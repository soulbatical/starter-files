<!-- tetra-project-scaffolding:applied -->

# Voor Claude Code

Dit deel is toegevoegd door Tetra's agent-scaffolding — automatisch bij een
nieuw `create-tetra`-project, of via `tetra/apply-project-scaffolding.sh` uit
soulbatical/starter-files voor onboarding-cursisten. Staat er hierboven nog
tekst (vóór de `---`): dat is wat create-tetra zelf gegenereerd heeft, en die
blijft gelden.

Zie `AGENTS.md` in je projectmap — dat bestand is de bron voor elke
AI-assistent die aan dit project werkt, Claude Code inclusief. Lees het eerst.

Deze bundel bevat daarnaast Claude Code-specifieke hulpmiddelen:

- `.claude/settings.json` — een `SessionStart`-hook die Node-versie en Tetra-status
  checkt via `npx tetra doctor --json`, en een `PreToolUse`-hook die een
  `Edit`/`Write`/`MultiEdit` op `.tetra/generated/` blokkeert (zie `AGENTS.md`
  §3: dat is waar compileren overheen schrijft). Geen garantie tegen elke
  route — een shell-commando via Bash (`sed -i`, `cat >`) raakt die bestanden
  buiten deze hook om.
- `.claude/skills/tetra-install/` — de installatiestappen uit `AGENTS.md` §1 als
  skill, zodat je ze met `/tetra-install` kunt oproepen.
- `.claude/skills/tetra-manifest-feature/` — het manifest-ritueel uit `AGENTS.md`
  §3 als skill (`/tetra-manifest-feature`).

Deze bestanden werken meteen, zonder verdere stappen.
