// ===== localStorage Verwaltung =====
const Storage = (() => {
  const PROGRESS_KEY = 'nihongo_progress';
  const SESSION_KEY = 'nihongo_session';

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

  // Session stats (today)
  function getTodaySession() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
      if (session.date !== today) {
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
  }

  function exportData() {
    return JSON.stringify({
      progress: _getAll(),
      session: getTodaySession(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress) {
        _saveAll(data.progress);
      }
      return true;
    } catch {
      return false;
    }
  }

  function clearAll() {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  return {
    getProgress,
    setProgress,
    getAllProgress,
    getTodaySession,
    updateTodaySession,
    exportData,
    importData,
    clearAll
  };
})();
