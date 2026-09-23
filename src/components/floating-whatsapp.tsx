"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { BRIGADE_CONFIG } from "@/config/brigade";

const whatsappUrl = BRIGADE_CONFIG.whatsappText.startsWith("http")
  ? BRIGADE_CONFIG.whatsappText
  : `https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(BRIGADE_CONFIG.whatsappText)}&type=phone_number&app_absent=0`;

export default function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { root: null, threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Fale com a ${BRIGADE_CONFIG.name} no WhatsApp`}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`whatsapp-group fixed bottom-6 right-4 sm:right-6 z-40 group transition-all duration-300 ${
        hidden ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <div
        className={`flex items-center bg-white rounded-full shadow-xl p-2 border border-forest-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          hidden
            ? "translate-y-28 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emergency-600 text-white shadow-lg transition-colors hover:bg-emergency-700"
          aria-label="Abrir WhatsApp"
        >
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </button>
        <span className="whatsapp-label text-sm font-semibold text-forest-900">
          Fale com a brigada
        </span>
      </div>
    </a>
  );
}
