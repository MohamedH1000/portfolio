import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "@auth/core/adapters";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function mapUserRow(data: Record<string, unknown>): AdapterUser {
  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    image: data.image as string | null,
    emailVerified: data.emailVerified ? new Date(data.emailVerified as string) : null,
    is_admin: data.is_admin as boolean,
  } as AdapterUser;
}

async function fetchUserById(id: string): Promise<AdapterUser | null> {
  const db = getSupabaseAdmin();
  const { data } = await db.from("users").select().eq("id", id).single();
  if (!data) return null;
  return mapUserRow(data);
}

export function createSupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const db = getSupabaseAdmin();
      const isAdmin = user.email === ADMIN_EMAIL;
      const row = {
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified?.toISOString() ?? null,
        is_admin: isAdmin,
      };
      const { data, error } = await db
        .from("users")
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      return mapUserRow(data);
    },

    async getUser(id) {
      return fetchUserById(id);
    },

    async getUserByEmail(email) {
      const db = getSupabaseAdmin();
      const { data } = await db.from("users").select().eq("email", email).single();
      if (!data) return null;
      return mapUserRow(data);
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const db = getSupabaseAdmin();
      const { data: account } = await db
        .from("accounts")
        .select("user_id")
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .single();

      if (!account) return null;
      return fetchUserById(account.user_id);
    },

    async updateUser(user) {
      const db = getSupabaseAdmin();
      const { id, ...updates } = user;
      const row: Record<string, unknown> = {};
      if (updates.name !== undefined) row.name = updates.name;
      if (updates.email !== undefined) row.email = updates.email;
      if (updates.image !== undefined) row.image = updates.image;
      if (updates.emailVerified !== undefined) {
        row.emailVerified = (updates.emailVerified as Date)?.toISOString() ?? null;
      }

      const { data, error } = await db
        .from("users")
        .update(row)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapUserRow(data);
    },

    async linkAccount(account) {
      const db = getSupabaseAdmin();
      const row = {
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
      };
      const { error } = await db.from("accounts").insert(row);
      if (error) throw error;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const db = getSupabaseAdmin();
      await db
        .from("accounts")
        .delete()
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId);
    },

    async createSession(session) {
      const db = getSupabaseAdmin();
      const { data, error } = await db
        .from("sessions")
        .insert({
          session_token: session.sessionToken,
          user_id: session.userId,
          expires: session.expires.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        sessionToken: data.session_token,
        userId: data.user_id,
        expires: new Date(data.expires),
      } as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const db = getSupabaseAdmin();
      const { data: row } = await db
        .from("sessions")
        .select("id, session_token, user_id, expires, users(id, name, email, image, emailVerified, is_admin)")
        .eq("session_token", sessionToken)
        .single();

      if (!row) return null;

      const u = row.users as unknown as Record<string, unknown>;
      return {
        session: {
          id: row.id,
          sessionToken: row.session_token,
          userId: row.user_id,
          expires: new Date(row.expires),
        } as AdapterSession,
        user: {
          id: u.id as string,
          name: u.name as string,
          email: u.email as string,
          image: u.image as string | null,
          emailVerified: u.emailVerified ? new Date(u.emailVerified as string) : null,
          is_admin: u.is_admin as boolean,
        } as AdapterUser,
      };
    },

    async updateSession(session) {
      const db = getSupabaseAdmin();
      const row: Record<string, unknown> = {};
      if (session.expires) row.expires = session.expires.toISOString();

      const { data } = await db
        .from("sessions")
        .update(row)
        .eq("session_token", session.sessionToken)
        .select()
        .single();

      if (!data) return null;
      return {
        id: data.id,
        sessionToken: data.session_token,
        userId: data.user_id,
        expires: new Date(data.expires),
      } as AdapterSession;
    },

    async deleteSession(sessionToken) {
      const db = getSupabaseAdmin();
      await db.from("sessions").delete().eq("session_token", sessionToken);
    },
  };
}
