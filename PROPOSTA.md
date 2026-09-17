Ajustei todos os pontos solicitados no documento:

1. **Testes do R2:** Alterado para indicar que os números são resultado de testes de validação técnica efetuados na infraestrutura.
2. **Clarificação dos Conteúdos Textuais:** Esclarecido na tabela que os pontos listados são tópicos base, e que o desenvolvedor expandirá com textos detalhados e ilustrações. Caso o cliente já tenha os textos prontos, basta enviar; caso contrário, aguardará as sugestões desenvolvidas.
3. **Divisão Clara dos Acessos:** O cliente precisa fornecer **apenas o acesso ao DNS do Domínio**. A criação e configuração das contas no GitHub, Cloudflare, Gmail e Google Analytics serão feitas pelo desenvolvedor e repassadas ao cliente.
4. **Remoção de Registro:** Removida a menção ao registro operacional com data.

---

# PROPOSTA TÉCNICA E COMERCIAL DE DESENVOLVIMENTO WEB

**Cliente:** Brigada de Operações Florestais (IGNDA - RJ)

**Data:** 10/09/2026

---

## 🎯 Visão Geral da Estratégia

O objetivo deste projeto é reformular e expandir a presença digital da **1ª Brigada de Operações Florestais do Estado do Rio de Janeiro (IGNDA - RJ)**, criando um site moderno, rápido, adaptado para dispositivos móveis e otimizado para o Google, garantindo **custo R$ 0,00 contínuo com infraestrutura e hospedagem de mídias**.

```
   [ Foto de Campo / Celular ] (Até 10 MB)
                  │
                  ▼
   [ Otimização em Tempo Real (Next.js) ] ➔ Reduz em até 95% o peso sem perder qualidade
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  [ Cloudflare R2 ]   [ Google Drive ]
   (Galeria no Site)   (Backup Manual Original)
    100% Gratuito       100% Gratuito

```

---

## 📱 Responsividade & Benefícios Práticos

O novo site será desenvolvido com arquitetura **Mobile-First** (projetado primeiramente para dispositivos móveis), garantindo adaptação fluida para celulares, tablets e computadores de qualquer resolução.

### Benefícios do Design Responsivo:

- **Facilidade de Acesso em Campo:** Integrantes, parceiros e órgãos ambientais poderão acessar rapidamente informações, fotos e contatos diretamente do smartphone.
- **Velocidade de Carregamento:** Elementos gráficos e imagens ajustam seu tamanho de acordo com a tela do usuário, consumindo menos dados móveis.
- **Preferência nos Algoritmos do Google:** O Google prioriza sites responsivos nas buscas locais e orgânicas, garantindo maior visibilidade para a Brigada.

---

## 🔍 Estratégia de SEO (Search Engine Optimization)

Para otimizar o conteúdo textual e posicionar a Brigada nas primeiras páginas de busca, aplicaremos as seguintes diretrizes:

- **Palavras-Chave Estratégicas:** Foco em termos como _Brigada de Operações Florestais RJ_, _Prevenção e Combate a Incêndios Florestais Rio de Janeiro_, _Voluntariado Ambiental RJ_, _Proteção de Áreas Verdes e Unidades de Conservação_.
- **Otimização On-Page:** Tags de título (`<title>`), meta-descrições, hierarquia gráfica (`<h1>`, `<h2>`) e texto alternativo em todas as imagens (Tags `alt`).
- **Mensuração & Métricas:** Configuração do **Google Analytics 4** para monitorar acessos, origem dos visitantes e páginas mais navegadas.

---

## 📊 Análise Prática de Consumo e Projeção Gratuita (Cloudflare + Google Drive)

Após a realização de testes de validação técnica na infraestrutura, **100 fotos de teste cadastradas no Cloudflare R2 ocuparam apenas 11,39 MB**, registrando uma média por foto comprimida de cerca de **0,11 MB (110 KB)**.

### 1. Capacidade de Armazenamento na Nuvem (Cloudflare R2)

