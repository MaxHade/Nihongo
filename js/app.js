// ===== Haupt-App-Logik =====
const App = (() => {
  // Category metadata
  const CATEGORY_META = {
    hiragana: {
      emoji: 'あ', name: 'Hiragana',
      subs: {
        gojuuon: 'Grundzeichen', dakuten: 'Dakuten', combo: 'Kombinationen',
        gojuuon_rev: 'Grundzeichen (Bonus)', dakuten_rev: 'Dakuten (Bonus)', combo_rev: 'Kombinationen (Bonus)'
      }
    },
    katakana: {
      emoji: 'ア', name: 'Katakana',
      subs: {
        gojuuon: 'Grundzeichen', dakuten: 'Dakuten', combo: 'Kombinationen',
        gojuuon_rev: 'Grundzeichen (Bonus)', dakuten_rev: 'Dakuten (Bonus)', combo_rev: 'Kombinationen (Bonus)'
      }
    },
    dates:       { emoji: '📅', name: 'Datum', subs: { weekdays: 'Wochentage', months: 'Monate', days: 'Tage 1-31', expressions: 'Zeitausdrücke' } },
    times:       { emoji: '🕐', name: 'Uhrzeiten', subs: { hours: 'Stunden', minutes: 'Minuten' } },
    numbers:     { emoji: '🔢', name: 'Zahlen', subs: { basic: 'Grundzahlen', counters: 'Zählwörter' } },
    vocabulary:  { emoji: '📖', name: 'Vokabeln', subs: { family: 'Familie', i_adjectives: 'い-Adjektive', na_adjectives: 'な-Adjektive', countries: 'Länder', verbs: 'Verben' } },
    particles:   { emoji: '🔗', name: 'Partikeln', subs: { particles: 'Alle Partikeln' } },
    greetings:   { emoji: '👋', name: 'Begrüßungen', subs: { greetings: 'Alle Floskeln' } },
    lessons:     { emoji: '📝', name: 'Lektionen', subs: {
      lesson1: 'Lektion 1', lesson2: 'Lektion 2', lesson3: 'Lektion 3', lesson4: 'Lektion 4', lesson5: 'Lektion 5',
      lesson6: 'Lektion 6', lesson7: 'Lektion 7', lesson8: 'Lektion 8', lesson9: 'Lektion 9', lesson10: 'Lektion 10',
      lesson11: 'Lektion 11', lesson12: 'Lektion 12', lesson13: 'Lektion 13', lesson14: 'Lektion 14', lesson15: 'Lektion 15',
      lesson16: 'Lektion 16', lesson17: 'Lektion 17', lesson18: 'Lektion 18', lesson19: 'Lektion 19', lesson20: 'Lektion 20'
    }}
  };

  // Session state
  let currentCards = [];
  let currentCardIndex = 0;
  let sessionCorrect = 0;
  let sessionWrong = 0;
  let currentCategory = null;
  let currentSub = null;

  // ===== Card type detection =====
  function isRevealCard(card) {
    // Reverse kana cards use reveal mode (no typing)
    return card.id.includes('_rev_') && (card.category === 'hiragana' || card.category === 'katakana');
  }

  function isKanaForward(card) {
    return !card.id.includes('_rev_') && (card.category === 'hiragana' || card.category === 'katakana');
  }

  // ===== Theme =====
  function initTheme() {
    const saved = localStorage.getItem('nihongo_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nihongo_theme', next);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
  }

  // ===== Router =====
  function navigate(hash) {
    window.location.hash = hash;
  }

  function handleRoute() {
    const hash = window.location.hash || '#dashboard';
    const parts = hash.slice(1).split('/');
    const route = parts[0];

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    switch (route) {
      case 'dashboard':
        showDashboard();
        setNavActive('dashboard');
        break;
      case 'category':
        showSubcategories(parts[1]);
        setNavActive('dashboard');
        break;
      case 'learn':
        startLearning(parts[1], parts[2], parts[3] === 'errors');
        setNavActive('dashboard');
        break;
      case 'list-overview':
        showListOverview();
        setNavActive('list-overview');
        break;
      case 'list':
        showList(parts[1], parts[2]);
        setNavActive('list-overview');
        break;
      case 'stats':
        showStats();
        setNavActive('stats');
        break;
      default:
        showDashboard();
        setNavActive('dashboard');
    }
  }

  function setNavActive(view) {
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
  }

  // ===== Dashboard =====
  function showDashboard() {
    const view = document.getElementById('view-dashboard');
    view.classList.add('active');
    document.querySelector('#view-dashboard h2').textContent = 'Kategorien';
    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      const cards = Flashcard.getCardsByCategory(cat);

      if (cards.length === 0) {
        if (cat === 'lessons') {
          const el = document.createElement('div');
          el.className = 'category-card';
          el.style.opacity = '0.5';
          el.innerHTML = `
            <span class="category-emoji">${meta.emoji}</span>
            <div class="category-name">${meta.name}</div>
            <div class="category-count">Noch leer</div>
          `;
          grid.appendChild(el);
        }
        continue;
      }

      const stats = Stats.getCategoryStats(cat);
      const due = Stats.getDueCount(cat);

      const el = document.createElement('div');
      el.className = 'category-card';
      el.innerHTML = `
        <span class="category-emoji">${meta.emoji}</span>
        <div class="category-name">${meta.name}</div>
        <div class="category-count">${cards.length} Karten · ${due} fällig</div>
        <div class="category-progress">
          <div class="category-progress-fill" style="width: ${stats.percent}%"></div>
        </div>
      `;
      el.addEventListener('click', () => {
        // Check how many non-empty subs exist
        const nonEmptySubs = Object.keys(meta.subs).filter(s =>
          Flashcard.getCardsBySubcategory(cat, s).length > 0
        );
        if (nonEmptySubs.length <= 1) {
          navigate(`#learn/${cat}/${nonEmptySubs[0] || ''}`);
        } else {
          navigate(`#category/${cat}`);
        }
      });
      grid.appendChild(el);
    }
  }

  // ===== Subcategory View =====
  function showSubcategories(category) {
    const view = document.getElementById('view-subcategory');
    view.classList.add('active');

    const meta = CATEGORY_META[category];
    if (!meta) return navigate('#dashboard');

    document.getElementById('subcategory-title').textContent = meta.name;
    const grid = document.getElementById('subcategory-grid');
    grid.innerHTML = '';

    view.querySelector('.back-btn').onclick = () => navigate('#dashboard');

    for (const [sub, subName] of Object.entries(meta.subs)) {
      const cards = Flashcard.getCardsBySubcategory(category, sub);
      if (cards.length === 0) continue; // Skip empty subcategories

      const dueCards = Flashcard.getDueCards(category, sub);

      const el = document.createElement('div');
      el.className = 'subcategory-card';
      el.innerHTML = `
        <div class="category-name">${subName}</div>
        <div class="category-count">${cards.length} Karten · ${dueCards.length} fällig</div>
        <div class="sub-actions">
          <button class="sub-action-btn" data-action="learn">Lernen</button>
          <button class="sub-action-btn" data-action="errors">Nur Fehler</button>
          <button class="sub-action-btn" data-action="list">Liste</button>
        </div>
      `;

      el.querySelector('[data-action="learn"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`#learn/${category}/${sub}`);
      });
      el.querySelector('[data-action="errors"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`#learn/${category}/${sub}/errors`);
      });
      el.querySelector('[data-action="list"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`#list/${category}/${sub}`);
      });

      grid.appendChild(el);
    }
  }

  // ===== Flashcard Learning =====
  function startLearning(category, sub, errorsOnly) {
    const view = document.getElementById('view-flashcard');
    view.classList.add('active');

    currentCategory = category;
    currentSub = sub;

    // Back button
    document.getElementById('flashcard-back').onclick = () => {
      const nonEmptySubs = Object.keys(CATEGORY_META[category]?.subs || {}).filter(s =>
        Flashcard.getCardsBySubcategory(category, s).length > 0
      );
      if (nonEmptySubs.length <= 1) {
        navigate('#dashboard');
      } else {
        navigate(`#category/${category}`);
      }
    };

    // Error mode toggle
    const errorToggle = document.getElementById('error-mode-toggle');
    errorToggle.checked = !!errorsOnly;
    errorToggle.onchange = () => {
      const mode = errorToggle.checked ? '/errors' : '';
      navigate(`#learn/${category}/${sub}${mode}`);
    };

    // Load cards
    if (errorsOnly) {
      currentCards = Flashcard.getErrorCards(category, sub);
    } else {
      currentCards = Flashcard.getDueCards(category, sub);
    }

    // If no due cards, show all cards (shuffled)
    if (currentCards.length === 0 && !errorsOnly) {
      currentCards = Flashcard.shuffle(
        sub ? Flashcard.getCardsBySubcategory(category, sub) : Flashcard.getCardsByCategory(category)
      );
    }

    currentCardIndex = 0;
    sessionCorrect = 0;
    sessionWrong = 0;

    document.getElementById('session-summary').classList.add('hidden');
    document.getElementById('flashcard-container').classList.remove('hidden');

    if (currentCards.length === 0) {
      showSessionSummary();
      return;
    }

    showCurrentCard();
  }

  function showCurrentCard() {
    if (currentCardIndex >= currentCards.length) {
      showSessionSummary();
      return;
    }

    const card = currentCards[currentCardIndex];
    const progress = `${currentCardIndex + 1} / ${currentCards.length}`;
    document.getElementById('flashcard-progress').textContent = progress;

    // Reset card state
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('correct', 'wrong');

    document.getElementById('card-front').textContent = card.front;
    document.getElementById('card-hint').textContent = card.hint || '';

    // Audio: for reverse kana cards, speak the back (Japanese character)
    if (isRevealCard(card)) {
      document.getElementById('card-audio').onclick = () => Speech.speak(card.back);
    } else {
      document.getElementById('card-audio').onclick = () => Speech.speak(card.front);
    }

    // Reset answer section
    const input = document.getElementById('answer-input');
    const form = document.getElementById('answer-form');
    const revealBtn = document.getElementById('reveal-btn');

    input.value = '';
    document.getElementById('answer-result').classList.add('hidden');
    document.getElementById('answer-result').className = 'answer-result hidden';
    document.getElementById('rating-buttons').classList.add('hidden');

    if (isRevealCard(card)) {
      // Reveal mode: hide input, show reveal button
      form.classList.add('hidden');
      revealBtn.classList.remove('hidden');
    } else {
      // Type mode: show input, hide reveal button
      form.classList.remove('hidden');
      revealBtn.classList.add('hidden');
      input.disabled = false;
      document.getElementById('check-btn').disabled = false;

      // Set placeholder based on card type
      if (isKanaForward(card)) {
        input.placeholder = 'Romaji eingeben...';
      } else {
        input.placeholder = 'Bedeutung eingeben...';
      }

      input.focus();
    }
  }

  function checkCurrentAnswer() {
    const card = currentCards[currentCardIndex];
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();

    // Leeres Feld = Antwort zeigen (als falsch werten)
    const isCorrect = userAnswer ? Flashcard.checkAnswer(userAnswer, card.back) : false;

    // Record answer
    Flashcard.recordAnswer(card.id, isCorrect);

    if (isCorrect) {
      sessionCorrect++;
    } else {
      sessionWrong++;
    }

    // Update UI
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add(isCorrect ? 'correct' : 'wrong');

    const result = document.getElementById('answer-result');
    result.classList.remove('hidden', 'correct', 'wrong');

    // Build romaji info line for non-kana cards
    const romajiLine = card.romaji ? `<div class="romaji-info">Lesung: ${escapeHtml(card.romaji)}</div>` : '';

    if (isCorrect) {
      result.classList.add('correct');
      result.innerHTML = `<strong>Richtig!</strong> ✓${romajiLine}`;
    } else {
      result.classList.add('wrong');
      result.innerHTML = `
        <strong>Falsch</strong> ✗<br>
        Deine Antwort: <strong>${escapeHtml(userAnswer)}</strong><br>
        Richtig wäre: <strong>${escapeHtml(card.back)}</strong>
        ${romajiLine}
      `;
    }

    // Disable input, show rating buttons
    input.disabled = true;
    document.getElementById('check-btn').disabled = true;
    document.getElementById('rating-buttons').classList.remove('hidden');
  }

  function revealCurrentCard() {
    const card = currentCards[currentCardIndex];

    // Hide reveal button
    document.getElementById('reveal-btn').classList.add('hidden');

    // Show the answer
    const result = document.getElementById('answer-result');
    result.classList.remove('hidden', 'correct', 'wrong');
    result.innerHTML = `<div class="reveal-answer">${escapeHtml(card.back)}</div>`;

    // Show rating buttons
    document.getElementById('rating-buttons').classList.remove('hidden');
  }

  function rateAndNext(rating) {
    const card = currentCards[currentCardIndex];

    // For reveal cards, record based on rating
    if (isRevealCard(card)) {
      const selfCorrect = (rating === 'good' || rating === 'easy');
      Flashcard.recordAnswer(card.id, selfCorrect);
      if (selfCorrect) {
        sessionCorrect++;
      } else {
        sessionWrong++;
      }
    }

    Flashcard.rateCard(card.id, rating);
    currentCardIndex++;
    showCurrentCard();
  }

  function showSessionSummary() {
    document.getElementById('flashcard-container').classList.add('hidden');
    const summary = document.getElementById('session-summary');
    summary.classList.remove('hidden');

    const total = sessionCorrect + sessionWrong;
    const percent = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;

    document.getElementById('summary-stats').innerHTML = `
      <div>Karten: <strong>${total}</strong></div>
      <div class="summary-correct">Richtig: ${sessionCorrect}</div>
      <div class="summary-wrong">Falsch: ${sessionWrong}</div>
      <div>Quote: <strong>${percent}%</strong></div>
    `;

    document.getElementById('summary-restart').onclick = () => {
      const mode = document.getElementById('error-mode-toggle').checked ? '/errors' : '';
      navigate(`#learn/${currentCategory}/${currentSub}${mode}`);
    };

    document.getElementById('summary-back').onclick = () => {
      const nonEmptySubs = Object.keys(CATEGORY_META[currentCategory]?.subs || {}).filter(s =>
        Flashcard.getCardsBySubcategory(currentCategory, s).length > 0
      );
      if (nonEmptySubs.length <= 1) {
        navigate('#dashboard');
      } else {
        navigate(`#category/${currentCategory}`);
      }
    };
  }

  // ===== List Overview =====
  function showListOverview() {
    const view = document.getElementById('view-dashboard');
    view.classList.add('active');

    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    document.querySelector('#view-dashboard h2').textContent = 'Listen';

    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      const cards = Flashcard.getCardsByCategory(cat);
      if (cards.length === 0) continue;

      // Count non-reverse cards for display
      const displayCards = cards.filter(c => !c.id.includes('_rev_'));

      const el = document.createElement('div');
      el.className = 'category-card';
      el.innerHTML = `
        <span class="category-emoji">${meta.emoji}</span>
        <div class="category-name">${meta.name}</div>
        <div class="category-count">${displayCards.length} Einträge</div>
      `;
      el.addEventListener('click', () => {
        // Only show non-reverse, non-empty subs for lists
        const listSubs = Object.keys(meta.subs).filter(s =>
          !s.endsWith('_rev') && Flashcard.getCardsBySubcategory(cat, s).length > 0
        );
        if (listSubs.length <= 1) {
          navigate(`#list/${cat}/${listSubs[0] || ''}`);
        } else {
          showListSubcategories(cat);
        }
      });
      grid.appendChild(el);
    }
  }

  function showListSubcategories(category) {
    const view = document.getElementById('view-subcategory');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    view.classList.add('active');

    const meta = CATEGORY_META[category];
    document.getElementById('subcategory-title').textContent = `${meta.name} – Listen`;
    const grid = document.getElementById('subcategory-grid');
    grid.innerHTML = '';

    view.querySelector('.back-btn').onclick = () => navigate('#list-overview');

    for (const [sub, subName] of Object.entries(meta.subs)) {
      // Skip reverse subs and empty subs in list view
      if (sub.endsWith('_rev')) continue;
      const cards = Flashcard.getCardsBySubcategory(category, sub);
      if (cards.length === 0) continue;

      const el = document.createElement('div');
      el.className = 'subcategory-card';
      el.innerHTML = `
        <div class="category-name">${subName}</div>
        <div class="category-count">${cards.length} Einträge</div>
      `;
      el.addEventListener('click', () => navigate(`#list/${category}/${sub}`));
      grid.appendChild(el);
    }
  }

  // ===== List View =====
  function showList(category, sub) {
    const view = document.getElementById('view-list');
    view.classList.add('active');

    const meta = CATEGORY_META[category];
    const subName = meta?.subs[sub] || sub;
    document.getElementById('list-title').textContent = `${meta?.name || category} – ${subName}`;

    document.getElementById('list-back').onclick = () => {
      const listSubs = Object.keys(meta?.subs || {}).filter(s =>
        !s.endsWith('_rev') && Flashcard.getCardsBySubcategory(category, s).length > 0
      );
      if (listSubs.length <= 1) {
        navigate('#list-overview');
      } else {
        showListSubcategories(category);
      }
    };

    const cards = sub
      ? Flashcard.getCardsBySubcategory(category, sub)
      : Flashcard.getCardsByCategory(category);

    const isKana = (category === 'hiragana' || category === 'katakana');

    const search = document.getElementById('list-search');
    search.value = '';

    function renderList(filter) {
      let filtered = cards.filter(c => !c.id.includes('_rev_')); // Always skip reverse in lists

      if (filter) {
        const f = filter.toLowerCase();
        filtered = filtered.filter(c =>
          c.front.includes(filter) ||
          c.back.toLowerCase().includes(f) ||
          (c.romaji && c.romaji.toLowerCase().includes(f)) ||
          (c.hint && c.hint.toLowerCase().includes(f))
        );
      }

      const content = document.getElementById('list-content');

      // Determine columns based on category type
      let col2Header, col3Header;
      if (isKana) {
        col2Header = 'Romaji';
        col3Header = '';
      } else {
        col2Header = 'Romaji';
        col3Header = 'Bedeutung';
      }

      // Table for desktop
      let tableHtml = `<table class="list-table"><thead><tr>
        <th>Japanisch</th>
        <th>${col2Header}</th>
        ${col3Header ? `<th>${col3Header}</th>` : ''}
      </tr></thead><tbody>`;

      // Cards for mobile
      let cardsHtml = '<div class="list-cards">';

      filtered.forEach(card => {
        if (isKana) {
          // Kana: front = character, back = romaji
          tableHtml += `<tr>
            <td class="jp-col">${escapeHtml(card.front)}</td>
            <td>${escapeHtml(card.back)}</td>
          </tr>`;
          cardsHtml += `<div class="list-card-item">
            <div class="list-card-jp">${escapeHtml(card.front)}</div>
            <div class="list-card-romaji">${escapeHtml(card.back)}</div>
          </div>`;
        } else {
          // Non-kana: front = Japanese, romaji = reading, back = meaning
          const romaji = card.romaji || '';
          const meaning = card.back || '';
          const hint = card.hint ? ` (${card.hint})` : '';
          tableHtml += `<tr>
            <td class="jp-col">${escapeHtml(card.front)}</td>
            <td>${escapeHtml(romaji)}</td>
            <td>${escapeHtml(meaning)}${escapeHtml(hint)}</td>
          </tr>`;
          cardsHtml += `<div class="list-card-item">
            <div class="list-card-jp">${escapeHtml(card.front)}</div>
            <div class="list-card-romaji">${escapeHtml(romaji)}</div>
            <div class="list-card-hint">${escapeHtml(meaning)}${escapeHtml(hint)}</div>
          </div>`;
        }
      });

      tableHtml += '</tbody></table>';
      cardsHtml += '</div>';

      content.innerHTML = tableHtml + cardsHtml;
    }

    renderList('');
    search.oninput = () => renderList(search.value);
  }

  // ===== Stats View =====
  function showStats() {
    const view = document.getElementById('view-stats');
    view.classList.add('active');

    const today = Stats.getTodayStats();
    const todayPercent = today.reviewed > 0
      ? Math.round((today.correct / today.reviewed) * 100) : 0;

    document.getElementById('stats-today-content').innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Gelernte Karten</span>
        <span class="stat-value">${today.reviewed}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Richtig</span>
        <span class="stat-value" style="color:var(--success)">${today.correct}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Falsch</span>
        <span class="stat-value" style="color:var(--danger)">${today.wrong}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Trefferquote</span>
        <span class="stat-value">${todayPercent}%</span>
      </div>
    `;

    const overall = Stats.getOverallStats();
    document.getElementById('stats-overall-content').innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Gesamt Karten</span>
        <span class="stat-value">${overall.total}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Gelernt</span>
        <span class="stat-value">${overall.learned} (${overall.percent}%)</span>
      </div>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="width:${overall.percent}%"></div>
      </div>
      <div class="stat-row">
        <span class="stat-label">Gesamte Trefferquote</span>
        <span class="stat-value">${overall.hitRate}%</span>
      </div>
    `;

    let catHtml = '';
    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      const cards = Flashcard.getCardsByCategory(cat);
      if (cards.length === 0) continue;

      const s = Stats.getCategoryStats(cat);
      catHtml += `
        <div class="stat-row">
          <span class="stat-label">${meta.emoji} ${meta.name}</span>
          <span class="stat-value">${s.learned}/${s.total} (${s.hitRate}%)</span>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width:${s.percent}%"></div>
        </div>
      `;
    }
    document.getElementById('stats-categories-content').innerHTML = catHtml;
  }

  // ===== Export/Import =====
  function setupExportImport() {
    document.getElementById('export-btn').addEventListener('click', () => {
      const data = Storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nihongo-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('import-btn').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (Storage.importData(ev.target.result)) {
          alert('Daten erfolgreich importiert!');
          handleRoute();
        } else {
          alert('Fehler beim Importieren der Daten.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  // ===== Utility =====
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Init =====
  function init() {
    initTheme();

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigate(`#${btn.dataset.view}`);
      });
    });

    // Answer form (type mode)
    document.getElementById('answer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      checkCurrentAnswer();
    });

    // Reveal button (reveal mode for reverse kana)
    document.getElementById('reveal-btn').addEventListener('click', () => {
      revealCurrentCard();
    });

    // Rating buttons
    document.querySelectorAll('.rate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        rateAndNext(btn.dataset.rating);
      });
    });

    // Back buttons with data-back
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => navigate(`#${btn.dataset.back}`));
    });

    setupExportImport();

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigate };
})();
