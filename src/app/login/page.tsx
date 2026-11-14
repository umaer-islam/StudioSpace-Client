"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "@/lib/auth-client";
import { Aperture, ArrowRight, Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    startTransition(async () => {
      try {
        const { error: signInError } = await signIn.email({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message || "Invalid email or password.");
          return;
        }

        router.push("/studios");
        router.refresh();
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during sign in."
        );
      }
    });
  };

  return (
    <div className="container-main flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm mb-4"
          >
            <Aperture size={26} strokeWidth={1.8} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to access your StudioSpace account
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
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
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
                Signing in...
              </>
            ) : (
              <>
                Sign in <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
