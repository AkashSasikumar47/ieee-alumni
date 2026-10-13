import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBoard } from "@/components/admin/admin-board";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminHeader } from "@/components/admin/admin-header";
import { getAdmin } from "@/lib/auth";
import { loadPeople } from "@/lib/people";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const people = await loadPeople({ drafts: true });

  return (
    <>
      <AdminHeader email={admin.email} />
      <main className="flex flex-1 flex-col">
        <AdminBoard people={people} />
      </main>
      <AdminFooter />
    </>
  );
}
