import Link from "next/link";
import { urls } from "@/lib/urls";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-forest-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-forest-900">
        Página não encontrada
      </h1>
      <p className="mt-2 max-w-md text-forest-600">
        O endereço que você procura não existe ou foi movido.
      </p>
      <Link
        href={urls.home()}
        className="mt-8 rounded-lg bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-600"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