- **Limite do Plano Gratuito:** 10 GB (~10.240 MB) e 1.000.000 de edições/envios mensais (Operações Classe A).
- **Média por foto otimizada:** ~0,11 MB.
- **Capacidade de Fotos no Plano Free:** ~90.000 fotos.
- **Projeção de Uso (Subindo 100 fotos por mês):**
- Em **1 ano** (1.200 fotos): ocupará ~132 MB de 10.000 MB disponíveis.
- Em **10 anos** (12.000 fotos): ocupará apenas ~1,3 GB.
- **Conclusão:** É possível alimentar a galeria mensalmente por **dezenas de anos** sem gerar custos de armazenamento na nuvem.

### 2. Capacidade de Acessos (1.000 Visitantes / Dia)

- **Tráfego Estimado:** 30.000 visitas/mês.
- **Consultas de Leitura (Operações Classe B):** Cota gratuita de **10 milhões de leituras por mês**. O tráfego de 1.000 pessoas/dia consumirá menos de 5% da cota gratuita do Cloudflare.
- **Taxa de Transferência (Egress):** R$ 0,00 (o Cloudflare R2 não cobra transferência de dados).

### 3. Backup Original (Google Drive - Procedimento Manual)

- **Importante:** O backup no Google Drive **não é automático**. Ele depende da ação manual da pessoa responsável pela gestão das fotos no site para salvar os arquivos originais em alta resolução na cota gratuita de 15 GB do Google Drive.

---

## 📝 Detalhamento do Conteúdo Textual de Cada Página

_Nota: Os itens abaixo representam tópicos guia da estrutura. O desenvolvedor irá redigir textos aprofundados e selecionar elementos ilustrativos para cada seção. Caso o cliente já possua textos prontos, basta encaminhá-los para inserção; caso contrário, basta aguardar as propostas e sugestões elaboradas pelo desenvolvedor._

| Página                    | Tópicos de Conteúdo e Estrutura Proposta                                       |
| ------------------------- | ------------------------------------------------------------------------------ |
| **Página Inicial (Home)** | • **Mantém a essência da Home atual**, com texto institucional aprimorado.<br> |

<br>• **Apresentação:** Foco na atuação da 1ª Brigada de Operações Florestais no Estado do RJ.<br>

<br>• **Ações Rápidas:** Destaque para as áreas de combate, prevenção e conscientização.<br>

<br>• **Galeria Recente:** Exibição dinâmica de algumas fotos mais recentes cadastradas na nova galeria do R2.<br>

<br>• **Botões Diretos:** Atalhos diretos para WhatsApp e Redes Sociais. |
| **Nossos Serviços** | • **Ações de Combate Direto:** Métodos e técnicas empregadas no combate a incêndios vegetacionais e florestais.<br>

<br>• **Prevenção e Aceiros:** Ações preventivas, abertura e manutenção de aceiros para proteção de áreas vulneráveis.<br>

<br>• **Monitoramento e Ronda:** Vigilância em períodos de alta estiagem.<br>

<br>• **Apoio Operacional:** Assistência a órgãos públicos, defesa civil e comunidades locais. |
| **Áreas de Atuação** | • **Cobertura Geográfica:** Atuação focada no Estado do Rio de Janeiro e suas Unidades de Conservação (Parques Estaduais, Nacionais e Reservas).<br>

<br>• **Preservação da Fauna e Flora:** O impacto do trabalho na preservação do ecossistema da Mata Atlântica.<br>

<br>• **Atuação Comunitária:** Integração com comunidades do entorno de áreas de preservação. |
| **Equipamentos & Tecnologia** | • **EPIs e Ferramentas Manuais:** Abafadores, bombas costais, enxadas, motosserras e equipamentos de proteção individual.<br>

<br>• **Tecnologia de Apoio:** Uso de geolocalização, comunicação via rádio e mapeamento de focos de calor.<br>

<br>• **Otimização Digital:** Apresentação da estrutura digital moderna da Brigada para rápida disseminação de registros e relatos operacionais. |
| **Galeria de Trabalhos (Casos)** | • **Módulo Fotográfico:** Galeria interativa conectada ao Cloudflare R2 com carregamento ultrarrápido.<br>

<br>• **Registros de Campo:** Fotos das operações, treinamentos, simulados e momentos de combate a incêndios. |
| **Contato & Redes Sociais** | • **Canais Diretos:** Links instantâneos para WhatsApp da Brigada, e-mail institucional e redes sociais oficiais (Instagram, YouTube, Facebook).<br>

