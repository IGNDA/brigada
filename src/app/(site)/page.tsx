import Image from "next/image";

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=5521966956140&text=Ol%C3%A1%21+Vi+o+site+da+1+Brigada+de+Opera%C3%A7%C3%B5es+Florestais+RJ+%28Brigada+Ivan+Moraes%29+e+quero+saber+mais.&type=phone_number&app_absent=0";

const instagramUrl = "https://www.instagram.com/1_brigada_de_operacoes_florest";

const atuacao = [
  {
    title: "Resgate de animais silvestres",
    description:
      "Atendimento a animais silvestres em situação de risco, levando cada caso ao cuidado adequado.",
  },
  {
    title: "Combate a incêndios florestais",
    description:
      "Ação voluntária no controle de focos de incêndio em áreas verdes do Rio de Janeiro.",
  },
  {
    title: "Retirada segura de enxames de abelhas",
    description:
      "Remoção de enxames sem prejudicar as abelhas, protegendo pessoas e polinizadores.",
  },
  {
    title: "Educação ambiental",
    description:
      "Ações educativas que aproximam a comunidade da preservação do meio ambiente.",
  },
];

export default function Home() {
  return (
    <>
      <section id="inicio" className="bg-forest-800 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Brigada voluntária ambiental no Rio de Janeiro
            </h1>
            <p className="mt-4 text-lg font-medium text-forest-100">
              Brigada voluntária de proteção ambiental no Rio de Janeiro
            </p>
            <p className="mt-4 max-w-2xl text-base text-forest-50/90 sm:text-lg">
              Resgate de animais silvestres, combate a incêndios florestais,
              retirada segura de enxames de abelhas e educação ambiental,
              trabalho voluntário dedicado à proteção do meio ambiente carioca.
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
              <a
                href="#programacao"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver a programação
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-4 border-forest-50/20 bg-forest-900 shadow-lg ring-1 ring-black/40">
              <Image
                src="/bof-rj/assets/images/hero.jpg"
                alt="Brigada voluntária ambiental no Rio de Janeiro"
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

      <section className="border-b border-forest-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-forest-800 sm:text-3xl">
              100% voluntária
            </p>
            <p className="mt-1 text-sm text-forest-700">Equipe dedicada</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-forest-800 sm:text-3xl">
              Rio de Janeiro
            </p>
            <p className="mt-1 text-sm text-forest-700">
              Nosso campo de atuação
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-forest-800 sm:text-3xl">
              Resgate de fauna silvestre
            </p>
            <p className="mt-1 text-sm text-forest-700">Protegendo a vida</p>
          </div>
        </div>
      </section>

      <section
        id="quem-somos"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
            Quem somos
          </p>
          <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
            1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes)
          </h2>
          <p className="mt-3 text-base text-forest-700 sm:text-lg">
            Equipe voluntária dedicada à proteção ambiental
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-forest-800">
            <p>
              A 1 Brigada de Operações Florestais RJ, também conhecida como
              Brigada Ivan Moraes, é uma brigada voluntária do Rio de Janeiro
              dedicada à proteção ambiental.
            </p>
            <p>
              A equipe atua em resgates de animais silvestres, combate a
              incêndios florestais, retirada segura de enxames de abelhas e
              educação ambiental, sempre de forma voluntária.
            </p>
            <p>
              Nosso campo de ação é a cidade do Rio de Janeiro e suas áreas
              verdes.
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-3 text-sm text-forest-800 sm:grid-cols-3">
          <li className="rounded-lg border border-forest-100 bg-white p-4">
            <span className="font-semibold text-forest-900">
              Resgate de animais silvestres
            </span>
            <p className="mt-1 text-forest-700">
              Retirada de enxames de abelhas pela mesma equipe.
            </p>
          </li>
          <li className="rounded-lg border border-forest-100 bg-white p-4">
            <span className="font-semibold text-forest-900">
              Combate a incêndios florestais
            </span>
            <p className="mt-1 text-forest-700">
              Atuação no combate a incêndios florestais no Rio de Janeiro.
            </p>
          </li>
          <li className="rounded-lg border border-forest-100 bg-white p-4">
            <span className="font-semibold text-forest-900">
              Educação ambiental
            </span>
            <p className="mt-1 text-forest-700">
              Educação ambiental junto à comunidade.
            </p>
          </li>
        </ul>
      </section>

      <section id="programacao" className="scroll-mt-24 bg-forest-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
            Nossa semana
          </p>
          <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
            Como atuamos
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {atuacao.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-forest-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-forest-700">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-forest-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-forest-600"
            >
              Quero participar
            </a>
          </div>
        </div>
      </section>

      <section
        id="nossa-gente"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
          Nossa gente
        </p>
        <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          Nossos trabalhos
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/bof-rj/assets/images/nossos-trabalhos-1.jpg"
              alt="Trabalho voluntário da brigada"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/bof-rj/assets/images/nossos-trabalhos-2.jpg"
              alt="Trabalho voluntário da brigada"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-forest-800 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Venha nos visitar
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Entre em contato
          </h2>
          <p className="mt-4 max-w-2xl text-forest-100">
            Encontrou um animal silvestre ferido, um enxame de abelhas ou um
            foco de incêndio? Fale com a Brigada pelo WhatsApp ou acompanhe
            nosso trabalho no Instagram.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/20 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <span className="flex items-center justify-between">
                <span className="font-semibold">WhatsApp</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
              <span className="mt-1 block text-sm text-forest-100">
                Fale com a Brigada
              </span>
            </a>

            <div className="rounded-xl border border-white/20 bg-white/5 p-6">
              <span className="font-semibold">Onde atendemos</span>
              <span className="mt-1 block text-sm text-forest-100">
                Rio de Janeiro
              </span>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/20 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <span className="flex items-center justify-between">
                <span className="font-semibold">Instagram</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
              <span className="mt-1 block text-sm text-forest-100">
                @1_brigada_de_operacoes_florest
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
