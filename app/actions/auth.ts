"use server";

import { signIn, signOut } from "@/lib/auth";
import { signUpSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleCredentialsSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function handleSignUp(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const { name, username, email, password } = parsed.data;

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if email already exists
  const { data: existingUser } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Check if username already exists
  const { data: existingUsername } = await db
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUsername) {
    return { success: false, error: "This username is already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const isAdmin = email === ADMIN_EMAIL;

  const { error } = await db.from("users").insert({
    name,
    username,
    email,
    password: hashedPassword,
    is_admin: isAdmin,
  });

  if (error) {
    return { success: false, error: "Failed to create account. Please try again." };
  }

  return { success: true };
}
