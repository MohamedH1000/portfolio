import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Throwing guard — for API routes only. Every `app/api/admin/*` handler wraps
 * this in a try/catch and answers 401, so the throw never escapes.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: not signed in");
  }
  if (!session.user.is_admin) {
    throw new Error("Forbidden: not an admin");
  }
  return session;
}

/**
 * Redirecting guard — for Server Component renders.
 *
 * `requireAdmin()` must never be called during a render: a raw throw there is
 * caught by React as a render failure and surfaces to the visitor as "An error
 * occurred in the Server Components render" (digest-only in production), which
 * is both a dead end and impossible to debug from the browser. Middleware
 * already turns anonymous traffic away, so reaching this branch means a session
 * that decoded at the edge but no longer holds up server-side — an expired or
 * stale token. Sending that visitor to sign in is the useful response.
 */
export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  if (!session.user.is_admin) {
    redirect("/en");
  }
  return session;
}
