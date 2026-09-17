"use client";

import { MessageCircle } from "lucide-react";
import { BRIGADE_CONFIG } from "@/config/brigade";

const whatsappUrl = BRIGADE_CONFIG.whatsappText.startsWith("http")
  ? BRIGADE_CONFIG.whatsappText
  : `https://api.whatsapp.com/send/?phone=5521966956140&text=${encodeURIComponent(BRIGADE_CONFIG.whatsappText)}&type=phone_number&app_absent=0`;

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 sm:right-6 z-40 group"
      aria-label={`Fale com a ${BRIGADE_CONFIG.name} no WhatsApp`}
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
    </a>
  );
}