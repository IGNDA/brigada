"use client";

import { useState } from "react";
import { memoryCards } from "@/data/memory";

interface CardState {
  key: string;
  cardId: string;
  name: string;
  emoji: string;
}

const TIPS = [
  "A Mata Atlântica é um dos biomas mais ricos e ameaçados do mundo.",
  "Muitos desses animais dependem de florestas preservadas para viver.",
  "Cada animal tem um papel único no equilíbrio do ecossistema.",
];

function pickTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

function buildDeck(): CardState[] {
  const deck = memoryCards.flatMap((card) => [
    {
      key: `${card.id}-a`,
      cardId: card.id,
      name: card.name,
      emoji: card.emoji,
    },
    {
      key: `${card.id}-b`,
      cardId: card.id,
      name: card.name,
      emoji: card.emoji,
    },
  ]);
  return deck.sort(() => Math.random() - 0.5);
}

type MemoryStatus = "playing" | "finished";

export default function MemoryGame() {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<MemoryStatus>("playing");
  const [tip, setTip] = useState(pickTip);

  const totalPairs = memoryCards.length;

  function handleFlip(key: string) {
    if (
      status !== "playing" ||
      flipped.includes(key) ||
      matched.includes(deck.find((c) => c.key === key)!.cardId) ||
      flipped.length === 2
    ) {
      return;
    }
    const nextFlipped = [...flipped, key];
    setFlipped(nextFlipped);
    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = nextFlipped.map((k) =>
        deck.find((c) => c.key === k)!
      );
      if (first.cardId === second.cardId) {
        const newMatched = [...matched, first.cardId];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === totalPairs) {
          setStatus("finished");
        }
      } else {
        window.setTimeout(() => setFlipped([]), 700);
      }
    }
  }

  const isCardUp = (key: string) =>
    flipped.includes(key) ||
    matched.includes(deck.find((c) => c.key === key)!.cardId);

  function restart() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTip(pickTip());
    setStatus("playing");
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between text-sm text-forest-700">
        <span>Tentativas: {moves}</span>
        <span>
          Pares: {matched.length} de {totalPairs}
        </span>
      </div>

      {status === "finished" && (
        <div className="mt-6 text-center" aria-live="polite">
          <span className="text-5xl" aria-hidden="true">
            🎉
          </span>
          <h2 className="mt-4 text-2xl font-bold text-forest-900">
            Parabéns! Você encontrou todos os pares!
          </h2>
          <p className="mt-2 text-forest-700">
            Você levou {moves} tentativas. {tip}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-6 rounded-full bg-emergency-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
          >
            Jogar novamente
          </button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => handleFlip(card.key)}
            aria-label={
              isCardUp(card.key) ? `${card.name}, visível` : "Carta virada"
            }
            className={`flex aspect-[3/4] items-center justify-center rounded-lg border text-2xl transition-all sm:text-3xl ${
              isCardUp(card.key)
                ? "border-forest-300 bg-forest-50"
                : "border-forest-700 bg-forest-700 hover:bg-forest-800"
            }`}
          >
            {isCardUp(card.key) ? card.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}
