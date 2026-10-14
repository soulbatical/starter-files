# Voor Claude Code

Zie `AGENTS.md` in deze map — dat bestand is de bron voor elke AI-assistent die aan
dit project werkt, Claude Code inclusief. Lees het eerst.

Deze map bevat daarnaast Claude Code-specifieke hulpmiddelen:

- `.claude/settings.json` — een `SessionStart`-hook die Node-versie en Tetra-status
  checkt, en een `PreToolUse`-hook die handmatige wijzigingen in `.tetra/generated/`
  blokkeert (zie `AGENTS.md` §3: dat is waar compileren overheen schrijft).
- `.claude/skills/tetra-install/` — de installatiestappen uit `AGENTS.md` §1 als
  skill, zodat je ze met `/tetra-install` kunt oproepen.
- `.claude/skills/tetra-manifest-feature/` — het manifest-ritueel uit `AGENTS.md`
  §3 als skill (`/tetra-manifest-feature`).

Na het kopiëren van deze map in je projectmap werken deze meteen, ook vóór
`create-tetra` heeft gedraaid.
