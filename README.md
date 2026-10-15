# Starter files

Materiaal dat cursisten meekrijgen en aan hun AI-assistent geven.

| Map | Voor wie | Inhoud |
|---|---|---|
| `standaard/` | projecten zonder framework: eigen Express-backend + Next.js + Supabase | `PROJECT_SETUP.md`, `CODE_REVIEW.md` |
| `tetra/` | projecten op Tetra (<https://tetrasaas.com>) | `PROJECT_SETUP.md`, `CODE_REVIEW.md`, `OPDRACHT_CRM.md` (voorbeeldopdracht), `project-scaffolding/` (AGENTS.md/CLAUDE.md + Claude Code-hooks/skills, zet je na `create-tetra` in je projectmap) |

Beide sets volgen dezelfde methodiek: testen per laag, een review die zichtbaar op de PR staat, en "af" is pas af als je het live hebt gezien. Het verschil is de fundering. In `standaard/` bouwt de cursist auth, database-toegang en RLS zelf. In `tetra/` komt die laag uit Tetra en uit manifests, en controleert de review vooral of de cursist niet om Tetra heen bouwt.

De Tetra-versie beschrijft de werkwijze van `create-tetra` zoals die in september 2026 was (Node 24, manifests + `tetra manifest …`, tetra-core 0.21). Verandert die, dan loopt de tekst achter.
