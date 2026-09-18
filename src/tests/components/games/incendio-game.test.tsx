import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import IncendioGame from "@/components/games/incendio-game";

describe("IncendioGame", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exibe a tela inicial com o botão Começar", () => {
    render(<IncendioGame />);
    expect(screen.getByText("Apague o Incêndio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Começar" })).toBeInTheDocument();
  });

  it("inicia o jogo ao clicar em Começar", async () => {
    const user = userEvent.setup();
    render(<IncendioGame />);
    await user.click(screen.getByRole("button", { name: "Começar" }));
    const map = screen.getByRole("group", { name: "Mapa da floresta" });
    expect(map).toBeInTheDocument();
    expect(map.children).toHaveLength(25);
    expect(
      screen.queryByRole("group", { name: "Hidrante" })
    ).not.toBeInTheDocument();
  });

  it("abre o hidrante quando os baldes de água acabam", async () => {
    const values = [0.01, 0.05, 0.09, 0.5];
    vi.spyOn(Math, "random").mockImplementation(() => {
      return values.shift() ?? 0.5;
    });
    const user = userEvent.setup();
    render(<IncendioGame />);
    await user.click(screen.getByRole("button", { name: "Começar" }));
    expect(screen.getByLabelText(/baldes de água/)).toHaveTextContent("2/4");

    const fireA = screen.getByRole("button", {
      name: "Foco de incêndio no bloco 1, 1",
    });
    const fireB = screen.getByRole("button", {
      name: "Foco de incêndio no bloco 1, 2",
    });
    await user.click(fireA);
    await user.click(fireB);

    expect(screen.getByLabelText(/baldes de água/)).toHaveTextContent("0/4");
    expect(screen.getByRole("group", { name: "Hidrante" })).toBeInTheDocument();
    expect(screen.getByText("Memorize a sequência…")).toBeInTheDocument();
  });
});
