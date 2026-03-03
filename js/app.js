// ===== Haupt-App-Logik =====
const App = (() => {
  // Category metadata
  const CATEGORY_META = {
    hiragana: {
      emoji: 'あ', name: 'Hiragana',
      subs: {
        gojuuon: 'Grundzeichen', dakuten: 'Dakuten', combo: 'Kombinationen',
        all: 'Alles',
        gojuuon_rev: 'Grundzeichen (Rückwärts)', dakuten_rev: 'Dakuten (Rückwärts)', combo_rev: 'Kombinationen (Rückwärts)',
        all_rev: 'Alles (Rückwärts)'
      }
    },
    katakana: {
      emoji: 'ア', name: 'Katakana',
      subs: {
        gojuuon: 'Grundzeichen', dakuten: 'Dakuten', combo: 'Kombinationen',
        all: 'Alles',
        gojuuon_rev: 'Grundzeichen (Rückwärts)', dakuten_rev: 'Dakuten (Rückwärts)', combo_rev: 'Kombinationen (Rückwärts)',
        all_rev: 'Alles (Rückwärts)'
      }
    },
    dates:       { emoji: '📅', name: 'Datum', subs: { weekdays: 'Wochentage', months: 'Monate', days: 'Tage 1-31', expressions: 'Zeitausdrücke', seasons: 'Jahreszeiten' } },
    times:       { emoji: '🕐', name: 'Uhrzeiten', subs: { hours: 'Stunden', minutes: 'Minuten', random_time: 'Zufällige Uhrzeit' } },
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
  let sessionRatings = { again: 0, hard: 0, good: 0, easy: 0 };
  let currentCategory = null;
  let currentSub = null;
  let previousStreak = 0;
  let dailyGoalReached = false;

  // ===== Card type detection =====
  function isRevealCard(card) {
    // Reverse kana cards use reveal mode (no typing)
    return card.id.includes('_rev_') && (card.category === 'hiragana' || card.category === 'katakana');
  }

  function isKanaForward(card) {
    return !card.id.includes('_rev_') && (card.category === 'hiragana' || card.category === 'katakana');
  }

  // ===== Card Status Badge =====
  function getCardStatusBadge(cardId) {
    const progress = Storage.getProgress(cardId);
    if (!progress) {
      return '<span class="card-status status-new">Neu</span>';
    }
    if (progress.lastRating === 'again' || progress.lastRating === 'hard') {
      return '<span class="card-status status-learning">Lernend</span>';
    }
    return '<span class="card-status status-mastered">Gemeistert</span>';
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
        if (parts[1] === '_difficult') {
          showDifficultList();
        } else {
          showList(parts[1], parts[2]);
        }
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

  // ===== Dashboard Header =====
  function renderDashboardHeader() {
    const header = document.getElementById('dashboard-header');
    if (!header) return;

    const streak = Storage.getStreak();
    const session = Storage.getTodaySession();
    const goal = Storage.getDailyGoal();
    const reviewed = session.reviewed;
    const percent = Math.min(100, Math.round((reviewed / goal) * 100));
    const isComplete = reviewed >= goal;

    const streakText = streak > 0
      ? `🔥 ${streak} Tag${streak !== 1 ? 'e' : ''} Streak`
      : 'Starte deine Serie!';

    // Mini week dots
    const last7 = Stats.getLast7Days();
    const weekDayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    let miniWeekHtml = '<div class="mini-week">';
    last7.forEach(day => {
      const isActive = day.reviewed > 0;
      miniWeekHtml += `
        <div class="mini-week-day">
          <span class="mini-week-label">${day.label}</span>
          <div class="mini-week-dot${isActive ? ' active' : ''}"></div>
        </div>
      `;
    });
    miniWeekHtml += '</div>';

    header.innerHTML = `
      <div class="dashboard-header-top">
        <span class="streak-display">${streakText}</span>
        <span class="daily-goal-display">
          ${reviewed} / ${goal} heute
          <button class="goal-settings-btn" id="goal-settings-btn" title="Tages-Ziel ändern">⚙️</button>
        </span>
      </div>
      <div class="daily-progress-bar">
        <div class="daily-progress-fill${isComplete ? ' complete' : ''}" style="width: ${percent}%"></div>
      </div>
      <div class="daily-progress-text">${percent}%</div>
      ${miniWeekHtml}
    `;

    document.getElementById('goal-settings-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const newGoal = prompt('Tages-Ziel (Anzahl Karten):', goal);
      if (newGoal !== null) {
        const n = parseInt(newGoal);
        if (!isNaN(n) && n > 0) {
          Storage.setDailyGoal(n);
          renderDashboardHeader();
        }
      }
    });
  }

  // ===== Dashboard =====
  function showDashboard() {
    const view = document.getElementById('view-dashboard');
    view.classList.add('active');
    document.querySelector('#view-dashboard h2').textContent = 'Kategorien';

    // Clean up global search elements from list-overview
    const oldSearch = document.getElementById('global-search');
    if (oldSearch) oldSearch.remove();
    const oldSearchResults = document.getElementById('global-search-results');
    if (oldSearchResults) oldSearchResults.remove();

    renderDashboardHeader();

    // Remove old daily challenge card if exists
    const oldDaily = document.querySelector('.daily-challenge-card');
    if (oldDaily) oldDaily.remove();

    // Daily challenge card
    const dailyCard = document.createElement('div');
    dailyCard.className = 'daily-challenge-card';
    dailyCard.innerHTML = `
      <span class="daily-challenge-emoji">🎯</span>
      <div class="daily-challenge-text">
        <span class="daily-challenge-title">Tägliche Herausforderung</span>
        <span class="daily-challenge-sub">15 zufällige Karten aus allen Kategorien</span>
      </div>
    `;
    dailyCard.addEventListener('click', () => navigate('#learn/_daily/all'));

    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';
    grid.parentNode.insertBefore(dailyCard, grid);

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
      // Special handling for random_time
      if (sub === 'random_time') {
        const el = document.createElement('div');
        el.className = 'subcategory-card';
        el.innerHTML = `
          <div class="category-name">${subName}</div>
          <div class="category-count">10 zufällige Uhrzeiten</div>
          <div class="sub-actions">
            <button class="sub-action-btn" data-action="learn">Üben</button>
          </div>
        `;
        el.querySelector('[data-action="learn"]').addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(`#learn/${category}/${sub}`);
        });
        grid.appendChild(el);
        continue;
      }

      const cards = Flashcard.getCardsBySubcategory(category, sub);
      if (cards.length === 0) continue; // Skip empty subcategories

      const dueCards = Flashcard.getDueCards(category, sub);

      const nochmalCards = Flashcard.getNochmalCards(category, sub);
      const nochmalCount = nochmalCards.length;

      const el = document.createElement('div');
      el.className = 'subcategory-card';
      el.innerHTML = `
        <div class="category-name">${subName}</div>
        <div class="category-count">${cards.length} Karten · ${dueCards.length} fällig</div>
        <div class="sub-actions">
          <button class="sub-action-btn" data-action="learn">Lernen</button>
          ${nochmalCount > 0 ? `<button class="sub-action-btn" data-action="errors">Nur Nochmal (${nochmalCount})</button>` : ''}
          <button class="sub-action-btn" data-action="list">Liste</button>
        </div>
      `;

      el.querySelector('[data-action="learn"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`#learn/${category}/${sub}`);
      });
      const errorsBtn = el.querySelector('[data-action="errors"]');
      if (errorsBtn) {
        errorsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(`#learn/${category}/${sub}/errors`);
        });
      }
      el.querySelector('[data-action="list"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`#list/${category}/${sub}`);
      });

      grid.appendChild(el);
    }
  }

  // ===== Random Time Generation =====
  function generateRandomTimeCards(count) {
    count = count || 10;
    const hours = (typeof DATA_TIMES !== 'undefined' ? DATA_TIMES : []).filter(c => c.sub === 'hours' && c.id !== 'time_13');
    const minutes = (typeof DATA_TIMES !== 'undefined' ? DATA_TIMES : []).filter(c => c.sub === 'minutes' && c.id !== 'time_33' && c.id !== 'time_34');

    if (hours.length === 0 || minutes.length === 0) return [];

    const cards = [];
    for (let i = 0; i < count; i++) {
      const h = hours[Math.floor(Math.random() * hours.length)];
      const m = minutes[Math.floor(Math.random() * minutes.length)];

      // Extract numeric hour from back (e.g. "3 Uhr" → 3)
      const hourNum = parseInt(h.back);
      // Extract numeric minutes from back (e.g. "25 Minuten" → 25)
      const minNum = parseInt(m.back);

      cards.push({
        id: `random_time_${i}`,
        front: `${h.front} ${m.front}`,
        back: `${hourNum}:${String(minNum).padStart(2, '0')}`,
        romaji: `${h.romaji} ${m.romaji}`,
        category: 'times',
        sub: 'random_time',
        isGenerated: true
      });
    }
    return cards;
  }

  // ===== Flashcard Learning =====
  function startLearning(category, sub, errorsOnly) {
    const view = document.getElementById('view-flashcard');
    view.classList.add('active');

    currentCategory = category;
    currentSub = sub;

    // Capture current streak and goal state before session
    previousStreak = Storage.getStreak();
    dailyGoalReached = Storage.getTodaySession().reviewed >= Storage.getDailyGoal();

    // Back button
    document.getElementById('flashcard-back').onclick = () => {
      if (category === '_daily') {
        navigate('#dashboard');
        return;
      }
      const nonEmptySubs = Object.keys(CATEGORY_META[category]?.subs || {}).filter(s =>
        Flashcard.getCardsBySubcategory(category, s).length > 0 || s === 'random_time'
      );
      if (nonEmptySubs.length <= 1) {
        navigate('#dashboard');
      } else {
        navigate(`#category/${category}`);
      }
    };

    // Error mode toggle
    const errorToggle = document.getElementById('error-mode-toggle');

    // Special handling for daily challenge
    if (category === '_daily') {
      errorToggle.checked = false;
      errorToggle.disabled = true;

      // Collect 15 cards: prefer due cards, fill with random
      const allCards = Flashcard.getAllCards().filter(c => !c.id.includes('_rev_'));
      const now = Date.now();
      const dueCards = Flashcard.shuffle(allCards.filter(card => {
        const progress = Storage.getProgress(card.id);
        if (!progress) return true;
        return progress.nextReview <= now;
      }));
      const nonDueCards = Flashcard.shuffle(allCards.filter(card => {
        const progress = Storage.getProgress(card.id);
        return progress && progress.nextReview > now;
      }));
      currentCards = dueCards.concat(nonDueCards).slice(0, 15);
    }
    // Special handling for random_time
    else if (sub === 'random_time') {
      currentCards = generateRandomTimeCards(10);
      errorToggle.checked = false;
      errorToggle.disabled = true;
    } else {
      errorToggle.disabled = false;
      errorToggle.checked = !!errorsOnly;

      // Load cards
      if (errorsOnly) {
        currentCards = Flashcard.getNochmalCards(category, sub);
      } else {
        currentCards = Flashcard.getDueCards(category, sub);
      }

      // If no due cards, show all cards (shuffled)
      if (currentCards.length === 0 && !errorsOnly) {
        currentCards = Flashcard.shuffle(
          sub ? Flashcard.getCardsBySubcategory(category, sub) : Flashcard.getCardsByCategory(category)
        );
      }
    }

    errorToggle.onchange = () => {
      if (category === '_daily') return;
      const mode = errorToggle.checked ? '/errors' : '';
      navigate(`#learn/${category}/${sub}${mode}`);
    };

    currentCardIndex = 0;
    sessionRatings = { again: 0, hard: 0, good: 0, easy: 0 };

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

    if (isRevealCard(card) || card.isGenerated) {
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

    // Update UI
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('flipping');
    setTimeout(() => flashcard.classList.remove('flipping'), 400);
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

    // Flip animation
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('flipping');
    setTimeout(() => flashcard.classList.remove('flipping'), 400);

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

    // Don't persist generated cards (random time)
    if (!card.isGenerated) {
      Flashcard.rateCard(card.id, rating);
    }

    sessionRatings[rating]++;

    // Check for daily goal trigger
    checkDailyGoalTrigger();

    currentCardIndex++;
    showCurrentCard();
  }

  function checkDailyGoalTrigger() {
    const session = Storage.getTodaySession();
    const goal = Storage.getDailyGoal();
    if (!dailyGoalReached && session.reviewed >= goal) {
      dailyGoalReached = true;
      triggerConfetti();
    }
  }

  function showSessionSummary() {
    document.getElementById('flashcard-container').classList.add('hidden');
    const summary = document.getElementById('session-summary');
    summary.classList.remove('hidden');

    const total = sessionRatings.again + sessionRatings.hard + sessionRatings.good + sessionRatings.easy;
    const goodPercent = total > 0 ? Math.round(((sessionRatings.good + sessionRatings.easy) / total) * 100) : 0;

    document.getElementById('summary-stats').innerHTML = `
      <div>Karten: <strong>${total}</strong></div>
      <div class="summary-easy">Einfach: ${sessionRatings.easy}</div>
      <div class="summary-good">Gut: ${sessionRatings.good}</div>
      <div class="summary-hard">Schwer: ${sessionRatings.hard}</div>
      <div class="summary-again">Nochmal: ${sessionRatings.again}</div>
      <div>Gut/Einfach-Quote: <strong>${goodPercent}%</strong></div>
    `;

    // Confetti for >=80% good+easy and at least some cards
    if (goodPercent >= 80 && total > 0) {
      triggerConfetti();
    }

    // Check streak milestone
    const newStreak = Storage.getStreak();
    const milestones = [5, 10, 25, 50, 100];
    if (newStreak > previousStreak) {
      for (const m of milestones) {
        if (newStreak >= m && previousStreak < m) {
          triggerConfetti();
          break;
        }
      }
    }

    document.getElementById('summary-restart').onclick = () => {
      if (currentCategory === '_daily') {
        navigate('#learn/_daily/all');
        return;
      }
      const mode = document.getElementById('error-mode-toggle').checked ? '/errors' : '';
      navigate(`#learn/${currentCategory}/${currentSub}${mode}`);
    };

    document.getElementById('summary-back').onclick = () => {
      if (currentCategory === '_daily') {
        navigate('#dashboard');
        return;
      }
      const nonEmptySubs = Object.keys(CATEGORY_META[currentCategory]?.subs || {}).filter(s =>
        Flashcard.getCardsBySubcategory(currentCategory, s).length > 0 || s === 'random_time'
      );
      if (nonEmptySubs.length <= 1) {
        navigate('#dashboard');
      } else {
        navigate(`#category/${currentCategory}`);
      }
    };
  }

  // ===== Confetti =====
  function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63', '#00bcd4', '#ff9800'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const size = 6 + Math.random() * 8;

      piece.style.left = left + '%';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.background = color;
      piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
      piece.style.animationDelay = delay + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';

      container.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(() => {
      container.innerHTML = '';
    }, 4000);
  }

  // ===== Global Search =====
  function renderGlobalSearch(query) {
    const container = document.getElementById('global-search-results');
    if (!container) return;

    if (!query || query.length < 2) {
      container.innerHTML = '';
      container.style.display = 'none';
      // Show the grid again
      document.getElementById('category-grid').style.display = '';
      return;
    }

    // Hide category grid while searching
    document.getElementById('category-grid').style.display = 'none';
    container.style.display = 'block';

    const q = query.toLowerCase();
    const allCards = Flashcard.getAllCards().filter(c => !c.id.includes('_rev_'));
    const matches = allCards.filter(c =>
      c.front.includes(query) ||
      c.back.toLowerCase().includes(q) ||
      (c.romaji && c.romaji.toLowerCase().includes(q)) ||
      (c.hint && c.hint.toLowerCase().includes(q))
    ).slice(0, 50);

    if (matches.length === 0) {
      container.innerHTML = '<div class="search-no-results">Keine Treffer gefunden.</div>';
      return;
    }

    // Group by category
    const grouped = {};
    matches.forEach(card => {
      if (!grouped[card.category]) grouped[card.category] = [];
      grouped[card.category].push(card);
    });

    let html = '';
    for (const [cat, cards] of Object.entries(grouped)) {
      const meta = CATEGORY_META[cat];
      const label = meta ? `${meta.emoji} ${meta.name}` : cat;
      html += `<div class="global-search-group-title">${label}</div>`;
      html += '<div class="list-cards">';
      cards.forEach(card => {
        const romaji = card.romaji || '';
        const meaning = card.back || '';
        const hint = card.hint ? ` (${card.hint})` : '';
        const badge = getCardStatusBadge(card.id);
        html += `<div class="list-card-item">
          <div class="list-card-jp">${escapeHtml(card.front)} ${badge}</div>
          <div class="list-card-romaji">${escapeHtml(romaji)}</div>
          ${meaning ? `<div class="list-card-hint">${escapeHtml(meaning)}${escapeHtml(hint)}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // ===== List Overview =====
  function showListOverview() {
    const view = document.getElementById('view-dashboard');
    view.classList.add('active');

    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    // Hide dashboard header and daily challenge in list overview mode
    const header = document.getElementById('dashboard-header');
    if (header) header.innerHTML = '';
    const oldDailyInList = document.querySelector('.daily-challenge-card');
    if (oldDailyInList) oldDailyInList.remove();

    document.querySelector('#view-dashboard h2').textContent = 'Listen';

    // Global search field
    let searchInput = document.getElementById('global-search');
    let searchResults = document.getElementById('global-search-results');
    if (!searchInput) {
      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'global-search';
      searchInput.placeholder = 'Alle Karten durchsuchen...';
      grid.parentNode.insertBefore(searchInput, grid);
    }
    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.id = 'global-search-results';
      searchResults.className = 'global-search-results';
      searchResults.style.display = 'none';
      grid.parentNode.insertBefore(searchResults, grid);
    }
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    grid.style.display = '';

    searchInput.oninput = () => renderGlobalSearch(searchInput.value.trim());

    // Difficult cards virtual entry
    const difficultCards = getDifficultCards();
    if (difficultCards.length > 0) {
      const el = document.createElement('div');
      el.className = 'category-card';
      el.style.borderColor = 'var(--danger)';
      el.innerHTML = `
        <span class="category-emoji">🔴</span>
        <div class="category-name">Schwierigste Karten</div>
        <div class="category-count">${difficultCards.length} Einträge</div>
      `;
      el.addEventListener('click', () => navigate('#list/_difficult'));
      grid.appendChild(el);
    }

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
          !s.endsWith('_rev') && s !== 'all' && s !== 'all_rev' && s !== 'random_time' &&
          Flashcard.getCardsBySubcategory(cat, s).length > 0
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
      // Skip reverse/virtual subs and empty subs in list view
      if (sub.endsWith('_rev') || sub === 'all' || sub === 'all_rev' || sub === 'random_time') continue;
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

  // ===== Difficult Cards List =====
  function getDifficultCards() {
    const allCards = Flashcard.getAllCards();
    return allCards.filter(card => {
      const p = Storage.getProgress(card.id);
      return p && p.lastRating === 'again';
    });
  }

  function showDifficultList() {
    const view = document.getElementById('view-list');
    view.classList.add('active');

    document.getElementById('list-title').textContent = 'Schwierigste Karten';
    document.getElementById('list-back').onclick = () => navigate('#list-overview');

    const cards = getDifficultCards();
    const search = document.getElementById('list-search');
    search.value = '';

    function renderList(filter) {
      let filtered = cards.filter(c => !c.id.includes('_rev_'));
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
      let tableHtml = `<table class="list-table"><thead><tr>
        <th>Japanisch</th><th>Romaji</th><th>Bedeutung</th><th>Status</th>
      </tr></thead><tbody>`;
      let cardsHtml = '<div class="list-cards">';

      filtered.forEach(card => {
        const romaji = card.romaji || '';
        const meaning = card.back || '';
        const hint = card.hint ? ` (${card.hint})` : '';
        const badge = getCardStatusBadge(card.id);
        tableHtml += `<tr>
          <td class="jp-col">${escapeHtml(card.front)}</td>
          <td>${escapeHtml(romaji)}</td>
          <td>${escapeHtml(meaning)}${escapeHtml(hint)}</td>
          <td>${badge}</td>
        </tr>`;
        cardsHtml += `<div class="list-card-item">
          <div class="list-card-jp">${escapeHtml(card.front)} ${badge}</div>
          <div class="list-card-romaji">${escapeHtml(romaji)}</div>
          <div class="list-card-hint">${escapeHtml(meaning)}${escapeHtml(hint)}</div>
        </div>`;
      });

      tableHtml += '</tbody></table>';
      cardsHtml += '</div>';
      content.innerHTML = filtered.length > 0
        ? tableHtml + cardsHtml
        : '<p style="color:var(--text-secondary);text-align:center;padding:24px;">Keine schwierigen Karten vorhanden.</p>';
    }

    renderList('');
    search.oninput = () => renderList(search.value);
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
        !s.endsWith('_rev') && s !== 'all' && s !== 'all_rev' && s !== 'random_time' &&
        Flashcard.getCardsBySubcategory(category, s).length > 0
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
        <th>Status</th>
      </tr></thead><tbody>`;

      // Cards for mobile
      let cardsHtml = '<div class="list-cards">';

      filtered.forEach(card => {
        const badge = getCardStatusBadge(card.id);
        if (isKana) {
          // Kana: front = character, back = romaji
          tableHtml += `<tr>
            <td class="jp-col">${escapeHtml(card.front)}</td>
            <td>${escapeHtml(card.back)}</td>
            <td>${badge}</td>
          </tr>`;
          cardsHtml += `<div class="list-card-item">
            <div class="list-card-jp">${escapeHtml(card.front)} ${badge}</div>
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
            <td>${badge}</td>
          </tr>`;
          cardsHtml += `<div class="list-card-item">
            <div class="list-card-jp">${escapeHtml(card.front)} ${badge}</div>
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
    const todayTotal = today.reviewed;
    const todayGoodRate = todayTotal > 0
      ? Math.round(((today.good + today.easy) / todayTotal) * 100) : 0;

    document.getElementById('stats-today-content').innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Gelernte Karten</span>
        <span class="stat-value">${todayTotal}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Einfach</span>
        <span class="stat-value" style="color:var(--accent)">${today.easy || 0}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Gut</span>
        <span class="stat-value" style="color:var(--success)">${today.good || 0}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Schwer</span>
        <span class="stat-value" style="color:var(--warning)">${today.hard || 0}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Nochmal</span>
        <span class="stat-value" style="color:var(--danger)">${today.again || 0}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Gut/Einfach-Quote</span>
        <span class="stat-value">${todayGoodRate}%</span>
      </div>
    `;

    // 7-Day bar chart
    renderWeekChart();

    // Heatmap
    renderHeatmap();

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
        <span class="stat-label">Gut/Einfach-Quote</span>
        <span class="stat-value">${overall.goodRate}%</span>
      </div>
    `;

    let catHtml = '';
    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      const cards = Flashcard.getCardsByCategory(cat);
      if (cards.length === 0) continue;

      const s = Stats.getCategoryStats(cat);
      const rated = s.ratings.again + s.ratings.hard + s.ratings.good + s.ratings.easy;
      const goodRate = rated > 0 ? Math.round(((s.ratings.good + s.ratings.easy) / rated) * 100) : 0;
      catHtml += `
        <div class="stat-row">
          <span class="stat-label">${meta.emoji} ${meta.name}</span>
          <span class="stat-value">${s.learned}/${s.total} gelernt</span>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width:${s.percent}%"></div>
        </div>
        <div class="stat-row-sub">
          <span class="stat-label">Gut/Einfach-Quote</span>
          <span class="stat-value">${goodRate}%</span>
        </div>
      `;
    }
    document.getElementById('stats-categories-content').innerHTML = catHtml;
  }

  // ===== Week Chart =====
  function renderWeekChart() {
    const container = document.getElementById('stats-week-chart');
    if (!container) return;

    const days = Stats.getLast7Days();
    const maxReviewed = Math.max(...days.map(d => d.reviewed), 1);

    let html = '<div class="week-chart">';
    days.forEach(day => {
      const easyWidth = (day.easy / maxReviewed) * 100;
      const goodWidth = (day.good / maxReviewed) * 100;
      const hardWidth = (day.hard / maxReviewed) * 100;
      const againWidth = (day.again / maxReviewed) * 100;
      html += `
        <div class="week-chart-row">
          <span class="week-chart-label">${day.label}</span>
          <div class="week-chart-bar-container">
            <div class="week-chart-bar-easy" style="width: ${easyWidth}%"></div>
            <div class="week-chart-bar-good" style="width: ${goodWidth}%"></div>
            <div class="week-chart-bar-hard" style="width: ${hardWidth}%"></div>
            <div class="week-chart-bar-again" style="width: ${againWidth}%"></div>
          </div>
          <span class="week-chart-count">${day.reviewed}</span>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ===== Heatmap =====
  function renderHeatmap() {
    const container = document.getElementById('stats-heatmap-content');
    if (!container) return;

    const cells = Stats.getHeatmapData(90);
    if (cells.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;">Noch keine Daten vorhanden.</p>';
      return;
    }

    // Find max for level calculation
    const maxReviewed = Math.max(...cells.map(c => c.reviewed), 1);

    function getLevel(reviewed) {
      if (reviewed === 0) return 0;
      const ratio = reviewed / maxReviewed;
      if (ratio <= 0.25) return 1;
      if (ratio <= 0.5) return 2;
      if (ratio <= 0.75) return 3;
      return 4;
    }

    // Build month labels
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    // Calculate weeks for month label placement
    const weeks = [];
    let currentWeek = [];
    cells.forEach((cell, i) => {
      currentWeek.push(cell);
      if (currentWeek.length === 7 || i === cells.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Month labels with separator gaps
    let monthHtml = '<div class="heatmap-months">';
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();

      // Insert separator label when new month starts (not on first week)
      if (month !== lastMonth && lastMonth !== -1) {
        monthHtml += '<span class="heatmap-month-label heatmap-separator-label"></span>';
      }

      if (month !== lastMonth) {
        monthHtml += `<span class="heatmap-month-label">${monthNames[month]}</span>`;
        lastMonth = month;
      } else {
        monthHtml += '<span class="heatmap-month-label"></span>';
      }
    });
    monthHtml += '</div>';

    // Grid
    let gridHtml = '<div class="heatmap-grid">';

    // Day labels column
    dayLabels.forEach(label => {
      gridHtml += `<div class="heatmap-day-label">${label}</div>`;
    });

    // Data columns (each week) with month separators
    let prevMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();

      // Insert separator column when new month starts (not on first week)
      if (month !== prevMonth && prevMonth !== -1) {
        for (let i = 0; i < 7; i++) {
          gridHtml += '<div class="heatmap-separator"></div>';
        }
      }
      prevMonth = month;

      // Pad incomplete weeks
      while (week.length < 7) {
        week.push({ date: '', reviewed: 0, dayOfWeek: week.length });
      }
      week.forEach(cell => {
        const level = cell.date ? getLevel(cell.reviewed) : 0;
        const title = cell.date ? `${cell.date}: ${cell.reviewed} Karten` : '';
        gridHtml += `<div class="heatmap-cell level-${level}" title="${title}"></div>`;
      });
    });

    gridHtml += '</div>';

    // Legend
    const legendHtml = `
      <div class="heatmap-legend">
        <span>Weniger</span>
        <div class="heatmap-cell level-0"></div>
        <div class="heatmap-cell level-1"></div>
        <div class="heatmap-cell level-2"></div>
        <div class="heatmap-cell level-3"></div>
        <div class="heatmap-cell level-4"></div>
        <span>Mehr</span>
      </div>
    `;

    container.innerHTML = `
      <div class="heatmap-container">
        ${monthHtml}
        ${gridHtml}
      </div>
      ${legendHtml}
    `;
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

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't fire when typing in input
      if (document.activeElement && document.activeElement.id === 'answer-input') return;
      // Only in flashcard view
      const flashcardView = document.getElementById('view-flashcard');
      if (!flashcardView || !flashcardView.classList.contains('active')) return;

      const ratingBtns = document.getElementById('rating-buttons');
      const revealBtn = document.getElementById('reveal-btn');

      // 1/2/3/4 → rate when rating buttons visible
      if (ratingBtns && !ratingBtns.classList.contains('hidden')) {
        if (e.key === '1') { rateAndNext('again'); e.preventDefault(); }
        else if (e.key === '2') { rateAndNext('hard'); e.preventDefault(); }
        else if (e.key === '3') { rateAndNext('good'); e.preventDefault(); }
        else if (e.key === '4') { rateAndNext('easy'); e.preventDefault(); }
      }

      // Enter/Space → reveal when reveal button visible
      if (revealBtn && !revealBtn.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          revealCurrentCard();
          e.preventDefault();
        }
      }
    });

    setupExportImport();

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // Initialize today's session (triggers history save on day change)
    Storage.getTodaySession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigate };
})();
