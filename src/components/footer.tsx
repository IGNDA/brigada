import { urlsFull } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

const entertainmentLinks = [
  { label: "Jogos", href: urlsFull.jogos() },
  { label: "Quiz Ambiental", href: urlsFull.jogosQuiz() },
  { label: "Jogo da Memória", href: urlsFull.jogosMemoria() },
  { label: "Caça-Palavras", href: urlsFull.jogosCacaPalavras() },
  { label: "Apague o Incêndio", href: urlsFull.jogosIncendio() },
];

const adminLinks = [{ label: "Área administrativa", href: urlsFull.admin() }];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest-100 bg-forest-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-forest-900">{BRIGADE_CONFIG.name}</p>
          <p className="mt-1 text-sm text-forest-600">
            {BRIGADE_CONFIG.instituteName}
          </p>
          <p className="text-sm text-forest-600">Rio de Janeiro · Brasil</p>
        </div>

        <nav aria-label="Entretenimento" className="text-center sm:text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-forest-800">
            Entretenimento
          </h2>
          <ul className="mt-3 space-y-2">
            {entertainmentLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-forest-600 transition-colors hover:text-forest-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          aria-label="Administração"
          className="text-center sm:text-left sm:justify-self-end"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-forest-800">
            Administração
          </h2>
          <ul className="mt-3 space-y-2">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-forest-600 transition-colors hover:text-forest-900"
                  rel="noopener"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-6 border-t border-forest-100 bg-forest-100/60 px-4 py-4 text-center sm:px-6">
        <p className="text-sm text-forest-600">
          © {year} {BRIGADE_CONFIG.name}
        </p>
        <a
          href="https://github.com/ui2code"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-forest-400 transition-colors hover:text-forest-700"
        >
          Desenvolvido por @ui2code
        </a>
      </div>
    </footer>
  );
}
