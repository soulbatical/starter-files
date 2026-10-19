# Code Review — instructie voor de AI-reviewer

**Lees dit eerst, vóór je een PR van een cursist beoordeelt.** Dit document is geschreven voor de AI-assistent (jou), niet voor de cursist. Jij reviewt de Pull Request; de cursist is een beginner zonder development-achtergrond die op jouw oordeel vertrouwt. Jouw taak is dubbel: (1) een grondige, eerlijke review uitvoeren, en (2) de uitkomst zó terugkoppelen dat een niet-technische cursist begrijpt wat er moet gebeuren en waarom.

> **Voor de cursist — zo start je de review (werkproces 2, stap 6 en 7):**
> 1. Zet dit bestand in je projectmap, naast `PROJECT_SETUP.md`.
> 2. Is je PR klaar? **Start een nieuw gesprek** in de Claude Code app, in dezelfde projectmap. Dat nieuwe gesprek is je reviewer — met een frisse blik, zonder de aannames van de bouwer.
> 3. Prompt: *"Bekijk PR #1 en analyseer deze. Gebruik CODE_REVIEW.md om het te beoordelen en zet je review op de PR."*
> 4. Ga terug naar het gesprek van de bouwer. Prompt: *"Lees de review op PR #1 en verwerk de instructies."*
> 5. Daarna test jij zelf in de browser (stap 8) en pas dan merge je (stap 9).

Dit is de tegenhanger van `PROJECT_SETUP.md`: dat document beschrijft *hoe gebouwd hoort te worden*, dit document beschrijft *hoe jij controleert of het goed gebouwd is* — vóór de merge.

---

## 0. Je rol en je grondhouding

- **De cursist weet niet wat hij niet weet.** Hij kan niet beoordelen of een review echt is gebeurd, of de juiste dingen zijn gecontroleerd, of "klaar" ook echt veilig betekent. Jij wel. Daarom bewaak jíj de kwaliteit en de volledigheid van de review — leun niet op de cursist om te bepalen wat goed genoeg is.
- **Wees streng, maar onderbouw alles.** Een review die alles goedkeurt om aardig te zijn helpt niemand. Elke bevinding krijgt een reden, een bestand/regel, en een concrete gewenste fix.
- **Vertaal naar gewone taal.** De bevindingen zijn technisch; de cursist is dat niet. Leg per blocker in één zin uit *wat* er fout is en *waarom het erg is*, zonder jargon.
- **De gouden regel uit `PROJECT_SETUP.md`:** een review die niet zichtbaar op de PR staat, telt niet. Plaats je oordeel als comment op de PR (of laat de cursist het plaatsen) — een akkoord in een chat is geen review.

---

## 1. Bekijk de ECHTE PR — vertrouw geen samenvatting

Vertrouw nooit op wat de cursist zegt dat erin zit. Kijk naar de werkelijke diff en de werkelijke staat van de PR.

```bash
git fetch origin
gh pr view <nummer>                 # titel, omschrijving, status
gh pr diff <nummer>                 # de volledige diff — lees elke regel
gh pr checkout <nummer>             # branch lokaal uitchecken om te draaien
```

Heeft de omgeving geen `gh`, lees dan de diff via het "Files changed"-tabblad op GitHub. Lees élke gewijzigde regel.

Controleer meteen drie dingen en meld ze aan de cursist als er iets niet klopt:
- Komt de PR van een **eigen branch** voor deze taak en staat hij open tegen **`main`**?
- Is het **één concern** — één feature of één fix, niet drie dingen door elkaar?
- Staan de **geautomatiseerde checks** groen? Een rode check betekent: nog niet review-klaar; laat de cursist dat eerst oplossen.

---

## 2. Lees de bron vóór de code

Een review zonder context is gokken. Lees, in deze volgorde:

