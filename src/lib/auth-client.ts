import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.INTERNAL_API_URL || "http://localhost:5000",
});

export const { signIn, signUp, signOut, useSession } = authClient;

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  role: "Creator" | "Host";
  image?: string | null;
}
