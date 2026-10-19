# Opdracht CRM — gevorderd (Tetra verkennen en testen)

Voor gevorderden en voor wie Tetra grondig wil testen. Begin je net? Doe dan eerst `OPDRACHT_CRM.md`.

Geef deze opdracht samen met `PROJECT_SETUP.md` en `CODE_REVIEW.md` (Tetra-versie) aan je AI-assistent. Volg daarbij werkproces 1 en 2 uit Deel 3 van `PROJECT_SETUP.md`. Gebruik `npx tetra blocks` en `npx tetra how` om het aanbod van Tetra te inventariseren.

1. Kijk op <https://tetrasaas.com> en onderzoek het Tetra-model: Tetra als SaaS-framework voor onder andere auth, RLS, CRM, pipeline, planner en manifests.
2. Bedenk 10 CRM-systemen voor 10 verschillende typen bedrijven waarmee zij hun bedrijf prettig en efficiënt kunnen runnen.
3. Gebruik zoveel mogelijk Tetra en programmeer zelf zo min mogelijk.
4. Verzamel tijdens het hele proces feedback op Tetra.
5. Bouw 1 app voor 1 bedrijf — het beste idee van die tien — met minimaal 15 Tetra-modules. Maak er een complete, complexe en samenhangende applicatie van.
6. Zorg dat alles volledig werkt en goed met elkaar verbonden is. Verzamel feedback voor Tetra, zodat het framework nog beter en handiger kan worden.
7. Probeer Tetra maximaal te gebruiken. Onderzoek de beperkingen, mogelijke onveiligheden, sterke punten en mogelijkheden. Ontdek zoveel mogelijk van Tetra en zet dat daadwerkelijk in.
8. Onderzoek van A tot Z iedere beschikbare functionaliteit van Tetra en bepaal welke onderdelen je kunt inzetten om optimaal gebruik te maken van het framework.
9. Sla je testmappen op in `~/tests`. Gebruik een duidelijke en consistente naamgeving en nummering waarin minimaal het gebruikte taalmodel en de gebruikte Tetra-versie staan, bijvoorbeeld:

   ```
   ~/tests/001_claude-opus-5.5_tetra-core-0.21.24_crm-schildersbedrijf/
   ~/tests/002_claude-opus-5.5_tetra-core-0.21.24_crm-schildersbedrijf/
   ```

Succes!

---

## Aanvullende eisen: maximaal Tetra, aantoonbaar werkend

Deze eisen zijn aanvullingen op de oorspronkelijke opdracht, geen vervanging daarvan.

### 1. Gebruik Tetra voor zowel frontend als backend

- Tetra is het uitgangspunt voor de hele applicatie, inclusief de zichtbare frontend.
- Inventariseer vóór het bouwen de beschikbare modules, frontendcomponenten, standaardpagina's, formulieren, navigatie, manifests, authenticatie, rechten, RLS en integraties.
- Gebruik de website, documentatie, beschikbare broncode en werkende voorbeelden om vast te stellen wat Tetra daadwerkelijk ondersteunt in de gebruikte versie.
- Leg per functionaliteit vast wat beschikbaar is, wat je hebt onderzocht en getest, of je het gebruikt en waarom. Maak ook zichtbaar wat nog niet is onderzocht.
- Onderzoek het volledige beschikbare aanbod. Gebruik zoveel mogelijk relevante functionaliteit zonder onderdelen toe te voegen die geen doel dienen binnen de gekozen applicatie.

### 2. Koppel bedrijfsprocessen en schermen aan Tetra

- Werk eerst de tien CRM-concepten uit en onderbouw vervolgens de keuze voor het beste idee.
- Beschrijf voor het gekozen bedrijf welke processen, gebruikers, rollen, gegevens en werkzaamheden de CRM-applicatie moet ondersteunen.
- Koppel ieder bedrijfsproces, ieder scherm en iedere benodigde backendfunctie aan bestaande Tetra-functionaliteit.
- Gebruik eerst standaardfunctionaliteit, configuratie en manifests van Tetra.
- Onderzoek ook voor dashboard, navigatie, tabellen, formulieren, planning en dossiers welke Tetra-frontendcomponenten je kunt hergebruiken voordat je deze zelf bouwt.

### 3. Maatwerk is een onderbouwde uitzondering

