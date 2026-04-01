# Nihongo App — Architektur & Dokumentation

## Projektübersicht

PWA zum Japanisch-Lernen mit Karteikarten, Spaced Repetition, Grammatik-Lektionen und Audio-Playlist.
Gehostet auf GitHub Pages unter `nihongo.fadory.de`.

**Tech-Stack:** Vanilla JS (ES6, IIFE-Module), CSS Custom Properties, Service Worker, localStorage. Kein Build-Step.

---

## Dateistruktur

```
nihongo/
├── index.html                  # Einzige HTML-Seite (Single Page App)
├── manifest.json               # PWA-Manifest
├── CNAME                       # Domain: nihongo.fadory.de
├── sw.js                       # Service Worker (Cache-First, Version bumpen bei Änderungen!)
├── css/
│   └── style.css               # Gesamtes Styling + Dark Mode + Responsive
├── js/
│   ├── app.js                  # Haupt-App: Routing, Views, UI-Logik (~1800 Zeilen)
│   ├── storage.js              # localStorage-Verwaltung + Datenmigration
│   ├── flashcard.js            # Karteikarten-Engine + Spaced Repetition
│   ├── stats.js                # Statistik-Berechnungen
│   ├── speech.js               # Text-to-Speech (Web Speech API)
│   └── playlist.js             # Audio-Player für Grammatik
├── data/
│   ├── hiragana.js             # Hiragana-Karten (vorwärts + rückwärts)
│   ├── katakana.js             # Katakana-Karten
│   ├── kanji.js                # Kanji JLPT N5
│   ├── vocabulary.js           # Vokabeln (Familie, Adjektive, Verben, etc.)
│   ├── numbers.js              # Zahlen + Zählwörter
│   ├── dates.js                # Datum (Wochentage, Monate, Tage, etc.)
│   ├── times.js                # Uhrzeiten
│   ├── particles.js            # Partikeln
│   ├── greetings.js            # Floskeln
│   ├── lessons.js              # Lektions-Vokabeln (Lektion 1-20)
│   └── grammar.js              # Grammatik-Erklärungen (HTML-Inhalte)
├── audio/grammar/
│   ├── podcast.m4a             # Gesamtpodcast (Lektion 1-20)
│   └── lesson2.m4a - lesson20.m4a  # Einzel-Audios pro Lektion
└── icons/                      # App-Icons (PWA, Favicon)
```

---

## Modul-Architektur

**Ladereihenfolge in index.html:**
```
Data-Dateien → storage.js → flashcard.js → speech.js → stats.js → grammar.js → playlist.js → app.js
```

**Abhängigkeiten:**
```
App (Routing, UI, alles zusammen)
 ├── Storage      (localStorage lesen/schreiben)
 ├── Flashcard    (nutzt Storage für Fortschritt)
 ├── Stats        (nutzt Flashcard + Storage)
 ├── Speech       (eigenständig, Web Speech API)
 └── Playlist     (eigenständig, HTML Audio)
```

### storage.js — Datenpersistenz
- **localStorage-Keys:**
  - `nihongo_progress` — Fortschritt pro Karte (nextReview, interval, lastRating, lastReview)
  - `nihongo_session` — Heutige Sitzung (date, reviewed, again, easy)
  - `nihongo_history` — Tageshistorie für Statistiken
  - `nihongo_daily_goal` — Tagesziel (Standard: 20)
  - `nihongo_data_version` — Migrationsversion (aktuell: 3)
  - `nihongo_theme` — "light" oder "dark"
  - `nihongo_romaji_visible` — Romaji-Toggle in Listen
- **Migration:** `_migrate()` läuft bei jedem Seitenaufruf, prüft Version und migriert Daten
  - v1→v2: correct/wrong → again/hard/good/easy
  - v2→v3: 4-Button → 2-Button (hard→again, good→easy)
- **Export/Import:** JSON mit progress + history + dailyGoal

