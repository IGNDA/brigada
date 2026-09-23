# Brigada IGNDA — Instituto Guarda Nacional de Defesa Ambiental

Site da Brigada IGNDA, construído com **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, com
deploy automático no **GitHub Pages** e uma galeria de "Nossos trabalhos"
alimentada por **Cloudflare R2 + Worker**.

## Stack

- [Next.js 16](https://nextjs.org) — App Router, exportação estática
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) — testes unitários
- [Prettier](https://prettier.io) — formatação
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) — hooks de pré-commit
- [Cloudflare Workers](https://workers.cloudflare.com) + [R2](https://developers.cloudflare.com/r2/) — galeria e upload

## Começando

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para a galeria/upload funcionar, configure o [Cloudflare R2 + Worker](docs/CLOUDFLARE_R2.md)
e crie um `.env.local` (veja `.env.example`).

## Scripts

| Comando                    | Descrição                                 |
| -------------------------- | ----------------------------------------- |
| `npm run dev`              | Servidor de desenvolvimento               |
| `npm run build`            | Build de produção (gera a pasta `out/`)   |
| `npm run start`            | Executa o build de produção               |
| `npm run lint`             | Verifica o código com ESLint              |
| `npm run lint:fix`         | Corrige automaticamente o ESLint          |
| `npm run typecheck`        | Verifica os tipos com TypeScript          |
| `npm run format`           | Formata o código com Prettier             |
| `npm run format:check`     | Verifica a formatação                     |
| `npm run test`             | Roda os testes unitários                  |
| `npm run test:watch`       | Roda os testes em modo watch              |
| `npm run test:coverage`    | Roda os testes com relatório de cobertura |
| `npm run typecheck:worker` | Verifica os tipos do Cloudflare Worker    |
| `npm run worker:dev`       | Sobe o Worker localmente (wrangler)       |
| `npm run worker:deploy`    | Faz deploy do Worker no Cloudflare        |

Ao commitar, o hook de pré-commit (Husky + lint-staged) roda ESLint e Prettier automaticamente nos arquivos alterados.

## Estrutura

```
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (html/body base)
│   │   ├── (site)/                # Site público
│   │   │   ├── layout.tsx         # Header + Footer
│   │   │   ├── page.tsx           # Home (SPA com seções ancoradas)
│   │   │   └── nossos-trabalhos/  # Galeria pública
│   │   └── (admin)/               # Área administrativa (protegida por senha)
│   │       ├── layout.tsx
│   │       └── admin/
│   │           ├── login/         # /admin/login
│   │           └── nossos-trabalhos/  # /admin/nossos-trabalhos (upload/gestão)
│   ├── components/
│   │   ├── admin/                 # Components da área admin
│   │   ├── gallery/               # Componentes da galeria pública
│   │   ├── header.tsx, footer.tsx, site-nav.tsx
│   ├── lib/                       # Constants, tipos e helpers (api, gallery, auth)
│   ├── styles/                    # Estilos globais / tema Tailwind
│   └── tests/                     # Testes unitários centralizados (espelha src/)
├── worker/                        # Cloudflare Worker (galeria/upload)
│   ├── src/index.ts
│   └── wrangler.toml
├── public/                        # Assets estáticos
├── docs/                          # Documentação de padrões do projeto
└── .github/workflows/             # CI/CD (GitHub Pages)
```

## Convenções

- **Arquivos em kebab-case** (`footer.tsx`, `site-nav.tsx`), exceto convenções do framework (`layout.tsx`, `page.tsx`).
- **Testes centralizados** em `src/tests/` espelhando a estrutura de `src/`. Ver [docs/TESTING.md](docs/TESTING.md).
- **Rotas**: o site público é um SPA com âncoras na home; `/nossos-trabalhos` é uma rota real; a área `/admin/*` é separada e protegida por senha.

## Galeria "Nossos trabalhos"

- **Pública**: `/nossos-trabalhos` — grid com filtros por categoria, lazy-load e lightbox.
- **Admin**: `/admin/nossos-trabalhos` — requer senha (`ADMIN_SECRET` do Worker) para enviar/excluir imagens.
- Armazenamento e backend: Cloudflare **R2** + **Worker**. Ver [docs/CLOUDFLARE_R2.md](docs/CLOUDFLARE_R2.md).

## Deploy

O deploy é feito automaticamente pelo **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) a cada push na branch `main`, publicando a pasta `out/` no GitHub Pages.

Passos para ativar:

1. Faça push das alterações para `main`.
2. No GitHub: **Settings → Pages → Source: GitHub Actions**.
3. O site ficará disponível em `https://brigadaignda.org.br/`.

> O Cloudflare Worker não é deployado pelo GitHub Actions — ele é deployado
> manualmente via `npm run worker:deploy` (ver `docs/CLOUDFLARE_R2.md`).

## Documentação

- [Testes](docs/TESTING.md) — convenções e como escrever testes
- [Cloudflare R2 + Worker](docs/CLOUDFLARE_R2.md) — configuração da galeria e do upload
