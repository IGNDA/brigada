import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FloatingWhatsApp from "@/components/floating-whatsapp";

describe("FloatingWhatsApp", () => {
  it("renderiza o link do WhatsApp", () => {
    render(<FloatingWhatsApp />);
    const link = screen.getByRole("link", {
      name: /Fale com a Brigada Ivan Moraes no WhatsApp/i,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("contém o botão de abrir WhatsApp", () => {
    render(<FloatingWhatsApp />);
    expect(
      screen.getByRole("button", { name: "Abrir WhatsApp" })
    ).toBeInTheDocument();
  });

  it("exibe o texto 'Fale conosco' em telas grandes", () => {
    render(<FloatingWhatsApp />);
    expect(screen.getByText("Fale conosco")).toBeInTheDocument();
  });
});
