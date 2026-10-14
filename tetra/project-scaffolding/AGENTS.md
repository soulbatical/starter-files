# Voor je AI-assistent

Dit bestand staat hier al vóórdat `create-tetra` heeft gedraaid — de **inhoud** van
deze map is in een lege projectmap uitgepakt (`unzip project-scaffolding.zip -d
mijn-app`, niet de map zelf erin gekopieerd), en pas daarna is
`npx create-tetra .` gedraaid. Dat is bewust: create-tetra (0.1.2+) staat een map
toe die alleen README.md, CLAUDE.md, AGENTS.md, `.claude/`, `.git/` en
`.gitignore` bevat, precies zodat je AI-assistent dit al kent voordat het eerste
commando draait.

Lees ook `PROJECT_SETUP.md`, `OPDRACHT_CRM.md` en `CODE_REVIEW.md` in deze repo — dit
bestand vult ze aan met wat een AI-assistent specifiek moet weten over het
installatie- en manifestproces zelf, niet over de bouwmethodiek.

## 1. Tetra activeren en installeren — wacht, herstart niet

`npx create-tetra .` vraagt een eenmalige browsergoedkeuring:

1. De CLI print een link en een bevestigingscode, en wacht.
2. Open de link zelf als je dat kunt (curl/headless browser), of vraag een mens dat
   te doen. Bevestig het e-mailadres op die pagina; er komt een magic-link-mail.
3. Open die mail-link (zelf, met je eigen mailbox-toegang, of laat een mens dat doen)
   en klik "Approve" op de pagina die daarna verschijnt.
4. De CLI pollt dit zelf af en gaat door zodra je hebt goedgekeurd.

**Herstart dit commando niet terwijl het wacht.** Sinds create-tetra 0.1.2:
- een trage of kort haperende verbinding met de control plane wordt zelf opnieuw
  geprobeerd;
- een goedkeuringscode die verloopt voordat je klaar bent, wordt automatisch
  vervangen door een nieuwe (begrensd, met een duidelijke melding en een nieuwe
  link) — je hoeft niet terug naar stap 1;
- de CLI print exact tot welk tijdstip hij wacht. Zolang dat tijdstip niet voorbij
  is, is er niets stuk en hoef je niets te doen buiten de browser/mail-stap.

Zie je toch een harde foutmelding (bijvoorbeeld na "Goedgekeurd." een foutmelding
over je toegang), dan is de goedkeuring verbruikt of onbruikbaar geworden — draai
het commando dan opnieuw voor een nieuwe goedkeuring. Dat staat dan ook letterlijk
in de foutmelding.

## 2. Tetra eerst — ook tijdens het installeren

Vóór je zelf iets bouwt: zoek of Tetra het al heeft. Dat geldt voor auth, CRUD,
formulieren, tabellen, dashboards, planning — niet alleen voor losse functies maar
ook voor hele schermen en workflows. Zie `PROJECT_SETUP.md` §1 en de
Tetra-inventaristabel in §22 voor hoe je dat onderzoek vastlegt.

## 3. Het manifest-ritueel

```bash
npx tetra manifest new <naam> --write          # manifests/<naam>.json
npx tetra manifest validate manifests/<naam>.json
npx tetra manifest compile  manifests/<naam>.json --write
npx tetra manifest migration manifests/<naam>.json                                   # droog
npx tetra manifest migration manifests/<naam>.json --version <timestamp> --write      # echt
```

Na `migration --write`: `supabase db reset` lokaal om de nieuwe migratie te testen.

**Nooit** met de hand in `.tetra/generated/` wijzigen — dat verdwijnt bij de
volgende compile. Wijzig het manifest, compileer opnieuw.

## 4. Vóór je een taak "klaar" meldt

```bash
npm run typecheck
npm test
npm run build
```

Alle drie groen, en de app heeft ook echt gedraaid (`npm run dev:local`) met het
scherm dat je net hebt gebouwd. "Tests zijn groen" is niet hetzelfde als "ik heb het
gezien werken" — zie `PROJECT_SETUP.md` §26, gouden regel 5.

## 5. Wat hier niet hoort

Dit bestand gaat over het gereedschap (installeren, manifesten, testen). De
productbeschrijving, het PRD en het statusblok horen in `docs/` van het project
zelf, niet hier — zie `PROJECT_SETUP.md` §3 en §25.
