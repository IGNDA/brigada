import type { Metadata } from "next";
import FAQ from "@/components/faq/faq";
import { urls } from "@/lib/urls";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Perguntas frequentes — Brigada IGNDA",
  description:
    "Respostas para as dúvidas mais comuns sobre a Brigada IGNDA: atuação, resgate de fauna, incêndios florestais, abelhas, educação ambiental e como participar.",
};

export default function FAQPage() {
  const whatsappUrl =
    "https://api.whatsapp.com/send/?phone=5521966956140&text=Ol%C3%A1%21+Tenho+uma+d%C3%BAvida+sobre+a+Brigada+IGNDA.&type=phone_number&app_absent=0";

  return (
    <>
      <section className="bg-forest-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-200">
            Suporte
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Perguntas frequentes
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-forest-100">
            Não encontrou o que procura? Entre em contato conosco.
          </p>
          <div className="mt-8">
            <Link
              href={urls.atuacao()}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Ver nossa atuação
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <FAQ defaultOpen />

      <section className="bg-forest-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">
            Ainda tem dúvidas?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-forest-700">
            Não hesite em nos chamar pelo WhatsApp.
          </p>
          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emergency-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-emergency-700"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>Fale no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
