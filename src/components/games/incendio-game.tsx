"use client";

import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const GAME_SECONDS = 45;
const TICK_MS = 500;
const FIRE_DURATION = 6;
const INITIAL_FIRES = 3;
const SPREAD_CHANCE = 0.18;
const RANDOM_FIRE_CHANCE = 0.12;

type CellState = "tree" | "fire" | "safe" | "ash";

interface Cell {
  id: number;
  state: CellState;
  burnTime: number;
}

function createGrid(): Cell[] {
  return Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i,
    state: "tree" as const,
    burnTime: 0,
  }));
}

function ignite(target: Cell) {
  target.state = "fire";
  target.burnTime = FIRE_DURATION;
}

function neighborsOf(id: number): number[] {
  const row = Math.floor(id / GRID_SIZE);
  const col = id % GRID_SIZE;
  const result: number[] = [];
  if (row > 0) result.push(id - GRID_SIZE);
  if (row < GRID_SIZE - 1) result.push(id + GRID_SIZE);
  if (col > 0) result.push(id - 1);
  if (col < GRID_SIZE - 1) result.push(id + 1);
  return result;
}

type GameStatus = "idle" | "playing" | "finished";

export default function IncendioGame() {
  const [grid, setGrid] = useState<Cell[]>(createGrid);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(GAME_SECONDS);

  function finish() {
    setStatus("finished");
  }

  function step(prev: Cell[]): Cell[] {
    const next = prev.map((cell) => ({ ...cell }));

    const burning = next.filter((c) => c.state === "fire");
    for (const cell of burning) {
      cell.burnTime -= 1;
      if (cell.burnTime <= 0) {
        cell.state = "ash";
      }
    }

    for (const cell of next.filter((c) => c.state === "fire")) {
      for (const n of neighborsOf(cell.id)) {
        if (next[n].state === "tree" && Math.random() < SPREAD_CHANCE) {
          ignite(next[n]);
        }
      }
    }

    if (Math.random() < RANDOM_FIRE_CHANCE) {
      const trees = next.filter((c) => c.state === "tree");
      if (trees.length > 0) {
        ignite(trees[Math.floor(Math.random() * trees.length)]);
      }
    }

    return next;
  }

  function extinguish(id: number) {
    const cell = grid[id];
    if (cell.state === "fire") {
      setScore((s) => s + 1);
      setGrid((prev) =>
        prev.map((c) =>
          c.id === id && c.state === "fire"
            ? { ...c, state: "safe" as const }
            : c
        )
      );
    }
  }

  function start() {
    timeLeftRef.current = GAME_SECONDS;
    const initialGrid = createGrid();
    const fires = new Set<number>();
    while (fires.size < INITIAL_FIRES) {
      fires.add(Math.floor(Math.random() * TOTAL_CELLS));
    }
    for (const index of fires) {
      ignite(initialGrid[index]);
    }
    setGrid(initialGrid);
    setTimeLeft(GAME_SECONDS);
    setScore(0);
    setStatus("playing");
  }

  function tip() {
    if (score >= 12) {
      return "Incrível! Você é um verdadeiro bombeiro da floresta. 🔥💧";
    }
    if (score >= 6) {
      return "Muito bem! Regiões secas precisam de atenção redobrada. 🌿";
    }
    return "Lembre-se: nunca faça fogueiras em áreas de mata e denuncie queimadas pelo 193. 🚨";
  }

  useEffect(() => {
    if (status !== "playing") return;
    intervalRef.current = setInterval(() => {
      setGrid((prev) => step(prev));
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        finish();
      }
    }, TICK_MS);
    return function cleanup() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [status]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between text-sm font-semibold text-forest-700">
        <span>⏱️ {timeLeft}s</span>
        <span>🔥 Apagados: {score}</span>
      </div>

      {status === "idle" && (
        <div className="mt-6 text-center">
          <span className="text-5xl" aria-hidden="true">
            🔥
          </span>
          <h2 className="mt-4 text-xl font-bold text-forest-900">
            Apague o Incêndio
          </h2>
          <p className="mt-2 text-sm text-forest-700">
            O fogo queima rápido e se espalha pela floresta. Clique nos focos
            para apagá-los com água antes que tudo vire cinzas. Você tem{" "}
            {GAME_SECONDS} segundos!
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-6 rounded-full bg-emergency-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
          >
            Começar
          </button>
        </div>
      )}

      {(status === "playing" || status === "finished") && (
        <div className="mt-6">
          <div
            className="grid grid-cols-5 gap-1"
            role="group"
            aria-label="Mapa da floresta"
          >
            {grid.map((cell) => {
              const row = Math.floor(cell.id / GRID_SIZE);
              const col = cell.id % GRID_SIZE;
              const label =
                cell.state === "fire"
                  ? `Foco de incêndio no bloco ${row + 1}, ${col + 1}`
                  : `Bloco ${row + 1}, ${col + 1} (${
                      cell.state === "safe"
                        ? "área apagada"
                        : cell.state === "ash"
                          ? "área queimada"
                          : "árvore"
                    })`;
              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => extinguish(cell.id)}
                  disabled={status !== "playing" || cell.state !== "fire"}
                  aria-label={label}
                  className={`flex aspect-square items-center justify-center rounded-md border text-lg transition-colors sm:text-xl ${
                    cell.state === "fire"
                      ? "border-emergency-600 bg-emergency-500 hover:bg-emergency-600"
                      : cell.state === "safe"
                        ? "border-forest-300 bg-forest-100"
                        : cell.state === "ash"
                          ? "border-forest-800 bg-forest-900 text-forest-500"
                          : "border-forest-700 bg-forest-600"
                  }`}
                >
                  {cell.state === "fire"
                    ? "🔥"
                    : cell.state === "safe"
                      ? "💧"
                      : cell.state === "ash"
                        ? "·"
                        : "🌳"}
                </button>
              );
            })}
          </div>

          {status === "playing" && (
            <p className="mt-4 text-center text-sm text-forest-600">
              Clique nos 🔥 para apagar com água.
            </p>
          )}

          {status === "finished" && (
            <div className="mt-6 text-center" aria-live="polite">
              <span className="text-5xl" aria-hidden="true">
                🚒
              </span>
              <h2 className="mt-4 text-xl font-bold text-forest-900">
                Tempo esgotado!
              </h2>
              <p className="mt-2 text-sm font-semibold text-forest-800">
                Você apagou {score} focos de incêndio.
              </p>
              <p className="mt-1 text-sm text-forest-700">{tip()}</p>
              <button
                type="button"
                onClick={start}
                className="mt-6 rounded-full bg-emergency-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
              >
                Jogar novamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