### flashcard.js — Karteikarten-Engine
- **INTERVALS:** `again` = 1 Stunde, `easy` = 21 Tage
- **getDueCards(category, sub):** Filtert fällige Karten, shufflet, sortiert "again"-Karten nach vorne
- **rateCard(cardId, rating):** Berechnet nextReview, speichert in Storage
- **checkAnswer(input, expected, alts):** Normalisiert (Umlaute, Whitespace, Case), vergleicht mit Alternativen
- **getNochmalCards():** Nur Karten mit lastRating === 'again'

### app.js — Haupt-App (~1800 Zeilen)
- **Routing:** Hash-basiert (`window.location.hash`), `handleRoute()` dispatcht zu View-Funktionen
- **Views:** Dashboard, Subcategory, Flashcard, List, Grammar-Text, Grammar-Playlist, Stats
- **Tastaturkürzel:** 1 = Nochmal, 2 = Einfach, Enter/Space = Aufdecken

### stats.js — Statistiken
- Kategorie-Stats, Gesamt-Stats, Heute, 7-Tage-Chart, 90-Tage-Heatmap
- Nutzt `Storage.getHistory()` und `Flashcard.getCardsByCategory()`

### speech.js — Aussprache
- `Speech.speak(text)` — Spricht japanischen Text per Web Speech API
- Sucht automatisch japanische Stimme, Rate 0.85x

### playlist.js — Audio-Player
- `Playlist.init(trackList)` — Erwartet Array von `{ title, src }`
- Play/Pause, Vor/Zurück, Seek, Track-Highlight
- Buttons sind reine CSS-Shapes (keine Emojis)

---

## Datenformat einer Karte

```javascript
{
  id: "vocab_01",           // Eindeutige ID
  front: "ちち",             // Vorderseite (Japanisch)
  back: "mein Vater",       // Rückseite (Bedeutung/Antwort)
  romaji: "chichi",         // Aussprache (optional)
  hint: "informell",        // Zusatzhinweis (optional)
  alt: ["Vater"],           // Alternative Antworten (optional)
  category: "vocabulary",   // Kategorie
  sub: "family"             // Unterkategorie
}
```

**Kategorien:** hiragana, katakana, kanji, vocabulary, numbers, dates, times, particles, greetings, lessons

---

## Routing (Hash-basiert)

| Route | View-Funktion | Beschreibung |
|-------|---------------|--------------|
| `#dashboard` | `showDashboard()` | Kategorie-Grid + Tägliche Herausforderung |
| `#category/{cat}` | `showSubcategories()` | Unterkategorien wählen |
| `#learn/{cat}/{sub}` | `startLearning()` | Karteikarten-Sitzung |
| `#learn/{cat}/{sub}/errors` | `startLearning()` | Nur Nochmal-Karten |
| `#learn/_daily/all` | `startLearning()` | Tägliche Herausforderung (15 Karten) |
| `#learn/_difficult/all` | `startLearning()` | Schwierige Karten üben |
| `#list-overview` | `showListOverview()` | Lernen-Tab: Alle Kategorien |
| `#list/{cat}/{sub}` | `showList()` | Kartenliste mit Suche + Audio |
| `#grammar-text/{lesson}` | `showGrammarText()` | Grammatik-Lektion anzeigen |
| `#grammar-playlist` | `showGrammarPlaylist()` | Audio-Player |
| `#stats` | `showStats()` | Statistiken |

---

## Spaced Repetition — Ablauf

```
Karte anzeigen → Antwort eingeben → Prüfen → Bewerten (Nochmal / Einfach)
                                                  ↓
                                    Nochmal: nächste Review in 1h
                                    Einfach: nächste Review in 21 Tagen
                                                  ↓
                              Storage.setProgress() + updateTodaySession()
```

**Karten-Priorisierung:** `getDueCards()` gibt zuerst "again"-Karten zurück, dann den Rest (beide Gruppen geshufflet).

---

