import type { Metadata } from "next";
import AdminGate from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: "Login",
};

export default function AdminLoginPage() {
  return <AdminGate />;
}
