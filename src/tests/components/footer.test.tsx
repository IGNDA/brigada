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
    expect(screen.getByText(`© ${year} Brigada Ivan Moraes`)).toBeInTheDocument();
  });

  it("exibe a localização da brigada", () => {
    render(<Footer />);
    expect(screen.getByText("Rio de Janeiro · Brasil")).toBeInTheDocument();
  });

  it("exibe o nome completo da instituição", () => {
    render(<Footer />);
    expect(
      screen.getByText("Instituto Guarda-Natureza de Defesa Ambiental")
    ).toBeInTheDocument();
  });
});
