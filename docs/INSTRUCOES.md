# Guia — Site da Brigada no ar

Este documento explica, tudo o que é
necessário para o site funcionar e para ter o seu próprio endereço (domínio)
na internet.

Uma boa notícia: **planos gratuitos de hospedagem do codigo e imagens**. A seguir será explicado cada parte.

---

## 1. Como o site funciona (resumo rápido)

O site tem 3 partes principais:

| Parte                                   | O que é                                                                   | Quem cuida                                                 |
| --------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Página do site**                      | O "visual" que as pessoas veem (home, galeria, formulários)               | Hospedado de graça no **GitHub Pages** (1GB Grátis)        |
| **Galeria de fotos** (Nossos trabalhos) | Onde as fotos ficam guardadas e são enviadas pelo painel de administração | **Cloudflare** (armazenamento e sistema gratuito até 10GB) |
| **Backup dos originais**                | Cópia das fotos originais, para nunca perder                              | **Google Drive** (15 GB grátis)                            |

Abaixo, cada item explicado em detalhes, com o que **você precisa fazer/saber**.

---

## 2. Registrar um domínio próprio (ex.: `suaorganizacao.org.br`)

Para ter um endereço amigável e próprio, do tipo `.org.br`, é preciso **registrar um
domínio** — é como "matricular" o nome do site na internet, igual a dar entrada
no nome de uma empresa.

- O registro de domínios terminados em `.br` (como `.org.br`) é feito no site
  **Registro.br** (o órgão responsável pelos domínios brasileiros).
- Para um domínio `.org.br`, normalmente é preciso informar os dados da
  organização (CNPJ e documentação).

**O que você precisa fazer:**

1. Acesse `registro.br` e crie uma conta/entre.
2. Faça a solicitação de registro do domínio desejado (ex.: `brigada.org.br`).
   O Registro.br informa se o nome já está disponível e a taxa cobrada.
3. **Importante:** ao finalizar, adicione **o desenvolvedor como "Contato
   Técnico"** do domínio. Isso dá a ele a permissão para configurar
   o domínio (apontar para o site, renovar tecnicamente etc.) sem depender do
   seu acesso. Você continua sendo o dono; o técnico apenas ajuda na manutenção.
   Código do desenvolvedor no Registro BR: **HEVIA4**

**O que o desenvolvedor faz:** depois do registro, ele configura o domínio para
"apontar" para o site. Feito isso, as pessoas poderão acessar o site pelo
endereço próprio.

> Dica: o registro de domínio é pago (renovado em geral a cada ano). A
> hospedagem em si continua gratuita, se continuar hospedado no Github.

---

## 3. Hospedagem: não é necessária — usamos GitHub Pages (grátis)

**Você não precisa pagar hospedagem nem contratar servidor.** Isso é feito de
forma gratuita pelo **GitHub Pages**, que é um serviço que publica o site na
internet de graça para sites estático como o da brigada, que não precisam de banco de dados e processamento no servidor.

- O código do site fica guardado num "repositório" (uma pasta na nuvem) no
  **GitHub**, e o GitHub publica automaticamente a versão mais atualizada.
- O Github oferece 1GB (1024 MB) gratuito, sendo que um site desse tipo sem as imagens de galeria, costumam ter o tamanho por volta de 2 MB

**O que você precisa fazer:**

1. Criar uma conta gratuita no GitHub: acesse `github.com` e clique em
   **Sign up** (cadastrar). Use um e-mail (recomendamos o e-mail do Gmail do
   item 5) e crie uma senha.
2. Anote o **nome de usuário** que você escolher — será útil mais adiante.
3. Quando a conta estiver pronta, informe ao desenvolvedor o **nome de
   usuário** e o **e-mail** usados, para que ele possa te adicionar ao projeto
   do site (assim você também consegue acompanhar tudo).

**Ponto importante: o código do site precisa ser público.**

Para usar o GitHub Pages de forma gratuita, o "repositório" (a pasta do
código) precisa ficar **visível/publico** na internet. Isso é normal e
amplamente usado na criação de sites. Como o **código do site não contém
informações confidenciais** (senhas, dados dos visitantes, planilhas, etc.),
deixá-lo público **não traz problema algum** — o que precisa ficar protegido e
secreto (como a senha de acesso ao painel de fotos) fica guardado com o
desenvolvedor, em local seguro e separado do código, de onde **não** fica
visível para outras pessoas.

**O que o desenvolvedor faz:** publica o site, configura a publicação
automática e cuida das atualizações. Não é preciso instalar nada no seu
computador — tudo acontece na nuvem.

---

