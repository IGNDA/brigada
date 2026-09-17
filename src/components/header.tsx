import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-100 bg-forest-50/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/bof-rj/assets/global/logo.jpg"
            alt="Logotipo da 1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes)"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
            priority
          />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span className="truncate text-sm font-bold text-forest-900">
              1 Brigada de Operações Florestais RJ (Brigada Ivan Moraes)
            </span>
            <span className="text-xs text-forest-600">Rio de Janeiro</span>
          </span>
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}
