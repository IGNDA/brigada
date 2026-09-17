# Testes

## Estrutura

Todos os testes unitários ficam **centralizados** em `src/tests/`, espelhando a estrutura de pastas do projeto:

```
src/tests/
├── components/
│   └── footer.test.tsx      # testa src/components/footer.tsx
├── content/
│   └── docs/
│       └── index.test.ts    # testa src/content/docs/index.ts
└── ...
```

Para cada pasta de código em `src/`, existe uma pasta correspondente em `src/tests/` que contém os arquivos `*.test.ts(x)`.

## Framework

Usamos **Vitest** + **React Testing Library** + **@testing-library/jest-dom** com ambiente `jsdom`.

O Vitest está configurado para descobrir apenas os arquivos em `src/tests/**/*.test.{ts,tsx}` (ver `vitest.config.mts`).

## Scripts

| Comando                 | Descrição                                |
| ----------------------- | ---------------------------------------- |
| `npm run test`          | Roda os testes uma vez (CI / pré-commit) |
| `npm run test:watch`    | Modo watch durante o desenvolvimento     |
| `npm run test:coverage` | Gera relatório de cobertura de código    |

## Como escrever testes

O Vitest está configurado com `globals: true`, então `describe`, `it`, `expect`, etc. são globais (não é necessário importar).

Sempre prefira consultar **pela semântica** (roles, texto, labels) em vez de testar por classe CSS ou tag:

```tsx
import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer";

describe("Footer", () => {
  it("exibe o nome da brigada", () => {
    render(<Footer />);
    expect(
      screen.getByText("Brigada de Operações Florestais de Rio de Janeiro")
    ).toBeInTheDocument();
  });
});
```

## Convenções

- Arquivo: `<nome>.test.ts(x)` em **kebab-case**, dentro da pasta espelhada em `src/tests/`.
- Um `describe` por componente/módulo.
- Testar o **comportamento**, não a implementação.
- Mockar chamadas externas (fetch, API) e limites de módulo do Next.js quando necessário.
