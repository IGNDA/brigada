import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/footer";

describe("Footer", () => {
  it("exibe o nome da brigada", () => {
    render(<Footer />);
    expect(screen.getByText("Brigada Ivan Moraes")).toBeInTheDocument();
  });

  it("exibe a indicação de copyright com o ano atual", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} Brigada Ivan Moraes`)
    ).toBeInTheDocument();
  });

  it("exibe a localização da brigada", () => {
    render(<Footer />);
    expect(screen.getByText("Rio de Janeiro · Brasil")).toBeInTheDocument();
  });

  it("exibe o nome completo da instituição", () => {
    render(<Footer />);
    expect(
      screen.getByText("Instituto Guarda Nacional de Defesa Ambiental")
    ).toBeInTheDocument();
  });

  it("exibe o menu de Entretenimento com o link de jogos e cada jogo", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Entretenimento" });
    expect(nav).toBeInTheDocument();
    for (const label of [
      "Jogos",
      "Quiz Ambiental",
      "Jogo da Memória",
      "Coleta Seletiva",
      "Apague o Incêndio",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("exibe o menu de Administração com o link da área administrativa", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Administração" });
    expect(nav).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Área administrativa" })
    ).toBeInTheDocument();
  });
});
