# Voor je AI-assistent

Dit deel is toegevoegd door `tetra/apply-project-scaffolding.sh`, normaal
gesproken ná `npx create-tetra` (zie `PROJECT_SETUP.md` §2). Staat er
hierboven nog tekst (vóór de `---`): dat is wat create-tetra zelf voor dit
project gegenereerd heeft (de exacte commandolijst, project-rules) — die
blijft gelden, dit vult hem aan.

Lees ook `PROJECT_SETUP.md`, `OPDRACHT_CRM.md` en `CODE_REVIEW.md` in deze repo — dit
bestand vult ze aan met wat een AI-assistent specifiek moet weten over het
installatie- en manifestproces zelf, niet over de bouwmethodiek.

## 1. Tetra activeren en installeren

`npx create-tetra .` (of `npx create-tetra mijn-app` in een lege map) vraagt een
eenmalige browsergoedkeuring:

1. De CLI print een link en een bevestigingscode, en wacht.
2. Open de link zelf als je dat kunt (curl/headless browser), of vraag een mens dat
   te doen. Bevestig het e-mailadres op die pagina; er komt een magic-link-mail.
3. Open die mail-link (zelf, met je eigen mailbox-toegang, of laat een mens dat doen)
   en klik "Approve" op de pagina die daarna verschijnt.
4. De CLI pollt dit zelf af en gaat door zodra je hebt goedgekeurd.

**Controleer eerst welke versie je draait: `npx create-tetra --version`.** Het
gedrag bij een verlopen code verschilt:

- **≥ 0.1.2:** herstart dit commando niet terwijl het wacht. Een trage of kort
  haperende verbinding met de control plane wordt zelf opnieuw geprobeerd, en
  een goedkeuringscode die verloopt voordat je klaar bent wordt automatisch
  vervangen door een nieuwe (begrensd, met een duidelijke melding en een
  nieuwe link) — je hoeft niet terug naar stap 1. De CLI print exact tot welk
  tijdstip hij wacht; zolang dat niet voorbij is, hoef je niets te doen buiten
  de browser/mail-stap.
- **0.1.1 of ouder:** geen automatisch herstel. Bij "De goedkeuring is
  verlopen" moet je het commando zelf opnieuw draaien voor een nieuwe code —
  hier is herstarten wél de juiste actie, niet een foutherstel waar je op moet
  wachten.

Zie je ná "Goedgekeurd." toch een harde foutmelding over je toegang, dan is de
goedkeuring verbruikt of onbruikbaar geworden (op elke versie) — draai het
commando dan opnieuw voor een nieuwe goedkeuring. Dat staat dan ook letterlijk
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
