import type { Metadata } from "next";
import Link from "next/link";
import CacaPalavrasGame from "@/components/games/caca-palavras-game";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Caça-Palavras — ${BRIGADE_CONFIG.name}`,
  description:
    "Encontre palavras sobre o meio ambiente escondidas na grade de letras e aprenda se divertindo no caça-palavras da Brigada Ivan Moraes.",
};

export default function CacaPalavrasPage() {
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
            Palavras
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Caça-Palavras</h1>
          <p className="mt-2 max-w-2xl text-forest-100">
            Procure palavras ligadas à proteção ambiental escondidas na grade.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <CacaPalavrasGame />
      </section>
    </>
  );
}
