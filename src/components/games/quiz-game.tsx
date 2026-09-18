"use client";

import { useState } from "react";
import { quizQuestions, quizResultMessage } from "@/data/quiz";

function shuffleQuiz() {
  return [...quizQuestions].sort(() => Math.random() - 0.5);
}

type QuizStatus = "intro" | "playing" | "finished";

export default function QuizGame() {
  const [status, setStatus] = useState<QuizStatus>("intro");
  const [questions, setQuestions] = useState(shuffleQuiz);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const total = questions.length;
  const question = questions[current];

  function handleAnswer(index: number) {
    if (answered !== null) return;
    setAnswered(index);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    setAnswered(null);
    if (current + 1 >= total) {
      setStatus("finished");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function restart() {
    setQuestions(shuffleQuiz());
    setCurrent(0);
    setAnswered(null);
    setScore(0);
    setStatus("playing");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      {status === "intro" && (
        <div className="text-center">
          <span className="text-5xl" aria-hidden="true">
            🌱
          </span>
          <h2 className="mt-4 text-2xl font-bold text-forest-900">
            Quiz Ambiental
          </h2>
          <p className="mt-2 text-forest-700">
            {total} perguntas sobre fauna, floresta, incêndios e reciclagem.
            Teste seus conhecimentos e aprenda algo novo a cada resposta.
          </p>
          <button
            type="button"
            onClick={() => setStatus("playing")}
            className="mt-6 rounded-full bg-emergency-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
          >
            Começar
          </button>
        </div>
      )}

      {status === "playing" && (
        <div>
          <div className="flex items-center justify-between text-sm text-forest-700">
            <span>
              Pergunta {current + 1} de {total}
            </span>
            <span>Acertos: {score}</span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-forest-100"
            role="progressbar"
            aria-valuenow={current + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={`Progresso: pergunta ${current + 1} de ${total}`}
          >
            <div
              className="h-2 rounded-full bg-forest-600 transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>

          <h3 className="mt-6 text-lg font-bold text-forest-900 sm:text-xl">
            {question.question}
          </h3>
          <ul className="mt-4 space-y-3">
            {question.options.map((option, index) => {
              const isCorrectOption = index === question.correctIndex;
              const isSelected = index === answered;
              const isDisabled = answered !== null;
              let buttonClass =
                "w-full rounded-lg border px-4 py-3 text-left transition-colors ";
              if (!isDisabled) {
                buttonClass +=
                  "border-forest-200 bg-white text-forest-800 hover:border-forest-400 hover:bg-forest-50";
              } else if (isCorrectOption) {
                buttonClass +=
                  "border-forest-500 bg-forest-100 text-forest-900";
              } else if (isSelected) {
                buttonClass +=
                  "border-emergency-500 bg-emergency-50 text-forest-900";
              } else {
                buttonClass += "border-forest-200 bg-white text-forest-700";
              }
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleAnswer(index)}
                    disabled={isDisabled}
                    className={buttonClass}
                  >
                    <span className="font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>

          {answered !== null && (
            <div
              aria-live="polite"
              className={`mt-4 rounded-lg p-4 text-sm ${
                answered === question.correctIndex
                  ? "bg-forest-100 text-forest-800"
                  : "bg-emergency-50 text-emergency-700"
              }`}
            >
              <p className="font-bold">
                {answered === question.correctIndex
                  ? "Correto! 🎉"
                  : `A resposta certa é ${String.fromCharCode(
                      65 + question.correctIndex
                    )}.`}
              </p>
              <p className="mt-1">{question.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 rounded-full bg-forest-700 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
              >
                {current + 1 >= total ? "Ver resultado" : "Próxima pergunta"}
              </button>
            </div>
          )}
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <span className="text-5xl" aria-hidden="true">
            🏆
          </span>
          <h2 className="mt-4 text-2xl font-bold text-forest-900">
            Você acertou {score} de {total}
          </h2>
          <p className="mt-2 text-forest-700">
            {quizResultMessage(score, total)}
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
    </div>
  );
}
