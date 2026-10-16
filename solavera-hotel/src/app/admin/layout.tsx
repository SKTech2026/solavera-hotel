import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Solavéra Hotel | Management Dashboard",
  description: "Luxury hotel management dashboard for Solavéra Hotel.",
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  // Admin routes are intentionally unauthenticated for demonstration purposes and must be protected before production use.
  return <AdminShell>{children}</AdminShell>;
}
