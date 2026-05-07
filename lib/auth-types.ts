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
