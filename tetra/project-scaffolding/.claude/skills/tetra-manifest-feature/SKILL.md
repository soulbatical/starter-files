---
name: tetra-manifest-feature
description: Voeg een nieuwe feature toe aan een Tetra-project via het manifest-ritueel (new, validate, compile, migration) in plaats van zelf tabellen/routes/RLS te schrijven. Gebruik dit voor elke nieuwe tabel, elk nieuw CRUD-scherm of elke rechten-wijziging.
---

# Een feature toevoegen via het manifest

Bouw dit NOOIT eerst zelf (eigen Express-route, eigen migratie, eigen RLS-policy)
en pas het daarna om naar een manifest. Begin bij het manifest.

```bash
npx tetra manifest new <naam> --write
```

Vul in `manifests/<naam>.json`:
- de tabel, velden en relaties;
- de rollen en wie wat mag (`list`, `read`, `create`, `update`, `delete`);
- zoeken/filters/sortering/paginering als relevant;
- lijst/detail/formulier-weergave;
- `needsDecision` voor open vragen — niet gokken, dit expliciet laten staan.

```bash
npx tetra manifest validate manifests/<naam>.json
npx tetra manifest compile  manifests/<naam>.json --write
npx tetra manifest migration manifests/<naam>.json                                   # droog bekijken
npx tetra manifest migration manifests/<naam>.json --version <timestamp> --write     # pas dan schrijven
```

Daarna lokaal testen:

```bash
supabase db reset
npm run typecheck
npm test
```

Zoek vóór je een `needsDecision` zelf invult of een bedrijfsregel toevoegt eerst of
een bestaande Tetra-module dit al dekt (zie AGENTS.md §2 / PROJECT_SETUP.md §22).
Alleen wat daar echt niet in past, wordt eigen code naast de gegenereerde laag —
en dat hoort dan in `backend/src/modules/<feature>/`, niet in `.tetra/generated/`.
