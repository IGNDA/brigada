"use client";

import { useEffect, useState } from "react";
import { getSessionToken } from "@/lib/admin-session";
import LoginForm from "@/components/admin/login-form";
import AdminApp from "@/components/admin/admin-app";

export default function AdminGate() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura de sessão no mount (client-only)
    setToken(getSessionToken());
  }, []);

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <LoginForm onSuccess={() => setToken(getSessionToken())} />
      </div>
    );
  }

  return <AdminApp initialToken={token} onLogout={() => setToken(null)} />;
}
