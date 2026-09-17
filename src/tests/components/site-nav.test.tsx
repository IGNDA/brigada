import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SiteNav from "@/components/site-nav";

describe("SiteNav", () => {
  it("renderiza os links de navegação", () => {
    render(<SiteNav />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Quem somos")).toBeInTheDocument();
    expect(screen.getByText("Nossa atuação")).toBeInTheDocument();
    expect(screen.getByText("Nossos trabalhos")).toBeInTheDocument();
    expect(screen.getByText("Perguntas frequentes")).toBeInTheDocument();
  });

  it("renderiza o botão de abrir menu mobile", () => {
    render(<SiteNav />);
    expect(
      screen.getByRole("button", { name: "Abrir menu" })
    ).toBeInTheDocument();
  });

  it("abre o menu mobile ao clicar no botão", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(<SiteNav />);
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getByText("Falar com a Brigada")).toBeInTheDocument();
  });
});
