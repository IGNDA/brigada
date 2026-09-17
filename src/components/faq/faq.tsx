"use client";

import { useState } from "react";
import { faqData, type FAQItem } from "@/data/faq";

export default function FAQ({
  items = faqData,
  defaultOpen = false,
}: { items?: FAQItem[]; defaultOpen?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen ? 0 : null
  );

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
        Perguntas frequentes
      </p>
      <h2 className="mt-2 text-2xl font-bold text-forest-900 sm:text-3xl">
        Dúvidas comuns
      </h2>
      <p className="mt-3 max-w-2xl text-forest-700">
        Respostas rápidas para as principais dúvidas sobre a Brigada IGNDA e nossa
        atuação ambiental.
      </p>

      <dl className="mt-10 space-y-4">
        {items.map((item, index) => {
          const isOpen = defaultOpen || openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-forest-100 bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-1"
                aria-expanded={isOpen}
              >
                <dt className="text-base font-semibold text-forest-900 pr-4">
                  {item.question}
                </dt>
                <span
                  className={`flex-shrink-0 h-5 w-5 text-forest-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              <dd
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pt-3 pb-5 text-forest-700 leading-relaxed border-t border-forest-100">
                  {item.answer}
                </div>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}