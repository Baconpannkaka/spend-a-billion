import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spend a Billion – Hur rik vill du vara?",
    template: "%s | Spend a Billion",
  },
  description:
    "Välj en miljard, en känd förmögenhet eller din egen aktiedröm. Shoppa Bugatti, privatjet, yachter och andra drömköp – helt på låtsas.",
  applicationName: "Spend a Billion",
  openGraph: {
    title: "Spend a Billion – Hur rik vill du vara?",
    description: "Välj din förmögenhet, byt valuta och bygg världens mest överdrivna fantasivarukorg.",
    type: "website",
    locale: "sv_SE",
    siteName: "Spend a Billion",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Spend a Billion – Hur rik vill du vara?",
    description: "Välj din förmögenhet och shoppa bort den på några minuter.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>
        <a href="#main-content" className="skip-link">Hoppa till innehållet</a>
        <Providers>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
