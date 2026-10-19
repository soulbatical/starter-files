# Code Review — instructie voor de AI-reviewer (Tetra-projecten)

**Lees dit eerst, vóór je een PR van een cursist beoordeelt.** Dit document is geschreven voor de AI-assistent (jou), niet voor de cursist. Jij reviewt de Pull Request van een project dat op **Tetra** is gebouwd (<https://tetrasaas.com>). De cursist is een beginner zonder development-achtergrond die op jouw oordeel vertrouwt. Jouw taak is dubbel: (1) een grondige, eerlijke review uitvoeren, en (2) de uitkomst zó terugkoppelen dat een niet-technische cursist begrijpt wat er moet gebeuren en waarom.

> **Voor de cursist — zo start je de review (werkproces 2, stap 6 en 7):**
> 1. Zet dit bestand in je projectmap, naast `PROJECT_SETUP.md`.
> 2. Is je PR klaar? **Start een nieuw gesprek** in de Claude Code app, in dezelfde projectmap. Dat nieuwe gesprek is je reviewer — met een frisse blik, zonder de aannames van de bouwer.
> 3. Prompt: *"Bekijk PR #1 en analyseer deze. Gebruik CODE_REVIEW.md om het te beoordelen en zet je review op de PR."*
> 4. Ga terug naar het gesprek van de bouwer. Prompt: *"Lees de review op PR #1 en verwerk de instructies."*
> 5. Daarna test jij zelf in de browser (stap 8) en pas dan merge je (stap 9).

Dit is de tegenhanger van `PROJECT_SETUP.md` (Tetra-versie): dat document beschrijft *hoe er gebouwd hoort te worden*, dit document beschrijft *hoe jij controleert of het goed gebouwd is* — vóór de merge.

**Wat anders is dan bij een gewoon project:** een groot deel van de fundering (auth, database-toegang, CRUD, RLS) komt uit Tetra en uit gegenereerde code. Je reviewt dus niet alleen *of de code klopt*, maar vooral *of de cursist Tetra gebruikt waar het kan* — en of hij er niet omheen bouwt. Code die naast Tetra een tweede loginroute, een eigen database-client of een eigen RLS-regel neerzet, is de meest voorkomende bron van lekken in Tetra-projecten.

---

## 0. Je rol en je grondhouding

- **De cursist weet niet wat hij niet weet.** Hij kan niet beoordelen of een review echt is gebeurd, of de juiste dingen zijn gecontroleerd, of "klaar" ook echt veilig betekent. Jij wel.
- **Wees streng, maar onderbouw alles.** Elke bevinding krijgt een reden, een bestand/regel en een concrete gewenste fix.
- **Vertaal naar gewone taal.** Leg per blocker in één zin uit *wat* er fout is en *waarom het erg is*, zonder jargon.
- **Een review die niet zichtbaar op de PR staat, telt niet.** Plaats je oordeel als comment op de PR (of laat de cursist het plaatsen).
- **Maak onderscheid tussen een fout van de cursist en een beperking van Tetra.** Bouwt de cursist iets zelf omdat Tetra het echt niet kan, dan is dat geen fout — mits het onderbouwd is. Vind je een fout ín Tetra zelf, benoem die apart als "Tetra-feedback" (zie §13).

---

## 1. Bekijk de ECHTE PR — vertrouw geen samenvatting

```bash
git fetch origin
gh pr view <nummer>                 # titel, omschrijving, status
gh pr diff <nummer>                 # de volledige diff — lees elke regel
gh pr checkout <nummer>             # branch lokaal uitchecken om te draaien
```

Geen `gh`? Gebruik de GitHub-koppeling (plugin) of lees de diff via het "Files changed"-tabblad op GitHub. Lees élke gewijzigde regel.

Controleer meteen:
- Komt de PR van een **eigen branch** voor deze taak en staat hij open tegen **`main`**?
- Is het **één concern**?
- Staan de **geautomatiseerde checks** groen? Rood = nog niet review-klaar.
- **Welk deel van de diff is gegenereerd?** Bestanden onder `.tetra/generated/` horen niet in git (ze staan in `.gitignore`). Zie je ze toch in de diff, of zie je er handmatige wijzigingen in, dan is dat een bevinding (§5).

---

## 2. Lees de bron vóór de code

1. **`PROJECT_SETUP.md` (Tetra-versie)** — de standaarden.
2. **`docs/PRD.md`** (de PRD) en de **mapping-tabel** — wat had deze PR moeten doen, en welke Tetra-module of welk manifest hoort daarbij?
3. **`docs/Security.md`** — de afgesproken rollen en de scheiding tussen user- en admin-route. Wijkt de PR daarvan af, dan is dat een bevinding.
4. **De PR-omschrijving** — wat claimt de cursist? Staat er bij eigen code een onderbouwing waarom Tetra het niet kon?
5. **De manifests** in `manifests/` die de PR raakt — dit is de echte bron van schema, rechten en RLS.
6. **De diff.**

Kernvraag bij elke bevinding: **doet de diff wat de PRD vroeg, met zoveel mogelijk Tetra en zo min mogelijk eigen code, op de manier die `PROJECT_SETUP.md` voorschrijft?**

---

## 3. Beoordeel van zwaar naar licht, met severity per bevinding

```
1. VEILIGHEID        secrets, RLS, auth, DB-helpers — fout = data-lek (BLOCKER)
2. TETRA-GEBRUIK     wordt Tetra omzeild of dubbel nagebouwd? (BLOCKER/MOET FIXEN)
3. CORRECTHEID       doet het wat het moet? edge cases? (BLOCKER)
4. MANIFEST          klopt het manifest; is de gegenereerde laag onaangeroerd?
5. SCOPE             past de diff bij het doel van de PR?
6. TESTS             juiste lagen getest, inclusief rechten?
7. NAAMGEVING        consistent met PROJECT_SETUP §8
8. ONDERHOUDBAARHEID duplicatie, dode code, te grote functies
9. STIJL & DOCS      tokens, docs/ bijgewerkt
```

Severity:
- 🔴 **BLOCKER** — mag niet gemerged worden tot dit gefixt is.
- 🟠 **MOET FIXEN** — fix vóór merge, tenzij de cursist een geldige reden heeft die jij accepteert.
- 🔵 **NIT** — suggestie, blokkeert niet.

**Eén enkele 🔴 = verdict REQUEST CHANGES**, ook als alle checks groen zijn. Groene checks betekenen "de aanwezige tests slagen", niet "het is veilig en correct".

---

## 4. Veiligheid (de zwaarste gate — niet-onderhandelbaar)

> **Raakt de PR auth, rechten, manifests met `permissions`, migraties of database-toegang? Draai dan `/security-review` (ingebouwd in Claude Code) op de wijzigingen vóór je een verdict geeft.** Neem de findings mee in je oordeel hieronder.

Secrets
- [ ] **Geen `.env` of secrets in de diff.** → 🔴 BLOCKER. Vertel de cursist: **stop, verwijder het uit de PR en roteer de sleutel.**
- [ ] **Service-role key alleen in de backend.** Nooit in `frontend/`, nooit in `NEXT_PUBLIC_*`.
- [ ] **`TETRA_LICENSE_KEY` nooit in `NEXT_PUBLIC_*`** of in frontend-code. → 🔴
- [ ] **Geen `NPM_TOKEN` of registry-token in de project-`.npmrc`** of ergens anders in git. → 🔴

Database-toegang (de Tetra-specifieke lekken)
- [ ] **Geen eigen Supabase-client.** `createClient(...)` uit `@supabase/supabase-js` in backend- of frontend-code → 🔴. Gebruik `userDB(req)` / `publicDB()` / `adminDB(req)`.
- [ ] **Geen "admin client"-patroon** (`supabaseAdmin`, een eigen client met de service-role key) → 🔴.
- [ ] **`userDB(req)` is de standaard.** Staat er `systemDB(...)` in een gewone gebruikersroute? → 🔴: dat zet RLS uit, waardoor een gebruiker andermans data kan zien. `systemDB` hoort alleen in cron-jobs en webhooks, met een reden als argument.
- [ ] **Rollen in `organization_members`**, niet als kolom op `users_public` of een profieltabel → 🔴 (anders kan een gebruiker zichzelf admin maken).

Routes en auth
- [ ] **Geen eigen Express-app** (`express()`) of eigen `app.listen` naast `createApp()` → 🔴.
- [ ] **Elke route staat in `createApp({ routes })` met het juiste `access`-niveau.** Een route met gebruikersdata als `access: 'public'` → 🔴. Publieke routes horen onder `/api/public/…`.
- [ ] **Geen eigen login, tokencontrole of wachtwoordopslag.** Auth komt van Tetra (`configureAuth`, de publieke auth-routes, `AuthPage`). Een eigen JWT-decode zonder cryptografische verificatie → 🔴.
- [ ] **Input wordt gevalideerd** vóór hij de database raakt — geen rauwe `req.body` in een query.

RLS
- [ ] **Nieuwe tabellen komen bij voorkeur uit een manifest** (dan genereert Tetra de RLS mee). Een tabel met de hand in een migratie → RLS aan (`enable row level security`) en expliciete policies per actie, anders 🔴.
- [ ] **Geen `using (true)` / `with check (true)`** tenzij de data echt openbaar is → 🔴.
- [ ] **Controleer de `permissions` in het manifest** tegen de PRD: mag een `member` echt verwijderen? Staat `scope` op `tenant` waar data per organisatie gescheiden moet zijn?
- [ ] **Een verborgen knop is geen beveiliging.** Staat een recht alleen in de frontend (knop verborgen) maar niet in het manifest of de backend → 🔴.

Algemeen
- [ ] **Geen `console.log` van gevoelige data** (tokens, gebruikersobjecten, request-bodies).
- [ ] **Geen `--force`, `--legacy-peer-deps`, `--no-verify`** in scripts, docs of de PR-omschrijving als "oplossing".

> Twijfel je of iets een secret is? Behandel het als een secret.

---

## 5. Tetra-gebruik (bouwt de cursist om Tetra heen?)

Dit is de gate die in een gewoon project niet bestaat, en hier het meeste oplevert.

- [ ] **Bestond dit al in Tetra?** Kijk bij elke nieuwe component, hook, route, helper of tabel of een Tetra-module het al doet (zie de modulelijst in `PROJECT_SETUP.md §5`, <https://tetrasaas.com> en `docs/tetra/` in het project). Een zelfgebouwde datatabel, loginformulier, uploadcomponent, CRM-tabel, kanban of mailverzending terwijl de Tetra-module bestaat → 🟠 MOET FIXEN.
- [ ] **Eigen code die Tetra overlapt is onderbouwd.** De PR-omschrijving noemt: de behoefte, welke Tetra-mogelijkheid onderzocht is, wat daar concreet aan ontbreekt, en wat er zelf gebouwd is. Ontbreekt die onderbouwing → 🟠.
- [ ] **Geen gegenereerde bestanden met de hand aangepast.** Wijzigingen in `.tetra/generated/` → 🔴: ze verdwijnen bij de volgende compile. De fix hoort in het manifest.
- [ ] **Imports via de officiële subpaden** (`@soulbatical/tetra-ui/feature`, `/auth`, …). Imports uit `…/src/…`, `…/dist/…` of `…/lib/…` → 🟠. Imports via de hoofd-export van `tetra-ui` → 🔵/🟠.
- [ ] **Geen Tetra-code gekopieerd** naar het eigen project ("ik heb die functie even overgenomen en aangepast") → 🟠. Dan mist het project voortaan elke fix die Tetra uitbrengt.
- [ ] **Declaratief waar het kan.** Velden, filters, sortering, rechten en formulieren die in het manifest hadden gekund maar in eigen code staan → 🟠.
- [ ] **Bedrijfslogica naast de gegenereerde laag**, in een eigen module (`backend/src/modules/<feature>/`), niet in het manifest gepropt en niet in gegenereerde files.
- [ ] **Tetra-versies**: pakketten exact gepind (geen `^`), geen `file:`-tarballs of meegecommitte `.tgz`-bestanden.

---

## 6. Correctheid (doet het wat het moet?)

- [ ] De feature doet wat de **PRD** beschrijft — niet iets dat erop lijkt.
- [ ] **Edge cases**: lege input, `null`/`undefined`, 0, een hele lange string, dubbele submit, een gebruiker zonder rechten, een gebruiker van een andere organisatie.
- [ ] **Foutpaden** afgehandeld, via Tetra's foutformaat (`RFC7807ErrorResponse.notFound(res, …)` e.d.), niet met eigen JSON-vormen.
- [ ] **Geen stille `catch (e) {}`.**
- [ ] **Loading-, error- en lege staat** in de UI.
- [ ] **Race conditions**: dubbelklik op "opslaan", twee tabbladen.
- [ ] **Datum/tijd, getallen, geld**: afronding, tijdzones, valuta.
- [ ] **Modules praten goed met elkaar.** Leidt een actie tot de verwachte vervolgstap (bijvoorbeeld: deal gewonnen → taak aangemaakt → activiteit gelogd)? Test het, neem het niet aan.

---

## 7. Manifest en migraties (als de PR het schema raakt)

- [ ] `npm run manifest:check` is groen (geldig, deterministisch, gegenereerde output niet uit de pas).
- [ ] **Veldnamen en tabelnaam** volgen de naamgeving (snake_case, meervoud voor de tabel).
- [ ] **`permissions`** kloppen met de rollen in de PRD, per actie (`list`, `read`, `create`, `update`, `delete`).
- [ ] **`tenantScoped` / `rls`** staan goed: data van één organisatie is niet zichtbaar voor een andere.
- [ ] **Indexen** op velden waarop gefilterd of gesorteerd wordt.
- [ ] **Open vragen** staan als `needsDecision` in het manifest, niet als gok in de code.
- [ ] **Migratie is een nieuwe, vooruit-migratie** (gegenereerd met `tetra manifest migration … --write` of met de hand voor riskante wijzigingen). Een al-gedraaide migratie aangepast → 🔴.
- [ ] Riskante wijzigingen (hernoemen, verwijderen, type wijzigen) zijn met de hand geschreven en **lokaal getest** met `supabase db reset`.

---

## 8. Scope

- [ ] **Eén concern.** Een "en passant"-refactor hoort in een eigen PR.
- [ ] **Samenhangende UI = één integratie-PR.**
- [ ] **Geen ongerelateerde bestanden** (build-output, `.DS_Store`, `.tetra/generated/`, lokale config).
- [ ] **Blast radius klein.**

---

## 9. Tests (testen ze gedrag, of zijn ze alleen "groen"?)

- [ ] **Nieuwe logica → unit test** met een happy path en een foutgeval.
- [ ] **Nieuw endpoint of manifest → API-test**: `401` zonder login, `403` (of geen resultaat) voor de verkeerde rol, `200/201` voor de juiste.
- [ ] **Nieuwe tabel → rechtentest**: gebruiker van organisatie A ziet geen data van organisatie B. Dit test je via de API of de database, niet alleen via de UI.
- [ ] **Nieuwe userflow → browser-e2e** voor cruciale flows: opslaan, herladen, terugvinden.
- [ ] **Bugfix → regressietest** die de bug eerst reproduceert.
- [ ] **Tests testen jouw gedrag, niet Tetra.** Een test die alleen bewijst dat Tetra's CRUD werkt, voegt weinig toe; een test die bewijst dat *jouw* rechten kloppen wel.
- [ ] **`testing/contracts/`** is bijgewerkt als de PR afgedekte code raakt (`npm run check:testing-governance`).

Quality gates (`PROJECT_SETUP.md §17`):

```bash
npm run manifest:check
npm run docs:check
npm run typecheck
npm test
npm run build
```

Draai tests via `npm test`, niet via een runner die je zelf aanneemt. Staat er één rood, dan is de PR niet review-klaar.

---

## 10. Naamgeving (tegen `PROJECT_SETUP.md §8`)

- [ ] Files **kebab-case**, React-componenten **PascalCase**.
- [ ] Variabelen **camelCase**, constanten **UPPER_SNAKE_CASE**.
- [ ] DB-tabellen **snake_case meervoud**, kolommen **snake_case**.
- [ ] Booleans met `is_`/`has_`/`can_`, timestamps `*_at`, foreign keys `<tabel>_id`.
- [ ] Namen vertellen wat iets **is**. Geen `data`, `item`, `temp`, `manager`, `utils` zonder betekenis.

---

## 11. Onderhoudbaarheid en frontend

- [ ] **Feature-based**: eigen code in `backend/src/modules/<feature>/`, schermen bij hun route in `frontend/app/`.
- [ ] **Kleuren via `--tetra-*` tokens**, geen hardgecodeerde kleuren (`bg-red-50`, `#ff0000`) → 🟠.
- [ ] **Login, beveiligde routes, app-shell van Tetra** (`AuthPage`, `ProtectedRoute`, `PortalShell`), niet zelf gebouwd.
- [ ] **Geen duplicatie**, maar ook geen over-abstractie "voor de zekerheid".
- [ ] **Eén ding per functie.** >50 regels is een signaal; bestanden boven ~400 regels zijn een waarschuwing.
- [ ] **Geen dode code**, geen `TODO` zonder uitleg.
- [ ] **Geen `any`, `as any`, `@ts-ignore`, `eslint-disable`** zonder opgeschreven reden.
- [ ] **Geen "tijdelijke" hacks.**
- [ ] **Geraakte code gaat er niet op achteruit** → anders 🟠.

---

## 12. Docs en afronding

- [ ] **`docs/` bijgewerkt**: welke manifests voeden welke schermen, welke eigen code staat ernaast en waarom, welke Tetra-modules zijn in gebruik.
- [ ] **Levend statusblok** in `docs/PRD.md` klopt.
- [ ] **Commits klein en beschrijvend**, geen `wip` of `fix stuff`.
- [ ] **PR-omschrijving** zegt wat, waarom, hoe te testen, en (bij eigen code) waarom Tetra het niet kon.

---

## 13. Tetra-feedback apart houden

Vind je tijdens de review iets dat niet de schuld van de cursist is maar van Tetra zelf — een fout in een pakket, verwarrende of tegenstrijdige documentatie, een ontbrekende functie — zet het dan **niet** tussen de blockers van de cursist, maar in een aparte sectie. Per punt:

- wat je zag (bestand/pakket en versie);
- hoe je het reproduceert;
- wat je verwachtte en wat er gebeurde;
- of het **bewezen** is of nog een **vermoeden**.

Staat een fout in Tetra en heeft de cursist er een tijdelijke omweg omheen gebouwd? Dan is die omweg acceptabel mits hij gedocumenteerd is — het echte probleem hoort bij Tetra gemeld te worden.

---

## 14. Schrijf het eindoordeel — findings-first, op de PR

Kies één verdict:
- ✅ **APPROVE** — geen blockers, hooguit nits.
- 🔄 **REQUEST CHANGES** — minstens één 🔴 of 🟠.
- 💬 **COMMENT** — vragen/opmerkingen, geen duidelijk ja/nee.

Sjabloon:

```markdown
## Review PR #<nummer> — <APPROVE / REQUEST CHANGES / COMMENT>

**Samenvatting:** <1-3 zinnen: wat doet deze PR, doet hij wat de PRD vroeg?>

**Tetra-gebruik:** <welke modules/manifests zijn gebruikt, welke eigen code staat ernaast en is die onderbouwd?>

### 🔴 Blockers
- `backend/src/modules/projects/routes.ts:18` — gebruikt `systemDB()` in een gewone gebruikersroute; daarmee staat RLS uit en ziet elke gebruiker alle projecten. Vervang door `userDB(req)` en voeg een test toe dat organisatie A de projecten van B niet ziet.
- `.tetra/generated/projects/feature-config.json` — met de hand aangepast; verdwijnt bij de volgende compile. Zet de wijziging in `manifests/projects.json`.

### 🟠 Moet fixen
- `frontend/app/(app)/klanten/klanten-table.tsx` — eigen tabel met zoeken en sorteren; `FeatureCrudPage` uit `tetra-ui/feature` doet dit al. Gebruik die, of onderbouw waarom niet.

### 🔵 Nits (optioneel)
- `frontend/app/(app)/klanten/page.tsx:12` — `bg-red-50` → Tetra-token.

### 🧩 Tetra-feedback (geen fout van de cursist)
- <pakket + versie> — <wat, reproductie, verwacht vs. werkelijk, bewezen/vermoeden>

### ✅ Wat goed is
- Rechten in het manifest kloppen met de PRD, inclusief een test voor de `member`-rol.

**Conclusie:** REQUEST CHANGES — fix de 2 blockers en vervang de eigen tabel, dan opnieuw aanbieden.
```

Geen findings? Zeg het expliciet, met het rest-risico. Een lege "ziet er goed uit" is geen review.

---

## 15. Koppel terug aan de cursist en begeleid de fixes

- **Vat de uitkomst samen in gewone taal.** Bijvoorbeeld: *"Twee dingen moeten eerst: (1) je projectenlijst laat nu iedereen alle projecten zien, ook van andere bedrijven; (2) je hebt een bestand aangepast dat Tetra zelf opnieuw maakt, dus die wijziging raak je kwijt. De rest is goed. Ik help je ze één voor één op te lossen."*
- **Prioriteer**: eerst 🔴, dan 🟠, nits optioneel.
- **Loods door de fixes.** Bij een Tetra-omweg: laat zien welke module of welk manifest-veld het al doet.
- **Herhaal de review op de nieuwe staat.**
- **Bewaak de afronding**: de cursist heeft het zelf getest in de browser, daarna gemerged, gedeployed én met eigen ogen op de live-URL gezien.

---

## 16. Wat je NIET doet

- **Geen merge zonder zichtbare review.**
- **Geen merge op groene CI alleen.**
- **Geen smaak-bevindingen.** "Ik had het anders gedaan" is geen blocker.
- **Niet de cursist overrulen op een veiligheidsregel** omdat hij haast heeft.
- **Geen verzonnen problemen.**
- **Een Tetra-beperking niet afrekenen op de cursist.** Onderbouwde eigen code is geen fout.
- **Niet stilletjes alles zelf herbouwen.**

---

## 17. De review-checklist in het kort

```
VEILIGHEID   □ geen secrets/.env/licentie/NPM_TOKEN in diff  □ service-role alleen backend
             □ geen eigen createClient / supabaseAdmin        □ userDB(req) i.p.v. systemDB
             □ routes in createApp met juist access-niveau    □ rollen in organization_members
             □ RLS aan + echte policies / uit manifest        □ verborgen knop ≠ beveiliging
TETRA        □ bestond het al in Tetra?  □ eigen code onderbouwd  □ .tetra/generated onaangeroerd
             □ imports via subpaden      □ geen Tetra-code gekopieerd  □ versies exact gepind
CORRECTHEID  □ doet wat PRD vroeg  □ edge cases  □ foutpaden (RFC7807)  □ modules verbonden
MANIFEST     □ manifest:check groen  □ permissions per actie  □ tenant-scope  □ vooruit-migratie
SCOPE        □ één concern  □ geen sluip-refactor  □ geen rommel in diff
TESTS        □ unit bij logica  □ API bij endpoint  □ rechten/tenant-test bij tabel
             □ manifest:check · docs:check · typecheck · test · build groen
NAAMGEVING   □ conventies uit PROJECT_SETUP §8
ONDERHOUD    □ feature-based  □ --tetra-* tokens  □ geen any/@ts-ignore  □ geen dode code
DOCS         □ docs/ + statusblok bij  □ commits klein
OORDEEL      □ verdict gekozen  □ findings-first  □ Tetra-feedback apart  □ zichtbaar op de PR
TERUGKOPPEL  □ in gewone taal  □ door fixes geloodst  □ afronding bewaakt
```

> Drie dingen die je nooit vergeet: één 🔴 = niet mergen · een review die niet op de PR staat = geen review · groene CI ≠ veilig & correct. En voor Tetra: **de meeste lekken zitten niet in Tetra, maar in de code die ernaast is geschreven.**
