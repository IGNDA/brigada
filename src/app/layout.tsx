import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import { BRIGADE_CONFIG } from "@/config/brigade";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const SITE_URL = "https://brigadaignda.org.br";
const OG_IMAGE = `${SITE_URL}/assets/images/hero.jpg`;

export const metadata: Metadata = {
  title: {
    default: BRIGADE_CONFIG.seo.defaultTitle,
    template: BRIGADE_CONFIG.seo.template,
  },
  description: BRIGADE_CONFIG.seo.description,
  icons: {
    icon: `${SITE_URL}/favicon.ico`,
    shortcut: `${SITE_URL}/favicon.ico`,
    apple: `${SITE_URL}/favicon.ico`,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: BRIGADE_CONFIG.seo.defaultTitle,
    description: BRIGADE_CONFIG.seo.description,
    siteName: BRIGADE_CONFIG.name,
    locale: "pt_BR",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: BRIGADE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRIGADE_CONFIG.seo.defaultTitle,
    description: BRIGADE_CONFIG.seo.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
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
      <head>
        <link rel="preload" as="image" href={`${SITE_URL}/assets/global/logo.jpg`} />
        <link rel="preload" as="image" href={`${SITE_URL}/assets/images/hero.jpg`} />
      </head>
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