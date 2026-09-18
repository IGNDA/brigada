"use client";

import { useState } from "react";
import {
  wasteCategories,
  wasteItems,
  type WasteCategory,
} from "@/data/reciclagem";

function shuffleItems() {
  return [...wasteItems].sort(() => Math.random() - 0.5);
}

interface Feedback {
  type: "correct" | "wrong";
  message: string;
}

export default function ReciclagemGame() {
  const [items, setItems] = useState(shuffleItems);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const total = items.length;
  const item = items[current];

  function handlePick(category: WasteCategory) {
    if (feedback) return;
    if (category === item.category) {
      const newScore = score + 1;
      setScore(newScore);
      const isDone = current + 1 >= total;
      setFeedback({
        type: "correct",
        message: isDone
          ? `Você acertou ${newScore} de ${total}. Boa coleta!`
          : "Correto! Esse resíduo vai no lugar certo.",
      });
    } else {
      const correct = wasteCategories.find((c) => c.id === item.category)!;
      setFeedback({
        type: "wrong",
        message: `Quase! O ${item.name.toLowerCase()} deve ir para a lixeira ${correct.label.toLowerCase()}.`,
      });
    }
  }

  function handleNext() {
    setFeedback(null);
    if (current + 1 >= total) {
      setCurrent(0);
      setItems(shuffleItems());
      setScore(0);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between text-sm text-forest-700">
        <span>
          Item {Math.min(current + 1, total)} de {total}
        </span>
        <span>Acertos: {score}</span>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-forest-50 text-6xl">
          {item.emoji}
        </span>
        <h2 className="mt-4 text-xl font-bold text-forest-900 sm:text-2xl">
          {item.name}
        </h2>
        <p className="mt-1 text-sm text-forest-600">
          Clique na lixeira correta para descartar este resíduo.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {wasteCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handlePick(cat.id)}
            disabled={Boolean(feedback)}
            aria-label={`Lixeira ${cat.label}`}
            className={`flex flex-col items-center gap-1 rounded-lg border border-forest-100 p-3 text-center transition-colors ${cat.color} ${cat.hoverColor}`}
          >
            <span className="text-2xl" aria-hidden="true">
              🗑️
            </span>
            <span className="text-xs font-semibold text-white">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {feedback && (
        <div
          aria-live="polite"
          className={`mt-4 rounded-lg p-4 text-sm ${
            feedback.type === "correct"
              ? "bg-forest-100 text-forest-800"
              : "bg-emergency-50 text-emergency-700"
          }`}
        >
          <p className="font-bold">
            {feedback.type === "correct" ? "Boa! 🎉" : "Ops! 🤔"}
          </p>
          <p className="mt-1">{feedback.message}</p>
          <button
            type="button"
            onClick={handleNext}
            className="mt-4 rounded-full bg-forest-700 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
          >
            {current + 1 >= total ? "Jogar novamente" : "Próximo item"}
          </button>
        </div>
      )}
    </div>
  );
}
