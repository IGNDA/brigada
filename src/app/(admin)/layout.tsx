import type { Metadata } from "next";
import Link from "next/link";
import { urls } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Área administrativa</span>
          <Link
            href={urls.home()}
            className="text-sm text-gray-500 hover:text-gray-700 underline-offset-2"
          >
            Voltar ao site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
