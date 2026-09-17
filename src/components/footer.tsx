export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest-100 bg-forest-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-forest-700 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p>
            <span className="font-semibold text-forest-900">
              Brigada IGNDA
            </span>
          </p>
          <p className="mt-1 text-forest-600">Instituto Guarda-Natureza de Defesa Ambiental</p>
          <p className="text-forest-600">Rio de Janeiro · Brasil</p>
        </div>
        <p>
          © {year} Brigada IGNDA
        </p>
      </div>
    </footer>
  );
}
