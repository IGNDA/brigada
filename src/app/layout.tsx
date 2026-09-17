import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import FloatingWhatsApp from "@/components/floating-whatsapp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: "Brigada IGNDA — Instituto Guarda-Natureza de Defesa Ambiental",
    template: "%s | Brigada IGNDA",
  },
  description:
    "Brigada IGNDA — Brigada voluntária de proteção ambiental no Rio de Janeiro. Resgate de fauna silvestre, combate a incêndios florestais, educação ambiental e retirada segura de enxames.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={geistSans.variable}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col antialiased">
        {children}
        <FloatingWhatsApp />
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
