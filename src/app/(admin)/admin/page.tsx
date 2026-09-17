"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/admin/login-form";

export default function AdminRoot() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <LoginForm onSuccess={() => router.push("/admin/nossos-trabalhos")} />
    </div>
  );
}