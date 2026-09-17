import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/footer";

describe("Footer", () => {
  it("exibe o nome da brigada", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        "1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes)"
      )
    ).toBeInTheDocument();
  });

  it("exibe a indicação de copyright com o ano atual", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${year} 1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes)`
      )
    ).toBeInTheDocument();
  });

  it("exibe a localização da brigada", () => {
    render(<Footer />);
    expect(screen.getByText("Rio de Janeiro · Brasil")).toBeInTheDocument();
  });
});
