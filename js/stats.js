// ===== Statistik-Berechnungen =====
const Stats = (() => {
  function getCategoryStats(category) {
    const cards = Flashcard.getCardsByCategory(category);
    const total = cards.length;
    if (total === 0) return { total: 0, learned: 0, correct: 0, wrong: 0, percent: 0 };

    let learned = 0;
    let correct = 0;
    let wrong = 0;

    cards.forEach(card => {
      const p = Storage.getProgress(card.id);
      if (p) {
        learned++;
        correct += p.correct || 0;
        wrong += p.wrong || 0;
      }
    });

    const attempts = correct + wrong;
    const hitRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

    return {
      total,
      learned,
      correct,
      wrong,
      percent: Math.round((learned / total) * 100),
      hitRate
    };
  }

  function getOverallStats() {
    const allCards = Flashcard.getAllCards();
    const total = allCards.length;
    const progress = Storage.getAllProgress();
    const learned = Object.keys(progress).length;
    let correct = 0;
    let wrong = 0;

    Object.values(progress).forEach(p => {
      correct += p.correct || 0;
      wrong += p.wrong || 0;
    });

    const attempts = correct + wrong;
    const hitRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

    return {
      total,
      learned,
      correct,
      wrong,
      percent: total > 0 ? Math.round((learned / total) * 100) : 0,
      hitRate
    };
  }

  function getTodayStats() {
    return Storage.getTodaySession();
  }

  function getDueCount(category) {
    return Flashcard.getDueCards(category).length;
  }

  return {
    getCategoryStats,
    getOverallStats,
    getTodayStats,
    getDueCount
  };
})();
