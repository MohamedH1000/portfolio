import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-60">
        <AdminHeader user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
