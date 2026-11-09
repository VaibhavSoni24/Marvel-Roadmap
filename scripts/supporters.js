/**
 * Marvel Multiverse Roadmap - Supporters & Contributors Page Interactivity
 * Handles tab switching and dynamic contributor GitHub avatar fetching.
 */

(function () {
  'use strict';

  // Dynamic GitHub avatar loader with official GitHub mark fallback
  function fetchContributorAvatars() {
    const cards = document.querySelectorAll('.contributor-item-card');
    cards.forEach(card => {
      const pill = card.querySelector('.contributor-avatar-pill');
      if (!pill) return;

      const link = card.querySelector('a[href*="github.com/"]');
      let username = card.getAttribute('data-github-user');
      if (!username && link) {
        const m = link.getAttribute('href').match(/github\.com\/([a-zA-Z0-9_\-]+)/);
        if (m && m[1]) username = m[1];
      }
      if (!username) return;

      const fallbackSvg = `
        <svg class="contributor-avatar-fallback" viewBox="0 0 24 24" fill="currentColor" aria-label="${username} on GitHub">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      `;

      let img = pill.querySelector('img.contributor-avatar-img');
      if (!img) {
        img = document.createElement('img');
        img.className = 'contributor-avatar-img';
        img.alt = `${username} GitHub Avatar`;
        img.width = 50;
        img.height = 50;
        img.loading = 'lazy';
        pill.innerHTML = '';
        pill.appendChild(img);
      }

      img.onerror = function () {
        this.onerror = null;
        pill.innerHTML = fallbackSvg;
      };

      const targetSrc = `https://github.com/${username}.png?size=96`;
      if (img.src !== targetSrc) {
        img.src = targetSrc;
      }
    });
  }

  function initSupportersPage() {
    const tabBtnSupporters = document.getElementById('tabBtnSupporters');
    const tabBtnContributors = document.getElementById('tabBtnContributors');
    const tabPanelSupporters = document.getElementById('tabPanelSupporters');
    const tabPanelContributors = document.getElementById('tabPanelContributors');

    if (!tabBtnSupporters || !tabBtnContributors || !tabPanelSupporters || !tabPanelContributors) {
      return;
    }

    function switchTab(target) {
      if (target === 'contributors') {
        tabBtnContributors.classList.add('active');
        tabBtnContributors.setAttribute('aria-selected', 'true');
        tabBtnSupporters.classList.remove('active');
        tabBtnSupporters.setAttribute('aria-selected', 'false');

        tabPanelContributors.classList.add('active');
        tabPanelSupporters.classList.remove('active');
        fetchContributorAvatars();
      } else {
        tabBtnSupporters.classList.add('active');
        tabBtnSupporters.setAttribute('aria-selected', 'true');
        tabBtnContributors.classList.remove('active');
        tabBtnContributors.setAttribute('aria-selected', 'false');

        tabPanelSupporters.classList.add('active');
        tabPanelContributors.classList.remove('active');
      }
    }

    tabBtnSupporters.addEventListener('click', () => switchTab('supporters'));
    tabBtnContributors.addEventListener('click', () => switchTab('contributors'));

    // Check URL hash for direct tab linking
    if (window.location.hash === '#contributors') {
      switchTab('contributors');
    }

    // Initial avatar pass
    fetchContributorAvatars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupportersPage);
  } else {
    initSupportersPage();
  }
})();
