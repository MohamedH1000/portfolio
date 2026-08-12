import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!session.user.is_admin) {
    redirect("/en");
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient brand wash — keeps the admin from reading as a flat grey slab */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute -top-40 start-1/4 h-[32rem] w-[32rem] rounded-full bg-brand/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 end-0 h-[26rem] w-[26rem] rounded-full bg-purple-500/[0.05] blur-[110px]" />
      </div>

      <div className="relative z-10">
        <AdminSidebar />
        <div className="lg:ps-60">
          <AdminHeader
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }}
          />
          <main className="p-4 lg:p-6">
            <AdminPageTransition>{children}</AdminPageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
