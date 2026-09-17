import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/components/header";

describe("Header", () => {
  it("exibe o nome da brigada", () => {
    render(<Header />);
    expect(screen.getByText("Brigada Ivan Moraes")).toBeInTheDocument();
  });

  it("exibe o nome do instituto", () => {
    render(<Header />);
    expect(
      screen.getByText("Instituto Guarda Nacional de Defesa Ambiental")
    ).toBeInTheDocument();
  });

  it("renderiza o link para a home", () => {
    render(<Header />);
    const link = screen.getAllByRole("link")[0];
    expect(link).toHaveAttribute("href", "/");
  });

  it("renderiza a imagem do logo com alt", () => {
    render(<Header />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Logotipo da Brigada Ivan Moraes");
  });
});
