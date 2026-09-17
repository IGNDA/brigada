import { urls } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest-100 bg-forest-50 pb-16 sm:pb-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-forest-700 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p>
            <span className="font-semibold text-forest-900">
              {BRIGADE_CONFIG.name}
            </span>
          </p>
          <p className="mt-1 text-forest-600">{BRIGADE_CONFIG.instituteName}</p>
          <p className="text-forest-600">Rio de Janeiro · Brasil</p>
        </div>
        <div className="flex items-center gap-4">
          <p>
            © {year} {BRIGADE_CONFIG.name}
          </p>
          <a
            href={urls.admin()}
            className="text-xs text-forest-500 underline-offset-2 hover:text-forest-700"
            rel="noopener"
          >
            Área administrativa
          </a>
        </div>
      </div>
    </footer>
  );
}
