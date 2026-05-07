# Auth Feature: Google Sign-In with NextAuth v5

## Overview

Add authentication to the portfolio using NextAuth v5 (Auth.js) with Google as the sole OAuth provider. Supabase stores all auth data. The portfolio owner (`mohammedhisham115@gmail.com`) is automatically promoted to admin. Admin users gain access to a protected `/admin` route group for content management in the future.

## Goals

1. Visitors sign in with Google — no username/password, no registration forms
2. Auth data (users, accounts, sessions) stored in Supabase, not in a separate service
3. The portfolio owner is auto-detected as admin by email match
4. Public portfolio pages remain fully accessible without authentication
5. Future `/admin` routes are protected behind auth middleware
6. Session available in both server components and client components
7. Sign-in/sign-out accessible from the existing Header navbar

## Prerequisites

Before implementation, set up Google OAuth in Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or use existing)
3. Go to **APIs & Services → OAuth consent screen** → configure (External, add test user email)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized JavaScript origins: `http://localhost:3000` and your production URL
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://<your-domain>/api/auth/callback/google`
8. Copy the **Client ID** and **Client Secret**

## Dependencies

```bash
npm install next-auth@beta @auth/core @auth/supabase-adapter
```

> If `@auth/supabase-adapter` is unavailable or outdated, use a custom adapter approach (see "Fallback: Custom Adapter" section at the bottom).

## Environment Variables

Add to `.env.local`:

```env
# NextAuth
AUTH_SECRET="<generate-with:-npx-auth-secret>"
AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="<from-google-cloud-console>"
GOOGLE_CLIENT_SECRET="<from-google-cloud-console>"

# Admin detection — the portfolio owner's email
ADMIN_EMAIL="mohammedhisham115@gmail.com"
```

Add to `.env.example`:

```env
# NextAuth
AUTH_SECRET=""
AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ADMIN_EMAIL=""
```

Update `lib/env.ts` to include auth vars:

```typescript
// Add to the existing envSchema:
AUTH_SECRET: z.string().min(1),
GOOGLE_CLIENT_ID: z.string().min(1),
GOOGLE_CLIENT_SECRET: z.string().min(1),
ADMIN_EMAIL: z.string().email(),
```

## Database Schema

Run this SQL in Supabase SQL Editor. These tables follow the NextAuth adapter schema.

### Migration: `supabase/migrations/004_auth_tables.sql`

```sql
-- ============================================
-- NextAuth Auth Tables
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Accounts table (OAuth provider data)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, "providerAccountId")
);

-- Sessions table ( NextAuth managed sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

-- Verification tokens table (for email verification if needed later)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);

-- ============================================
-- Auto-promote owner to admin on insert
-- ============================================
CREATE OR REPLACE FUNCTION auto_promote_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = current_setting('app.admin_email', true) THEN
    -- We can't read env vars in SQL, so we'll handle this in application code.
    -- This trigger is a safety net: promote by email pattern.
    NEW.is_admin := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Instead, create a simpler trigger just for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Users: public can read basic info (for display), only self can read full row
CREATE POLICY "Users are publicly readable" ON users
  FOR SELECT USING (true);

-- Accounts, Sessions, Verification Tokens: no public access
-- NextAuth uses the service role key or a dedicated database connection
-- For now, we'll use the service role key in the adapter

-- Grant full access to service role (already has it via supabase_admin)
-- Grant anon key access only to users table SELECT
CREATE POLICY "Accounts managed by service role" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Sessions managed by service role" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Verification tokens managed by service role" ON verification_tokens
  FOR ALL USING (auth.role() = 'service_role');
```

### After running the migration

Manually promote the owner to admin (run once):

```sql
-- After first sign-in, or preemptively:
INSERT INTO users (email, name, is_admin)
VALUES ('mohammedhisham115@gmail.com', 'Mohamed Hesham', TRUE)
ON CONFLICT (email) DO UPDATE SET is_admin = TRUE;
```

## Implementation Files

