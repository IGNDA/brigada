import type { Metadata } from "next";
import AdminGate from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: "Nossos trabalhos",
};

export default function AdminGalleryPage() {
  return <AdminGate />;
}
