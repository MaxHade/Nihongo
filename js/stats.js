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

  // ===== Chart Data =====
  function getLast7Days() {
    const history = Storage.getHistory();
    const today = Storage.getTodaySession();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      const label = dayNames[d.getDay()];

      let data = history[dateStr];
      if (dateStr === today.date && today.reviewed > 0) {
        data = { reviewed: today.reviewed, correct: today.correct, wrong: today.wrong };
      }

      days.push({
        date: dateStr,
        label,
        reviewed: data ? data.reviewed : 0,
        correct: data ? data.correct : 0,
        wrong: data ? data.wrong : 0
      });
    }
    return days;
  }

  function getHeatmapData(numDays) {
    numDays = numDays || 90;
    const history = Storage.getHistory();
    const today = Storage.getTodaySession();
    const cells = [];

    // Find the starting Monday to align the grid
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays + 1);
    // Go back to the previous Monday
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const endDate = new Date();
    const d = new Date(startDate);

    while (d <= endDate) {
      const dateStr = d.toISOString().slice(0, 10);
      let data = history[dateStr];
      if (dateStr === today.date && today.reviewed > 0) {
        data = { reviewed: today.reviewed, correct: today.correct, wrong: today.wrong };
      }
      cells.push({
        date: dateStr,
        reviewed: data ? data.reviewed : 0,
        dayOfWeek: d.getDay()
      });
      d.setDate(d.getDate() + 1);
    }

    return cells;
  }

  return {
    getCategoryStats,
    getOverallStats,
    getTodayStats,
    getDueCount,
    getLast7Days,
    getHeatmapData
  };
})();
