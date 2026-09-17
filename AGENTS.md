<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Convenções do projeto

## Comandos de verificação
Sempre rode estes comandos após concluir tarefas de código:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run format:check`

Build de produção: `npm run build` (gera exportação estática em `out/`).

## Stack
- Next.js 16 (App Router) com exportação estática para GitHub Pages — `next.config.ts` já define `output: "export"`, `basePath` e `assetPrefix` para `/bof-rj`.
- Código da aplicação em `src/` (`src/app`, `src/components`, `src/styles`, `src/tests`), com alias `@/` apontando para `./src/*`.
- TypeScript estrito.
- Tailwind CSS v4 com tema customizado (`forest-*`, `emergency-*`) em `src/styles/globals.css`.
- Testes: Vitest + React Testing Library, centralizados em `src/tests/` espelhando `src/`. Ver `docs/TESTING.md`.
- Formatação: Prettier.

## Regras
- Arquivos em **kebab-case** (`footer.tsx`, `o-que-e.md`), exceto convenções do framework (`layout.tsx`, `page.tsx`, `_app.tsx`).
- Não criar rotas de API (`app/api`) — não suportadas na exportação estática.
- Não usar rendering dinâmico (`headers`, `cookies`), `getServerSideProps` nem ISR — incompatíveis com `output: "export"`.
- Testes centralizados em `src/tests/<pasta-correspondente>/<nome>.test.ts(x)`.
- Usar route groups `()` para organizar seções com layouts próprios (ex.: `(site)`).

## UI e Responsividade
- Todo componente de interface deve ser **responsivo**, funcionando em mobile, tablet e desktop.
- O menu de navegação principal usa **menu lateral deslizante (off-canvas)** em telas pequenas (`< lg`) e menu horizontal em telas maiores.
- O header e o footer são compartilhados globalmente a partir do root layout (`src/app/layout.tsx`).
- Usar breakpoints do Tailwind (`sm`, `md`, `lg`, `xl`) e propiciar interação acessível (botão com `aria-label`, painel com `aria-label`).
- Não usar estilos fixos que causem quebra em telas pequenas; preferir `flex`, `grid` responsivos e `overflow` controlado.



