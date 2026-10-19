# Starter files

Materiaal dat cursisten meekrijgen en aan hun AI-assistent geven.

| Map | Voor wie | Inhoud |
|---|---|---|
| `standaard/` | projecten zonder framework: eigen Express-backend + Next.js + Supabase | `PROJECT_SETUP.md`, `CODE_REVIEW.md` |
| `tetra/` | projecten op Tetra (<https://tetrasaas.com>) | `PROJECT_SETUP.md`, `CODE_REVIEW.md`, `OPDRACHT_CRM.md` (oefenopdracht), `OPDRACHT_CRM_GEVORDERD.md` (Tetra verkennen en testen), `project-scaffolding/` (gegenereerd uit soulbatical/tetra; `create-tetra` zet dit al neer) |

Beide sets volgen hetzelfde werkproces als de cursus: **werkproces 1** (van idee naar bouwtaken, 7 stappen) en **werkproces 2** (bouwen per taak, 9 stappen: elke taak een eigen branch en PR, een tweede AI reviewt op de PR, je test zelf, en "af" is pas af als je het live hebt gezien). De stappen zijn geschreven als prompts voor de Claude Code app; het PRD staat in `docs/PRD.md`. Het verschil is de fundering. In `standaard/` bouwt de cursist auth, database-toegang en RLS zelf. In `tetra/` komt die laag uit Tetra en uit manifests, en controleert de review vooral of de cursist niet om Tetra heen bouwt.

De Tetra-versie beschrijft de werkwijze van `create-tetra` zoals die in oktober 2026 is (Node 24, manifests + `tetra manifest …`, `tetra blocks`/`how`/`intake`, tetra-core 0.21.24). Verandert die, dan loopt de tekst achter.

Deze repo is de enige bron van de starter files. Wijzigingen aan `tetra/project-scaffolding/` gaan via soulbatical/tetra (`scripts/export-starter-scaffolding.mjs`).
