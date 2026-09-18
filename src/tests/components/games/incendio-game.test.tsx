import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import IncendioGame from "@/components/games/incendio-game";

describe("IncendioGame", () => {
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
  });

  it("exibe o hidrante com as válvulas e a pontuação de baldes", async () => {
    const user = userEvent.setup();
    render(<IncendioGame />);
    await user.click(screen.getByRole("button", { name: "Começar" }));
    const hydrant = screen.getByRole("group", { name: "Hidrante" });
    expect(hydrant).toBeInTheDocument();
    for (const label of [
      "Válvula azul",
      "Válvula verde",
      "Válvula amarela",
      "Válvula vermelha",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: "Pedir água" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/baldes de água/)).toHaveTextContent("2/4");
  });
});
