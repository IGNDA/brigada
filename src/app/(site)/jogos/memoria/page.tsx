import type { Metadata } from "next";
import Link from "next/link";
import MemoryGame from "@/components/games/memory-game";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Jogo da Memória — ${BRIGADE_CONFIG.name}`,
  description:
    "Jogo da memória com animais da Mata Atlântica: encontre os pares e conheça espécies protegidas pela Brigada Ivan Moraes.",
};

export default function MemoriaPage() {
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
            Memória
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Jogo da Memória
          </h1>
          <p className="mt-2 max-w-2xl text-forest-100">
            Vire as cartas e encontre os pares de animais que vivem na Mata
            Atlântica.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <MemoryGame />
      </section>
    </>
  );
}
