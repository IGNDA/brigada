"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type NavItem = { label: string; href: string; anchor: boolean };

const navItems: NavItem[] = [
  { label: "Início", href: "/#inicio", anchor: true },
  { label: "Quem somos", href: "/#quem-somos", anchor: true },
  { label: "Programação", href: "/#programacao", anchor: true },
  { label: "Nossos trabalhos", href: "/nossos-trabalhos", anchor: false },
];

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=5521966956140&text=Ol%C3%A1%21+Vi+o+site+da+1+Brigada+de+Opera%C3%A7%C3%B5es+Florestais+RJ+%28Brigada+Ivan+Moraes%29+e+quero+saber+mais.&type=phone_number&app_absent=0";

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const t = window.setTimeout(() => scrollToHash(hash), 80);
      return () => window.clearTimeout(t);
    }
  }, [pathname]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    setOpen(false);
    const hashIndex = href.indexOf("#");
    if (isHome && hashIndex !== -1) {
      const hash = href.slice(hashIndex);
      e.preventDefault();
      window.history.replaceState(null, "", hash);
      scrollToHash(hash);
    }
  }

  const panel = open
    ? createPortal(
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white shadow-xl transition-transform duration-300"
            style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
            aria-label="Menu de navegação"
          >
            <div className="flex items-center justify-between border-b border-forest-100 px-4 py-3">
              <span className="text-sm font-bold text-forest-900">
                1 Brigada de Operações Florestais RJ
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-forest-900 transition-colors hover:bg-forest-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => {
                const className =
                  "rounded-md px-3 py-3 text-base font-medium text-forest-800 transition-colors hover:bg-forest-100 hover:text-forest-900";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      if (!item.anchor) setOpen(false);
                    }}
                    className={className}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-lg bg-emergency-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emergency-700"
              >
                Falar com a Brigada
              </a>
            </nav>
          </aside>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <nav className="flex items-center gap-4 text-sm font-medium">
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const className =
              "rounded-md px-3 py-2 text-forest-800 transition-colors hover:bg-forest-100 hover:text-forest-900";
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={className}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg bg-emergency-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emergency-700 sm:inline-flex"
        >
          Falar com a Brigada
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-forest-900 transition-colors hover:bg-forest-100 lg:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
      {panel}
    </>
  );
}
