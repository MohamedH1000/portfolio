import { redirect } from "next/navigation";

export default function SignInRedirect({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  redirect("/en/auth/signin");
}
