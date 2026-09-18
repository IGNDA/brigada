import type { Metadata } from "next";
import GameCard from "@/components/games/game-card";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Jogos educativos — ${BRIGADE_CONFIG.name}`,
  description:
    "Divirta-se e aprenda com os jogos ambientais da Brigada Ivan Moraes: quiz ambiental, jogo da memória, coleta seletiva e combate a incêndios florestais.",
};

const games = [
  {
    href: urls.jogosQuiz(),
    emoji: "🌱",
    title: "Quiz Ambiental",
    description:
      "Responda perguntas sobre fauna, floresta, incêndios e reciclagem e descubra o quanto você protege o planeta.",
  },
  {
    href: urls.jogosMemoria(),
    emoji: "🦜",
    title: "Jogo da Memória",
    description:
      "Encontre os pares de animais da Mata Atlântica e conheça as espécies que protegemos.",
  },
  {
    href: urls.jogosReciclagem(),
    emoji: "♻️",
    title: "Coleta Seletiva",
    description:
      "Separe os resíduos na lixeira correta e aprenda a destinar cada material do jeito certo.",
  },
  {
    href: urls.jogosIncendio(),
    emoji: "🔥",
    title: "Apague o Incêndio",
    description:
      "Combata os focos de incêndio antes que o fogo tome conta da floresta em uma corrida contra o tempo.",
  },
];

export default function JogosPage() {
  return (
    <>
      <section className="bg-forest-800 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Entretenimento
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Jogos para aprender a proteger o meio ambiente
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-forest-100">
            Brincando também se aprende. Escolha um jogo, divirta-se e leve para
            o dia a dia tudo o que você descobrir aqui.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

      <section className="bg-forest-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">
            Aprendeu algo novo?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-forest-700">
            A melhor jogada é colocar em prática. Quer ajudar a Brigada Ivan
            Moraes a proteger a natureza de verdade?
          </p>
          <a
            href={`https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(`Olá! Quero saber como participar da ${BRIGADE_CONFIG.name}.`)}&type=phone_number&app_absent=0`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-emergency-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
          >
            Fale com a Brigada
          </a>
        </div>
      </section>
    </>
  );
}
