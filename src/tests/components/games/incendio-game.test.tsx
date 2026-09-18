import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import IncendioGame from "@/components/games/incendio-game";

describe("IncendioGame", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("exibe a tela inicial com o botão Começar", () => {
    render(<IncendioGame />);
    expect(screen.getByText("Apague o Incêndio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Começar" })).toBeInTheDocument();
  });

  it("mostra a floresta ilustrativa e o hidrante com as válvulas", async () => {
    const user = userEvent.setup();
    render(<IncendioGame />);
    await user.click(screen.getByRole("button", { name: "Começar" }));

    expect(
      screen.getByRole("img", { name: /Floresta .* em chamas/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Hidrante" })).toBeInTheDocument();
    for (const label of [
      "Válvula azul",
      "Válvula verde",
      "Válvula amarela",
      "Válvula vermelha",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByText("Memorize a sequência…")).toBeInTheDocument();
  });

  it("completa a sequência correta e avança o nível", async () => {
    const values = [0, 0.5];
    vi.spyOn(Math, "random").mockImplementation(() => values.shift() ?? 0.5);
    vi.useFakeTimers();
    render(<IncendioGame />);

    fireEvent.click(screen.getByRole("button", { name: "Começar" }));
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText("Repita a sequência!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Válvula azul" }));
    fireEvent.click(screen.getByRole("button", { name: "Válvula amarela" }));

    expect(screen.getByText(/Água na floresta/)).toBeInTheDocument();
    expect(screen.getByText("✅ Sequências: 1")).toBeInTheDocument();
    expect(screen.getByText("🏆 Nível 2")).toBeInTheDocument();
  });
});
