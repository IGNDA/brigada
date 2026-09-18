import type { Metadata } from "next";
import Link from "next/link";
import ReciclagemGame from "@/components/games/reciclagem-game";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Coleta Seletiva — ${BRIGADE_CONFIG.name}`,
  description:
    "Aprenda a separar os resíduos corretamente no jogo de coleta seletiva da Brigada Ivan Moraes e ajude o meio ambiente.",
};

export default function ReciclagemPage() {
  return (
    <>
      <section className="bg-forest-800 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            href={urls.jogos()}
            className="text-sm font-medium text-forest-200 underline-offset-2 hover:text-white hover:underline"
          >
            ← Voltar aos jogos
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-forest-200">
            Reciclagem
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Coleta Seletiva
          </h1>
          <p className="mt-2 max-w-2xl text-forest-100">
            Cada resíduo tem o seu lugar. Clique na lixeira certa e faça o
            melhor descarte.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ReciclagemGame />
      </section>
    </>
  );
}
