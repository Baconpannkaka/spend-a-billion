# AGENTS.md

## Viktigt om ramverket

Projektet använder Next.js 16 och React 19. Läs relevanta guider i `node_modules/next/dist/docs/` när en API-detalj är osäker, eftersom äldre Next.js-mönster kan vara inaktuella.

## Produktregler

1. Startbudgeten är alltid `1_000_000_000` SEK och definieras endast i `src/lib/constants.ts`.
2. Ingen kodväg får kunna skapa en kundvagn över budgeten.
3. Alla köp är simulerade. Lägg aldrig till betalnings-SDK, kortfält, order-API eller formuleringar som antyder verklig handel.
4. Produktpriser är ungefärliga underhållningsvärden, inte aktuella offerter.
5. Delade resultat ska alltid vara skrivskyddade tills användaren uttryckligen väljer att starta en remix.
6. Avkodad URL-data och LocalStorage-data ska betraktas som opålitlig och valideras.
7. Använd aldrig `dangerouslySetInnerHTML` för användardata.
8. Ingen databas, autentisering, analytics, cookies, annonser eller miljövariabler får införas utan ett uttryckligt produktbeslut.
9. Produktbilder ska vara lokala och korrekt licensierade. Metadata ska anges i produktfilen och visas på `/bildkallor`.
10. Alla synliga knappar och länkar ska utföra en verklig funktion.

## Struktur

```text
src/app/                  Sidor, layouts, metadata, sitemap, robots och felvyer
src/components/           Presentations- och flödeskomponenter
src/context/              GameProvider och ToastProvider
src/data/products.ts      Enda källan för produktdata
src/lib/cart.ts           Kundvagn, totalsumma och budgetvalidering
src/lib/achievements.ts   Achievements och resultattexter
src/lib/share.ts          URL-säker serialisering och validering
src/lib/storage.ts        Klientsäker LocalStorage-hantering
src/lib/format.ts         Gemensam svensk nummer- och prisformatering
src/types/                Delade datatyper
```

## Kodprinciper

- TypeScript strict mode; använd inte `any`.
- Håll affärslogik ren och testbar utanför React-komponenter.
- Använd `formatSek()` för alla synliga SEK-belopp.
- Använd funktionella, semantiska komponenter och tillgängliga labels.
- Klientkomponenter ska endast märkas med `"use client"` när de behöver browser-API, state eller events.
- LocalStorage får endast läsas och skrivas på klienten och UI ska hantera hydrering utan layoutkrasch.
- Återanvänd `ProductMedia`; den ansvarar för korrekt bild/placeholder-fallback.
- Lägg inte till externa bilddomäner i Next-konfigurationen innan en riktig och godkänd källa används.
- Respektera `prefers-reduced-motion` för nya animationer.
- Kommentarer ska förklara varför, inte återberätta koden.

## Produktdata

Varje produkt ska följa typen `Product` och ha unik:

- `id`
- `slug`
- kort beskrivning
- längre beskrivning
- 3–5 fakta

När en bild läggs till ska följande normalt fyllas i tillsammans:

- `imageUrl`
- `imageAlt`
- `imageSourceUrl`
- `imageCreator`
- `imageLicense`
- `imageLicenseUrl`

## Testkommandon

Kör alltid följande före leverans:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Viktiga testområden:

- budgetgräns och manipulerad data
- kvantitetsändringar
- formattering
- achievements
- delningsformatets bakåtkompatibilitet och säkerhet
- rendering av centrala sidor

## Manuell kontroll

Kontrollera minst:

1. Lägg till produkt från `/shop`.
2. Försök överskrida budgeten.
3. Ändra antal och ta bort från `/varukorg`.
4. Genomför köp på `/kassa`.
5. Kopiera och öppna en delningslänk i nytt fönster.
6. Kontrollera skrivskyddat läge och remixknappen.
7. Kontrollera mobilmeny, tangentbordsfokus och reducerad rörelse.
8. Kontrollera att `/bildkallor`, `/juridiskt`, 404, sitemap och robots fungerar.
