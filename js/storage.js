// ===== localStorage Verwaltung =====
const Storage = (() => {
  const PROGRESS_KEY = 'nihongo_progress';
  const SESSION_KEY = 'nihongo_session';
  const HISTORY_KEY = 'nihongo_history';
  const DAILY_GOAL_KEY = 'nihongo_daily_goal';
  const VERSION_KEY = 'nihongo_data_version';
  const CURRENT_VERSION = 3;

  // ===== Migration =====
  function _migrate() {
    const version = parseInt(localStorage.getItem(VERSION_KEY)) || 0;
    if (version >= CURRENT_VERSION) return;

    // Migrate card progress: add lastRating
    const progress = _getAll();
    let changed = false;
    for (const id of Object.keys(progress)) {
      if (!('lastRating' in progress[id])) {
        progress[id].lastRating = null;
        changed = true;
      }
    }
    if (changed) _saveAll(progress);

    // Migrate session: correct/wrong → again/hard/good/easy
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session && ('correct' in session || 'wrong' in session)) {
        const migrated = {
          date: session.date,
          reviewed: session.reviewed || 0,
          again: 0,
          easy: session.correct || 0
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(migrated));
      }
    } catch {}

    // Migrate history: correct/wrong → again/hard/good/easy
    const history = _getHistory();
    let historyChanged = false;
    for (const date of Object.keys(history)) {
      const entry = history[date];
      if ('correct' in entry || 'wrong' in entry) {
        history[date] = {
          reviewed: entry.reviewed || 0,
          again: 0,
          easy: entry.correct || 0
        };
        historyChanged = true;
      }
    }
    if (historyChanged) _saveHistory(history);

    // Remove old reminders key
    localStorage.removeItem('nihongo_reminders');

    // v3: Migrate hard→again, good→easy (2-button system)
    if (version < 3) {
      const prog = _getAll();
      let progChanged = false;
      for (const id of Object.keys(prog)) {
        if (prog[id].lastRating === 'hard') {
          prog[id].lastRating = 'again';
          prog[id].interval = 60 * 60 * 1000;
          prog[id].nextReview = (prog[id].lastReview || Date.now()) + 60 * 60 * 1000;
          progChanged = true;
        } else if (prog[id].lastRating === 'good') {
          prog[id].lastRating = 'easy';
          prog[id].interval = 21 * 24 * 60 * 60 * 1000;
          prog[id].nextReview = (prog[id].lastReview || Date.now()) + 21 * 24 * 60 * 60 * 1000;
          progChanged = true;
        }
      }
      if (progChanged) _saveAll(prog);

      // Migrate session
      try {
        const sess = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (sess && ('hard' in sess || 'good' in sess)) {
          sess.again = (sess.again || 0) + (sess.hard || 0);
          sess.easy = (sess.easy || 0) + (sess.good || 0);
          delete sess.hard;
          delete sess.good;
          localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
        }
      } catch {}

      // Migrate history
      const hist = _getHistory();
      let hChanged = false;
      for (const date of Object.keys(hist)) {
        const e = hist[date];
        if ('hard' in e || 'good' in e) {
          e.again = (e.again || 0) + (e.hard || 0);
          e.easy = (e.easy || 0) + (e.good || 0);
          delete e.hard;
          delete e.good;
          hChanged = true;
        }
      }
      if (hChanged) _saveHistory(hist);
    }

    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  }

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
      again: session.again || 0,
      easy: session.easy || 0
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
        return { date: today, reviewed: 0, again: 0, easy: 0 };
      }
      return session;
    } catch {
      return { date: today, reviewed: 0, again: 0, easy: 0 };
    }
  }

  function updateTodaySession(rating) {
    const session = getTodaySession();
    session.reviewed++;
    if (session[rating] !== undefined) {
      session[rating]++;
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

    // Only count days where daily goal was reached
    const goal = getDailyGoal();
    let streak = 0;
    let date = new Date();

    // Check if today counts
    const todayData = history[today] || (session.reviewed >= goal ? session : null);
    if (!todayData || todayData.reviewed < goal) {
      // Today doesn't count — start checking from yesterday
      date.setDate(date.getDate() - 1);
    }

    // Count consecutive days
    while (true) {
      const dateStr = date.toISOString().slice(0, 10);
      const dayData = history[dateStr];
      if (dayData && dayData.reviewed >= goal) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else if (dateStr === today && session.reviewed >= goal) {
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
      // Re-run migration after import
      _migrate();
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

  // Run migration on load
  _migrate();

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
    exportData,
    importData,
    clearAll
  };
})();
