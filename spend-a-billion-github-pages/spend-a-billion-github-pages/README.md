# Spend a Billion

Ett svenskt fantasishopping-spel där användaren själv väljer hur rik hen vill vara och sedan shoppar bland 40 extrema produkter, fastigheter och upplevelser. Spelet kan köras och publiceras helt statiskt på **GitHub Pages** utan databas, server, inloggning, betalningslösning eller externa API:er.

## Vad som ingår

- Tre sätt att skapa en fantasibudget:
  - den klassiska svenska miljarden
  - **Be as rich as…** med 20 välkända personer och avrundade, daterade förmögenhetsuppskattningar
  - **Get rich on stock** med aktienamn, antal aktier, drömkurs och kursvaluta
- Global valutaväljare för SEK, USD, EUR, GBP, NOK, DKK, CHF, JPY, CAD och AUD
- 40 typade lyxprodukter med unika beskrivningar, fakta och exklusiva placeholders
- Sökning, kategorifilter, sortering och filter för sådant användaren fortfarande har råd med
- Dynamisk kundvagn som aldrig tillåter att den valda budgeten överskrids
- Simulerad fantasikassa med låst `BILLIONAIRE BLACK`-kort
- Resultatsida med statistik, achievements, kategorifördelning och resultatbild
- Databasfri delning via validerad URL-data på `/resultat?haul=...`
- Skrivskyddade delade resultat och möjlighet att starta en remix
- LocalStorage för pågående session
- Responsiv och tillgänglig design med mörk, redaktionell lyxkänsla
- Automatisk publicering på GitHub Pages genom GitHub Actions

Alla köp är på låtsas. Inga betalningsuppgifter kan anges och inga produkter beställs.

## Publicera via GitHubs webbplats

Du behöver inte installera Git, Node.js, Vercel eller något annat program för att få upp en testsida.

### 1. Skapa ett repository

1. Logga in på GitHub.
2. Välj **New repository**.
3. Döp det exempelvis till `spend-a-billion`.
4. Välj **Public** för den enklaste GitHub Pages-publiceringen.
5. Skapa repositoryt utan att lägga till en extra README eller `.gitignore`.

### 2. Ladda upp projektet

1. Packa upp zip-filen på datorn.
2. Öppna den uppackade mappen `spend-a-billion-github-pages`.
3. I GitHub-repositoryt: välj **Add file → Upload files**.
4. Dra in **allt innehåll i projektmappen**, inte själva zip-filen och inte en extra överordnad mapp.
5. Kontrollera att bland annat följande följer med:
   - `.github/workflows/pages.yml`
   - `src/`
   - `public/`
   - `package.json`
   - `package-lock.json`
   - `next.config.ts`
6. Välj **Commit changes**.

Projektet innehåller färre än 100 källfiler och är gjort för att kunna laddas upp i en omgång via GitHubs webbgränssnitt.

### 3. Aktivera GitHub Pages

1. Öppna repositoryts **Settings**.
2. Välj **Pages** i vänstermenyn.
3. Under **Build and deployment → Source**, välj **GitHub Actions**.
4. Öppna fliken **Actions** och invänta att arbetsflödet `Build and deploy Spend a Billion` får en grön markering.
5. Din adress visas därefter under **Settings → Pages** och blir normalt:

```text
https://DITT-GITHUB-NAMN.github.io/spend-a-billion/
```

Varje gång du ändrar en fil i `main` kör GitHub testerna, bygger webbplatsen och publicerar den nya versionen automatiskt.

## Ändra projektet direkt i GitHub

Öppna en fil, tryck på pennikonen, gör ändringen och välj **Commit changes**. GitHub Actions publicerar ändringen automatiskt när kontrollerna går igenom.

De vanligaste filerna att redigera är:

```text
src/data/products.ts          Produkter, priser, texter och bildmetadata
src/data/wealth-profiles.ts   Personer och förmögenhetsuppskattningar
src/data/currencies.ts        Valutor och fasta referenskurser
src/app/page.tsx              Startsidan
src/app/globals.css           Design och globala stilar
```

## Teknik

- Next.js 16 med App Router och statisk export
- React 19
- TypeScript i strict mode
- Tailwind CSS 4
- Lucide React
- Vitest, Testing Library och jsdom
- npm
- GitHub Actions och GitHub Pages

`next.config.ts` sätter `output: "export"`. Vid byggning skapas mappen `out/`, som GitHub Pages publicerar som en vanlig statisk webbplats. Projektet känner automatiskt av repositorynamnet och sätter rätt `basePath` för adresser som `användare.github.io/repository/`.

## Lokal utveckling, valfritt

På en dator där Node.js finns installerat:

```bash
npm install
npm run dev
```

Öppna sedan `http://localhost:3000`.

Bygg en statisk produktionsversion:

```bash
npm run build
```

Den färdiga webbplatsen hamnar i `out/`.

## Kontroller och tester

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Eller samlat:

```bash
npm run verify
```

Testsviten täcker bland annat:

