"use client";

import { useState } from "react";
import { generatePuzzle, pickWords, type Puzzle } from "@/data/caca-palavras";

interface CacaPalavrasGameProps {
  words?: string[];
  initialPuzzle?: Puzzle;
}

interface GameState {
  words: string[];
  puzzle: Puzzle;
}

function createGame(wordsArg?: string[], fixedPuzzle?: Puzzle): GameState {
  const words = wordsArg ?? pickWords();
  let puzzle = generatePuzzle(words);
  for (
    let attempt = 0;
    attempt < 20 && puzzle.placements.length !== words.length;
    attempt++
  ) {
    puzzle = generatePuzzle(words);
  }
  return { words, puzzle: fixedPuzzle ?? puzzle };
}

function cellsBetween(
  a: [number, number],
  b: [number, number]
): Array<[number, number]> {
  const dr = b[0] - a[0];
  const dc = b[1] - a[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [];
  const cells: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    cells.push([a[0] + (dr / steps) * i, a[1] + (dc / steps) * i]);
  }
  return cells;
}

export default function CacaPalavrasGame({
  words: wordsProp,
  initialPuzzle,
}: CacaPalavrasGameProps) {
  const [game, setGame] = useState<GameState>(() =>
    createGame(wordsProp, initialPuzzle)
  );
  const [selection, setSelection] = useState<[number, number] | null>(null);
  const [found, setFound] = useState<string[]>([]);

  const { words, puzzle } = game;
  const { grid, placements } = puzzle;
  const size = grid.length;

  const foundCells = new Set<string>(
    placements
      .filter((p) => found.includes(p.word))
      .flatMap((p) => p.cells.map(([r, c]) => `${r},${c}`))
  );

  function handleCell(row: number, col: number) {
    if (foundCells.has(`${row},${col}`)) return;
    if (!selection) {
      setSelection([row, col]);
      return;
    }
    if (selection[0] === row && selection[1] === col) {
      setSelection(null);
      return;
    }
    const line = cellsBetween(selection, [row, col]);
    const text = line.map(([r, c]) => grid[r][c]).join("");
    const reversed = text.split("").reverse().join("");
    const match = placements.find(
      (p) => !found.includes(p.word) && (p.word === text || p.word === reversed)
    );
    if (line.length > 0 && match) {
      const nextFound = [...found, match.word];
      setFound(nextFound);
      setSelection(null);
    } else {
      setSelection([row, col]);
    }
  }

  function restart() {
    setGame(createGame(wordsProp, initialPuzzle));
    setSelection(null);
    setFound([]);
  }

  function wordStatus(word: string) {
    return found.includes(word);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-forest-700">
        <span>
          Palavras encontradas: {found.length} de {placements.length}
        </span>
        {selection && <span>Clique na última letra da palavra.</span>}
      </div>

      <div
        className="mx-auto mt-4 grid max-w-md gap-1"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
        role="group"
        aria-label="Grade do caça-palavras"
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const isFound = foundCells.has(`${r},${c}`);
            const isSelected = selection?.[0] === r && selection?.[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCell(r, c)}
                disabled={isFound}
                aria-label={`Linha ${r + 1}, coluna ${c + 1}: letra ${letter}`}
                className={`flex aspect-square items-center justify-center rounded-md border text-sm font-bold transition-colors sm:text-base ${
                  isFound
                    ? "border-forest-600 bg-forest-600 text-white"
                    : isSelected
                      ? "border-emergency-500 bg-emergency-100 text-forest-900"
                      : "border-forest-100 bg-forest-50 text-forest-900 hover:bg-forest-100"
                }`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {words.map((word) => {
          const isFound = wordStatus(word);
          return (
            <li
              key={word}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                isFound
                  ? "border-forest-200 bg-forest-50 text-forest-400 line-through"
                  : "border-forest-100 bg-white text-forest-800"
              }`}
            >
              <span className="text-xs font-semibold uppercase">
                {word.toLowerCase()}
              </span>
            </li>
          );
        })}
      </ul>

      {found.length === placements.length && (
        <div className="mt-6 rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center">
          <span className="text-5xl" aria-hidden="true">
            🌳
          </span>
          <h2 className="mt-4 text-2xl font-bold text-forest-900">
            Parabéns! Você encontrou todas as palavras!
          </h2>
          <p className="mt-2 text-forest-700">
            Cada palavra é um pedacinho do que protegemos no dia a dia.
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