## Tägliche Herausforderung

- 15 zufällige Karten aus: **vocabulary, dates, times, numbers**
- Keine Hiragana, Katakana, Kanji oder Partikeln
- Bevorzugt fällige Karten, füllt mit nicht-fälligen auf
- Code: `startLearning()` mit `category === '_daily'`

---

## Grammatik-System

**data/grammar.js** enthält Lektionen 2-20 als Objekte:
```javascript
DATA_GRAMMAR = {
  lesson2: {
    title: 'Lektion 2',
    sections: [
      { heading: 'Thema', content: '<HTML>' }
    ]
  }
}
```

**Grammatik-Suche:** Suchfeld in der Unterkategorie-Ansicht filtert nach Titel und Section-Headings.

**Audio-Playlist:**
- Erster Track: Podcast (Lektion 1-20 komplett)
- Tracks 2-20: Einzellektionen
- Dateien: `audio/grammar/podcast.m4a`, `audio/grammar/lesson{2-20}.m4a`

---

## Service Worker (sw.js)

- **Strategie:** Cache-First (offline-fähig)
- **Cache-Version:** `nihongo-v24` (MUSS bei jeder Änderung gebumpt werden!)
- **Gecacht:** Alle HTML/CSS/JS/Data/Icons
- **NICHT gecacht:** Audio-Dateien (zu groß, werden on-demand gestreamt)
- **Update-Flow:** Neue Version → alter Cache gelöscht bei Activate → App neu laden

**Wichtig:** Bei jeder Code-Änderung `CACHE_VERSION` in sw.js hochzählen, sonst sehen Nutzer die Änderung nicht!

---

## CSS & Theming

- **Custom Properties** in `:root` (Light) und `[data-theme="dark"]` (Dark)
- **Hauptfarben:** `--primary: #e74c3c` (Rot), `--accent: #3498db` (Blau), `--success: #27ae60` (Grün)
- **Responsive:** 2-Spalten-Grid, Mobile-Karten statt Tabellen unter 480px
- **Playlist-Buttons:** Reine CSS-Dreiecke/Balken (keine Emojis wegen Android/iOS-Darstellung)

---

## Häufige Änderungen — Wo was anpassen

| Was | Wo |
|-----|----|
| Neue Vokabeln hinzufügen | `data/vocabulary.js` (Format siehe oben) |
| Neue Lektion (Karteikarten) | `data/lessons.js` + `CATEGORY_META.lessons.subs` in app.js |
| Neues Grammatik-Kapitel | `data/grammar.js` + `CATEGORY_META.grammar.subs` in app.js |
| Neues Audio hinzufügen | Datei nach `audio/grammar/` + automatisch in Playlist (lesson2-20) |
| Rating-System ändern | `INTERVALS` in flashcard.js + Migration in storage.js |
| Tägliche Herausforderung anpassen | `startLearning()` in app.js, Bereich `category === '_daily'` |
| Statistik-Anzeige ändern | `showStats()`, `renderWeekChart()`, `renderHeatmap()` in app.js |
| Style/Theme ändern | `css/style.css`, Custom Properties in `:root` / `[data-theme="dark"]` |
| Cache-Version bumpen | `CACHE_VERSION` in `sw.js` (bei JEDER Änderung!) |

---

## Bekannte Besonderheiten

- Kana haben vorwärts UND rückwärts-Karten (z.B. あ→a und a→あ), IDs mit `_rev_`
- Rückwärts-Karten werden in Listen gefiltert (`!c.id.includes('_rev_')`)
- Zufällige Uhrzeiten/Datumsangaben werden dynamisch generiert (nicht gespeichert)
- Strichfolge für Kanji wird von KanjiVG (GitHub) geladen
- Antwort-Normalisierung: ä→ae, ö→oe, ü→ue, ß→ss, case-insensitive
- `escapeHtml()` wird für alle nutzer-sichtbaren Texte verwendet (XSS-Schutz)
