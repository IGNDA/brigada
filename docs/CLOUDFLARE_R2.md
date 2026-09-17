# Configuração do Cloudflare (R2 + Worker)

Este guia cobre o setup manual na conta Cloudflare necessário para o funcionamento
da **galeria "Nossos trabalhos"** e da **área de upload (`/admin`)**.

> O site em si (GitHub Pages) já funciona sem isso — estas etapas são só para a
> funcionalidade de galeria/upload.

---

## Resumo

| Componente            | O que é                               | Custo (plano free)                     |
| --------------------- | ------------------------------------- | -------------------------------------- |
| **R2 bucket**         | Armazena as imagens + `manifest.json` | 10GB, 1M Class A / 10M Class B ops/mês |
| **Cloudflare Worker** | Backend da galeria/upload (API)       | 100k req/dia, 10ms CPU                 |

---

## Estado atual da configuração (valores reais)

> Os passos abaixo já foram executados na conta Cloudflare (conta
> oficial do projeto). Os valores aqui servem de referência no momento da
> escrita — se você já tiver feito o setup, apenas confira/atualize esta seção.

| Item               | Valor                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| **Worker**         | `brigada-ignda-gallery`                                                        |
| **URL do Worker**  | `https://brigada-ignda-gallery.<subdominio>.workers.dev`                       |
| **Bucket R2**      | `brigada-ignda` (vinculado como `env.GALLERY_BUCKET`)                          |
| **URL pública R2** | `https://pub-<hash>.r2.dev`                                                    |
| **Secret admin**   | `ADMIN_SECRET` (definido no Worker — senha do `/admin`)                        |
| **Deploy CLI**     | `npx wrangler r2 bucket dev-url enable brigada-ignda` → habilitou o r2.dev URL |

Verificações feitas:

- `GET /api/gallery` responde `200` com `{"updatedAt":"...","items":[]}` (lista vazia — correto antes do primeiro upload).

Para recriar este estado do zero, siga os passos 1 a 3 abaixo.

---

## 1. Criar o bucket R2

1. No painel Cloudflare → **R2 Object Storage** → **Create bucket**.
2. Nome: **`brigada-ignda`** (deve bater com `bucket_name` em `worker/wrangler.toml`).
3. Deixe a região padrão.
4. Após criar, vá em **Settings → Public Access** e ative **"R2.dev subdomain"**.
   - Anote o domínio público gerado: **`https://pub-<hash>.r2.dev`**
   - Este valor vai em `NEXT_PUBLIC_R2_PUBLIC_BASE` no `.env.local`.

> **CORS**: como o site roda em outro domínio (GitHub Pages), pode ser necessário
> configurar CORS no bucket (Settings → CORS Policies). O Worker já envia os
> headers `Access-Control-Allow-Origin`, então na maioria dos casos não é preciso
> mexer aqui. Se a galeria der erro de CORS no navegador, adicione uma regra
> permitindo o domínio do site e métodos `GET`.

---

## 2. Deploy do Worker

O Worker já está versionado na pasta `worker/`.

### 2.1. Instalar dependências do Worker

O `wrangler` já está nas devDependencies do projeto, mas você precisa do `@cloudflare/workers-types`
para o typecheck. Já está instalado.

### 2.2. Configurar a senha do admin (`ADMIN_SECRET`)

A senha de acesso à área `/admin` é armazenada como **secret** do Worker
(nunca no código):

```bash
cd worker
npx wrangler login              # ou já esteja logado
npx wrangler secret put ADMIN_SECRET
# digite a senha quando pedir, ex: umaSenhaForteSegura
```

> Guarde essa senha — é a mesma que será digitada na tela de login de `/admin`.

### 2.3. Deploy

```bash
npm run worker:deploy
# ou: cd worker && npx wrangler deploy
```

O wrangler irá pedir para criar um **worker** chamado `brigada-ignda-gallery` (nome do
`wrangler.toml`) e vincular o bucket `brigada-ignda`. Ao final, ele mostra a URL pública:

```
https://brigada-ignda-gallery.<subdominio>.workers.dev
```

Anote essa URL — vai em `NEXT_PUBLIC_GALLERY_WORKER_URL` no `.env.local`.

> **Como trocar a senha depois**: basta rodar novamente
> `npx wrangler secret put ADMIN_SECRET` e informar a nova senha. O novo secret
> vale para o próximo deploy/requisição — não precisa rebuildar o site.

