import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urls, asset } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export const metadata: Metadata = {
  title: `Quem somos — ${BRIGADE_CONFIG.name}`,
  description: `Conheça a ${BRIGADE_CONFIG.name}: instituto voluntário de proteção ambiental no Rio de Janeiro. Missão, valores e atuação na preservação da fauna, flora e combate a incêndios florestais.`,
};

export default function QuemSomos() {
  return (
    <>
      <section className="bg-forest-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Institucional
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Quem somos</h1>
          <p className="mt-4 max-w-2xl text-lg text-forest-100">
            {BRIGADE_CONFIG.fullName}. Uma brigada voluntária dedicada à
            proteção ambiental no Rio de Janeiro.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-forest-800">
            <h2 className="text-2xl font-bold text-forest-900">
              Nossa identidade
            </h2>
            <p>
              A <strong>{BRIGADE_CONFIG.name}</strong> (
              {BRIGADE_CONFIG.instituteName}) é uma organização voluntária
              sediada no Rio de Janeiro, formada por pessoas comprometidas com a
              preservação do meio ambiente. Não temos fins lucrativos e atuamos
              de forma colaborativa com a comunidade, órgãos públicos e outras
              instituições.
            </p>
            <p>
              Nossa missão é proteger a biodiversidade carioca através de ações
              diretas de resgate, prevenção, combate a incêndios e educação
              ambiental, sempre priorizando a vida — humana, animal e vegetal.
            </p>

            <h2 className="text-2xl font-bold text-forest-900">
              Valores que nos guiam
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 text-forest-600">•</span>
                <span>
                  <strong>Voluntariado:</strong> atuamos por vocação, não por
                  obrigação.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 text-forest-600">•</span>
                <span>
                  <strong>Respeito à vida:</strong> cada ser vivo importa.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 text-forest-600">•</span>
                <span>
                  <strong>Ciência e técnica:</strong> nossas ações baseiam-se em
                  conhecimento.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 text-forest-600">•</span>
                <span>
                  <strong>Transparência:</strong> prestamos contas à sociedade.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 text-forest-600">•</span>
                <span>
                  <strong>Colaboração:</strong> unimos forças com parceiros.
                </span>
              </li>
            </ul>
          </div>

          <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-2xl border-4 border-forest-50/20 bg-white shadow-lg">
            <Image
              src={asset("/assets/global/logo.png")}
              alt={`Logotipo da ${BRIGADE_CONFIG.name}`}
              fill
              priority
              className="object-contain p-4 sm:p-8"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16 sm:px-6">
        <div className="mt-8 sm:mt-16 grid gap-8 sm:grid-cols-3">
          <article className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-forest-900">Missão</h3>
            <p className="mt-2 text-forest-700">
              Proteger a biodiversidade do Rio de Janeiro através de resgate de
              fauna, combate a incêndios, preservação de polinizadores e
              educação ambiental.
            </p>
          </article>
          <article className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-forest-900">Visão</h3>
            <p className="mt-2 text-forest-700">
              Um Rio de Janeiro onde a convivência entre cidade e natureza seja
              harmônica, com florestas preservadas, fauna protegida e comunidade
              consciente.
            </p>
          </article>
          <article className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-forest-900">Atuação</h3>
            <p className="mt-2 text-forest-700">
              Rio de Janeiro (capital e região metropolitana), com foco em áreas
              de Mata Atlântica, parques, unidades de conservação e zonas de
              interface urbano-florestal.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-forest-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
            Quer fazer parte?
          </p>
          <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
            Somos voluntários. Você também pode ser.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-forest-700">
            Não precisa ser especialista — precisa ter vontade de proteger o
            meio ambiente. Temos espaço para diferentes perfis e
            disponibilidades.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={urls.gallery()}
              className="rounded-full border border-forest-200 bg-white px-6 py-3 font-semibold text-forest-700 shadow-sm transition-all hover:border-forest-300 hover:bg-forest-50"
            >
              Ver nossos trabalhos
            </Link>
            <a
              href={`https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(`Olá! Quero saber como participar da ${BRIGADE_CONFIG.name}.`)}&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emergency-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emergency-700"
            >
              Fale com a Brigada
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
