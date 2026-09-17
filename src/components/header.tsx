import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";
import { urls, asset } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-100 bg-forest-50/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={urls.home()} className="flex min-w-0 items-center gap-3">
          <Image
            src={asset("/assets/global/logo.png")}
            alt={`Logotipo da ${BRIGADE_CONFIG.name}`}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 object-contain"
            priority
          />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span className="truncate text-sm font-bold text-forest-900">
              {BRIGADE_CONFIG.name}
            </span>
            <span className="text-xs text-forest-600">
              {BRIGADE_CONFIG.instituteName}
            </span>
          </span>
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}