### 2.4. Testar o Worker localmente (opcional)

```bash
npm run worker:dev
# seta a senha antes para teste local
cd worker && npx wrangler secret put ADMIN_SECRET --local
npm run worker:dev
```

---

## 3. Configurar o site (`.env.local`)

Crie um arquivo `.env.local` na raiz do projeto (não é commitado; use
`.env.example` como referência):

```bash
NEXT_PUBLIC_GALLERY_WORKER_URL=https://brigada-ignda-gallery.<subdominio>.workers.dev
NEXT_PUBLIC_R2_PUBLIC_BASE=https://pub-<hash>.r2.dev
```

- `NEXT_PUBLIC_GALLERY_WORKER_URL` → URL pública do Worker (deploy acima).
- `NEXT_PUBLIC_R2_PUBLIC_BASE` → domínio público do bucket R2 (passo 1).

> ⚠️ **Importante**: variáveis `NEXT_PUBLIC_*` ficam expostas no bundle JS de
> produção (o que é esperado — são URLs públicas). Nunca coloque o `ADMIN_SECRET`
> aqui.

Reinicie o `next dev` após alterar o `.env.local`.

---

## 4. Como funciona o fluxo

- **Página pública `/nossos-trabalhos`**: um client component chama
  `GET <worker>/api/gallery`, que retorna o `manifest.json` com a lista de itens.
  As imagens são carregadas direto do domínio público do R2 (lazy-load).
- **Área admin `/admin/nossos-trabalhos`**: pede a senha. Se correta, o Worker
  devolve um token curto (HMAC com expiração de 8h) via `POST /api/auth`, que é
  guardado na `sessionStorage`. Todos os uploads/edições enviam esse token no
  header `Authorization: Bearer <token>`.
- **Upload**: `POST /api/upload` (multipart) valida o token, o tipo e o tamanho
  (máx. 10MB), grava a imagem no bucket e atualiza o `manifest.json`.
- **Excluir**: `DELETE /api/item/:id` (com token) remove o objeto e atualiza o
  manifest, reordenando por data (mais novo primeiro).

---

## 5. CI — variáveis no build de produção (GitHub Actions)

O site é **estático** e buildado no GitHub Actions. Como os `NEXT_PUBLIC_*`
precisam existir **durante** `npm run build`, o workflow `.github/workflows/deploy.yml`
lê esses valores de **secrets do repositório**:

```yaml
- name: Build with Next.js
  run: npm run build
  env:
    NEXT_PUBLIC_GALLERY_WORKER_URL: ${{ secrets.NEXT_PUBLIC_GALLERY_WORKER_URL }}
    NEXT_PUBLIC_R2_PUBLIC_BASE: ${{ secrets.NEXT_PUBLIC_R2_PUBLIC_BASE }}
    NEXT_PUBLIC_GA_ID: ${{ secrets.NEXT_PUBLIC_GA_ID }}
```

### Pré-requisito: configurar os secrets do GitHub

1. No repositório, vá em **Settings → Secrets and variables → Actions → New repository secret**.
2. Crie **três** secrets com os mesmos nomes acima e os valores correspondentes.
3. Faça push para `main` — o deploy passa a usar esses valores.

> Isso é independente do `.env.local` (que serve só para o desenvolvimento local).

---

## 6. Endpoints da API (resumo)

| Método   | Rota            | Auth           | Descrição                           |
| -------- | --------------- | -------------- | ----------------------------------- |
| `GET`    | `/api/gallery`  | —              | Retorna o manifest (lista de itens) |
| `POST`   | `/api/auth`     | —              | Valida senha → retorna token        |
| `POST`   | `/api/upload`   | `Bearer token` | Envia imagem + metadados            |
| `PATCH`  | `/api/item/:id` | `Bearer token` | Atualiza título/descrição/categoria |
| `DELETE` | `/api/item/:id` | `Bearer token` | Remove item                         |

CORS: o Worker responde `OPTIONS` e envia `Access-Control-Allow-*` em todas as rotas.

---

## 7. Solução de problemas

- **Login dá "Senha incorreta"**: confirme que o `ADMIN_SECRET` foi definido no
  Worker (`npx wrangler secret put ADMIN_SECRET`) e que digitou exatamente a
  mesma senha.
