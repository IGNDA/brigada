import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MemoryGame from "@/components/games/memory-game";

vi.mock("@/data/memory", () => ({
  memoryCards: [{ id: "arara", name: "Arara-azul", emoji: "🦜" }],
}));

describe("MemoryGame", () => {
  it("renderiza as cartas viradas", () => {
    render(<MemoryGame />);
    const cards = screen.getAllByRole("button", { name: "Carta virada" });
    expect(cards).toHaveLength(2);
  });

  it("vira a carta ao clicar", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);
    await user.click(
      screen.getAllByRole("button", { name: "Carta virada" })[0]
    );
    expect(
      screen.getByRole("button", { name: "Arara-azul, visível" })
    ).toBeInTheDocument();
  });

  it("finaliza o jogo ao encontrar todos os pares", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);
    const cards = screen.getAllByRole("button", { name: "Carta virada" });
    await user.click(cards[0]);
    await user.click(cards[1]);
    expect(
      screen.getByText("Parabéns! Você encontrou todos os pares!")
    ).toBeInTheDocument();
    expect(screen.getByText("Pares: 1 de 1")).toBeInTheDocument();
  });
});
