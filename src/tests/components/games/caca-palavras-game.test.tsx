import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CacaPalavrasGame from "@/components/games/caca-palavras-game";
import { cacaPalavrasWords } from "@/data/caca-palavras";

describe("CacaPalavrasGame", () => {
  it("renderiza a grade de letras com as linhas esperadas", () => {
    render(<CacaPalavrasGame />);
    const group = screen.getByRole("group", { name: "Grade do caça-palavras" });
    expect(group.children).toHaveLength(12 * 12);
  });

  it("sorteia 10 palavras do acervo por jogo", () => {
    render(<CacaPalavrasGame />);
    const words = screen.getAllByRole("listitem");
    expect(words).toHaveLength(10);
    for (const li of words) {
      expect(cacaPalavrasWords).toContain(li.textContent!.toUpperCase());
    }
  });

  it("marca uma palavra ao selecionar as letras corretas", async () => {
    const user = userEvent.setup();
    render(
      <CacaPalavrasGame
        words={["RIO", "MATA"]}
        initialPuzzle={{
          grid: [
            ["R", "I", "O", "X"],
            ["M", "A", "T", "A"],
            ["X", "X", "X", "X"],
            ["X", "X", "X", "X"],
          ],
          placements: [
            {
              word: "RIO",
              cells: [
                [0, 0],
                [0, 1],
                [0, 2],
              ],
            },
            {
              word: "MATA",
              cells: [
                [1, 0],
                [1, 1],
                [1, 2],
                [1, 3],
              ],
            },
          ],
        }}
      />
    );
    await user.click(screen.getByRole("button", { name: /Linha 1, coluna 1/ }));
    await user.click(screen.getByRole("button", { name: /Linha 1, coluna 3/ }));
    expect(screen.getByText("rio").closest("li")).toHaveClass("line-through");
  });

  it("exibe a mensagem de vitória ao encontrar todas as palavras", async () => {
    const user = userEvent.setup();
    render(
      <CacaPalavrasGame
        words={["RIO", "MATA"]}
        initialPuzzle={{
          grid: [
            ["R", "I", "O", "X"],
            ["M", "A", "T", "A"],
            ["X", "X", "X", "X"],
            ["X", "X", "X", "X"],
          ],
          placements: [
            {
              word: "RIO",
              cells: [
                [0, 0],
                [0, 1],
                [0, 2],
              ],
            },
            {
              word: "MATA",
              cells: [
                [1, 0],
                [1, 1],
                [1, 2],
                [1, 3],
              ],
            },
          ],
        }}
      />
    );
    await user.click(screen.getByRole("button", { name: /Linha 1, coluna 1/ }));
    await user.click(screen.getByRole("button", { name: /Linha 1, coluna 3/ }));
    await user.click(screen.getByRole("button", { name: /Linha 2, coluna 1/ }));
    await user.click(screen.getByRole("button", { name: /Linha 2, coluna 4/ }));
    expect(
      screen.getByText("Parabéns! Você encontrou todas as palavras!")
    ).toBeInTheDocument();
  });
});