- svensk prisformatering och valutaomräkning
- aktiescenario och personscenario
- totalsumma och återstående budget
- budgetspärr
- plus, minus och borttagning i kundvagnen
- maxantal som ryms
- achievements
- serialisering och säker avkodning av delningsdata
- felaktiga och manipulerade delningslänkar
- grundläggande rendering av shoppsidan

## Hur valuta fungerar

Alla produktpriser lagras i SEK som gemensam grundvaluta. Valutaväljaren ändrar hur beloppen visas men inte den underliggande köpkraften. Därför förändras inte kundvagnen eller budgetgränsen när användaren byter displayvaluta.

Aktiescenariot har två separata valutor:

- **kursvaluta**, exempelvis USD för en amerikansk aktie
- **displayvaluta**, exempelvis SEK för hela shoppingupplevelsen

Beräkningen är i princip:

```text
antal aktier × drömkurs i kursvalutan → omräknat till SEK → visat i vald displayvaluta
```

Växelkurserna i `src/data/currencies.ts` är fasta ECB-referensvärden från **30 juni 2026**. De hämtas inte automatiskt och ska betraktas som underhållningsvärden.

## Förmögenhetsprofiler

De 20 profilerna finns i `src/data/wealth-profiles.ts`. Värdena är avrundade offentliga uppskattningar med referensdatum **1 juli 2026**. Förmögenheter kan förändras snabbt och ska inte tolkas som exakt eller aktuell ekonomisk information.

Exempel:

```ts
{
  id: "michael-jordan",
  name: "Michael Jordan",
  profession: "Basketikon",
  netWorthUsd: 4_300_000_000,
  initials: "MJ",
  tier: "icon",
}
```

## Projektstruktur

```text
.github/workflows/        Automatisk byggning och GitHub Pages-publicering
public/                   Ikon, lokala bilder och .nojekyll
src/app/                  App Router-sidor, metadata, sitemap och felvyer
src/components/           Återanvändbara UI- och flödeskomponenter
src/context/              Klienttillstånd för spel och toastmeddelanden
src/data/products.ts      Alla produktposter
src/data/currencies.ts    Valutor och fasta växelkurser
src/data/wealth-profiles.ts Personer och uppskattade förmögenheter
src/lib/                  Budget, kundvagn, delning, lagring och formattering
src/types/                Gemensamma TypeScript-typer
src/test/                 Gemensam testsetup
```

## Redigera produkter

Alla produkter finns i `src/data/products.ts`. Priser anges som hela svenska kronor:

```ts
priceSek: 45_000_000
```

Använd aldrig formaterade prissträngar i produktdatan. `formatMoneyFromSek()` i `src/lib/format.ts` ansvarar för att konvertera och visa beloppen i rätt valuta.

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

`id` och `slug` måste vara unika och `category` måste vara en giltig `ProductCategory`.

## Lägga till en Wikimedia Commons-bild

Kontrollera först bildens licens på Commons och lägg sedan den nedladdade filen under `public/images/`. Fyll i metadata direkt på produktposten:

```ts
imageUrl: "/images/exempel-hyperbil.jpg",
imageAlt: "Exempel Hyperbil fotograferad framifrån",
imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
imageCreator: "Fotografens namn",
imageLicense: "CC BY-SA 4.0",
imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
```

Sidan `/bildkallor` skapas automatiskt från dessa fält. När `imageUrl` saknas används den designade kategori-placeholdern utan trasiga bildikoner.

## Delningslänkar

Ett färdigt resultat serialiseras med:

- formatversion
- användarnamn
- produkt-id och antal
- startbudget
- displayvaluta
- budgetscenario
- tidsstämpel

Avkodningen ignorerar okända produkter, tar bort ogiltiga antal, begränsar extrema värden och säkerställer att resultatet ryms i den delade budgeten. Delade resultat öppnas skrivskyddat.

## LocalStorage och integritet

Följande sparas lokalt i användarens webbläsare:

- namn
- kundvagn
- vald budget och budgetscenario
- vald valuta
- introduktionsstatus
- färdigt resultat
- tidpunkt för senaste session

Ingen speldata skickas till någon server. Projektet använder inga cookies, trackers, analytics eller annonser.

## Begränsningar

- GitHub Pages är statisk hosting; projektet har därför ingen server, databas, autentisering eller synk mellan enheter.
- Växelkurser, produktpriser och förmögenheter uppdateras inte automatiskt.
- Aktiekalkylatorn tar inte hänsyn till skatt, avgifter, utspädning, faktisk handel eller framtida marknadsvärde.
- Delningsdata finns i URL:en och är inte krypterad. Lägg aldrig känslig information där.
- LocalStorage kan rensas av användaren eller webbläsaren.
- Resultatbilden använder Canvas-grafik och text, inte externa produktbilder.

## Juridisk friskrivning

Spend a Billion är ett oberoende underhållningsprojekt. Inga produkter säljs, inga investeringar genomförs och inga betalningar eller beställningar skapas. Produktpriser, växelkurser och förmögenhetsuppskattningar är ungefärliga, daterade och används endast för underhållning. Personnamn, produktnamn och varumärken tillhör respektive rättighetsinnehavare. Projektet är inte sponsrat, godkänt eller administrerat av de personer eller varumärken som omnämns.
