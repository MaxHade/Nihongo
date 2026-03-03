// ===== Statistik-Berechnungen =====
const Stats = (() => {
  function getCategoryStats(category) {
    const cards = Flashcard.getCardsByCategory(category);
    const total = cards.length;
    if (total === 0) return { total: 0, learned: 0, percent: 0, ratings: { again: 0, hard: 0, good: 0, easy: 0 } };

    let learned = 0;
    const ratings = { again: 0, hard: 0, good: 0, easy: 0 };

    cards.forEach(card => {
      const p = Storage.getProgress(card.id);
      if (p) {
        learned++;
        if (p.lastRating && ratings[p.lastRating] !== undefined) {
          ratings[p.lastRating]++;
        }
      }
    });

    return {
      total,
      learned,
      percent: Math.round((learned / total) * 100),
      ratings
    };
  }

  function getOverallStats() {
    const allCards = Flashcard.getAllCards();
    const total = allCards.length;
    const progress = Storage.getAllProgress();
    const learned = Object.keys(progress).length;
    const ratings = { again: 0, hard: 0, good: 0, easy: 0 };

    Object.values(progress).forEach(p => {
      if (p.lastRating && ratings[p.lastRating] !== undefined) {
        ratings[p.lastRating]++;
      }
    });

    const rated = ratings.again + ratings.hard + ratings.good + ratings.easy;
    const goodRate = rated > 0 ? Math.round(((ratings.good + ratings.easy) / rated) * 100) : 0;

    return {
      total,
      learned,
      percent: total > 0 ? Math.round((learned / total) * 100) : 0,
      ratings,
      goodRate
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
        data = { reviewed: today.reviewed, again: today.again, hard: today.hard, good: today.good, easy: today.easy };
      }

      days.push({
        date: dateStr,
        label,
        reviewed: data ? data.reviewed : 0,
        again: data ? (data.again || 0) : 0,
        hard: data ? (data.hard || 0) : 0,
        good: data ? (data.good || 0) : 0,
        easy: data ? (data.easy || 0) : 0
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
        data = { reviewed: today.reviewed };
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
