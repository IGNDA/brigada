import type { Metadata } from "next";
import Link from "next/link";
import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

const areas = [
  {
    id: "incendios",
    title: "Combate e prevenção de incêndios florestais",
    icon: "🔥",
    description:
      "Atuamos na prevenção, monitoramento e combate a focos de incêndio em áreas de Mata Atlântica e vegetação nativa. Trabalhamos em parceria com bombeiros, defesa civil e brigadas comunitárias para resposta rápida e eficaz.",
    details: [
      "Monitoramento de áreas de risco",
      "Combate direto a focos de incêndio",
      "Criação e manutenção de aceiros",
      "Capacitação de brigadistas voluntários",
      "Campanhas de conscientização sobre queimadas",
    ],
  },
  {
    id: "resgate",
    title: "Resgate e proteção de animais silvestres",
    icon: "🐾",
    description:
      "Resgatamos animais silvestres em situação de risco — atropelados, feridos, órfãos ou em áreas urbanas. Encaminhamos para centros de reabilitação (CETAS, zoológicos, institutos parceiros) para tratamento e posterior soltura quando possível.",
    details: [
      "Resgate de fauna em área urbana e rodovias",
      "Atendimento a animais feridos ou doentes",
      "Parceria com CETAS e centros de reabilitação",
      "Soltura monitorada em habitat adequado",
      "Orientação à população sobre fauna urbana",
    ],
  },
  {
    id: "abelhas",
    title: "Abelhas e preservação dos polinizadores",
    icon: "🐝",
    description:
      "Realizamos a retirada segura de enxames de abelhas em áreas urbanas, preservando as colmeias e garantindo a segurança das pessoas. As abelhas são encaminhadas para apiários parceiros ou áreas de mata nativa, contribuindo para a polinização e biodiversidade.",
    details: [
      "Retirada segura de enxames em áreas urbanas",
      "Destinação adequada das colmeias (apiários/mata)",
      "Não utilização de produtos químicos",
      "Educação sobre importância dos polinizadores",
      "Parceria com apicultores locais",
    ],
  },
  {
    id: "educacao",
    title: "Educação ambiental",
    icon: "📚",
    description:
      "Promovemos a conscientização ambiental através de palestras, oficinas, trilhas interpretativas e materiais educativos. Atuamos em escolas, comunidades, empresas e eventos públicos, aproximando as pessoas da natureza e ensinando práticas sustentáveis.",
    details: [
      "Palestras e oficinas em escolas",
      "Trilhas interpretativas em áreas verdes",
      "Materiais educativos (cartilhas, folders)",
      "Eventos comunitários de plantio e mutirão",
      "Capacitação de multiplicadores ambientais",
    ],
  },
];

export const metadata: Metadata = {
  title: `Nossa atuação — ${BRIGADE_CONFIG.name}`,
  description: `Conheça as áreas de atuação da ${BRIGADE_CONFIG.name}: combate a incêndios florestais, resgate de fauna silvestre, preservação de abelhas e polinizadores, e educação ambiental no Rio de Janeiro.`,
};

const whatsappUrl = BRIGADE_CONFIG.whatsappText.startsWith("http")
  ? BRIGADE_CONFIG.whatsappText
  : `https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(BRIGADE_CONFIG.whatsappText)}&type=phone_number&app_absent=0`;

export default function Atuacao() {
  return (
    <>
      <section className="bg-forest-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            O que fazemos
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Nossas áreas de atuação
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-forest-100">
            Quatro pilares integrados para a proteção ambiental no Rio de
            Janeiro. Cada ação fortalece a outra na construção de um território
            mais resiliente e biodiverso.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="space-y-16">
          {areas.map((area) => (
            <article
              key={area.id}
              className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {area.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-forest-900">
                    {area.title}
                  </h2>
                </div>
                <p className="text-forest-700 text-lg leading-relaxed">
                  {area.description}
                </p>
                <ul className="space-y-2">
                  {area.details.map((detail, i) => (
                    <li key={i} className="flex gap-3 text-forest-700">
                      <span className="flex-shrink-0 text-forest-500">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-forest-900 mb-3">
                  Como você pode ajudar
                </h3>
                <ul className="space-y-2 text-sm text-forest-700">
                  <li className="flex gap-2">✓ Denuncie focos de incêndio</li>
                  <li className="flex gap-2">✓ Não faça queimadas</li>
                  <li className="flex gap-2">✓ Apoie brigadas voluntárias</li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-forest-800 text-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Onde atuamos
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Rio de Janeiro — Mata Atlântica e áreas urbanas
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-forest-100">
            Nossa atuação abrange a capital fluminense e região metropolitana,
            com foco em remanescentes de Mata Atlântica, parques urbanos
            (Tijuca, Pedra Branca, Mendanha), unidades de conservação estaduais
            e municipais, e zonas de interface urbano-florestal onde o risco de
            incêndios e conflitos com fauna é maior.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={urls.gallery()}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Ver galeria de ações
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emergency-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
            >
              Como colaborar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
