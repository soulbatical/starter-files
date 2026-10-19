---
name: tetra-install
description: Activeer en installeer Tetra SaaS in de huidige map via npx create-tetra, inclusief de browser-/e-mailgoedkeuring die de mens zelf doet. Gebruik dit wanneer het project nog geen .tetra/-map heeft, of wanneer create-tetra eerder vastliep op een verlopen of mislukte goedkeuring.
---

# Tetra installeren

1. Controleer Node: `node --version` moet `v24.x` zijn.
2. Controleer dat de map echt leeg is — create-tetra accepteert vandaag niets
   anders, met één uitzondering: `README.md`, `CLAUDE.md`, `AGENTS.md`,
   `.claude/`, `.git/` en `.gitignore` mogen er al staan (bijvoorbeeld uit de
   starter-files-onboarding-bundel, zie `PROJECT_SETUP.md` §2 als dat bestand
   in je project staat).
3. Draai `npx create-tetra mijn-app` (of `npx create-tetra .` als je al in de
   bedoelde, lege map staat).
4. De CLI print een link en een bevestigingscode. Geef beide door aan de mens:
   **hij** opent de link, vult zijn e-mailadres in, opent de link in de
   magic-link-mail en bevestigt. De licentie wordt aan hem gekoppeld — doe
   dit niet zelf, ook niet als je toegang hebt tot een mailbox.
5. Wacht. De CLI pollt dit zelf af. Herstart niets zolang de CLI print dat hij
   wacht — hij vraagt zelf een nieuwe code aan als de huidige verloopt (geef
   de nieuwe link dan door), en herstelt zelf van een korte netwerkhapering.
6. Zie je ná "Goedgekeurd." toch een foutmelding: de goedkeuring is dan
   verbruikt of onbruikbaar geworden. Draai het commando opnieuw voor een
   nieuwe.
7. Na een succesvolle install: volg de "Volgende stappen" die de CLI zelf
   print (`npm install --include=optional`, `npm run dev:local`, Supabase
   CLI), en draai dan vanuit de projectmap:

   ```bash
   npx tetra doctor --json       # Node, licentie, registry-toegang, project
   npx tetra intake              # wat dit project en de CLI kunnen
   npx tetra intake --accept     # nodig vóór tetra db start/reset en migrate --write
   ```

   Zie je `.claude/skills/tetra-install/` al in je project (dit bestand): de
   agent-scaffolding staat er dan al — `create-tetra` voegt die automatisch
   toe bij het scaffolden, niets extra te doen. Op een ouder project zonder
   deze bestanden: haal `tetra/project-scaffolding/` en
   `tetra/apply-project-scaffolding.sh` uit soulbatical/starter-files en
   draai dat script tegen je projectmap.
8. Vóór je daarna een taak "klaar" meldt, moeten deze quality gates groen zijn
   (zelfde lijst als `AGENTS.md` §4 en `PROJECT_SETUP.md` §17):

   ```bash
   npm run manifest:check
   npm run docs:check
   npm run typecheck
   npm test
   npm run build
   ```

Meld een afwijking van dit stappenplan (een andere foutmelding, een andere
wachttijd) expliciet in je verslag — dat is precies het soort feedback waarmee
Tetra zelf verbetert.
