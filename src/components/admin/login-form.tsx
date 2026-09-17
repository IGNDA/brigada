"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setSessionToken } from "@/lib/admin-session";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await login(password);
      setSessionToken(token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold text-forest-900">Acesso restrito</h1>
      <p className="mt-1 text-sm text-forest-700">
        Área destinada à administração da galeria.
      </p>

      <label
        className="mt-5 block text-sm font-medium text-forest-900"
        htmlFor="password"
      >
        Senha
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm text-forest-900 outline-none focus:border-forest-500"
        autoFocus
      />

      {error && (
        <p className="mt-3 text-sm text-emergency-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="mt-5 w-full rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="mt-4 rounded-lg bg-forest-50 p-3 text-xs text-forest-700">
        Sua sessão expira automaticamente após <strong>8 horas</strong>. Se ao
        salvar ou enviar aparecer <strong>“Sessão expirada”</strong>, basta
        fazer o login novamente nesta tela.
      </p>
    </form>
  );
}
