# AGENTS.md

## Ramverk och leveransmål

Projektet använder Next.js 16, React 19 och statisk export till GitHub Pages. Ändringar får inte göra webbplatsen beroende av en Node-server, server actions, route handlers, databas, autentisering, externa API:er eller miljövariabler som användaren måste konfigurera.

`npm run build` ska alltid skapa en komplett `out/`-mapp. `.github/workflows/pages.yml` bygger och publicerar den via GitHub Actions.

## Produktregler

1. Användaren väljer startbudget genom klassisk miljard, personprofil eller aktiescenario.
2. Interna produktpriser och budgetgränser lagras i SEK. Displayvalutan ändrar presentationen, inte köpkraften.
3. Ingen kodväg får skapa en kundvagn över den aktuella `startingBudgetSek`.
4. Alla köp är simulerade. Lägg aldrig till betalnings-SDK, riktiga kortfält, order-API eller formuleringar som antyder verklig handel.
5. Produktpriser, förmögenheter och växelkurser är daterade underhållningsvärden.
6. Aktiekalkylatorn är en enkel fantasiberäkning, inte marknadsdata eller finansiell rådgivning.
7. Delade resultat är skrivskyddade tills användaren uttryckligen startar en remix.
8. URL-data och LocalStorage-data är opålitliga och måste valideras och begränsas.
9. Använd aldrig `dangerouslySetInnerHTML` för användardata.
10. Ingen analytics, cookies, annonser eller trackers får införas utan ett uttryckligt produktbeslut.
11. Produktbilder ska vara lokala och korrekt licensierade. Bildmetadata ska visas på `/bildkallor`.
12. Alla synliga knappar och länkar ska utföra en verklig funktion.

## Struktur

```text
.github/workflows/pages.yml   GitHub Pages-build och publicering
src/app/                      Sidor, metadata, sitemap, robots och felvyer
src/components/               Presentations- och flödeskomponenter
src/context/                  GameProvider och ToastProvider
src/data/products.ts          Produktdata
src/data/currencies.ts        Valutor och fasta referenskurser
src/data/wealth-profiles.ts   Personer och förmögenhetsuppskattningar
src/lib/budget.ts             Budgetscenarier och validering
src/lib/cart.ts               Kundvagn, totalsumma och budgetspärr
src/lib/achievements.ts       Achievements och resultattexter
src/lib/share.ts              URL-säker serialisering och validering
src/lib/storage.ts            Klientsäker LocalStorage-hantering
src/lib/format.ts             Nummer-, valuta- och prisformatering
src/lib/site.ts               GitHub Pages URL och base path
src/types/                    Delade typer
```

## Kodprinciper

- TypeScript strict mode; använd inte `any`.
- Håll affärslogik ren och testbar utanför React.
- Använd `formatMoneyFromSek()` för belopp som lagras i SEK och `formatMoneyValue()` för belopp som redan är i en specifik valuta.
- Konvertera via funktionerna i `src/data/currencies.ts`; duplicera inte kurser eller växlingslogik.
- Klientkomponenter ska bara märkas med `"use client"` när de behöver browser-API, state eller events.
- LocalStorage får bara läsas och skrivas på klienten. Hantera gammal eller manipulerad data utan krasch.
- Använd `ProductMedia` för korrekt lokal bild eller placeholder-fallback.
- Lägg inte till externa bilddomäner utan en verklig, godkänd bildkälla.
- Respektera `prefers-reduced-motion` för animationer.
- Bevara tillgängliga labels, fokusmarkeringar, semantisk HTML och rimliga klickytor.
- Kommentarer ska förklara varför, inte återberätta koden.

## GitHub Pages

- Behåll `output: "export"` och `trailingSlash: true` i `next.config.ts`.
- Repositorynamnets `basePath` beräknas automatiskt i GitHub Actions.
- Intern navigation ska använda `next/link` eller Next.js router så att base path följer med.
- Lägg inte hårdkodade root-URL:er till egna assets eller sidor utan att verifiera GitHub Pages-sökvägen.
- `public/.nojekyll` måste finnas kvar.

## Testkommandon

Kör alltid före leverans:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Eller:

```bash
npm run verify
npm run build
```

Viktiga testområden:

- valutaomräkning och formattering
- klassiskt, personbaserat och aktiebaserat budgetscenario
- dynamisk budgetgräns och manipulerad data
- kvantitetsändringar
- achievements
- delningsformatets bakåtkompatibilitet och säkerhet
- rendering av centrala sidor
- statisk export och GitHub Pages base path

## Manuell kontroll

1. Starta vart och ett av de tre budgetscenarierna.
2. Byt displayvaluta före och efter att spelet startat.
3. Lägg till produkter och försök överskrida budgeten.
4. Ändra antal och ta bort från varukorgen.
5. Genomför fantasiköpet.
6. Kopiera och öppna en delningslänk.
7. Kontrollera skrivskyddat läge och remix.
8. Kontrollera mobilmeny, tangentbordsfokus och reducerad rörelse.
9. Kontrollera `/bildkallor`, `/juridiskt`, 404, sitemap och robots.
10. Kontrollera byggd output både lokalt och med ett simulerat `GITHUB_REPOSITORY`.
