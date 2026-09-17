"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=5521966956140&text=Ol%C3%A1%21+Vi+o+site+da+Brigada+IGNDA+e+quero+saber+mais.&type=phone_number&app_absent=0";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Fale com a Brigada no WhatsApp"
    >
      <div className="flex items-center gap-3 bg-white rounded-full shadow-xl p-2 pr-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-forest-100">
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emergency-600 text-white shadow-lg transition-colors hover:bg-emergency-700"
          aria-label="Abrir WhatsApp"
        >
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </button>
        <span className="hidden sm:block text-sm font-semibold text-forest-900 whitespace-nowrap">
          Fale conosco
        </span>
      </div>
      <div className="absolute bottom-16 right-0 w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 text-xs animate-bounce" aria-hidden="true">
        ↓
      </div>
    </a>
  );
}