import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuizGame from "@/components/games/quiz-game";

const QUESTIONS = vi.hoisted(() => [
  {
    question: "Qual é a atitude correta ao encontrar animal silvestre?",
    options: ["Levar para casa", "Observar a distância", "Alimentar", "Tocar"],
    correctIndex: 1,
    explanation: "Observar a distância é o certo.",
  },
  {
    question: "Qual órgão atende incêndios florestais?",
    options: ["Bombeiros", "Telefonia", "Cartório", "Prefeitura"],
    correctIndex: 0,
    explanation: "Bombeiros (193).",
  },
]);

vi.mock("@/data/quiz", () => ({
  quizQuestions: QUESTIONS,
  quizResultMessage: (score: number, total: number) =>
    `Você acertou ${score} de ${total}`,
}));

function startGame(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: "Começar" }));
}

function currentQuestion() {
  const heading = screen.getByRole("heading", { level: 3 }).textContent!;
  return QUESTIONS.find((q) => q.question === heading)!;
}

function clickOption(user: ReturnType<typeof userEvent.setup>, text: string) {
  return user.click(screen.getByRole("button", { name: new RegExp(text) }));
}

describe("QuizGame", () => {
  it("exibe a tela inicial com o botão Começar", () => {
    render(<QuizGame />);
    expect(screen.getByText("Quiz Ambiental")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Começar" })).toBeInTheDocument();
  });

  it("mostra a primeira pergunta ao clicar em Começar", async () => {
    const user = userEvent.setup();
    render(<QuizGame />);
    await startGame(user);
    expect(screen.getByText("Pergunta 1 de 2")).toBeInTheDocument();
    expect(screen.getByText("Acertos: 0")).toBeInTheDocument();
  });

  it("exibe feedback de resposta correta", async () => {
    const user = userEvent.setup();
    render(<QuizGame />);
    await startGame(user);
    const question = currentQuestion();
    await clickOption(user, question.options[question.correctIndex]);
    expect(screen.getByText(/Correto!/)).toBeInTheDocument();
  });

  it("exibe feedback de resposta incorreta", async () => {
    const user = userEvent.setup();
    render(<QuizGame />);
    await startGame(user);
    const question = currentQuestion();
    const wrongIndex = question.correctIndex === 0 ? 1 : 0;
    await clickOption(user, question.options[wrongIndex]);
    expect(screen.getByText(/A resposta certa é [A-D]/)).toBeInTheDocument();
  });

  it("mostra o resultado ao concluir todas as perguntas", async () => {
    const user = userEvent.setup();
    render(<QuizGame />);
    await startGame(user);
    for (let i = 0; i < QUESTIONS.length; i++) {
      const question = currentQuestion();
      await clickOption(user, question.options[question.correctIndex]);
      await user.click(
        screen.getByRole("button", {
          name: i < QUESTIONS.length - 1 ? "Próxima pergunta" : "Ver resultado",
        })
      );
    }
    expect(screen.getAllByText("Você acertou 2 de 2").length).toBeGreaterThan(
      0
    );
  });
});
