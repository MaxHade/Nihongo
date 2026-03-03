// ===== localStorage Verwaltung =====
const Storage = (() => {
  const PROGRESS_KEY = 'nihongo_progress';
  const SESSION_KEY = 'nihongo_session';
  const HISTORY_KEY = 'nihongo_history';
  const DAILY_GOAL_KEY = 'nihongo_daily_goal';
  const REMINDERS_KEY = 'nihongo_reminders';

  function _getAll() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function _saveAll(data) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  }

  function getProgress(cardId) {
    const all = _getAll();
    return all[cardId] || null;
  }

  function setProgress(cardId, data) {
    const all = _getAll();
    all[cardId] = data;
    _saveAll(all);
  }

  function getAllProgress() {
    return _getAll();
  }

  // ===== History =====
  function _getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {};
    } catch {
      return {};
    }
  }

  function _saveHistory(data) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
  }

  function saveDayToHistory(session) {
    if (!session || !session.date || session.reviewed === 0) return;
    const history = _getHistory();
    history[session.date] = {
      reviewed: session.reviewed,
      correct: session.correct,
      wrong: session.wrong
    };
    _saveHistory(history);
  }

  function getHistory() {
    return _getHistory();
  }

  // Session stats (today)
  function getTodaySession() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
      if (session.date !== today) {
        // Day changed — save old session to history before resetting
        if (session.date && session.reviewed > 0) {
          saveDayToHistory(session);
        }
        return { date: today, correct: 0, wrong: 0, reviewed: 0 };
      }
      return session;
    } catch {
      return { date: today, correct: 0, wrong: 0, reviewed: 0 };
    }
  }

  function updateTodaySession(correct) {
    const session = getTodaySession();
    session.reviewed++;
    if (correct) {
      session.correct++;
    } else {
      session.wrong++;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Also keep history in sync for today
    saveDayToHistory(session);
  }

  // ===== Streak =====
  function getStreak() {
    const history = _getHistory();
    const today = new Date().toISOString().slice(0, 10);
    const session = getTodaySession();

    // Include today if user has reviewed
    let streak = 0;
    let date = new Date();

    // Check if today counts
    const todayData = history[today] || (session.reviewed > 0 ? session : null);
    if (!todayData || todayData.reviewed === 0) {
      // Today doesn't count — start checking from yesterday
      date.setDate(date.getDate() - 1);
    }

    // Count consecutive days
    while (true) {
      const dateStr = date.toISOString().slice(0, 10);
      const dayData = history[dateStr];
      if (dayData && dayData.reviewed > 0) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else if (dateStr === today && session.reviewed > 0) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // ===== Daily Goal =====
  function getDailyGoal() {
    try {
      const val = parseInt(localStorage.getItem(DAILY_GOAL_KEY));
      return isNaN(val) ? 20 : val;
    } catch {
      return 20;
    }
  }

  function setDailyGoal(n) {
    localStorage.setItem(DAILY_GOAL_KEY, String(Math.max(1, Math.round(n))));
  }

  // ===== Reminders =====
  function getRemindersEnabled() {
    return localStorage.getItem(REMINDERS_KEY) === 'true';
  }

  function setRemindersEnabled(enabled) {
    localStorage.setItem(REMINDERS_KEY, String(!!enabled));
  }

  // ===== Export/Import =====
  function exportData() {
    return JSON.stringify({
      progress: _getAll(),
      session: getTodaySession(),
      history: _getHistory(),
      dailyGoal: getDailyGoal(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress) {
        _saveAll(data.progress);
      }
      if (data.history) {
        // Merge imported history with existing
        const existing = _getHistory();
        const merged = { ...existing, ...data.history };
        _saveHistory(merged);
      }
      if (data.dailyGoal) {
        setDailyGoal(data.dailyGoal);
      }
      return true;
    } catch {
      return false;
    }
  }

  function clearAll() {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(DAILY_GOAL_KEY);
  }

  return {
    getProgress,
    setProgress,
    getAllProgress,
    getTodaySession,
    updateTodaySession,
    getHistory,
    getStreak,
    getDailyGoal,
    setDailyGoal,
    getRemindersEnabled,
    setRemindersEnabled,
    exportData,
    importData,
    clearAll
  };
})();