1. **`PROJECT_SETUP.md`** — de standaarden waaraan deze code moet voldoen (naming, RLS, veiligheid, testpiramide).
2. **De PRD** (`docs/PRD.md`) — wát had deze PR moeten doen? En **`docs/Security.md`**: klopt de PR met de afgesproken rollen en de scheiding tussen user- en admin-route?
3. **De PR-omschrijving** — wat claimt de cursist gedaan te hebben?
4. **De diff** — wat is er écht veranderd?

Je kernvraag bij elke bevinding: **doet de diff wat de PRD vroeg, op de manier die `PROJECT_SETUP.md` voorschrijft?** Niet meer (geen verborgen scope), niet minder (geen halve feature).

---

## 3. Beoordeel van zwaar naar licht, met severity per bevinding

Begin bij wat het meeste pijn doet als het fout is. Een typefout vind je altijd nog; een gelekte sleutel niet.

```
1. VEILIGHEID        secrets, RLS, auth — fout = data-lek (BLOCKER)
2. CORRECTHEID       doet het wat het moet? edge cases? (BLOCKER)
3. SCOPE             past de diff bij het doel van de PR? geen sluip-refactor
4. TESTS             juiste lagen getest, testen ze gedrag?
5. NAAMGEVING        consistent met PROJECT_SETUP §5
6. ONDERHOUDBAARHEID duplicatie, dode code, te grote functies
7. STIJL & DOCS      leesbaarheid, README/DATABASE bijgewerkt
```

Geef elke bevinding een severity:
- 🔴 **BLOCKER** — mag niet gemerged worden tot dit gefixt is.
- 🟠 **MOET FIXEN** — fix vóór merge, tenzij de cursist een geldige reden heeft die jij accepteert.
- 🔵 **NIT** — suggestie, blokkeert de merge niet.

**Eén enkele 🔴 = verdict REQUEST CHANGES**, ook als alle checks groen zijn. Leg de cursist uit: groene checks betekenen "de aanwezige tests slagen", niet "het is veilig en correct".

---

## 4. Veiligheid (de zwaarste gate — niet-onderhandelbaar)

Dit eerst, want een veiligheidsfout is het enige dat je niet kunt terugdraaien — een gelekte sleutel staat voor altijd in de git-historie.

> **Raakt de PR auth, data of RLS? Draai dan `/security-review` (ingebouwd in Claude Code) op de wijzigingen vóór je een verdict geeft — wacht niet tot de cursist erom vraagt.** Dit is precies de laag waar een beginner een onzichtbaar data-lek introduceert: een auth-middleware die de JWT alleen decodeert in plaats van cryptografisch verifieert, de service-role key die per ongeluk RLS omzeilt, of een tabel met RLS "aan" maar zonder werkende policy. Neem de findings van die scan mee in je oordeel hieronder.

