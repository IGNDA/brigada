import { BRIGADE_CONFIG } from "@/config/brigade";
import type { FAQItem } from "@/data/faq";

const SITE_URL = "https://brigadaignda.org.br";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRIGADE_CONFIG.name,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/global/logo.jpg`,
    description: BRIGADE_CONFIG.description,
    sameAs: ["https://www.instagram.com/1_brigada_de_operacoes_florest/"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-21-96695-6140",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rio de Janeiro",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRIGADE_CONFIG.name,
    url: SITE_URL,
    description: BRIGADE_CONFIG.seo.description,
    inLanguage: "pt-BR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQPageJsonLd({ items }: { items: FAQItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
