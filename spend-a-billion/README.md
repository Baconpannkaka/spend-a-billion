# Spend a Billion

Ett komplett svenskt fantasishopping-spel där användaren får **1 000 000 000 kr** att spendera på 40 välkända lyxprodukter, extrema fastigheter och upplevelser. Allt sker på låtsas: inga betalningar, beställningar, konton, cookies eller externa API:er används.

## Funktioner

- Responsiv landningssida och exklusivt placeholdersystem utan externa produktbilder
- 40 typade produkter med beskrivningar, fakta och ungefärliga underhållningspriser
- Sökning, kategorifilter, sortering och filter för produkter som fortfarande ryms i budgeten
- Central kundvagnslogik som aldrig tillåter mer än 1 miljard kronor
- Flera exemplar av samma produkt, toastmeddelanden och tydliga budgetfel
- LocalStorage för namn, kundvagn, introduktionsstatus, resultat och senaste session
- Simulerad kassa med låst `BILLIONAIRE BLACK`-kort och lekfull köpsekvens
- Resultatsida med statistik, kategorifördelning, omdöme och achievements
- Databasfri delning genom validerad URL-data på `/resultat?haul=...`
- Skrivskyddade delade resultat, Web Share API, kopieringsfallback och resultatbild via Canvas
- Tillgänglig navigation, skip-link, fokusringar, reducerad rörelse, 404 och felgräns
- Sitemap, robots, metadata och automatisk sida för bildkällor

## Teknik

- Next.js 16 med App Router
- React 19
- TypeScript i strict mode
- Tailwind CSS 4
- Lucide React
- Vitest, Testing Library och jsdom
- npm

Projektet använder systemtypsnitt och egna CSS-placeholders. Det gör produktionen helt fristående och förhindrar att bygget behöver hämta externa typsnitt eller bilder.

## Installera och starta

```bash
npm install
npm run dev
```

Öppna sedan `http://localhost:3000`.

Produktionsläge:

```bash
npm run build
npm run start
```

## Kontroller och tester

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Testsviten täcker bland annat:

- svensk prisformatering
- totalsumma och återstående budget
- budgetspärr
- plus, minus och borttagning i kundvagnen
- maxantal som ryms
- achievements
- kodning och säker avkodning av delningsdata
- felaktiga och manipulerade delningslänkar
- grundläggande rendering av shoppsidan

## Projektstruktur

```text
src/
  app/                 App Router-sidor, metadata, sitemap och felvyer
  components/          Återanvändbara UI- och flödeskomponenter
  context/             Klienttillstånd för spel och toastmeddelanden
  data/products.ts     Alla produktposter och kategorinamn
  lib/                 Budget, kundvagn, delning, lagring och formattering
  types/               Gemensamma TypeScript-typer
  test/                Gemensam testsetup
```

## Redigera produkter

Alla produkter finns i `src/data/products.ts`. Gränssnittet, sökningen, produktvägarna, relaterade produkter och bildkällesidan hämtar information direkt därifrån.

Priser anges i hela svenska kronor:

```ts
priceSek: 45_000_000
```

Använd aldrig formaterade prissträngar i produktdatan. `formatSek()` i `src/lib/format.ts` ansvarar för svensk visning.

## Lägga till en ny produkt

Lägg till en post i arrayen `products`:

```ts
{
  id: "car-11",
  slug: "exempel-hyperbil",
  name: "Exempel Hyperbil",
  brand: "Exempel",
  category: "bilar",
  priceSek: 12_000_000,
  shortDescription: "En kort och unik beskrivning för produktkortet.",
  description:
    "En längre beskrivning som tydligt anger att priset är ungefärligt och används för underhållning.",
  facts: [
    "Intressant fakta ett",
    "Intressant fakta två",
    "Priset är ett ungefärligt fantasivärde",
  ],
  featured: false,
}
```

Krav:

- `id` och `slug` måste vara unika
- `category` måste vara en giltig `ProductCategory`
- priset måste vara ett positivt heltal
- använd inga logotyper eller osäkra externa bildlänkar

## Lägga till en Wikimedia Commons-bild

Ladda inte ned någon bild automatiskt. Kontrollera först bildens Commons-sida och fyll därefter i metadata direkt på produktposten:

```ts
imageUrl: "/images/exempel-hyperbil.jpg",
imageAlt: "Exempel Hyperbil fotograferad framifrån",
imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
imageCreator: "Fotografens namn",
imageLicense: "CC BY-SA 4.0",
imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
```

Rekommenderat arbetsflöde:

1. Kontrollera att filen verkligen får återanvändas.
2. Ladda ned en lämplig storlek manuellt.
3. Lägg filen lokalt under `public/images/`.
4. Ange korrekt alt-text, fotograf, källsida och licens.
5. Kontrollera `/bildkallor`, som automatiskt listar metadata.

`ProductMedia` visar automatiskt placeholdern när `imageUrl` saknas. Inga externa bilddomäner är konfigurerade eftersom projektet inte använder några.

## Delningslänkar

Ett färdigt resultat serialiseras till ett kompakt objekt med:

- formatversion
- användarnamn
- produkt-id och antal
- valfri tidsstämpel

Objektet kodas URL-säkert och läggs i `haul`:

```text
/resultat?haul=...
```

Avkodningen:

- ignorerar okända produkt-id
- tar bort negativa och ogiltiga antal
- begränsar extrema antal
- begränsar resultatet till startbudgeten
- avvisar trasiga eller tomma länkar
- renderar aldrig användarinnehåll som HTML

En mottagare ser resultatet skrivskyddat och kan antingen skapa en egen miljard eller starta en redigerbar remix från resultatet.

## LocalStorage och integritet

Nyckeln definieras i `src/lib/constants.ts`. Följande lagras lokalt:

- användarens namn
- kundvagn
- om introduktionen har visats
- färdigt resultat
- tidpunkt för senaste session

Ingen data skickas till en server. Projektet använder inga cookies, trackers, analytics eller annonser.

## Publicering på Vercel

1. Lägg projektet i ett Git-repository.
2. Importera repositoryt i Vercel.
3. Välj Next.js som framework preset.
4. Låt buildkommandot vara `npm run build`.
5. Inga miljövariabler behövs.

Byt `metadataBase` och URL:erna i `src/app/layout.tsx`, `src/app/sitemap.ts` och `src/app/robots.ts` från exempeldomänen till den riktiga domänen före publicering.

## Begränsningar

- Produktpriser är fasta, grova underhållningsvärden och uppdateras inte från marknaden.
- Delningsdata finns i URL:en och är därför kompakt, men inte krypterad eller avsedd för känslig information.
- LocalStorage kan rensas av användaren eller webbläsaren.
- Resultatbilden använder text och grafik från Canvas, inte externa produktbilder.
- Projektet har ingen server, användarprofil eller historik mellan olika enheter.
- `npm audit` kan rapportera en moderat PostCSS-varning inne i den aktuella stabila Next.js-versionens beroendeträd. Den automatiska föreslagna tvångsfixen nedgraderar Next.js kraftigt och ska inte användas.

## Juridisk friskrivning

Spend a Billion är ett oberoende underhållningsprojekt. Inga produkter säljs, inga betalningar genomförs och inga produkter beställs. Priserna är ungefärliga och används endast för underhållning. Produktnamn och varumärken tillhör respektive rättighetsinnehavare. Projektet är inte sponsrat, godkänt eller administrerat av de varumärken som omnämns.
