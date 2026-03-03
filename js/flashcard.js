// ===== Karteikarten-Engine & Spaced Repetition =====
const Flashcard = (() => {
  const INTERVALS = {
    again: 60 * 60 * 1000,           // 1 hour
    hard: 24 * 60 * 60 * 1000,       // 1 day
    good: 7 * 24 * 60 * 60 * 1000,   // 7 days
    easy: 21 * 24 * 60 * 60 * 1000   // 21 days
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getAllCards() {
    const sources = [
      typeof DATA_HIRAGANA !== 'undefined' ? DATA_HIRAGANA : [],
      typeof DATA_KATAKANA !== 'undefined' ? DATA_KATAKANA : [],
      typeof DATA_DATES !== 'undefined' ? DATA_DATES : [],
      typeof DATA_TIMES !== 'undefined' ? DATA_TIMES : [],
      typeof DATA_NUMBERS !== 'undefined' ? DATA_NUMBERS : [],
      typeof DATA_VOCABULARY !== 'undefined' ? DATA_VOCABULARY : [],
      typeof DATA_PARTICLES !== 'undefined' ? DATA_PARTICLES : [],
      typeof DATA_GREETINGS !== 'undefined' ? DATA_GREETINGS : [],
      typeof DATA_LESSONS !== 'undefined' ? DATA_LESSONS : []
    ];
    return sources.flat();
  }

  function getCardsByCategory(category) {
    return getAllCards().filter(c => c.category === category);
  }

  function getCardsBySubcategory(category, sub) {
    // Virtual subcategories for hiragana/katakana
    if ((category === 'hiragana' || category === 'katakana') && sub === 'all') {
      return getAllCards().filter(c => c.category === category && ['gojuuon', 'dakuten', 'combo'].includes(c.sub));
    }
    if ((category === 'hiragana' || category === 'katakana') && sub === 'all_rev') {
      return getAllCards().filter(c => c.category === category && ['gojuuon_rev', 'dakuten_rev', 'combo_rev'].includes(c.sub));
    }
    return getAllCards().filter(c => c.category === category && c.sub === sub);
  }

  function getDueCards(category, sub) {
    const now = Date.now();
    let cards = sub ? getCardsBySubcategory(category, sub) : getCardsByCategory(category);
    return shuffle(cards.filter(card => {
      const progress = Storage.getProgress(card.id);
      if (!progress) return true; // never reviewed = due
      return progress.nextReview <= now;
    }));
  }

  function getNochmalCards(category, sub) {
    let cards = sub ? getCardsBySubcategory(category, sub) : getCardsByCategory(category);
    return shuffle(cards.filter(card => {
      const progress = Storage.getProgress(card.id);
      return progress && progress.lastRating === 'again';
    }));
  }

  function rateCard(cardId, rating) {
    const interval = INTERVALS[rating];
    const now = Date.now();
    const existing = Storage.getProgress(cardId) || {};

    Storage.setProgress(cardId, {
      nextReview: now + interval,
      interval: interval,
      lastRating: rating,
      lastReview: now
    });

    Storage.updateTodaySession(rating);
  }

  function checkAnswer(input, expected) {
    // Case-insensitive, normalize whitespace and German umlauts
    const normalize = s => s.trim().toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    return normalize(input) === normalize(expected);
  }

  function getCategories() {
    const all = getAllCards();
    const cats = {};
    all.forEach(card => {
      if (!cats[card.category]) {
        cats[card.category] = new Set();
      }
      if (card.sub) {
        cats[card.category].add(card.sub);
      }
    });
    const result = {};
    for (const [cat, subs] of Object.entries(cats)) {
      result[cat] = [...subs];
    }
    return result;
  }

  function getCategoryCards(category) {
    return getCardsByCategory(category);
  }

  return {
    getAllCards,
    getCardsByCategory,
    getCardsBySubcategory,
    getDueCards,
    getNochmalCards,
    rateCard,
    checkAnswer,
    getCategories,
    getCategoryCards,
    shuffle
  };
})();
