import type { Metadata } from "next";
import Link from "next/link";
import IncendioGame from "@/components/games/incendio-game";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Apague o Incêndio — ${BRIGADE_CONFIG.name}`,
  description:
    "Corrida contra o tempo para apagar os focos de incêndio na floresta. Jogo educativo da Brigada Ivan Moraes sobre prevenção a queimadas.",
};

export default function IncendioPage() {
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
            Prevenção
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Apague o Incêndio
          </h1>
          <p className="mt-2 max-w-2xl text-forest-100">
            O fogo se espalha rápido. Apague os focos antes que a floresta vire
            cinzas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <IncendioGame />
      </section>
    </>
  );
}