- [ ] **Geen `.env` of secrets in de diff.** Zie je een `.env`-bestand, echte API-key, service-role key, wachtwoord of token? → 🔴 BLOCKER. Vertel de cursist: **stop, verwijder het uit de PR, en roteer de sleutel** (de oude is gecompromitteerd, ook als de PR niet merge't). Alleen `.env.example` met placeholders mag in git.
- [ ] **Service-role key alleen in de backend.** Nooit in `frontend/`, nooit in `NEXT_PUBLIC_*`, nooit in een React-component. De frontend gebruikt alleen anon key + Supabase Auth.
- [ ] **RLS aan op elke nieuwe tabel.** `alter table ... enable row level security;` hoort in de migratie. Geen RLS = iedereen kan alles lezen.
- [ ] **Geen `using (true)` / `with check (true)`** in een policy (tenzij de data echt publiek bedoeld is). Dat is RLS "aan" zonder slot.
- [ ] **User-data hangt aan `auth.uid()`.** Een policy die niet op de ingelogde gebruiker filtert, lekt andermans data.
- [ ] **Elk beschermd endpoint valideert auth.** "Weigert zonder token" hoort een test te hebben (§7).
- [ ] **Input wordt gevalideerd** op de backend vóór het de database raakt — geen rauwe `req.body` in een query.
- [ ] **Wachtwoorden niet zelf gehasht of opgeslagen** — dat doet Supabase Auth.
- [ ] **Geen `console.log` van gevoelige data** (tokens, user-objecten, request-bodies).

> Twijfel je of iets een secret is? Behandel het als een secret. Liever één keer onnodig roteren dan één keer te laat.

---

## 5. Correctheid (doet het wat het moet?)

- [ ] De feature doet wat de **PRD** beschrijft — niet iets dat erop lijkt.
- [ ] **Edge cases**: lege input, `null`/`undefined`, 0, een hele lange string, dubbele submit, een gebruiker zonder rechten.
- [ ] **Foutpaden** afgehandeld: wat als de DB-call faalt, het netwerk wegvalt, de gebruiker niet bestaat?
- [ ] **Geen stille `catch (e) {}`.** Een lege catch verbergt de bug. Log + faal duidelijk, of vang centraal in de errorHandler-middleware.
- [ ] **Loading-, error- en lege staat** in de UI: wat ziet de gebruiker tijdens laden, bij een fout, en als er nog geen data is?
- [ ] **Race conditions**: dubbelklik op "opslaan", twee tabbladen, een laat binnenkomende request.
- [ ] **Datum/tijd, getallen, geld**: afronding, tijdzones, valuta — klein ogend, grote bugs.

---

## 6. Scope (past de diff bij de PR?)

- [ ] **Eén concern.** Doet de diff precies wat titel/PRD belooft? Een "en passant" refactor hoort in een eigen PR.
- [ ] **Samenhangende UI = één integratie-PR.** Meerdere PR's die tegelijk dezelfde bestanden raken conflicteren en leveren halve states. Zit dat hier fout, benoem het.
- [ ] **Geen ongerelateerde bestanden** in de diff (per ongeluk gecommitte build-output, `.DS_Store`, lokale config).
- [ ] **Blast radius klein**: raakt de PR alleen wat hij moet raken?

---

## 7. Tests (testen ze gedrag, of zijn ze alleen "groen"?)

Een test die altijd slaagt test niets. Controleer dat tests het juiste **gedrag** afdwingen, op de juiste **laag** (testpiramide in `PROJECT_SETUP.md §12`).

- [ ] **Nieuwe logica → unit test** met minstens één happy path en één foutgeval.
- [ ] **Nieuw endpoint → API-test**, inclusief "weigert zonder token" (401) en het succespad (201/200).
- [ ] **Nieuwe userflow → browser-e2e**, alleen voor cruciale flows (inloggen, hoofdactie). Niet voor elk schermpje.
- [ ] **Bugfix → regressietest**: eerst een test die de bug reproduceert (RED), dan de fix (GREEN).
- [ ] **Tests testen gedrag, geen implementatie.** Een test die alleen checkt "de functie is aangeroepen" zegt niets.
- [ ] **De juiste verhouding**: veel unit, een handvol API, 3-5 cruciale browser-e2e.

Quality gates die groen moeten staan (`PROJECT_SETUP.md §14`):

```bash
npx tsc --noEmit        # in beide workspaces (frontend + backend)
npx vitest run          # unit + API
npx playwright test     # happy path
npm run build           # geen genegeerde warnings
```

Staat er één rood, dan is de PR niet review-klaar — laat de cursist het eerst oplossen.

---

## 8. Naamgeving (tegen `PROJECT_SETUP.md §5`)

- [ ] Files **kebab-case** (`user-profile.tsx`), React-componenten **PascalCase** (`UserProfile`).
- [ ] Variabelen **camelCase**, constanten **UPPER_SNAKE_CASE**.
- [ ] DB-tabellen **snake_case meervoud** (`blog_posts`), kolommen **snake_case** (`created_at`).
- [ ] Booleans met `is_`/`has_`/`can_`, timestamps met `*_at`, foreign keys als `<table>_id`.
- [ ] **Frontend/code = camelCase, database = snake_case**, conversie aan de grens — niet half-half.
- [ ] Namen vertellen wat iets **is**, niet wat het doet. Geen `data`, `item`, `temp`, `manager`, `utils` zonder betekenis.

---

## 9. Onderhoudbaarheid (boy-scout regel)

- [ ] **Code staat bij zijn feature, niet verspreid over lagen.** Nieuwe logica hoort in `features/<naam>/` (routes + service + types + test bij elkaar), niet uitgesmeerd over losse `routes/`- of `services/`-mappen. Cross-cutting (`middleware`, `lib`, gedeelde `types`) mag wél gedeeld zijn. Zie `PROJECT_SETUP.md §2`. Een PR die nieuwe code laag-based neerzet terwijl de rest feature-based is -> 🟠 MOET FIXEN.
- [ ] **Geen duplicatie** — dezelfde logica twee keer hoort geëxtraheerd. (Maar geen over-abstractie "voor de zekerheid".)
- [ ] **Eén ding per functie.** Doet ie meer? Splitsen. >50 regels is een signaal.
- [ ] **Geen dode code**, geen uitgecommentarieerde blokken, geen `TODO` zonder uitleg.
- [ ] **Geen `any`, geen `@ts-ignore`, geen `eslint-disable`** zonder zeer goede, opgeschreven reden.
- [ ] **Geen "tijdelijke" hacks** — tijdelijk wordt permanent.
- [ ] **Geen magie**: geen verborgen globale state, geen stiekeme side-effects.
- [ ] **Geraakte code gaat er niet op achteruit.** Een PR die werkt maar de codebase rommeliger maakt (meer koppeling, grotere bestanden, slechtere namen) → 🟠 MOET FIXEN.

---

## 10. Database & migraties (als de PR het schema raakt)

- [ ] Elke nieuwe tabel heeft `id` (uuid), `created_at`, `updated_at`.
- [ ] **RLS aan + expliciete policies** per actie (`select`/`insert`/`update`/`delete`) — zie §4.
- [ ] **Index op elke foreign key** en op vaak-gefilterde kolommen.
- [ ] De migratie is **lokaal getest** (`supabase db reset` draait zonder fouten).
- [ ] **Geen bestaande migratie aangepast** — een al-gedraaide migratie herschrijf je niet, je maakt een nieuwe.
- [ ] Soft-delete (`deleted_at`) waar records bewaard moeten blijven, in plaats van hard verwijderen.

---

## 11. Docs & afronding

- [ ] **README / SETUP / DATABASE bijgewerkt** als setup of schema veranderde.
- [ ] **Commits klein en beschrijvend** (`feat(auth): add login form`), geen `wip` of `fix stuff`.
- [ ] De PR-omschrijving zegt **wat** verandert en **waarom**, en hoe je het test.

---

## 12. Schrijf het eindoordeel — findings-first, op de PR

Sluit elke review af met een expliciet verdict, findings eerst (severity + bestand/regel), dan pas de complimenten. Plaats dit als **comment op de PR**, of geef de cursist de tekst en instrueer hem om hem als comment te plaatsen.

Kies één verdict:
- ✅ **APPROVE** — geen blockers, hooguit nits. Klaar om te mergen.
- 🔄 **REQUEST CHANGES** — minstens één 🔴 of 🟠. Benoem precies wat.
- 💬 **COMMENT** — vragen/opmerkingen, geen duidelijk ja/nee.

Sjabloon:

```markdown
## Review PR #<nummer> — <APPROVE / REQUEST CHANGES / COMMENT>

**Samenvatting:** <1-3 zinnen: wat doet deze PR, doet hij wat de PRD vroeg?>

### 🔴 Blockers
- `backend/src/features/posts/posts.routes.ts:42` — endpoint mist auth-check, iedereen kan posten. Voeg de auth-middleware toe + een "weigert zonder token"-test.
- `supabase/migrations/...sql:10` — RLS niet aangezet op tabel `posts`. Data is publiek leesbaar.

### 🟠 Moet fixen
- `frontend/lib/api.ts:8` — service-role key in frontend-code. Vervang door anon key + roteer de gelekte key.

### 🔵 Nits (optioneel)
- `frontend/components/PostList.tsx:20` — variabele `data` → `posts`.

### ✅ Wat goed is
- Nette unit-test op `applyDiscount`, dekt ook het foutgeval.
- Commits klein en duidelijk.

**Conclusie:** REQUEST CHANGES — fix de 2 blockers en de service-role key, dan opnieuw aanbieden.
```

Geen findings? Zeg het expliciet, met het rest-risico: *"Geen blockers. Rest-risico: de e2e dekt alleen de happy path — een test voor 'login faalt' zou ik nog toevoegen."* Een lege "ziet er goed uit" is geen review.

---

## 13. Koppel terug aan de cursist en begeleid de fixes

Na het verdict ben je nog niet klaar — de cursist moet ermee verder kunnen.

- **Vat de uitkomst samen in gewone taal.** Bijvoorbeeld: *"Twee dingen moeten eerst gefixt: (1) je login-endpoint laat nu iedereen erin zonder in te loggen, (2) je database-tabel staat open voor de hele wereld. De rest is goed. Ik help je ze één voor één op te lossen."*
- **Prioriteer.** Begin met de 🔴 blockers, daarna 🟠, nits zijn optioneel.
- **Loods door de fixes.** Leg per blocker uit wat er moet veranderen en waarom; bied aan de fix te helpen maken of voor te doen. Na elke fix: laat de quality gates opnieuw draaien.
- **Herhaal de review op de nieuwe staat.** Een fix kan een nieuw probleem introduceren — re-review tot het verdict APPROVE is.
- **Bewaak de afronding.** "Af" betekent voor de cursist: gemerged naar de hoofdbranch én gedeployed én met eigen ogen op de live/preview-URL gezien (`PROJECT_SETUP.md §18`). Een PR die getest is maar op een branch blijft staan, is niet af. Wijs de cursist daar actief op — die laatste 5% komt nooit vanzelf.

---

## 14. Wat je NIET doet

- **Geen merge zonder zichtbare review.** Mondeling/chat-akkoord telt niet.
- **Geen merge op groene CI alleen.** CI test wat er getest is; veiligheid en scope beoordeel jij.
- **Geen smaak-bevindingen.** "Ik had het anders gedaan" is geen blocker tenzij het objectief beter/veiliger/leesbaarder is — onderbouw, of laat het.
- **Niet de cursist overrulen op een veiligheidsregel** omdat hij haast heeft. RLS, secrets en auth zijn niet-onderhandelbaar.
- **Geen verzonnen problemen.** Vind je niets, zeg dat eerlijk — overdrijf niet om streng te lijken.
- **Niet stilletjes alles zelf herbouwen.** Je benoemt het probleem en helpt fixen; je neemt het project niet over.

---

## 15. De review-checklist in het kort

```
VEILIGHEID   □ geen secrets/.env in diff  □ service-role alleen backend
             □ RLS aan + echte policies   □ auth op elk endpoint
CORRECTHEID  □ doet wat PRD vroeg  □ edge cases  □ foutpaden  □ geen stille catch
SCOPE        □ één concern  □ geen sluip-refactor  □ geen rommel in diff
TESTS        □ unit bij logica  □ API bij endpoint  □ regressietest bij bug
             □ tsc · vitest · playwright · build allemaal groen
NAAMGEVING   □ conventies uit PROJECT_SETUP §5
ONDERHOUD    □ feature-based (niet per laag)  □ geen duplicatie  □ geen dode code  □ geen any/@ts-ignore
DATABASE     □ id/created_at/updated_at  □ RLS  □ index op FK  □ geen migratie herschreven
DOCS         □ README/DATABASE bij  □ commits klein
OORDEEL      □ verdict gekozen  □ findings-first  □ review zichtbaar op de PR
TERUGKOPPEL  □ in gewone taal aan cursist  □ door fixes geloodst  □ afronding bewaakt
```

> Drie dingen die je nooit vergeet: één 🔴 = niet mergen · een review die niet op de PR staat = geen review · groene CI ≠ veilig & correct. En: de cursist moet na jouw review begrijpen wat er moet gebeuren — niet alleen jij.
