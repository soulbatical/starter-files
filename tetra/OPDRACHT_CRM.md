# Opdracht CRM — je eerste Tetra-app

Een oefenopdracht om werkproces 1 en 2 uit de cursus één keer helemaal door te lopen. Zet `PROJECT_SETUP.md`, `CODE_REVIEW.md` en dit bestand in je projectmap en open die map in de Claude Code app.

**Het doel:** een klein, werkend CRM voor één bedrijf, live op internet — gebouwd met zoveel mogelijk Tetra en zo weinig mogelijk eigen code.

## Het bedrijf

Kies zelf een bedrijf dat je kent (de bloemenwinkel van je oom, een schilder, een kapper, een coach). Weet je er geen? Neem dan: *een schildersbedrijf met 3 schilders dat klanten, offertes en klussen wil bijhouden.*

## Wat de app minimaal kan

1. Inloggen, met twee rollen: **eigenaar** (mag alles) en **medewerker** (mag klanten en klussen zien en bijwerken, niet verwijderen).
2. **Klanten** bijhouden: naam, contactgegevens, notities.
3. **Offertes of klussen** per klant, met een status (bijvoorbeeld: nieuw → offerte → gepland → klaar).
4. Een overzicht waarin je kunt **zoeken en filteren**.

Meer mag, maar pas als dit werkt en live staat.

## Zo pak je het aan

**Werkproces 1 — van idee naar bouwtaken** (`PROJECT_SETUP.md`, Deel 3):

1. **Idee scherp** — voor wie, wat minimaal, welk type app?
2. **PROJECT_SETUP.md meegeven** en een nieuw Tetra-project laten maken (`npx create-tetra`). De licentie-mail bevestig je zelf.
3. **PRD maken** in `docs/PRD.md` — laat Claude je interviewen. Laat Claude ook de Tetra-inventaris maken: welke modules (bijvoorbeeld `tetra-crm`, `tetra-pipeline`, `tetra-tasks`) doen dit al?
4. **Design** in Claude Design (<https://claude.com/design>).
5. **Design importeren** in de repo.
6. **PRD bijwerken** met de mapping-tabel: scherm → data → manifest of eigen code → Tetra-module.
7. **Bouwtaken** maken, plus `docs/Security.md` (eigenaar vs medewerker). Sluit af met `/init`.

**Werkproces 2 — bouwen per taak**, voor elke bouwtaak opnieuw:

1. `/clear` en één taak kiezen
2. Claude maakt een plan (Plan Mode) — Tetra eerst
3. Claude bouwt (TDD-light)
4. Claude test zelf
5. Commit + pull request
6. Tweede AI reviewt de PR in een nieuw gesprek, met `CODE_REVIEW.md`
7. De bouwer verwerkt de review
8. **Jij test zelf** in de browser
9. Merge en live

## Klaar is klaar als

- [ ] Je bent ingelogd als eigenaar én als medewerker, en de medewerker kán echt niets verwijderen (ook niet via een omweg — laat Claude dat testen).
- [ ] Je hebt een klant met een offerte aangemaakt, de pagina herladen, en alles staat er nog.
- [ ] Elke PR heeft een zichtbare review.
- [ ] De app staat live en je hebt hem **met eigen ogen** op de live-URL gezien.
- [ ] In `docs/PRD.md` staat welke Tetra-modules je gebruikt en waar je zelf code schreef (met reden).

Ging iets niet met Tetra, of was iets onduidelijk? Schrijf het op in `docs/tetra-feedback.md`. Daar wordt Tetra beter van.

Wil je verder? Pak dan `OPDRACHT_CRM_GEVORDERD.md`.
