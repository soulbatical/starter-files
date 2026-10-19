<!-- tetra-project-scaffolding:applied -->

# Voor je AI-assistent

Dit deel komt uit Tetra's agent-scaffolding (canonieke bron:
`packages/create-app/src/agent-scaffolding/` in soulbatical/tetra). In een
project gemaakt met een recente `npx create-tetra` is dit automatisch
toegevoegd, bovenop wat create-tetra zelf al voor
dit project gegenereerd had. Staat er hierboven nog tekst (vóór de `---`):
dat is die projectspecifieke content (de exacte commandolijst,
project-rules) — die blijft gelden, dit vult hem aan. Kreeg je dit bestand
los, bijvoorbeeld via `tetra/apply-project-scaffolding.sh` uit
soulbatical/starter-files voor onboarding-cursisten: zelfde inhoud, zelfde
regels.

Lees ook `PROJECT_SETUP.md`, `OPDRACHT_CRM.md` en `CODE_REVIEW.md` als die in
je project staan (de onboarding-bundel) — dit bestand vult ze aan met wat een
AI-assistent specifiek moet weten over het installatie- en manifestproces
zelf, niet over de bouwmethodiek. Staan die bestanden er niet (een gewoon
`create-tetra`-project): kijk dan naar `docs/tetra/BUILD-A-SYSTEM.md` en
`docs/PRD.md` in dit project.

## 1. Tetra activeren en installeren

`npx create-tetra .` (of `npx create-tetra mijn-app` in een lege map) vraagt een
eenmalige browsergoedkeuring. Die goedkeuring is van de **mens**, niet van jou:
de licentie wordt gekoppeld aan het e-mailadres dat daar bevestigd wordt.

1. De CLI print een link en een bevestigingscode, en wacht.
2. Geef de link en de code door aan de mens en vraag hem de pagina te openen,
   zijn e-mailadres in te vullen en daarna de link in de magic-link-mail te
   openen en te bevestigen. Open die link niet zelf en lees zijn mailbox niet
   uit — ook niet als je daar toegang toe hebt.
3. Wacht. De CLI pollt dit zelf af en gaat door zodra de mens heeft
   goedgekeurd.

Herstart het commando niet terwijl het wacht. Een trage of kort haperende
verbinding met de control plane wordt zelf opnieuw geprobeerd, en een
goedkeuringscode die verloopt voordat de mens klaar is wordt automatisch
vervangen door een nieuwe (begrensd, met een duidelijke melding en een nieuwe
link — geef die dan door). De CLI print exact tot welk tijdstip hij wacht;
zolang dat niet voorbij is, hoef je niets te doen.

Zie je ná "Goedgekeurd." toch een harde foutmelding over je toegang, dan is de
goedkeuring verbruikt of onbruikbaar geworden — draai het commando dan opnieuw
voor een nieuwe goedkeuring. Dat staat dan ook letterlijk in de foutmelding.

Twijfel je of je omgeving klaar is (Node-versie, licentie, registry-toegang,
project-status): draai `npx tetra doctor --json` — zie sectie 6 hieronder.

## 2. Tetra eerst — ook tijdens het installeren

Vóór je zelf iets bouwt: zoek of Tetra het al heeft. Dat geldt voor auth, CRUD,
formulieren, tabellen, dashboards, planning — niet alleen voor losse functies maar
ook voor hele schermen en workflows. Begin altijd met de discovery-commando's
van de CLI:

```bash
npx tetra intake              # wat dit project en de CLI kunnen
npx tetra intake --accept     # bevestig dat je het gelezen hebt
npx tetra blocks              # alle modules (blocks) op een rij
npx tetra blocks <naam>       # diepe kaart van één module: wat hij kan en hoe je hem aansluit
npx tetra how [taak]          # taakrecepten, bv. npx tetra how rollen / betalingen / email
npx tetra doctor --json       # omgeving en projectstatus
```

Tot `npx tetra intake --accept` gedraaid is, weigert de CLI `tetra db start`,
`tetra db reset` en `tetra migrate --write`. Dat is bewust: lees eerst wat er
al is. Na een update van de CLI naar een nieuwe minor-versie (bv. 0.3 → 0.4)
vervalt die acceptatie en vraagt de CLI opnieuw om `intake` en
`intake --accept` — er is dan iets nieuws te weten.

Zie `PROJECT_SETUP.md` §5 en de Tetra-inventaristabel in §22 als dat bestand in
je project staat voor hoe je dat onderzoek vastlegt; anders kijk naar
`docs/tetra/BUILD-A-SYSTEM.md` en `docs/tetra/BLOCKS.md` in dit project.

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

Zet bij een `required` enum/status-veld altijd een bewuste `defaultValue` in
het manifest. Sinds `@soulbatical/tetra-ui` ≥0.21.18 / `@soulbatical/tetra-core`
≥0.21.23 kiest het gegenereerde formulier zonder `defaultValue` zelf de eerste
optie (zowel visueel als in de form-state, dus de eerste "Create"-klik werkt
gewoon) — maar dat is dan toeval, niet een bedrijfskeuze. Een expliciete
`defaultValue` laat zien welke status écht de bedoelde standaard is.

## 4. Vóór je een taak "klaar" meldt

```bash
npm run manifest:check    # manifest geldig, gegenereerde output niet uit de pas
npm run docs:check        # meegeleverde Tetra-handleidingen up-to-date
npm run typecheck
npm test
npm run build
```

Alle vijf groen, en de app heeft ook echt gedraaid (`npm run dev:local`) met het
scherm dat je net hebt gebouwd. "Tests zijn groen" is niet hetzelfde als "ik heb het
gezien werken" — zie `PROJECT_SETUP.md` §17 (quality gates) en §26, gouden
regel 5, als dat bestand in je project staat. Werk per taak op een eigen
branch en lever via een PR (werkproces 2 in `PROJECT_SETUP.md`).

## 5. Wat hier niet hoort

Dit bestand gaat over het gereedschap (installeren, manifesten, testen). De
productbeschrijving, het PRD en het statusblok horen in `docs/PRD.md` van het
project zelf, niet hier — zie `PROJECT_SETUP.md` werkproces 1 (stap 3) en §25
als dat bestand in je project staat, anders `docs/README.md` en `docs/PRD.md`
van dit project.

## 6. `tetra doctor`

```bash
npx tetra doctor --json
```

Eén call die rapporteert: Node-versie, licentie (offline geverifieerd, geen
waarden in de output), registry-toegang, en projectstatus (manifest geldig,
gegenereerde output actueel, lokale Supabase bereikbaar + vrije poorten).
Gebruik dit als eerste stap bij elke onverklaarde installatie- of buildfout,
vóór je zelf gaat zoeken — de "volgende stap" in de output wijst je door.
