"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TICK_MS = 500;
const FIRE_PER_TICK = 0.7;
const START_FIRE = 10;
const FIRE_RELIEF = 9;
const FIRE_PENALTY = 7;

const HANDRES = 4;
const MIN_SEQ_LENGTH = 2;
const MAX_SEQ_LENGTH = 8;
const FLASH_ON_MS = 320;
const FLASH_GAP_MS = 180;

const ILLUSTRATED_TREES = 12;

type GameStatus = "idle" | "playing" | "finished";
type SeqStatus = "idle" | "flashing" | "awaiting" | "congrats" | "wrong";

const LEVERS = [
  { label: "Válvula azul", className: "bg-blue-500" },
  { label: "Válvula verde", className: "bg-forest-500" },
  { label: "Válvula amarela", className: "bg-yellow-400" },
  { label: "Válvula vermelha", className: "bg-emergency-500" },
];

function sequenceLength(round: number): number {
  return Math.min(MIN_SEQ_LENGTH + round - 1, MAX_SEQ_LENGTH);
}

function clampFire(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export default function IncendioGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [fire, setFire] = useState(START_FIRE);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [seqStep, setSeqStep] = useState(0);
  const [seqStatus, setSeqStatus] = useState<SeqStatus>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fireRef = useRef(START_FIRE);
  const seqTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearSeqTimeouts = useCallback(() => {
    for (const id of seqTimeoutsRef.current) {
      clearTimeout(id);
    }
    seqTimeoutsRef.current = [];
    setLit(null);
    setPressed(null);
  }, []);

  const finish = useCallback(() => {
    clearSeqTimeouts();
    setSeqStatus("idle");
    setSeqStep(0);
    setStatus("finished");
  }, [clearSeqTimeouts]);

  const flashSequence = useCallback((newSeq: number[]) => {
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
  }, []);

  const beginSequence = useCallback(
    (length: number) => {
      clearSeqTimeouts();
      const newSequence = Array.from({ length }, () =>
        Math.floor(Math.random() * HANDRES)
      );
      setSequence(newSequence);
      flashSequence(newSequence);
    },
    [clearSeqTimeouts, flashSequence]
  );

  function pressLever(index: number) {
    if (status !== "playing" || seqStatus !== "awaiting" || lit !== null)
      return;

    setPressed(index);
    const pressedId = setTimeout(() => setPressed(null), 180);
    seqTimeoutsRef.current.push(pressedId);

    if (sequence[seqStep] !== index) {
      fireRef.current = clampFire(fireRef.current + FIRE_PENALTY);
      setFire(fireRef.current);
      setSeqStatus("wrong");
      const id = setTimeout(() => {
        setSeqStep(0);
        flashSequence(sequence);
      }, 800);
      seqTimeoutsRef.current.push(id);
      return;
    }

    const nextStep = seqStep + 1;
    setSeqStep(nextStep);
    if (nextStep >= sequence.length) {
      fireRef.current = clampFire(fireRef.current - FIRE_RELIEF);
      setFire(fireRef.current);
      setSeqStatus("congrats");
      setScore((s) => s + 1);
      const nextRound = round + 1;
      setRound(nextRound);
      const id = setTimeout(() => {
        beginSequence(sequenceLength(nextRound));
      }, 900);
      seqTimeoutsRef.current.push(id);
    }
  }

  function start() {
    clearSeqTimeouts();
    fireRef.current = START_FIRE;
    setFire(START_FIRE);
    setScore(0);
    setRound(1);
    setSequence([]);
    setSeqStep(0);
    setSeqStatus("idle");
    setLit(null);
    setStatus("playing");
    beginSequence(sequenceLength(1));
  }

  function tip() {
    if (score >= 15) {
      return "Incrível! Você é um verdadeiro bombeiro da floresta. 🔥💧";
    }
    if (score >= 8) {
      return "Muito bem! Sua memória está afiada. 🌿";
    }
    return "Lembre-se: nunca faça fogueiras em áreas de mata e denuncie queimadas pelo 193. 🚨";
  }

  useEffect(() => {
    if (status !== "playing") return;
    intervalRef.current = setInterval(() => {
      fireRef.current = clampFire(fireRef.current + FIRE_PER_TICK);
      setFire(fireRef.current);
      if (fireRef.current >= 100) {
        finish();
      }
    }, TICK_MS);
    return function cleanup() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [status, finish]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearSeqTimeouts();
    };
  }, [clearSeqTimeouts]);

  const burningTrees = Math.round((fire / 100) * ILLUSTRATED_TREES);
  const water = 100 - fire;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-forest-700">
        <span>✅ Sequências: {score}</span>
        <span>🏆 Nível {round}</span>
        <span>🔥 {Math.round(fire)}% em chamas</span>
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
            Abra o hidrante acompanhando a sequência das válvulas coloridas:
            memorize e repita a ordem. A cada acerto a sequência cresce e você
            joga água na floresta. Não deixe ela queimar por completo!
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

      {status !== "idle" && (
        <div className="mt-6">
          <div
            className="flex items-end justify-center gap-0.5 text-lg sm:text-xl"
            role="img"
            aria-label={`Floresta ${Math.round(fire)}% em chamas`}
          >
            {Array.from({ length: ILLUSTRATED_TREES }, (_, i) => (
              <span key={i} aria-hidden="true">
                {i < burningTrees ? "🔥" : "🌳"}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-forest-600">
            <span className="w-14 shrink-0 text-right">💧 Água</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-forest-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${water}%` }}
              />
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs font-medium text-forest-600">
            <span className="w-14 shrink-0 text-right">🔥 Fogo</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-forest-100">
              <div
                className="h-full rounded-full bg-emergency-500 transition-all duration-500"
                style={{ width: `${fire}%` }}
              />
            </div>
          </div>

          {status === "playing" && (
            <div
              className="mt-6 rounded-xl border border-forest-100 bg-forest-50 p-4"
              role="group"
              aria-label="Hidrante"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-forest-900">🔑 Hidrante</h3>
                <span className="text-xs font-semibold text-forest-600">
                  Sequência de {sequenceLength(round).toString()} válvulas
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                {LEVERS.map((lever, index) => {
                  const isLit = lit === index;
                  const isPressed = pressed === index;
                  return (
                    <button
                      key={lever.label}
                      type="button"
                      onClick={() => pressLever(index)}
                      disabled={seqStatus !== "awaiting" || lit !== null}
                      aria-label={lever.label}
                      aria-pressed={isLit || isPressed}
                      className={`h-14 w-14 cursor-pointer rounded-full border-4 transition-all duration-150 active:scale-90 sm:h-16 sm:w-16 ${
                        isLit
                          ? "scale-110 border-white shadow-lg ring-2 ring-emergency-400"
                          : isPressed
                            ? "scale-90 border-white ring-2 ring-white brightness-150"
                            : "border-forest-100"
                      } ${lever.className}`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 text-center text-sm" aria-live="polite">
                {seqStatus === "flashing" && (
                  <p className="font-medium text-forest-800">
                    Memorize a sequência…
                  </p>
                )}
                {seqStatus === "awaiting" && (
                  <p className="font-medium text-forest-800">
                    Repita a sequência!
                  </p>
                )}
                {seqStatus === "congrats" && (
                  <p className="font-medium text-forest-800">
                    Ótimo! Água na floresta 💧 (−{FIRE_RELIEF}% de fogo)
                  </p>
                )}
                {seqStatus === "wrong" && (
                  <p className="font-semibold text-emergency-600">
                    Sequência errada! +{FIRE_PENALTY}% de fogo.
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
                A floresta queimou!
              </h2>
              <p className="mt-2 text-sm font-semibold text-forest-800">
                Você completou {score}{" "}
                {score === 1 ? "sequência" : "sequências"}.
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