## 4. Cloudflare (plano gratuito): onde ficam as fotos e o sistema da galeria

O site usa o **Cloudflare** para duas coisas:

- **Guardar as fotos** da seção "Nossos trabalhos" (chamado de _armazenamento_).
- **Rodar o sistema que recebe e organiza** o upload das fotos pelo painel de
  administração (chamado de _Workers_).

Tudo isso tem um **plano gratuito** com limite generoso (10 GB de
armazenamento), que atende bem a uma galeria. Não é preciso
pagar por enquanto.

**Sobre requisições (o quanto o sistema "trabalha" ao ser usado):**

O plano gratuito do Cloudflare permite **100.000 requisições por dia** (cada
vez que o sistema recebe um pedido — como carregar a galeria, entrar no painel
ou enviar uma foto — conta como uma requisição). Para o tamanho deste site,
esse limite é muito folgado.

Uma observação importante sobre o painel do Cloudflare (no menu "Workers &
Pages"): o número que aparece ali é o **total acumulado de TUDO** que o sistema
fez desde que foi publicado — e lá a própria sintonia é feita, não só uploads.
Por exemplo, ao enviar fotos você usa as operações, mas **entrar no painel,
carregar a lista de fotos e atualizar a galeria após o envio** também somam.
Por isso, mesmo enviando poucas fotos, é normal ver um número maior (por
exemplo, **204** em um dia de testes) — isso inclui login + uploads +
atualizações da lista ao longo do dia, e **de longe não chega perto** do limite
de 100 mil por dia.

Em termos práticos:

- **Enviar 30 fotos** pelo painel usa **30 requisições de upload** (1 por
  foto). O upload acontece de uma vez só e pronto.
- **Cada pessoa que visita a galeria** gasta **1 requisição** para carregar a
  lista de fotos. Mesmo se o site recebesse **1.000 visitas num dia**, seriam
  apenas **1.000 requisições** — bem abaixo do limite.
- As **imagens propriamente ditas** são entregues diretamente pelo
  armazenamento de fotos (chamado _R2_), sem contar como requisição do sistema
  de upload. Como as fotos enviadas já são **otimizadas (comprimidas)** antes
  de subir, elas ficam pequenas e usam pouquíssimo espaço e tráfego.

Ou seja: **30 fotos** e até centenas de visitas por dia cabem tranquilamente no
**plano gratuito**, sem pagar nada.

**O que você precisa fazer:**

1. Criar uma conta gratuita no Cloudflare: acesse `dash.cloudflare.com` e
   cadastre-se com um e-mail (use o mesmo Gmail do item 5) e uma senha.
2. Confirmar o e-mail no link que o Cloudflare enviar.
3. Informar ao desenvolvedor que a conta foi criada com o mesmo e-mail da
   organização.

**O que o desenvolvedor faz:** configura o armazenamento das fotos e o sistema
de envio dentro da sua conta, e seta a senha de acesso ao painel de
administração do site (a área onde você fará upload das fotos). Também configura
as **proteções de uso** (detalhadas abaixo), para garantir que o site não
ultrapasse os limites do plano gratuito.

**Proteções que o desenvolvedor configura (no painel do Cloudflare):**

Para garantir que o site não ultrapasse os limites do plano gratuito, o
desenvolvedor configura as seguintes proteções:

- **Rate limiting** (limite de requisições): configura regras no painel do
  Cloudflare para limitar o número de pedidos por minuto, evitando abuso. O
  Worker também já possui uma proteção interna que limita tentativas de login
  (5 por minuto) e uploads (20 por minuto) por endereço.
- **Spending limit** (limite de gasto): configura um limite de gasto no
  armazenamento R2, para que o Cloudflare bloqueie novos uploads antes de
  ultrapassar o plano gratuito.
- **Alertas por e-mail**: configura notificações no painel do Cloudflare para
  avisar quando o site atingir 80% do limite de requisições ou armazenamento,
  permitindo que o desenvolvedor tome providências antes de qualquer bloqueio.

> Você não precisa se preocupar com essas configurações — o desenvolvedor
> cuida de tudo. Mas é bom saber que existem essas proteções, para ficar
> tranquilo de que não haverá surpresas.

> Importante: quando o armazenamento gratuito for ficando cheio, é só avisar o
> desenvolvedor — dá para aumentar ou liberar espaço sem grande custo.
> Mas como mencionado, se seguir um planejamento e se o numero de acessos não aumentar de forma absurda, só precisará do plano gratuito. O desenvolvedor fará testes para passar o número de quantas visitas e cadastros por mês é a média segura para não ter custos e o Analytics ajudará ver o número de acessos ao site.

---

## 5. Criar um e-mail (Gmail): conta central para tudo

Recomendamos criar um **e-mail da organização no Gmail** (`@gmail.com`). Ele
será a **conta central** — ou seja, **todos** os cadastros e serviços do site
usarão esse mesmo e-mail, para ficar tudo organizado em um só lugar:

- É o **e-mail de contato** da organização.
- Servirá para criar as contas do **GitHub** (item 3) e do **Cloudflare**
  (item 4).
- Servirá também para o **Google Analytics** (item 6), que mede as visitas do
  site.
- Dá acesso ao **Google Drive** (15 GB grátis) para o backup das fotos.

Centralizar tudo num só e-mail evita confusão, facilita recuperar senhas e
permite que você gerencie os serviços a partir de uma única conta.

Além do e-mail, o Google oferece um espaço para guardar arquivos chamado
**Google Drive**, com **15 GB grátis**.

**Por que guardar as fotos originais no Drive?**

O sistema de envio de fotos do site **otimiza (comprime e redimensiona)
automaticamente** cada foto para deixar o site rápido. Assim, fotografias
pesadas (de celular ou câmera) viram versões leves na internet.

A **foto original** (a qualidade total, antes da otimização) não fica no site —
fica apenas a versão otimizada. Por isso, é muito bom ter uma cópia dos
**originais** guardada no Google Drive: você tem o backup seguro das
imagens com qualidade máxima, caso precise delas no futuro (impressões,
materiais, etc.).

**O que você precisa fazer:**

1. Crie o e-mail no Gmail: acesse `gmail.com` → "Criar conta". Siga os passos
   e escolha um nome de e-mail profissional.
2. Use **esse mesmo e-mail** para criar as contas do GitHub (item 3), do
   Cloudflare (item 4) e do Google Analytics (item 6).
3. Dentro do Google Drive, crie a pasta da organização e, dentro dela, uma pasta
   para **cada álbum de fotos** (ex.: "Curso de combate a incêndio", "Evento
   XX", etc.). É lá que você guarda os arquivos originais.
4. Ao enviar fotos para o site pelo painel de administração, **guarde também
   uma cópia dos originais** no Drive (por álbum), antes de enviar.

**O que o desenvolvedor faz:** pode ajudar a organizar a estrutura de pastas e
indicar a melhor forma de nomear os arquivos.

---

## 6. Google Analytics: acompanhar as visitas do site

O **Google Analytics** (também conhecido como GA) é uma ferramenta gratuita do
Google que mostra quantas pessoas visitam o site, de onde vêm, quais páginas
veem, por quanto tempo ficam etc. É importante para vocês entenderem se o site
está sendo acessado e o que os visitantes mais procuram.

**O que você precisa fazer:**

1. Usando o **mesmo e-mail do Gmail** (item 5), acesse
   `analytics.google.com` e faça o cadastro (é gratuito).
2. Ao criar, o Google pedirá algumas informações. Siga os passos indicados; se
   tiver dúvida no que preencher, é só anotar e perguntar ao desenvolvedor.
3. Informe ao desenvolvedor que a conta do Analytics foi criada (na maioria dos
   casos, ele consegue configurar o site automaticamente usando o e-mail que
   você cadastrou).

**O que o desenvolvedor faz:** conecta o site ao Analytics para que as
visitas comecem a ser contadas. Depois disso, você acompanha tudo pelo painel
do Analytics, sempre entrando com o mesmo e-mail da organização.

---

## 7. Painel de administração: como enviar e gerenciar as fotos

O site tem um **painel de administração** — uma área segura, com senha, onde
você envia, edita e exclui fotos da galeria ("Nossos trabalhos").

### Como acessar

1. Acesse o endereço do site + `/admin/login` (ex.: `seusite.org.br/admin/login`).
2. Insira a **senha de acesso** fornecida pelo desenvolvedor.
3. Pronto — você estará dentro do painel.

### Como enviar fotos

1. Preencha o **título** do álbum (ex.: "Curso de combate a incêndio 2026").
2. (Opcional) Adicione uma **descrição**.
3. Escolha a **categoria** (veja lista abaixo).
4. Clique em **"Escolher arquivos"** e selecione as fotos do computador
   (pode selecionar várias de uma vez — todas as fotos de uma vez só).
5. Clique em **"Enviar imagens"**.
6. As fotos são **otimizadas automaticamente** (redimensionadas e comprimidas)
   antes de subir — você não precisa se preocupar com isso.
7. A galeria do site **atualiza sozinha**, sem precisar fazer mais nada.

### Categorias disponíveis

| Categoria | Quando usar                                                       |
| --------- | ----------------------------------------------------------------- |
| Cursos    | Treinamentos, capacitações, oficinas ministradas pela brigada     |
| Eventos   | Eventos públicos, cerimônias, inaugurações, trabalhos voluntários |
| Resgates  | Ações de resgate de animais, pessoas ou situações de risco        |
| Incêndios | Combate a incêndios florestais e ações de prevenção               |
| Educação  | Palestras, ações em escolas, trabalhos educativos                 |
| Outras    | Qualquer coisa que não se encaixe nas categorias acima            |

> **Quer mudar ou adicionar categorias?** Basta solicitar ao desenvolvedor.
> É rápido e gratuito. Por exemplo, se vocês criarem um novo tipo de atividade
> (como "Animais resgatados"), é só pedir para ele incluir.

### Editar e excluir fotos

No painel, ao lado de cada foto, há opções para:

- **Editar:** alterar o título, a descrição ou a categoria de uma foto.
- **Excluir:** remover uma foto que não deve mais aparecer no site.

> **Importante:** o site atualiza instantaneamente. Ao editar ou excluir uma
> foto, a mudança já aparece na galeria em segundos.

### Fluxo de trabalho recomendado

O fluxo completo para manter a galeria atualizada:

1. **Tire as fotos** (celular ou câmera).
2. **Guarde os originais** no Google Drive (por álbum), conforme explicado no
   item 5.
3. **Acesse o painel de administração** (`/admin/login`) e envie as fotos com
   título e categoria.
4. **O site atualiza automaticamente** — sem precisar pedir ao desenvolvedor.

> Dica: se vocês tiverem muitas fotos de um mesmo evento, pode enviar tudo de
> uma vez, com o mesmo título. O site agrupa automaticamente as fotos que têm
> o mesmo título em um "álbum" visual.

### Senha do painel

- A **senha** é criada pelo desenvolvedor e entregue para a organização.
- A organização pode **trocar a senha** a qualquer momento — basta solicitar
  ao desenvolvedor ou pedir orietação para que nem o desenvolvedor saiba a senha.
- A senha deve ser mantida em local seguro e compartilhada apenas com quem
  precisa acessar o painel.

---

## 8. Resumo do que VOCÊ precisa fazer (checklist)

- [ ] **Registro.br:** registrar o domínio `.org.br` e me colocar como **contato técnico**.
- [ ] **GitHub:** criar conta gratuita e informar usuário/e-mail ao desenvolvedor.
- [ ] **Cloudflare:** criar conta gratuita (mesmo e-mail da organização).
- [ ] **Gmail:** criar o e-mail da organização.
- [ ] **Google Analytics:** criar a conta (mesmo e-mail da organização) para medir as visitas.
- [ ] **Google Drive:** criar a pasta dos álbuns e guardar os **originais** das fotos.

> **Observação importante:** os itens acima (GitHub, Cloudflare, Gmail,
> Analytics e Drive) **podem ser feitos pelo desenvolvedor** caso a organização
> ainda **não tenha um e-mail (Gmail) criado** — basta informar ao desenvolvedor
> qual nome de e-mail vocês gostariam de usar, e ele cuida do restante. Se
> **já existir** um Gmail da organização, vocês apenas informam o endereço ao
> desenvolvedor. Depois de tudo configurado, o desenvolvedor **entrega os
> acessos** de cada conta para a organização e orienta a **troca das senhas**
> pelos próprios responsáveis, garantindo que somente vocês tenham controle das
> contas.

## 9. O que o DESENVOLVEDOR faz (para seu conhecimento)

- Publica e atualiza o site no GitHub Pages.
- Configura o domínio para apontar para o site.
- Configura o armazenamento das fotos e o sistema de envio no Cloudflare.
- Configura a senha do painel de administração (painel onde você envia as fotos).

---

## Dúvidas comuns

**Preciso pagar alguma coisa todo mês?**
R: Não. A hospedagem, o armazenamento das fotos e o backup são gratuitos. O
único gasto recorrente é o **domínio** (item 2), que costuma ser um valor
anual.

**Preciso instalar algo no meu computador?**
R: Não. Tudo é feito pela internet (no navegador), a partir das contas criadas
acima.

**E se eu mudar as fotos?**
R: Você mesmo pode trocar, adicionar ou remover fotos pelo painel de
administração do site, sem precisar do desenvolvedor.

**Quanto tempo demora para o site ficar no novo endereço?**
R: Depois de registrar o domínio e o desenvolvedor configurá-lo, a mudança
costuma valer em algumas horas (podendo levar até 24h).
