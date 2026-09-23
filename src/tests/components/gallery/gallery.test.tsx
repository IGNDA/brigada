import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Gallery from "@/components/gallery/gallery";
import { fetchGallery } from "@/lib/api";
import type { GalleryItem } from "@/lib/gallery";

vi.mock("@/lib/api", () => ({
  fetchGallery: vi.fn(),
}));

vi.mock("yet-another-react-lightbox", () => ({
  default: () => null,
}));

const items: GalleryItem[] = [
  {
    id: "1",
    title: "Treino A",
    category: "cursos",
    url: "/a1.jpg",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Treino A",
    category: "cursos",
    url: "/a2.jpg",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Resgate X",
    category: "resgates",
    url: "/b1.jpg",
    createdAt: "2026-01-03T00:00:00.000Z",
  },
];

describe("Gallery", () => {
  beforeEach(() => {
    vi.mocked(fetchGallery).mockResolvedValue({
      updatedAt: "2026-01-03T00:00:00.000Z",
      items,
    });
  });

  it("mostra as contagens totais de fotos e álbuns", async () => {
    render(<Gallery />);
    await screen.findByText("Treino A");
    const stats = screen.getByTestId("gallery-stats");
    expect(within(stats).getByText(/3 fotos/)).toBeInTheDocument();
    expect(within(stats).getByText(/2 álbuns/)).toBeInTheDocument();
  });

  it("atualiza fotos e álbuns ao filtrar por categoria", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findByText("Treino A");

    await user.click(screen.getByRole("button", { name: "Cursos" }));

    const stats = screen.getByTestId("gallery-stats");
    expect(within(stats).getByText(/2 fotos/)).toBeInTheDocument();
    expect(within(stats).getByText(/1 álbum/)).toBeInTheDocument();
  });

  it("mantém os filtros visíveis quando a categoria não tem fotos", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findByText("Treino A");

    await user.click(screen.getByRole("button", { name: "Eventos" }));

    expect(
      screen.getByText("Nenhuma imagem nesta categoria")
    ).toBeInTheDocument();
    const stats = screen.getByTestId("gallery-stats");
    expect(within(stats).getByText(/0 fotos/)).toBeInTheDocument();
    expect(within(stats).getByText(/0 álbuns/)).toBeInTheDocument();

    const cursosFilter = screen.getByRole("button", { name: "Cursos" });
    expect(cursosFilter).toBeInTheDocument();
    await user.click(cursosFilter);
    await waitFor(() => {
      expect(screen.getByText("Treino A")).toBeInTheDocument();
    });
  });
});

describe("Gallery paginação", () => {
  const manyItems: GalleryItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `page-${i}`,
    title: `Álbum ${i + 1}`,
    category: "cursos",
    url: `/page-${i}.jpg`,
    createdAt: new Date(2026, 0, 20 - i).toISOString(),
  }));

  beforeEach(() => {
    vi.mocked(fetchGallery).mockResolvedValue({
      updatedAt: "2026-01-20T00:00:00.000Z",
      items: manyItems,
    });
  });

  it("mostra apenas 9 álbuns por página e navega entre páginas", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findByRole("heading", { name: "Álbum 1" });

    expect(
      screen.getByRole("heading", { name: "Álbum 9" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Álbum 10" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Página 2 de 2" }));

    expect(
      await screen.findByRole("heading", { name: "Álbum 10" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Álbum 1" })
    ).not.toBeInTheDocument();
  });

  it("volta para a primeira página ao mudar o filtro", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findByRole("heading", { name: "Álbum 1" });

    await user.click(screen.getByRole("button", { name: "Página 2 de 2" }));
    await screen.findByRole("heading", { name: "Álbum 10" });

    await user.click(screen.getByRole("button", { name: "Eventos" }));
    await screen.findByText("Nenhuma imagem nesta categoria");

    await user.click(screen.getByRole("button", { name: "Todas" }));
    await screen.findByRole("heading", { name: "Álbum 1" });
    expect(
      screen.getByRole("button", { name: "Página 1 de 2" })
    ).toHaveAttribute("aria-current", "page");
  });
});
