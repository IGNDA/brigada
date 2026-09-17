import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FAQ from "@/components/faq/faq";
import { faqData } from "@/data/faq";

describe("FAQ", () => {
  it("renderiza o título da seção", () => {
    render(<FAQ />);
    expect(screen.getByText("Dúvidas comuns")).toBeInTheDocument();
  });

  it("renderiza todas as perguntas", () => {
    render(<FAQ />);
    for (const item of faqData) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it("expande uma pergunta ao clicar", async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const button = screen.getByRole("button", { name: faqData[0].question });
    await user.click(button);
    const answer = screen.getByText(faqData[0].answer);
    expect(answer.parentElement).toHaveClass("max-h-96");
  });

  it("colapsa uma pergunta ao clicar novamente", async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const button = screen.getByRole("button", { name: faqData[0].question });
    await user.click(button);
    await user.click(button);
    const answer = screen.getByText(faqData[0].answer);
    expect(answer.parentElement).toHaveClass("max-h-0");
  });

  it("expande a primeira pergunta quando defaultOpen é true", () => {
    render(<FAQ defaultOpen />);
    const answer = screen.getByText(faqData[0].answer);
    expect(answer.parentElement).toHaveClass("max-h-96");
  });
});