- Bouw alleen maatwerk wanneer je met documentatie, broncode of een reproduceerbare test kunt aantonen dat Tetra de benodigde functie niet ondersteunt of onvoldoende ondersteunt.
- Leg per uitzondering vast:
  - de bedrijfsbehoefte;
  - de onderzochte Tetra-mogelijkheid;
  - de concrete beperking;
  - de noodzakelijke eigen code;
  - de gewenste verbetering aan Tetra.
- Meld een ontbrekende Tetra-functie als feedback; verberg die beperking niet achter eigen code.
- Verwijder overbodig maatwerk zodra een beschikbare Tetra-oplossing dezelfde behoefte aantoonbaar afdekt en test vervolgens de vervanging.

### 4. Minimaal 15 daadwerkelijk gebruikte modules

- Integreer minimaal 15 Tetra-modules in werkende gebruikersprocessen en verbind ze met elkaar.
- Alleen een pakket installeren, importeren of één losse hulpfunctie gebruiken telt niet als volledige module-integratie.
- Lever per module bewijs van het gebruik:
  - doel;
  - betrokken proces of scherm;
  - verbinding met andere modules;
  - testresultaat.
- Rapporteer eerlijk wanneer het beschikbare aanbod of de bedrijfsbehoefte het minimum niet ondersteunt. Tel hulpfuncties of ongebruikte pakketten niet kunstmatig mee.

### 5. Test de volledige applicatie

- Test complete gebruikersprocessen van begin tot eind in de browser, inclusief opslaan, opnieuw laden en terugvinden van gegevens.
- Test dat modules onderling de juiste gegevens uitwisselen en dat acties de verwachte vervolgstappen veroorzaken.
- Test positieve en negatieve scenario's: geldige acties moeten slagen en ongeldige of onbevoegde acties moeten worden afgewezen.
- Test authenticatie, rollen, rechten, tenantisolatie en RLS ook via API- en databasecontroles waar relevant. Alleen een verborgen knop is geen toegangsbeveiliging.
- Voer beveiligingstests uitsluitend uit op eigen, geïsoleerde testomgevingen met synthetische gegevens en binnen de toegestane scope.
- Leg testresultaten en reproduceerbaar bewijs vast in de correct genummerde testmap, samen met het gebruikte taalmodel en de exacte Tetra-pakketversies.
- Open en controleer de werkende applicatie zelf voordat je haar oplevert.

### 6. Verzamel bruikbare feedback voor Tetra

- Beschrijf zowel sterke punten als beperkingen, onveiligheden, ontbrekende functies en verbeteringen in gebruiksgemak.
- Scheid:
  - bewezen frameworkbugs;
  - wensen voor het framework;
  - fouten in de eigen app;
  - ontbrekende informatie, data of externe toegangen.
- Geef per bevinding:
  - prioriteit;
  - getroffen versie;
  - getroffen onderdeel;
  - reproductiestappen;
  - verwacht gedrag;
  - werkelijk gedrag;
  - bewijs;
  - acceptatiecriteria voor een oplossing.
- Maak duidelijk welke bevindingen bewezen zijn en welke nog een hypothese zijn.
- Leg bij opgeloste problemen vast welke versie de oplossing bevat en of die oplossing in deze app opnieuw is getest.

### 7. Lever controleerbaar op

- Lever de tien CRM-concepten en de onderbouwing van de gekozen app op.
- Lever de complete, complexe en samenhangende applicatie op die de processen van het gekozen bedrijf afdekt. Voeg geen complexiteit toe uitsluitend om een moduleaantal te halen.
- Lever een overzicht per scherm van:
  - gebruikte Tetra-componenten;
  - eigen code;
  - onderbouwing waarom die eigen code noodzakelijk is.
- Doe hetzelfde voor de backend.
- Lever daarnaast op:
  - de volledige Tetra-functionaliteiteninventaris;
  - de modulematrix;
  - de testresultaten;
  - de verzamelde Tetra-feedback.
- Vermeld:
  - de projectmap;
  - startinstructies;
  - werkende lokale URL;
  - gebruikt taalmodel;
  - exacte gebruikte Tetra-versies en pakketversies.
- Noem de app alleen volledig werkend als de afgesproken bedrijfsprocessen aantoonbaar werken.
- Maak expliciet welke koppelingen:
  - daadwerkelijk werken;
  - gesimuleerd zijn;
  - nog afhankelijk zijn van ontbrekende gegevens, externe toegangen of besluiten.
- Maak duidelijk onderscheid tussen:
  - een werkende testapplicatie;
  - een applicatie die technisch productierijp is;
  - een applicatie die daadwerkelijk klaar is voor gebruik door een bedrijf.