<br>• **Informações Institucionais:** Dados de identificação do IGNDA e orientação para voluntários e parceiros. |

---

## 🎨 Processo de Aprovação do Layout, Prazos e Propostas

Para garantir a transparência e o alinhamento de expectativas durante a criação do projeto, o fluxo de aprovação visual e de conteúdo seguirá as regras abaixo:

### 1. Primeira Apresentação de Layout

- Após a aprovação do orçamento, o desenvolvedor terá até **3 dias úteis** para apresentar a primeira proposta de layout estruturada com a sugestão visual e os textos de cada página.

### 2. Cenário A — Aprovação com Ajustes Pontuais (Sem Custo Adicional)

- Caso o cliente aprove a estrutura do primeiro layout e solicite apenas ajustes pontuais de texto, cores ou substituição de fotos, o desenvolvedor terá **3 dias úteis** para efetuar os ajustes sem nenhum custo extra.

### 3. Cenário B — Rejeição do Layout & Propostas Adicionais

- Caso o cliente não aprove a primeira proposta de layout, o desenvolvedor apresentará uma **2ª proposta de layout em até 4 dias úteis**, sem custo adicional.
- Caso a 2ª proposta também não seja aprovada, eventuais novas propostas (3ª em diante) terão um custo adicional de **R$ 80,00 por nova proposta visual apresentada**, com prazo de **4 dias úteis** de desenvolvimento para cada uma.

---

## 🚀 Publicação do Site, Acessos Técnicos e Suporte

Aprovação final do layout confirmada, inicia-se a fase de implementação técnica:

1. **Acessos Técnicos do Cliente:** O cliente precisará fornecer **apenas o acesso técnico ao DNS do Domínio** (painel onde o endereço do site está registrado).
2. **Configuração da Infraestrutura pelo Dev:** O desenvolvedor criará, configurará e repassará posteriormente ao cliente os acessos das contas do **GitHub, Cloudflare, Gmail e Google Analytics**.
3. **Página Provisória ("Em Breve" / Tapume):** O desenvolvedor subirá o código com uma tela provisória informando o lançamento do novo site enquanto finaliza a estrutura.
4. **Prazo de Publicação:** Até **7 dias úteis** para o desenvolvedor realizar as configurações finais e apontar o site para o domínio definitivo.
5. **Alinhamento de Lançamento:** O momento exato da disponibilização pública do site poderá ser imediato ou combinado entre as partes.
6. **Treinamento e Tutoriais:** Serão disponibilizados tutoriais e vídeos explicativos orientando o cliente sobre como navegar no painel de acessos, gerenciar arquivos e sanar dúvidas recorrentes.

---

## 📈 Acompanhamento Pós-Lançamento (Garantia de 30 Dias)

Durante os primeiros **30 dias consecutivos após a entrega oficial do site**, o desenvolvedor realizará o acompanhamento preventivo da aplicação:

- Monitoramento semanal do **Google Analytics 4** para verificar métricas de acesso e navegação.
- Verificação dos painéis e alertas de uso da **Cloudflare** para garantir que o consumo de banco, dados e banda permaneça normalizado dentro dos limites gratuitos.

---

## 🛠️ Resumo das Atividades Contempladas no Escopo

1. Reformulação e desenvolvimento responsivo em Next.js (adaptado para celular, tablet e desktop).
2. Elaboração, otimização e estruturação dos conteúdos textuais das 6 páginas institucionais com suporte de SEO.
3. Atualização e adequação da identidade visual da Brigada IGNDA.
4. Configuração do repositório no GitHub e integração do banco de mídias no Cloudflare R2 (com otimização de fotos até 10 MB).
5. Desenvolvimento e integração da galeria de fotos na Home e na página dedicada de Trabalhos Realizados.
6. Configuração dos alertas de orçamento, consumo e limites de segurança no Cloudflare.
7. Integração do Google Analytics 4 para acompanhamento de visitas.
8. Configuração do apontamento de DNS no domínio oficial e página de "Em Breve".
9. Elaboração de tutoriais em vídeo para instrução do cliente.
10. Acompanhamento e suporte de métricas por 30 dias pós-lançamento.

---

## 💰 Investimento Total

- **Valor Geral do Projeto:** R$ 915,00
