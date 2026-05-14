import { auth } from "@/lib/auth";

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
