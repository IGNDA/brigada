import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ReciclagemGame from "@/components/games/reciclagem-game";
import { wasteItems, wasteCategories } from "@/data/reciclagem";

describe("ReciclagemGame", () => {
  it("renderiza o item atual e as seis lixeiras", () => {
    render(<ReciclagemGame />);
    expect(screen.getAllByRole("button", { name: /Lixeira/ })).toHaveLength(6);
    for (const cat of wasteCategories) {
      expect(
        screen.getByRole("button", { name: `Lixeira ${cat.label}` })
      ).toBeInTheDocument();
    }
  });

  it("exibe feedback ao descartar no lugar correto", async () => {
    const user = userEvent.setup();
    render(<ReciclagemGame />);
    const currentItem = screen.getAllByRole("heading", { level: 2 })[0]
      .textContent!;
    const matches = wasteItems.filter((item) => item.name === currentItem);
    expect(matches).toHaveLength(1);
    const category = wasteCategories.find((c) => c.id === matches[0].category)!;
    await user.click(
      screen.getByRole("button", { name: `Lixeira ${category.label}` })
    );
    expect(screen.getByText(/Boa!/)).toBeInTheDocument();
  });
});
