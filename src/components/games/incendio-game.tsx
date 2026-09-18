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

const HANDRES = 4;
const MAX_BUCKETS = 4;
const START_BUCKETS = 2;
const BUCKETS_PER_SOLVE = 2;
const FLASH_ON_MS = 320;
const FLASH_GAP_MS = 180;
const MIN_SEQ_LENGTH = 2;
const MAX_SEQ_LENGTH = 6;

type CellState = "tree" | "fire" | "safe" | "ash";

interface Cell {
  id: number;
  state: CellState;
  burnTime: number;
}

type GameStatus = "idle" | "playing" | "finished";
type SeqStatus = "idle" | "flashing" | "awaiting" | "congrats" | "wrong";

const LEVERS = [
  { label: "Válvula azul", className: "bg-blue-500" },
  { label: "Válvula verde", className: "bg-forest-500" },
  { label: "Válvula amarela", className: "bg-yellow-400" },
  { label: "Válvula vermelha", className: "bg-emergency-500" },
];

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

function sequenceLength(round: number): number {
  return Math.max(MIN_SEQ_LENGTH, Math.min(round + 1, MAX_SEQ_LENGTH));
}

function createInitialGridWithFires(): Cell[] {
  const initialGrid = createGrid();
  const fires = new Set<number>();
  while (fires.size < INITIAL_FIRES) {
    fires.add(Math.floor(Math.random() * TOTAL_CELLS));
  }
  for (const index of fires) {
    ignite(initialGrid[index]);
  }
  return initialGrid;
}

