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
  let presenceInterval = null;

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

  const shareBtn = document.getElementById('shareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
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
    startOnlinePresence();

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
  // Render Custom Rating Popover Widget
  // -------------------------------------------------------------------------
  function getRatingWidgetHtml(itemId, userRating, title) {
    const ratingLabel = userRating ? `${userRating} / 10` : '_ / 10';
    const hasRatingClass = userRating ? 'has-rating' : '';
    const clearBtn = userRating ? `<button type="button" class="btn-clear-rating" data-id="${itemId}" title="Clear your rating">Clear</button>` : '';

    let buttonsHtml = '';
    for (let r = 1; r <= 10; r++) {
      const isSelected = (userRating == r) ? 'is-selected' : '';
      buttonsHtml += `
        <button type="button" class="rating-num-btn ${isSelected}" data-id="${itemId}" data-rating="${r}" title="Rate ${r} out of 10">
          <span class="num-star">★</span>
          <span>${r}</span>
        </button>
      `;
    }

    return `
      <div class="user-rating-widget" data-id="${itemId}">
        <button type="button" class="user-rating-btn ${hasRatingClass}" data-id="${itemId}" aria-expanded="false" aria-haspopup="dialog" title="Rate ${title} (1-10)">
          <span class="user-rating-prefix">YOUR RATING:</span>
          <span class="user-rating-value">${ratingLabel}</span>
          <svg class="rating-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="rating-popover" role="dialog" aria-hidden="true">
          <div class="rating-popover-header">
            <span class="popover-title">Your Rating</span>
            ${clearBtn}
          </div>
          <div class="rating-grid">
            ${buttonsHtml}
          </div>
        </div>
      </div>
    `;
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
      const userRating = ratingsMap[item.id] || null;
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

      const ratingWidgetMarkup = getRatingWidgetHtml(item.id, userRating, item.title);

      li.innerHTML = `
        <div class="timeline-node" aria-hidden="true">
          <span>${item.id}</span>
        </div>
        <article class="timeline-card">
          <div class="card-media">
            <img 
              class="card-poster-img"
              src="${item.poster_portrait}" 
              onerror="this.onerror=null; this.src='${item.poster_portrait_fallback || 'poster/portrait/' + item.id + '.jpg'}'"
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

              ${ratingWidgetMarkup}
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
    const fallbackUrl = item.poster_landscape_fallback || `poster/landscape/${id}.jpg`;

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
    // Timeline Card Actions Delegation
    timelineList.addEventListener('click', (e) => {
      // 1. Watched Button
      const watchedBtn = e.target.closest('.btn-watched');
      if (watchedBtn) {
        const id = parseInt(watchedBtn.dataset.id, 10);
        toggleWatched(id);
        return;
      }

      // 2. Skip Button
      const skipBtn = e.target.closest('.btn-skip');
      if (skipBtn) {
        const id = parseInt(skipBtn.dataset.id, 10);
        toggleSkip(id);
        return;
      }

      // 3. Trailer Button
      const trailerBtn = e.target.closest('.btn-trailer');
      if (trailerBtn) {
        const url = trailerBtn.dataset.trailer;
        const title = trailerBtn.dataset.title;
        openTrailer(url, title);
        return;
      }

      // 4. Rating Trigger Button
      const ratingBtn = e.target.closest('.user-rating-btn');
      if (ratingBtn) {
        e.stopPropagation();
        const widget = ratingBtn.closest('.user-rating-widget');
        if (!widget) return;
        const isOpen = widget.classList.contains('is-open');

        // Close all open rating popovers
        closeAllRatingPopovers();

        // Toggle clicked
        if (!isOpen) {
          widget.classList.add('is-open');
          const tItem = widget.closest('.timeline-item');
          if (tItem) tItem.classList.add('has-open-popover');
          ratingBtn.setAttribute('aria-expanded', 'true');
          const pop = widget.querySelector('.rating-popover');
          if (pop) pop.setAttribute('aria-hidden', 'false');
        }
        return;
      }

      // 5. Rating Number Selection
      const numBtn = e.target.closest('.rating-num-btn');
      if (numBtn) {
        e.stopPropagation();
        const id = parseInt(numBtn.dataset.id, 10);
        const rating = parseInt(numBtn.dataset.rating, 10);
        if (id && rating) {
          setPersonalRating(id, rating);
        }
        return;
      }

      // 6. Rating Clear Button
      const clearBtn = e.target.closest('.btn-clear-rating');
      if (clearBtn) {
        e.stopPropagation();
        const id = parseInt(clearBtn.dataset.id, 10);
        if (id) {
          clearPersonalRating(id);
        }
        return;
      }
    });

    // Close rating popovers when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-rating-widget')) {
        closeAllRatingPopovers();
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

    // Share & Copy Link
    shareBtn.addEventListener('click', handleShare);
    copyLinkBtn.addEventListener('click', handleCopyLink);

    // Reset All Progress
    resetProgressBtn.addEventListener('click', handleResetProgress);

    // Keyboard ESC to close modals & popovers
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTrailer();
        closeAllRatingPopovers();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Rating Actions
  // -------------------------------------------------------------------------
  function closeAllRatingPopovers() {
    document.querySelectorAll('.timeline-item.has-open-popover').forEach(item => {
      item.classList.remove('has-open-popover');
    });
    document.querySelectorAll('.user-rating-widget.is-open').forEach(w => {
      w.classList.remove('is-open');
      const btn = w.querySelector('.user-rating-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const pop = w.querySelector('.rating-popover');
      if (pop) pop.setAttribute('aria-hidden', 'true');
    });
  }

  function setPersonalRating(id, rating) {
    ratingsMap[id] = rating;
    saveStorage();
    showToast(`★ Rated #${id} (${rating}/10)`);
    updateSingleRatingWidget(id);
  }

  function clearPersonalRating(id) {
    delete ratingsMap[id];
    saveStorage();
    showToast(`Cleared rating for #${id}`);
    updateSingleRatingWidget(id);
  }

  function updateSingleRatingWidget(id) {
    const card = document.getElementById(`title-card-${id}`);
    if (!card) return;
    const widget = card.querySelector('.user-rating-widget');
    if (!widget) return;

    const item = items.find(it => it.id === id);
    const userRating = ratingsMap[id] || null;
    const title = item ? item.title : `Title #${id}`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = getRatingWidgetHtml(id, userRating, title);
    const newWidget = tempDiv.firstElementChild;
    widget.replaceWith(newWidget);
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
  // Reset Progress
  // -------------------------------------------------------------------------
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
  // Live Online Presence (Vercel Serverless Function + Fallback)
  // -------------------------------------------------------------------------
  async function fetchOnlinePresence() {
    try {
      const res = await fetch('/api/presence', { cache: 'no-store' });
      if (!res.ok) throw new Error('API status ' + res.status);
      const data = await res.json();
      if (data && typeof data.online === 'number') {
        onlineCount.textContent = data.online;
        return;
      }
    } catch (e) {
      // Local development or offline fallback
      fallbackPresence();
    }
  }

  function fallbackPresence() {
    onlineCount.textContent = '1';
  }

  function startOnlinePresence() {
    fetchOnlinePresence();
    if (presenceInterval) clearInterval(presenceInterval);
    presenceInterval = setInterval(fetchOnlinePresence, 15000);
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
