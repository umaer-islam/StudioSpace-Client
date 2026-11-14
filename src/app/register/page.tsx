"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import {
  Aperture,
  ArrowRight,
  Briefcase,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Creator" | "Host">("Creator");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }

    // Password Validation per rubric:
    // 1. Length must be at least 6 characters
    // 2. Must have an Uppercase letter
    // 3. Must have a Lowercase letter
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter (A-Z).");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    startTransition(async () => {
      try {
        const { error: signUpError } = await signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          image: photoUrl.trim() || undefined,
          role,
        } as Parameters<typeof signUp.email>[0]);

        if (signUpError) {
          setError(signUpError.message || "Failed to create account.");
          return;
        }

        toast.success("Account created successfully! Please sign in with your credentials.");
        router.push("/login?registered=true");
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during account creation."
        );
      }
    });
  };

  return (
    <div className="container-main flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm mb-4"
          >
            <Aperture size={26} strokeWidth={1.8} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted">
            Join StudioSpace as a Creator or Space Host
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("Creator")}
                className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  role === "Creator"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-background hover:border-muted/50"
                }`}
              >
                <div className="flex w-full items-center justify-between mb-1.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-foreground">
                    <Camera size={16} />
                  </span>
                  {role === "Creator" && (
                    <CheckCircle2 size={16} className="text-accent" />
                  )}
                </div>
                <div className="font-semibold text-sm">Creator</div>
                <div className="text-xs text-muted mt-0.5">
                  Book spaces for shoots & sessions
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("Host")}
                className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  role === "Host"
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-background hover:border-muted/50"
                }`}
              >
                <div className="flex w-full items-center justify-between mb-1.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-foreground">
                    <Briefcase size={16} />
                  </span>
                  {role === "Host" && (
                    <CheckCircle2 size={16} className="text-accent" />
                  )}
                </div>
                <div className="font-semibold text-sm">Studio Host</div>
                <div className="text-xs text-muted mt-0.5">
                  List studios and manage bookings
                </div>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Full name
            </label>
            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="photoUrl"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Photo URL <span className="text-muted/60 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <ImageIcon
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/your-avatar.jpg"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Password <span className="text-muted/60 font-normal">(min. 6 chars, uppercase & lowercase)</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-neutral-900 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-black hover:shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full pointer-events-none" />
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account as {role} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