export default function IncendioGame() {
  const [grid, setGrid] = useState<Cell[]>(createGrid);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [buckets, setBuckets] = useState(START_BUCKETS);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [seqStep, setSeqStep] = useState(0);
  const [seqStatus, setSeqStatus] = useState<SeqStatus>("idle");
  const [lit, setLit] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(GAME_SECONDS);
  const bucketsRef = useRef(START_BUCKETS);
  const seqTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function finish() {
    setStatus("finished");
  }

  function clearSeqTimeouts() {
    for (const id of seqTimeoutsRef.current) {
      clearTimeout(id);
    }
    seqTimeoutsRef.current = [];
    setLit(null);
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
    if (cell.state !== "fire" || status !== "playing") return;
    if (bucketsRef.current <= 0) return;
    bucketsRef.current -= 1;
    setBuckets(bucketsRef.current);
    setScore((s) => s + 1);
    setGrid((prev) =>
      prev.map((c) =>
        c.id === id && c.state === "fire" ? { ...c, state: "safe" as const } : c
      )
    );
  }

  function flashSequence(newSeq: number[]) {
    setSeqStatus("flashing");
    const ids: ReturnType<typeof setTimeout>[] = [];
    let delay = 0;
    for (const lever of newSeq) {
      ids.push(
        setTimeout(() => setLit(lever), delay),
        setTimeout(() => setLit(null), delay + FLASH_ON_MS)
      );
      delay += FLASH_ON_MS + FLASH_GAP_MS;
    }
    ids.push(
      setTimeout(() => {
        setSeqStep(0);
        setSeqStatus("awaiting");
      }, delay)
    );
    seqTimeoutsRef.current = ids;
  }

  function startChallenge() {
    if (
      status !== "playing" ||
      seqStatus === "flashing" ||
      seqStatus === "awaiting" ||
      bucketsRef.current >= MAX_BUCKETS
    ) {
      return;
    }
    clearSeqTimeouts();
    const newSequence = Array.from({ length: sequenceLength(round) }, () =>
      Math.floor(Math.random() * HANDRES)
    );
    setSequence(newSequence);
    flashSequence(newSequence);
  }

  function pressLever(index: number) {
    if (status !== "playing" || seqStatus !== "awaiting" || lit !== null)
      return;
    if (sequence[seqStep] !== index) {
      setSeqStatus("wrong");
      const id = setTimeout(() => {
        setSeqStep(0);
        setLit(null);
        setSeqStatus("idle");
      }, 700);
      seqTimeoutsRef.current.push(id);
      return;
    }
    const nextStep = seqStep + 1;
    setSeqStep(nextStep);
    if (nextStep >= sequence.length) {
      setSeqStatus("congrats");
      const nextBuckets = Math.min(
        MAX_BUCKETS,
        bucketsRef.current + BUCKETS_PER_SOLVE
      );
      const gained = nextBuckets - bucketsRef.current;
      bucketsRef.current = nextBuckets;
      setBuckets(nextBuckets);
      setRound((r) => r + 1);
      const id = setTimeout(() => {
        if (gained > 0) {
          startChallenge();
        } else {
          setSeqStatus("idle");
        }
      }, 900);
      seqTimeoutsRef.current.push(id);
    }
  }

  function start() {
    clearSeqTimeouts();
    timeLeftRef.current = GAME_SECONDS;
    setGrid(createInitialGridWithFires());
    setTimeLeft(GAME_SECONDS);
    setScore(0);
    bucketsRef.current = START_BUCKETS;
    setBuckets(START_BUCKETS);
    setRound(1);
    setSequence([]);
    setSeqStep(0);
    setSeqStatus("idle");
    setLit(null);
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
      clearSeqTimeouts();
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-forest-700">
        <span>⏱️ {timeLeft}s</span>
        <span>🔥 Apagados: {score}</span>
        <span aria-label={`${buckets} de ${MAX_BUCKETS} baldes de água`}>
          💧 {buckets}/{MAX_BUCKETS}
        </span>
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
            A floresta está em chamas! Abra o hidrante repetindo as sequências
            de válvulas para encher baldes de água e clique nos focos 🔥 para
            apagá-los. Você tem {GAME_SECONDS} segundos!
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
              const canExtinguish =
                status === "playing" && cell.state === "fire" && buckets > 0;
              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => extinguish(cell.id)}
                  disabled={!canExtinguish}
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
            <p className="mt-3 text-center text-sm text-forest-600">
              {buckets > 0
                ? "Clique nos 🔥 para apagar com água."
                : "Sem baldes! Abra o hidrante para conseguir água."}
            </p>
          )}

          {status === "playing" && (
            <div
              className="mt-5 rounded-xl border border-forest-100 bg-forest-50 p-4"
              role="group"
              aria-label="Hidrante"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-forest-900">
                  Hidrante
                  <span className="ml-2 text-xs font-normal text-forest-600">
                    Sequência de {sequenceLength(round).toString()} válvulas
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={startChallenge}
                  disabled={buckets >= MAX_BUCKETS || seqStatus === "flashing"}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    buckets >= MAX_BUCKETS || seqStatus === "flashing"
                      ? "cursor-not-allowed bg-forest-100 text-forest-400"
                      : "bg-forest-700 text-white hover:bg-forest-800"
                  }`}
                >
                  Pedir água
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                {LEVERS.map((lever, index) => {
                  const isLit = lit === index;
                  return (
                    <button
                      key={lever.label}
                      type="button"
                      onClick={() => pressLever(index)}
                      disabled={seqStatus !== "awaiting" || lit !== null}
                      aria-label={lever.label}
                      aria-pressed={isLit}
                      className={`h-12 w-12 rounded-full border-4 transition-all sm:h-14 sm:w-14 ${
                        isLit
                          ? "scale-110 border-white shadow-lg ring-2 ring-forest-400"
                          : "border-forest-100"
                      } ${lever.className}`}
                    />
                  );
                })}
              </div>

              <div className="mt-3 text-center text-sm" aria-live="polite">
                {seqStatus === "idle" && (
                  <p className="text-forest-600">
                    {buckets >= MAX_BUCKETS
                      ? "Baldes cheios!"
                      : "Aperte “Pedir água” para abrir o hidrante."}
                  </p>
                )}
                {seqStatus === "flashing" && (
                  <p className="font-medium text-forest-800">
                    Memorize a sequência…
                  </p>
                )}
                {seqStatus === "awaiting" && (
                  <p className="font-medium text-forest-800">
                    Repita a sequência agora!
                  </p>
                )}
                {seqStatus === "congrats" && (
                  <p className="font-medium text-forest-800">
                    Hidrante aberto! 📢 +{BUCKETS_PER_SOLVE} baldes de água
                  </p>
                )}
                {seqStatus === "wrong" && (
                  <p className="font-semibold text-emergency-600">
                    Sequência errada. Tente de novo!
                  </p>
                )}
              </div>
            </div>
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
