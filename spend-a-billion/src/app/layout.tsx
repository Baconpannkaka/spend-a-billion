import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spendabillion.example"),
  title: { default: "Spend a Billion – Vad skulle du köpa för en miljard?", template: "%s | Spend a Billion" },
  description: "Du har fått en miljard kronor. Köp Bugatti, privatjet, yachter och andra drömprylar – helt på låtsas – och utmana dina vänner.",
  openGraph: {
    title: "Spend a Billion – Vad skulle du köpa för en miljard?",
    description: "Du har fått en miljard kronor. Vad köper du?",
    type: "website",
    locale: "sv_SE",
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
