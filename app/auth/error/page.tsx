import { redirect } from "next/navigation";

export default function AuthErrorRedirect() {
  redirect("/en/auth/error");
}
