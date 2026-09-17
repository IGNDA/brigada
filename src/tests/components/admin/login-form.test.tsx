import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/admin/login-form";

const onSuccess = vi.fn();

function mockFetch(response: { status: number; body: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    json: async () => response.body,
  });
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    onSuccess.mockReset();
  });

  it("exibe os campos de login", () => {
    render(<LoginForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("chama onSuccess quando a senha está correta", async () => {
    globalThis.fetch = mockFetch({
      status: 200,
      body: { token: "abc.123" },
    });
    const user = userEvent.setup();
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Senha"), "minhasenha");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("exibe erro quando a senha está incorreta", async () => {
    globalThis.fetch = mockFetch({
      status: 401,
      body: { error: "Senha incorreta." },
    });
    const user = userEvent.setup();
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Senha"), "errada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Senha incorreta."
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