- **Galeria vazia/erro de rede**: confira `NEXT_PUBLIC_GALLERY_WORKER_URL` e se o
  Worker foi feito deploy. Teste a URL no navegador → deve abrir `{...items:[...]}`.
  (A URL deve ser do novo worker `brigada-ignda-gallery`.)
- **Erro de CORS no navegador**: adicione regra de CORS no bucket R2 (Settings →
  CORS Policies) permitindo a origem do site e método `GET`.
- **Imagem não carrega**: confira `NEXT_PUBLIC_R2_PUBLIC_BASE` — as URLs das
  imagens no manifest são relativas (`/imagens/...`) e o prefixo é adicionado a
  partir dessa base.

---

## 8. Proteções contra abuso e ultrapassagem de limites

Para garantir que o site não ultrapasse os limites do plano gratuito, foram
configuradas **duas camadas de proteção**: uma no código do Worker e outra no
painel do Cloudflare.

### 8.1. Proteção no código do Worker (rate limiting interno)

O Worker possui um rate limiter interno que limita requisições por endereço IP:

| Rota               | Limite       | Janela | Ação ao exceder                      |
| ------------------ | ------------ | ------ | ------------------------------------ |
| `POST /api/auth`   | 5 tentativas | 1 min  | Retorna HTTP 429 "Muitas tentativas" |
| `POST /api/upload` | 20 uploads   | 1 min  | Retorna HTTP 429 "Muitos uploads"    |

> **Nota técnica**: o rate limiter é baseado em memória do Worker (Map em
> JavaScript). Como o Cloudflare pode executar múltiplas instâncias do Worker
> simultaneamente, a contagem não é 100% precisa entre instâncias. Para uma
> proteção mais robusta, use as regras de rate limiting do painel (seção 8.2).

### 8.2. Proteção no painel do Cloudflare (dashboard)

Estas configurações são feitas pelo desenvolvedor no painel do Cloudflare
(`dash.cloudflare.com`):

#### Rate limiting (limite de requisições)

1. No painel → **Workers & Pages** → selecione `brigada-ignda-gallery` → **Settings** → **Triggers** → **Rate Limiting**.
2. Crie uma regra: "Se uma origem (IP) fizer mais de 100 requisições/minuto, bloquear por 5 minutos".
3. Salve a regra.

> Isso evita abuso (bots, ataques, scripts). O limite real do plano free é
> 100.000 req/dia, mas a regra de rate limiting protege contra picos
> 瞬aneos.

#### Spending limit (limite de gasto no R2)

1. No painel → **R2 Object Storage** → selecione o bucket `brigada-ignda` → **Settings** → **Metrics**.
2. Em **Usage Limits**, configure um **spending limit** (ex.: US$ 0,00 para
   garantir que não gaste nada além do free tier).
3. O Cloudflare bloqueará novos uploads antes de ultrapassar o limite.

#### Alertas por e-mail

1. No painel → **Notifications** (sino no canto superior direito) → **Add notification**.
2. Crie um alerta: "Quando o Worker atingir 80% do limite de requisições, enviar e-mail".
3. Crie outro alerta: "Quando o R2 atingir 80% do armazenamento, enviar e-mail".
4. Use o e-mail da organização para receber as notificações.

> Com essas proteções, o desenvolvedor é avisado antes de qualquer bloqueio
> e pode tomar providências (liberar espaço, ajustar limites, etc.).

---

## 9. Variáveis de ambiente (resumo)

| Variável                         | Onde é usada            | Onde é definida                                      |
| -------------------------------- | ----------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_GALLERY_WORKER_URL` | Front-end (site)        | `.env.local` + GitHub Secrets                        |
| `NEXT_PUBLIC_R2_PUBLIC_BASE`     | Front-end (site)        | `.env.local` + GitHub Secrets                        |
| `NEXT_PUBLIC_GA_ID`              | Front-end (site)        | `.env.local` + GitHub Secrets (Google Analytics)     |
| `ADMIN_SECRET`                   | Worker (senha do admin) | `wrangler secret put ADMIN_SECRET` (nunca no código) |

> Variáveis `NEXT_PUBLIC_*` ficam expostas no bundle JS (são URLs públicas).
> `ADMIN_SECRET` é secreta e nunca aparece no código fonte.