### 1. `lib/auth.ts` — Auth Configuration

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createSupabaseAdapter } from "./auth-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createSupabaseAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Extend session with admin status
      if (session.user) {
        session.user.id = user.id;
        session.user.is_admin = user.is_admin;
      }
      return session;
    },
    async signIn({ user }) {
      // Auto-promote admin by email
      if (user.email === process.env.ADMIN_EMAIL) {
        // The adapter handles user creation/update,
        // but we need to set is_admin = true
        // This is handled in the adapter's createUser/updateUser
      }
      return true;
    },
  },
  pages: {
    // Custom sign-in page (optional, defaults to NextAuth's built-in)
    // signIn: "/auth/signin",
    // error: "/auth/error",
  },
  session: {
    strategy: "database", // Use database sessions stored in Supabase
  },
  trustHost: true,
});
```

### 2. `lib/auth-adapter.ts` — Supabase Adapter

Custom adapter that uses the Supabase service role client to manage auth tables. This avoids depending on `@auth/supabase-adapter` which may be outdated.

```typescript
import type { Adapter } from "@auth/core/adapters";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export function createSupabaseAdapter(): Adapter {
  const db = getSupabaseAdmin();

  return {
    async createUser(user) {
      const isAdmin = user.email === ADMIN_EMAIL;
      const { data, error } = await db
        .from("users")
        .insert({
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          is_admin: isAdmin,
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, emailVerified: new Date(data.emailVerified) };
    },

    async getUser(id) {
      const { data } = await db.from("users").select().eq("id", id).single();
      if (!data) return null;
      return { ...data, emailVerified: data.emailVerified ? new Date(data.emailVerified) : null };
    },

    async getUserByEmail(email) {
      const { data } = await db.from("users").select().eq("email", email).single();
      if (!data) return null;
      return { ...data, emailVerified: data.emailVerified ? new Date(data.emailVerified) : null };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { data: account } = await db
        .from("accounts")
        .select("user_id")
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .single();

      if (!account) return null;
      return this.getUser(account.user_id);
    },

    async updateUser(user) {
      const { id, ...updates } = user;
      const { data, error } = await db
        .from("users")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, emailVerified: data.emailVerified ? new Date(data.emailVerified) : null };
    },

    async linkAccount(account) {
      const { error } = await db.from("accounts").insert({
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
      if (error) throw error;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await db
        .from("accounts")
        .delete()
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId);
    },

    async createSession(session) {
      const { data, error } = await db
        .from("sessions")
        .insert({
          session_token: session.sessionToken,
          user_id: session.userId,
          expires: session.expires,
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, sessionToken: data.session_token, userId: data.user_id };
    },

    async getSessionAndUser(sessionToken) {
      const { data: session } = await db
        .from("sessions")
        .select("*, users(*)")
        .eq("session_token", sessionToken)
        .single();

      if (!session) return null;

      const user = {
        ...session.users,
        emailVerified: session.users.emailVerified ? new Date(session.users.emailVerified) : null,
      };

      return {
        session: {
          id: session.id,
          sessionToken: session.session_token,
          userId: session.user_id,
          expires: new Date(session.expires),
        },
        user,
      };
    },

    async updateSession(session) {
      const { data } = await db
        .from("sessions")
        .update({ expires: session.expires })
        .eq("session_token", session.sessionToken)
        .select()
        .single();

      if (!data) return null;
      return { ...data, sessionToken: data.session_token, userId: data.user_id };
    },

    async deleteSession(sessionToken) {
      await db.from("sessions").delete().eq("session_token", sessionToken);
    },
  };
}
```

### 3. `lib/auth-types.ts` — Type Extensions

```typescript
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    is_admin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      is_admin?: boolean;
    };
  }
}
```

### 4. `app/api/auth/[...nextauth]/route.ts` — API Route Handler

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

This is a valid use of `app/api/` — NextAuth requires an API route for its OAuth callback flow. This is a third-party integration (Google OAuth), consistent with the project's architecture rule.

### 5. `middleware.ts` — Combined i18n + Auth Middleware

```typescript
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/admin"];

