---
name: tetra-install
description: Activeer en installeer Tetra SaaS in de huidige map via npx create-tetra, inclusief de browser-/e-mailgoedkeuring. Gebruik dit wanneer het project nog geen .tetra/-map heeft, of wanneer create-tetra eerder vastliep op een verlopen of mislukte goedkeuring.
---

# Tetra installeren

1. Controleer Node: `node --version` moet `v24.x` zijn.
2. Controleer de create-tetra-versie: `npx create-tetra --version`. Het
   gedrag bij een verlopen code (stap 6) hangt hiervan af.
3. Controleer dat de map echt leeg is — create-tetra accepteert vandaag niets
   anders, met één uitzondering: README.md/CLAUDE.md/AGENTS.md/.claude mogen
   er al staan (bijvoorbeeld uit de starter-files-onboarding-bundel, zie
   `PROJECT_SETUP.md` §2 als dat bestand in je project staat). Die horen er
   dan al vóór deze stappen bij, niet erna.
4. Draai `npx create-tetra mijn-app` (of `npx create-tetra .` als je al in de
   bedoelde, lege map staat).
5. De CLI print een link en een bevestigingscode. Open de link (zelf met curl/een
   headless browser, of laat een mens dat doen) en vul het e-mailadres in.
6. Er komt een magic-link-mail. Open die link (zelf, als je toegang hebt tot de
   mailbox, anders via een mens) en klik "Approve".
7. De CLI pollt dit zelf af.
   - **≥ 0.1.2:** niets herstarten zolang de CLI print dat hij wacht — hij
     vraagt zelf een nieuwe code aan als de huidige verloopt, en herstelt
     zelf van een korte netwerkhapering.
   - **0.1.1 of ouder:** geen automatisch herstel. Bij "De goedkeuring is
     verlopen" draai je het commando zelf opnieuw — dat is hier de juiste
     actie, geen fout.
8. Zie je ná "Goedgekeurd." toch een foutmelding: de goedkeuring is dan
   verbruikt of onbruikbaar geworden (op elke versie). Draai het commando
   opnieuw voor een nieuwe.
9. Na een succesvolle install: volg de "Volgende stappen" die de CLI zelf
   print (`npm install --include=optional`, `npm run dev:local`, Supabase
   CLI), en draai dan `npx tetra doctor --json` om te bevestigen dat Node,
   licentie, registry-toegang en het project zelf in orde zijn. Zie je
   `.claude/skills/tetra-install/` al in je project (dit bestand): de
   agent-scaffolding staat er dan al — een recente `create-tetra` voegt die
   automatisch toe bij het scaffolden, niets extra te doen. Op een
   ouder project zonder deze bestanden: haal `tetra/project-scaffolding/` en
   `tetra/apply-project-scaffolding.sh` uit soulbatical/starter-files en
   draai dat script tegen je projectmap.

Meld een afwijking van dit stappenplan (een andere foutmelding, een andere
wachttijd) expliciet in je verslag — dat is precies het soort feedback waarmee
Tetra zelf verbetert.
