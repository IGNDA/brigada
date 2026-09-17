import Image from "next/image";
import Link from "next/link";
import GalleryVitrine from "@/components/gallery/gallery-vitrine";
import { urls, asset } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";
import {
  Flame,
  PawPrint,
  Flower2,
  BookOpen,
  Info,
  Target,
  Image as ImageIcon,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const whatsappUrl = BRIGADE_CONFIG.whatsappText.startsWith("http")
  ? BRIGADE_CONFIG.whatsappText
  : `https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(BRIGADE_CONFIG.whatsappText)}&type=phone_number&app_absent=0`;

const instagramUrl =
  "https://www.instagram.com/1_brigada_de_operacoes_florest/";

export default function Home() {
  return (
    <>
      <section className="bg-forest-800 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              {BRIGADE_CONFIG.name} — Proteção ambiental no Rio de Janeiro
            </h1>
            <p className="mt-4 text-lg font-medium text-forest-100">
              {BRIGADE_CONFIG.instituteName}
            </p>
            <p className="mt-4 max-w-2xl text-base text-forest-50/90 sm:text-lg">
              {BRIGADE_CONFIG.description}. Resgate de animais silvestres,
              retirada segura de enxames de abelhas e educação ambiental —
              trabalho voluntário em defesa do meio ambiente carioca.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emergency-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
              >
                Fale com a Brigada
              </a>
              <Link
                href={urls.quemSomos()}
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Quem somos
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-4 border-forest-50/20 bg-forest-900 shadow-lg ring-1 ring-black/40">
              <Image
                src={asset("/assets/images/hero.jpg")}
                alt={`Equipe da ${BRIGADE_CONFIG.name} em ação de proteção ambiental no Rio de Janeiro`}
                width={800}
                height={1000}
                priority
                sizes="(min-width: 1024px) 448px, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="space-y-8 text-forest-800">
            <h2 className="text-2xl font-bold text-forest-900">
              O que fazemos
            </h2>
            <p className="text-lg leading-relaxed">
              A <strong>Brigada Ivan Moraes</strong> atua em quatro frentes
              integradas para a proteção ambiental no Rio de Janeiro:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 text-forest-600 flex h-7 w-7 items-center justify-center rounded-lg bg-forest-100">
                  <Flame className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pt-0.5">
                  <strong>Combate e prevenção de incêndios florestais</strong> —
                  monitoramento, aceiros, combate direto e capacitação.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 text-forest-600 flex h-7 w-7 items-center justify-center rounded-lg bg-forest-100">
                  <PawPrint className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pt-0.5">
                  <strong>Resgate de fauna silvestre</strong> — atendimento a
                  animais em risco, parceria com CETAS e centros de
                  reabilitação.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 text-forest-600 flex h-7 w-7 items-center justify-center rounded-lg bg-forest-100">
                  <Flower2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pt-0.5">
                  <strong>Preservação de polinizadores</strong> — retirada
                  segura de enxames de abelhas, destinação a apiários e mata
                  nativa.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 text-forest-600 flex h-7 w-7 items-center justify-center rounded-lg bg-forest-100">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pt-0.5">
                  <strong>Educação ambiental</strong> — palestras, trilhas,
                  oficinas e materiais para escolas e comunidades.
                </span>
              </li>
            </ul>
            <p className="mt-8 text-lg leading-relaxed">
              Atuamos em remanescentes de <strong>Mata Atlântica</strong>,
              parques urbanos (Tijuca, Pedra Branca, Mendanha), unidades de
              conservação e áreas de interface urbano-florestal do Rio de
              Janeiro.
            </p>
          </div>

          <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="font-semibold text-forest-900 mb-4">
              Acesso rápido
            </h3>
            <nav className="space-y-2">
              <Link
                href={urls.quemSomos()}
                className="flex gap-3 rounded-lg p-3 text-forest-700 transition-colors hover:bg-forest-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <Info className="h-4 w-4" />
                </span>
                <span>Quem somos</span>
              </Link>
              <Link
                href={urls.atuacao()}
                className="flex gap-3 rounded-lg p-3 text-forest-700 transition-colors hover:bg-forest-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <Target className="h-4 w-4" />
                </span>
                <span>Nossa atuação</span>
              </Link>
              <Link
                href={urls.gallery()}
                className="flex gap-3 rounded-lg p-3 text-forest-700 transition-colors hover:bg-forest-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <ImageIcon className="h-4 w-4" />
                </span>
                <span>Galeria de trabalhos</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 rounded-lg p-3 text-forest-700 transition-colors hover:bg-forest-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span>Fale conosco (WhatsApp)</span>
              </a>
            </nav>
          </div>
        </div>
      </section>

      <section id="nossa-gente" className="scroll-mt-24">
        <GalleryVitrine />
      </section>

      <section className="bg-forest-800 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Entre em contato
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Encontrou algo? Fale com a Brigada
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-forest-100">
            Animal silvestre ferido, enxame de abelhas, foco de incêndio ou
            dúvida ambiental. Estamos à disposição.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-emergency-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
            >
              <span>WhatsApp</span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span>Instagram</span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <Link
              href={urls.atuacao()}
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span>Como atuar</span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