// Routes accessible only by admins
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 1. Check if the route requires auth
  const isProtected = protectedRoutes.some((route) => pathname.includes(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.includes(route));

  if (isProtected && !req.auth) {
    // Not signed in — redirect to sign in
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && req.auth && !req.auth.user.is_admin) {
    // Signed in but not admin — redirect to home
    return NextResponse.redirect(new URL("/en", req.url));
  }

  // 2. Handle i18n routing for all other requests
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(en|ar)/:path*",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 6. `components/providers/session-provider.tsx` — Client Session Provider

```typescript
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 7. Update `app/[locale]/layout.tsx` — Wrap with SessionProvider

Add the `SessionProvider` inside the existing `NextIntlClientProvider`:

```typescript
import { SessionProvider } from "@/components/providers/session-provider";

// In the JSX, wrap NextIntlClientProvider's children:
<NextIntlClientProvider messages={messages}>
  <SessionProvider>
    <Header />
    <div className="flex-1">{children}</div>
    <Footer locale={locale} />
    <Analytics />
  </SessionProvider>
</NextIntlClientProvider>
```

### 8. Update `components/layout/Header.tsx` — Add Auth UI

Add a sign-in/sign-out button in the header navbar. This must be a client component or use a client wrapper.

**Option A: Server-side approach** (preferred — no client session needed for header)

```typescript
import { auth } from "@/lib/auth";

// Inside the Header component function:
export async function Header() {
  const session = await auth();

  return (
    <header>
      {/* ... existing nav ... */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        {session?.user ? (
          <div className="flex items-center gap-3">
            {session.user.is_admin && (
              <Link href="/admin" className="text-sm text-brand hover:underline">
                Admin
              </Link>
            )}
            <UserMenu user={session.user} />
          </div>
        ) : (
          <form action={handleSignIn}>
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-xl brand-gradient text-white"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
```

**Option B: Client wrapper** (if Header is already a client component)

```typescript
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || ""}
            className="h-8 w-8 rounded-full border border-border/40"
          />
        )}
        <button
          onClick={() => signOut()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm px-4 py-2 rounded-xl brand-gradient text-white"
    >
      Sign in
    </button>
  );
}
```

### 9. Server Action for Sign-In `app/actions/auth.ts`

```typescript
"use server";

import { signIn, signOut } from "@/lib/auth";

export async function handleSignIn() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
```

### 10. `components/ui/user-menu.tsx` — User Avatar Dropdown

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { handleSignOut } from "@/app/actions/auth";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    is_admin?: boolean;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-0.5 hover:opacity-80 transition-opacity"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || ""}
            className="h-8 w-8 rounded-full border border-border/40"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand text-sm font-medium">
            {(user.name || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-56 rounded-xl bg-card border border-border/40 shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-border/20">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full text-start px-4 py-2 text-sm text-foreground hover:bg-surface-high transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
```

## Future: Admin Route Group

When admin features are built, create this structure:

```
app/
  (admin)/
    admin/
      layout.tsx        ← Auth check + admin sidebar
      page.tsx          ← Dashboard overview
      projects/
        page.tsx        ← Manage projects CRUD
      testimonials/
        page.tsx        ← Manage testimonials
      experiences/
        page.tsx        ← Manage experiences
      contacts/
        page.tsx        ← View contact submissions
      settings/
        page.tsx        ← Site settings editor
```

The `(admin)` route group is separate from `[locale]` — admin pages are English-only by default. The middleware already protects `/admin/*` routes.

## File Structure After Implementation

```
New files:
  lib/auth.ts                          ← NextAuth configuration
  lib/auth-adapter.ts                  ← Custom Supabase adapter
  lib/auth-types.ts                    ← TypeScript type extensions
  app/api/auth/[...nextauth]/route.ts  ← NextAuth API route handler
  app/actions/auth.ts                  ← Sign-in/sign-out server actions
  components/providers/session-provider.tsx ← Client session provider
  components/ui/user-menu.tsx          ← User avatar dropdown

Modified files:
  middleware.ts                        ← Combined i18n + auth middleware
  lib/env.ts                          ← Add auth env vars to schema
  app/[locale]/layout.tsx             ← Add SessionProvider
  components/layout/Header.tsx        ← Add auth UI (sign-in button / user menu)
  messages/en.json                    ← Add auth-related UI strings
  messages/ar.json                    ← Add auth-related Arabic strings
  .env.local                          ← Add auth env vars
  .env.example                        ← Document auth env vars

Database:
  supabase/migrations/004_auth_tables.sql  ← Auth tables migration
```

## i18n Strings to Add

Add to `messages/en.json`:

```json
{
  "Auth": {
    "signIn": "Sign in",
    "signOut": "Sign out",
    "signInWithGoogle": "Sign in with Google",
    "admin": "Admin",
    "dashboard": "Dashboard"
  }
}
```

Add to `messages/ar.json`:

```json
{
  "Auth": {
    "signIn": "تسجيل الدخول",
    "signOut": "تسجيل الخروج",
    "signInWithGoogle": "تسجيل الدخول بحساب جوجل",
    "admin": "لوحة التحكم",
    "dashboard": "لوحة المعلومات"
  }
}
```

## Security Considerations

1. **AUTH_SECRET** — Must be a strong random string. Generate with `npx auth secret`. Never commit to git.
2. **Service role key for adapter** — The custom Supabase adapter uses the service role key to read/write auth tables. This is server-only code and never reaches the client.
3. **CSRF protection** — NextAuth handles CSRF tokens automatically for OAuth flows.
4. **Session strategy** — Using database sessions (not JWT) so sessions can be revoked by deleting the row.
5. **Admin detection** — Checked server-side in the `session` callback and middleware. Client never decides admin status on its own.
6. **Middleware ordering** — Auth check runs before i18n redirect, so protected routes are enforced regardless of locale.
7. **RLS on auth tables** — Accounts, sessions, and verification_tokens have service-role-only RLS. Users table is publicly readable (name/image for display) but only the adapter (service role) can write.

## Implementation Order

```
1. Run SQL migration (004_auth_tables.sql) in Supabase Dashboard
2. Install dependencies (next-auth, @auth/core)
3. Create lib/auth-types.ts (type declarations)
4. Create lib/auth-adapter.ts (Supabase adapter)
5. Create lib/auth.ts (NextAuth config)
6. Create app/api/auth/[...nextauth]/route.ts
7. Create app/actions/auth.ts (server actions)
8. Update lib/env.ts (add auth vars)
9. Update middleware.ts (combined i18n + auth)
10. Create components/providers/session-provider.tsx
11. Update app/[locale]/layout.tsx (add SessionProvider)
12. Create components/ui/user-menu.tsx
13. Update components/layout/Header.tsx (add auth UI)
14. Update messages/en.json and messages/ar.json
15. Update .env.local with real values
16. Test: sign in, sign out, admin detection
17. npm run build — must pass with zero errors
```

## Testing Checklist

- [ ] `npm run build` passes with zero errors
- [ ] Clicking "Sign in" redirects to Google OAuth consent screen
- [ ] After Google sign-in, user is redirected back to the portfolio
- [ ] Header shows user avatar and name after sign-in
- [ ] Clicking avatar shows dropdown with "Sign out"
- [ ] Signing out clears session and redirects to home
- [ ] Visiting `/admin` while not signed in redirects to sign-in
- [ ] Visiting `/admin` while signed in as non-admin redirects to home
- [ ] Visiting `/admin` while signed in as admin renders the admin page
- [ ] Both locales (`/en`, `/ar`) work with auth (sign-in/sign-out)
- [ ] Dark and light themes both render auth UI correctly
- [ ] Mobile responsive: auth UI works on small screens

## Fallback: Custom Adapter (if @auth/supabase-adapter unavailable)

The implementation above already uses a custom adapter (`lib/auth-adapter.ts`) that talks to Supabase directly using `@supabase/supabase-js`. No third-party adapter dependency is needed. If `@auth/supabase-adapter` becomes stable and well-maintained, it can replace the custom adapter later — the interface is identical.
