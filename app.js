/**
 * Marvel Multiverse Roadmap - Main Application Logic
 * Full release-order marathon ending at Avengers: Doomsday (2026-12-18).
 */

(function () {
  'use strict';

  // Constants
  const STORAGE_KEY_WATCHED = 'marvel_roadmap_watched_v1';
  const STORAGE_KEY_SKIPPED = 'marvel_roadmap_skipped_v1';
  const STORAGE_KEY_RATINGS = 'marvel_roadmap_ratings_v1';
  const DOOMSDAY_DATE = new Date('2026-12-18T00:00:00');

  // State
  let items = typeof MARVEL_DATA !== 'undefined' ? MARVEL_DATA : [];
  let watchedSet = new Set();
  let skippedSet = new Set();
  let ratingsMap = {}; // { [id]: number }
  let activeFilter = 'all';
  let activeStatus = 'all';
  let searchQuery = '';
  let activeHeroLayer = 'A';
  let currentActiveId = 1;

  // DOM Elements
  const timelineList = document.getElementById('timelineList');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const heroBgA = document.getElementById('heroBgA');
  const heroBgB = document.getElementById('heroBgB');
  const onlineCount = document.getElementById('onlineCount');
  const continueBtn = document.getElementById('continueBtn');
  const continueTitle = document.getElementById('continueTitle');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const jumpTopBtn = document.getElementById('jumpTopBtn');

  // HUD Elements
  const hudHoursLeft = document.getElementById('hudHoursLeft');
  const hudPace = document.getElementById('hudPace');
  const hudDoneCount = document.getElementById('hudDoneCount');
  const hudTotalCount = document.getElementById('hudTotalCount');
  const hudDonePct = document.getElementById('hudDonePct');
  const hudProgressBar = document.getElementById('hudProgressBar');

  // Modals & Buttons
  const trailerModal = document.getElementById('trailerModal');
  const trailerModalTitle = document.getElementById('trailerModalTitle');
  const trailerIframe = document.getElementById('trailerIframe');
  const closeTrailerBtn = document.getElementById('closeTrailerBtn');
  const openExternalTrailerBtn = document.getElementById('openExternalTrailerBtn');

  const calendarFab = document.getElementById('calendarFab');
  const calendarModal = document.getElementById('calendarModal');
  const closeCalendarBtn = document.getElementById('closeCalendarBtn');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');
  const calDaysLeft = document.getElementById('calDaysLeft');
  const calWatchLeft = document.getElementById('calWatchLeft');
  const calPaceVal = document.getElementById('calPaceVal');
  const calDoneVal = document.getElementById('calDoneVal');

  const shareBtn = document.getElementById('shareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const resetProgressBtn = document.getElementById('resetProgressBtn');
  const toastContainer = document.getElementById('toastContainer');

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------
  function init() {
    loadStorage();
    setupEventListeners();
    renderTimeline();
    updateStats();
    updateContinueButton();
    startOnlineCounterSimulation();

    // Set initial background to #1 or first item
    if (items.length > 0) {
      setBackground(items[0].id);
    }

    setupIntersectionObserver();
  }

  // -------------------------------------------------------------------------
  // LocalStorage Management
  // -------------------------------------------------------------------------
  function loadStorage() {
    try {
      const watched = localStorage.getItem(STORAGE_KEY_WATCHED);
      if (watched) {
        watchedSet = new Set(JSON.parse(watched));
      }
      const skipped = localStorage.getItem(STORAGE_KEY_SKIPPED);
      if (skipped) {
        skippedSet = new Set(JSON.parse(skipped));
      }
      const ratings = localStorage.getItem(STORAGE_KEY_RATINGS);
      if (ratings) {
        ratingsMap = JSON.parse(ratings);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage:', e);
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHED, JSON.stringify([...watchedSet]));
      localStorage.setItem(STORAGE_KEY_SKIPPED, JSON.stringify([...skippedSet]));
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratingsMap));
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e);
    }
  }

  // -------------------------------------------------------------------------
  // Statistics & Pace Calculation
  // -------------------------------------------------------------------------
  function updateStats() {
    const totalItems = items.length;
    let watchedCount = 0;
    let remainingMinutes = 0;

    items.forEach(item => {
      const isWatched = watchedSet.has(item.id);
      const isSkipped = skippedSet.has(item.id);

      if (isWatched) {
        watchedCount++;
      } else if (!isSkipped) {
        remainingMinutes += (item.runtime_mins || 120);
      }
    });

    // Watch Time Left
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    hudHoursLeft.textContent = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    // Days until Avengers: Doomsday (2026-12-18)
    const now = new Date();
    const diffTime = DOOMSDAY_DATE - now;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Pace (hours/day needed)
    const hoursLeft = remainingMinutes / 60;
    const paceHPerDay = (hoursLeft / diffDays).toFixed(1);
    hudPace.textContent = `${paceHPerDay}h/d`;

    // Done Count & Percentage
    const donePct = totalItems > 0 ? Math.round((watchedCount / totalItems) * 100) : 0;
    hudDoneCount.textContent = watchedCount;
    hudTotalCount.textContent = totalItems;
    hudDonePct.textContent = `${donePct}%`;
    hudProgressBar.style.width = `${donePct}%`;

    // Update calendar modal stats
    calDaysLeft.textContent = diffDays;
    calWatchLeft.textContent = `${hours}h ${mins}m`;
    calPaceVal.textContent = `${paceHPerDay}h/d`;
    calDoneVal.textContent = `${watchedCount}/${totalItems} (${donePct}%)`;
  }

  // -------------------------------------------------------------------------
  // Next Unwatched "Continue" Finder
  // -------------------------------------------------------------------------
  function updateContinueButton() {
    const nextItem = items.find(it => !watchedSet.has(it.id) && !skippedSet.has(it.id));
    if (nextItem) {
      continueTitle.textContent = `${nextItem.title} (${nextItem.year})`;
      continueBtn.style.display = 'inline-flex';
      continueBtn.onclick = () => scrollToItem(nextItem.id);
    } else {
      continueTitle.textContent = 'All Completed! Ready for Doomsday';
      continueBtn.onclick = () => showToast('🎉 You have completed the entire Multiverse Roadmap!');
    }
  }

  function scrollToItem(id) {
    const el = document.getElementById(`title-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('is-active');
      setTimeout(() => el.classList.remove('is-active'), 2000);
      setBackground(id);
    }
  }

  // -------------------------------------------------------------------------
  // Render Timeline
  // -------------------------------------------------------------------------
  function renderTimeline() {
    timelineList.innerHTML = '';

    const filteredItems = items.filter(item => {
      // Universe filter
      if (activeFilter !== 'all' && item.category !== activeFilter) {
        return false;
      }
      // Status filter
      const isWatched = watchedSet.has(item.id);
      const isSkipped = skippedSet.has(item.id);
      if (activeStatus === 'remaining' && (isWatched || isSkipped)) {
        return false;
      }
      if (activeStatus === 'watched' && !isWatched) {
        return false;
      }
      if (activeStatus === 'skipped' && !isSkipped) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchYear = item.year.toString().includes(q);
        const matchUniv = item.universe.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchYear && !matchUniv && !matchCat) {
          return false;
        }
      }
      return true;
    });

    if (filteredItems.length === 0) {
      noResultsMsg.style.display = 'flex';
      return;
    } else {
      noResultsMsg.style.display = 'none';
    }

    filteredItems.forEach((item, index) => {
      const isWatched = watchedSet.has(item.id);
      const isSkipped = skippedSet.has(item.id);
      const userRating = ratingsMap[item.id] || '';
      const sideClass = (index % 2 === 0) ? 'side-left' : 'side-right';

      const li = document.createElement('li');
      li.className = `timeline-item ${sideClass} ${isWatched ? 'is-watched' : ''} ${isSkipped ? 'is-skipped' : ''}`;
      li.id = `title-card-${item.id}`;
      li.dataset.id = item.id;

      // Category badge class
      let badgeClass = 'badge-legacy';
      if (item.category === 'MCU') badgeClass = 'badge-mcu';
      else if (item.category === 'Fox') badgeClass = 'badge-fox';
      else if (item.category === 'Sony') badgeClass = 'badge-sony';
      else if (item.category === 'Defenders') badgeClass = 'badge-defenders';

      // Watch time layout: Series (3 metrics) vs Movie (1 metric)
      let watchTimeHtml = '';
      if (item.type === 'series') {
        watchTimeHtml = `
          <div class="card-watch-stats">
            <div class="series-stats-grid">
              <div class="series-stat-col">
                <span class="watch-stat-label">Total Time</span>
                <span class="watch-stat-value">${item.total_watch_time || item.watch_time}</span>
              </div>
              <div class="series-stat-col">
                <span class="watch-stat-label">Avg / Ep</span>
                <span class="watch-stat-value">${item.avg_watch_time || '45m / ep'}</span>
              </div>
              <div class="series-stat-col">
                <span class="watch-stat-label">Episodes</span>
                <span class="watch-stat-value">${item.episodes || 1} eps</span>
              </div>
            </div>
          </div>
        `;
      } else {
        watchTimeHtml = `
          <div class="card-watch-stats">
            <div class="watch-stat-row">
              <span class="watch-stat-label">Watch Time:</span>
              <span class="watch-stat-value">${item.watch_time}</span>
            </div>
          </div>
        `;
      }

      // User individual rating options (blank from 10 by default)
      let ratingOptions = '<option value="">_ / 10</option>';
      for (let r = 10; r >= 1; r--) {
        const selected = (userRating == r) ? 'selected' : '';
        ratingOptions += `<option value="${r}" ${selected}>${r}/10</option>`;
      }

      li.innerHTML = `
        <div class="timeline-node" aria-hidden="true">
          <span>${item.id}</span>
        </div>
        <article class="timeline-card">
          <div class="card-media">
            <img 
              class="card-poster-img"
              src="${item.poster_portrait}" 
              onerror="this.onerror=null; this.src='${item.poster_portrait_fallback || 'poster/originals/portrait_' + item.id + '.jpg'}'"
              alt="${item.title} (${item.year}) poster" 
              loading="lazy" 
              width="145" 
              height="215"
            />
            <span class="card-runtime-pill">${item.type === 'series' ? (item.episodes + ' eps') : item.watch_time}</span>
          </div>

          <div class="card-body">
            <div class="card-topline">
              <span class="card-index">#${item.id} / 121</span>
              <time class="card-date">${item.release_date}</time>
              <span class="card-universe-badge ${badgeClass}">${item.universe}</span>
            </div>

            <h2 class="card-title">${item.title}</h2>

            ${watchTimeHtml}

            <div class="card-ratings-row">
              <div class="official-score" title="Critical / IMDb score">
                <span class="score-badge">★ ${item.rating}</span>
                <span class="score-sub">Score</span>
              </div>

              <div class="user-rating-box" title="Set your personal rating for this movie or show">
                <label for="user-rating-${item.id}" class="user-rating-label">Your Rating:</label>
                <select id="user-rating-${item.id}" name="user-rating" class="user-rating-select" data-id="${item.id}" aria-label="Individual Rating for ${item.title}">
                  ${ratingOptions}
                </select>
              </div>
            </div>

            <div class="card-actions">
              <button type="button" class="btn-card btn-watched ${isWatched ? 'is-active' : ''}" data-id="${item.id}" title="Toggle watched status">
                ${isWatched ? '✓ Watched' : 'Mark watched'}
              </button>
              <button type="button" class="btn-card btn-skip ${isSkipped ? 'is-active' : ''}" data-id="${item.id}" title="Skip this title in watch time calculations">
                ${isSkipped ? 'Skipped' : 'Skip'}
              </button>
              <button type="button" class="btn-card btn-trailer" data-id="${item.id}" data-trailer="${item.trailer}" data-title="${item.title}" title="Watch Official Trailer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Trailer
              </button>
            </div>
          </div>
        </article>
      `;

      // Hover / focus triggers background update
      li.addEventListener('mouseenter', () => setBackground(item.id));

      timelineList.appendChild(li);
    });

    // Re-observe cards for scroll-based background transitions
    setupIntersectionObserver();
  }

  // -------------------------------------------------------------------------
  // Dynamic Background Crossfader
  // -------------------------------------------------------------------------
  function setBackground(id) {
    if (currentActiveId === id && (heroBgA.classList.contains('active') || heroBgB.classList.contains('active'))) {
      return;
    }
    currentActiveId = id;
    const item = items.find(it => it.id === id);
    if (!item) return;

    const landscapeUrl = item.poster_landscape;
    const fallbackUrl = item.poster_landscape_fallback || `poster/originals/landscape_${id}.jpg`;

    // Crossfade between A and B
    if (activeHeroLayer === 'A') {
      heroBgB.style.backgroundImage = `url('${landscapeUrl}'), url('${fallbackUrl}')`;
      heroBgB.classList.add('active');
      heroBgA.classList.remove('active');
      activeHeroLayer = 'B';
    } else {
      heroBgA.style.backgroundImage = `url('${landscapeUrl}'), url('${fallbackUrl}')`;
      heroBgA.classList.add('active');
      heroBgB.classList.remove('active');
      activeHeroLayer = 'A';
    }
  }

  // -------------------------------------------------------------------------
  // Scroll Intersection Observer
  // -------------------------------------------------------------------------
  let observer = null;
  function setupIntersectionObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.dataset.id, 10);
          if (id) {
            setBackground(id);
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
  }

  // -------------------------------------------------------------------------
  // Event Listeners & Interaction Handlers
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // Card Actions Delegation
    timelineList.addEventListener('click', (e) => {
      const watchedBtn = e.target.closest('.btn-watched');
      if (watchedBtn) {
        const id = parseInt(watchedBtn.dataset.id, 10);
        toggleWatched(id);
        return;
      }

      const skipBtn = e.target.closest('.btn-skip');
      if (skipBtn) {
        const id = parseInt(skipBtn.dataset.id, 10);
        toggleSkip(id);
        return;
      }

      const trailerBtn = e.target.closest('.btn-trailer');
      if (trailerBtn) {
        const url = trailerBtn.dataset.trailer;
        const title = trailerBtn.dataset.title;
        openTrailer(url, title);
        return;
      }
    });

    // User Rating Select Delegation
    timelineList.addEventListener('change', (e) => {
      const select = e.target.closest('.user-rating-select');
      if (select) {
        const id = parseInt(select.dataset.id, 10);
        const val = select.value;
        if (val) {
          ratingsMap[id] = parseInt(val, 10);
          showToast(`Rated #${id} (${val}/10)`);
        } else {
          delete ratingsMap[id];
          showToast(`Cleared rating for #${id}`);
        }
        saveStorage();
      }
    });

    // Universe Filters
    document.getElementById('universeFilters').addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-btn');
      if (btn) {
        document.querySelectorAll('#universeFilters .chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderTimeline();
      }
    });

    // Status Filters
    document.getElementById('statusFilters').addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-btn');
      if (btn) {
        document.querySelectorAll('#statusFilters .chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatus = btn.dataset.status;
        renderTimeline();
      }
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      renderTimeline();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderTimeline();
      searchInput.focus();
    });

    resetFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      activeFilter = 'all';
      activeStatus = 'all';
      document.querySelectorAll('.chip-btn').forEach(b => {
        if (b.dataset.filter === 'all' || b.dataset.status === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      renderTimeline();
    });

    jumpTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Trailer Modal Close
    closeTrailerBtn.addEventListener('click', closeTrailer);
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeTrailer();
    });

    // Calendar Modal
    calendarFab.addEventListener('click', openCalendarModal);
    closeCalendarBtn.addEventListener('click', closeCalendarModal);
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) closeCalendarModal();
    });
    downloadIcsBtn.addEventListener('click', generateIcsFile);

    // Share & Copy Link
    shareBtn.addEventListener('click', handleShare);
    copyLinkBtn.addEventListener('click', handleCopyLink);

    // Data Management
    exportDataBtn.addEventListener('click', handleExport);
    importDataBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImport);
    resetProgressBtn.addEventListener('click', handleResetProgress);

    // Keyboard ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTrailer();
        closeCalendarModal();
      }
    });
  }

  // -------------------------------------------------------------------------
  // State Toggle Handlers
  // -------------------------------------------------------------------------
  function toggleWatched(id) {
    if (watchedSet.has(id)) {
      watchedSet.delete(id);
      showToast(`Unmarked #${id} as watched`);
    } else {
      watchedSet.add(id);
      skippedSet.delete(id); // cannot be both watched and skipped
      showToast(`✓ Marked #${id} as watched`);
    }
    saveStorage();
    updateStats();
    updateContinueButton();
    renderTimeline();
  }

  function toggleSkip(id) {
    if (skippedSet.has(id)) {
      skippedSet.delete(id);
      showToast(`Removed skip on #${id}`);
    } else {
      skippedSet.add(id);
      watchedSet.delete(id);
      showToast(`Skipped #${id}`);
    }
    saveStorage();
    updateStats();
    updateContinueButton();
    renderTimeline();
  }

  // -------------------------------------------------------------------------
  // Trailer Modal
  // -------------------------------------------------------------------------
  function openTrailer(url, title) {
    if (!url) {
      showToast('Trailer unavailable');
      return;
    }

    let embedUrl = url;
    // Extract YouTube Video ID
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`;
    }

    trailerModalTitle.textContent = `${title} — Official Trailer`;
    trailerIframe.src = embedUrl;
    openExternalTrailerBtn.href = url;
    trailerModal.classList.add('open');
    trailerModal.setAttribute('aria-hidden', 'false');
  }

  function closeTrailer() {
    trailerIframe.src = '';
    trailerModal.classList.remove('open');
    trailerModal.setAttribute('aria-hidden', 'true');
  }

  // -------------------------------------------------------------------------
  // Calendar Modal & ICS Generation
  // -------------------------------------------------------------------------
  function openCalendarModal() {
    updateStats();
    calendarModal.classList.add('open');
    calendarModal.setAttribute('aria-hidden', 'false');
  }

  function closeCalendarModal() {
    calendarModal.classList.remove('open');
    calendarModal.setAttribute('aria-hidden', 'true');
  }

  function generateIcsFile() {
    const totalRemaining = items.filter(it => !watchedSet.has(it.id) && !skippedSet.has(it.id)).length;
    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Marvel Multiverse Roadmap//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:marvel-doomsday-${Date.now()}@marvelroadmap.local`,
      `DTSTAMP:${dtStamp}`,
      'DTSTART;VALUE=DATE:20261218',
      'DTEND;VALUE=DATE:20261219',
      'SUMMARY:Avengers: Doomsday Premiere',
      `DESCRIPTION:The culmination of your 121-title Marvel Multiverse marathon! Titles remaining: ${totalRemaining}.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Avengers-Doomsday-Schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📅 Calendar event (.ics) downloaded!');
  }

  // -------------------------------------------------------------------------
  // Sharing & Copy Link
  // -------------------------------------------------------------------------
  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('📋 Roadmap link copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy link');
    });
  }

  function handleShare() {
    if (navigator.share) {
      const watched = watchedSet.size;
      navigator.share({
        title: 'Marvel Multiverse Roadmap',
        text: `I've watched ${watched}/121 Marvel titles on my roadmap to Avengers: Doomsday!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  }

  // -------------------------------------------------------------------------
  // Export & Import Progress
  // -------------------------------------------------------------------------
  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      watched: [...watchedSet],
      skipped: [...skippedSet],
      ratings: ratingsMap
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `marvel-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('💾 Progress exported successfully!');
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.watched)) {
          watchedSet = new Set(data.watched);
        }
        if (Array.isArray(data.skipped)) {
          skippedSet = new Set(data.skipped);
        }
        if (typeof data.ratings === 'object') {
          ratingsMap = data.ratings;
        }
        saveStorage();
        updateStats();
        updateContinueButton();
        renderTimeline();
        showToast('✅ Progress imported successfully!');
      } catch (err) {
        showToast('❌ Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleResetProgress() {
    if (confirm('Are you sure you want to reset all your watched, skipped, and rating progress? This cannot be undone.')) {
      watchedSet.clear();
      skippedSet.clear();
      ratingsMap = {};
      saveStorage();
      updateStats();
      updateContinueButton();
      renderTimeline();
      showToast('Progress has been reset.');
    }
  }

  // -------------------------------------------------------------------------
  // Simulated Live Online Counter
  // -------------------------------------------------------------------------
  function startOnlineCounterSimulation() {
    let current = 465;
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      current = Math.max(430, Math.min(520, current + delta));
      onlineCount.textContent = current;
    }, 4500);
  }

  // -------------------------------------------------------------------------
  // Toast Helper
  // -------------------------------------------------------------------------
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
