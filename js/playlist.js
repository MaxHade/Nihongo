// ===== Audio Playlist Module =====
const Playlist = (() => {
  let tracks = [];
  let currentIndex = 0;
  let audio = null;
  let playing = false;

  function init(trackList) {
    tracks = trackList || [];
    currentIndex = 0;
    playing = false;
    if (!audio) {
      audio = new Audio();
      audio.addEventListener('ended', () => {
        next();
      });
      audio.addEventListener('timeupdate', () => {
        updateProgress();
      });
      audio.addEventListener('error', () => {
        const titleEl = document.getElementById('playlist-track-title');
        if (titleEl) titleEl.textContent = 'Audio nicht verfügbar';
        playing = false;
        updatePlayButton();
      });
      audio.addEventListener('loadedmetadata', () => {
        const totalEl = document.getElementById('playlist-time-total');
        if (totalEl) totalEl.textContent = formatTime(audio.duration);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    if (tracks.length > 0) {
      loadTrack(0);
    }
  }

  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    currentIndex = index;
    audio.src = tracks[index].src;
    audio.load();
    const titleEl = document.getElementById('playlist-track-title');
    if (titleEl) titleEl.textContent = tracks[index].title;
    const currentEl = document.getElementById('playlist-time-current');
    if (currentEl) currentEl.textContent = '0:00';
    const totalEl = document.getElementById('playlist-time-total');
    if (totalEl) totalEl.textContent = '0:00';
    const fillEl = document.getElementById('playlist-progress-fill');
    if (fillEl) fillEl.style.width = '0%';
    highlightTrack();
  }

  function play() {
    if (!audio || tracks.length === 0) return;
    audio.play().then(() => {
      playing = true;
      updatePlayButton();
    }).catch(() => {
      const titleEl = document.getElementById('playlist-track-title');
      if (titleEl) titleEl.textContent = 'Audio nicht verfügbar';
      playing = false;
      updatePlayButton();
    });
  }

  function pause() {
    if (!audio) return;
    audio.pause();
    playing = false;
    updatePlayButton();
  }

  function togglePlayPause() {
    if (playing) {
      pause();
    } else {
      play();
    }
  }

  function next() {
    if (currentIndex < tracks.length - 1) {
      loadTrack(currentIndex + 1);
      play();
    } else {
      pause();
    }
  }

  function prev() {
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (currentIndex > 0) {
      loadTrack(currentIndex - 1);
      play();
    }
  }

  function seekTo(fraction) {
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
  }

  function updateProgress() {
    if (!audio || !audio.duration) return;
    const currentEl = document.getElementById('playlist-time-current');
    if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
    const fillEl = document.getElementById('playlist-progress-fill');
    if (fillEl) fillEl.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
  }

  function updatePlayButton() {
    const btn = document.getElementById('playlist-play');
    if (btn) btn.textContent = playing ? '❚❚' : '▶';
  }

  function highlightTrack() {
    const items = document.querySelectorAll('.playlist-track-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  function getCurrentTrack() {
    return tracks[currentIndex] || null;
  }

  function isPlaying() {
    return playing;
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  return {
    init,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    next,
    prev,
    seekTo,
    getCurrentTrack,
    getCurrentIndex,
    isPlaying,
    formatTime,
    highlightTrack
  };
})();
