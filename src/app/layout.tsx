import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/urls";
import { BRIGADE_CONFIG } from "@/config/brigade";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const OG_IMAGE = `${SITE_URL}/assets/images/compartilhar-og.jpg`;

export const metadata: Metadata = {
  title: {
    default: BRIGADE_CONFIG.seo.defaultTitle,
    template: BRIGADE_CONFIG.seo.template,
  },
  description: BRIGADE_CONFIG.seo.description,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      "/favicon.ico",
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
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
        height: 675,
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
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <link
          rel="preload"
          as="image"
          href={`${SITE_URL}/assets/global/logo.png`}
        />
        <link
          rel="preload"
          as="image"
          href={`${SITE_URL}/assets/images/hero.jpg`}
        />
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
