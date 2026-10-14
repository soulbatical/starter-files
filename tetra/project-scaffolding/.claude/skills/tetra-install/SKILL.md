---
name: tetra-install
description: Activeer en installeer Tetra SaaS in de huidige map via npx create-tetra, inclusief de browser-/e-mailgoedkeuring. Gebruik dit wanneer het project nog geen .tetra/-map heeft, of wanneer create-tetra eerder vastliep op een verlopen of mislukte goedkeuring.
---

# Tetra installeren

1. Controleer Node: `node --version` moet `v24.x` zijn.
2. Controleer dat de map leeg is, of alleen `README.md`, `AGENTS.md`, `CLAUDE.md`,
   `.claude/`, `.git/` en `.gitignore` bevat — dat is toegestaan.
3. Draai `npx create-tetra .` in deze map (niet in een submap, anders komt het
   project in de verkeerde plek terecht).
4. De CLI print een link en een bevestigingscode. Open de link (zelf met curl/een
   headless browser, of laat een mens dat doen) en vul het e-mailadres in.
5. Er komt een magic-link-mail. Open die link (zelf, als je toegang hebt tot de
   mailbox, anders via een mens) en klik "Approve".
6. De CLI pollt dit zelf af. **Niets herstarten zolang de CLI print dat hij wacht**
   — sinds versie 0.1.2 vraagt hij zelf een nieuwe code aan als de huidige
   verloopt, en herstelt hij zelf van een korte netwerkhapering.
7. Zie je ná "Goedgekeurd." toch een foutmelding: de goedkeuring is dan verbruikt.
   Draai `npx create-tetra .` opnieuw voor een nieuwe.
8. Na een succesvolle install: volg de "Volgende stappen" die de CLI zelf print
   (`npm run dev:local`, Supabase CLI).

Meld een afwijking van dit stappenplan (een andere foutmelding, een andere
wachttijd) expliciet in je verslag — dat is precies het soort feedback waarmee
Tetra zelf verbetert.
