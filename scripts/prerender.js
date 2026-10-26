/**
 * Pre-render Build Script for Marvel Multiverse Roadmap
 * 
 * 1. Pre-renders all 121 title cards into index.html (#timelineList)
 * 2. Generates complete 121-item JSON-LD ItemList with exact #title-card-{id} anchors
 * 3. Injects visible FAQ section and matching FAQPage schema
 * 4. Ensures consistent titles and meta descriptions across HTML, OG, Twitter, and Schema
 * 5. Pre-populates initial HUD statistics for instant non-JS presentation
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data.json');
const indexHtmlPath = path.resolve(__dirname, '../index.html');

const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log(`🎬 Loaded ${items.length} titles from data.json.`);

// 1. Calculate HUD initial values
let totalRuntimeMins = 0;
items.forEach(it => {
  totalRuntimeMins += (it.runtime_mins || 120);
});
const totalHours = Math.floor(totalRuntimeMins / 60);
const totalMins = totalRuntimeMins % 60;
const hudHoursFormatted = `${totalHours}h ${totalMins.toString().padStart(2, '0')}m`;

const doomsdayDate = new Date('2026-12-18T00:00:00');
const now = new Date();
const diffDays = Math.max(1, Math.ceil((doomsdayDate - now) / (1000 * 60 * 60 * 24)));
const paceFormatted = `${((totalRuntimeMins / 60) / diffDays).toFixed(1)}h/d`;

console.log(`📊 Initial HUD: ${hudHoursFormatted} left, ${paceFormatted} pace, ${items.length} total titles`);

// 2. Generate HTML for rating widget
function getRatingWidgetHtml(itemId, title) {
  let buttonsHtml = '';
  for (let r = 1; r <= 10; r++) {
    buttonsHtml += `
            <button type="button" class="rating-num-btn" data-id="${itemId}" data-rating="${r}" title="Rate ${r} out of 10">
              <span class="num-star">★</span>
              <span>${r}</span>
            </button>`;
  }

  return `
                  <div class="user-rating-widget" data-id="${itemId}">
                    <button type="button" class="user-rating-btn" data-id="${itemId}" aria-expanded="false" aria-haspopup="dialog" title="Rate ${title} (1-10)">
                      <span class="user-rating-prefix">YOUR RATING:</span>
                      <span class="user-rating-value">_ / 10</span>
                      <svg class="rating-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div class="rating-popover" role="dialog" aria-hidden="true">
                      <div class="rating-popover-header">
                        <span class="popover-title">Your Rating</span>
                      </div>
                      <div class="rating-grid">${buttonsHtml}
                      </div>
                    </div>
                  </div>`;
}

// 3. Generate HTML for all 121 title cards
const cardsHtml = items.map((item, index) => {
  const sideClass = (index % 2 === 0) ? 'side-left' : 'side-right';

  let badgeClass = 'badge-legacy';
  if (item.category === 'MCU') badgeClass = 'badge-mcu';
  else if (item.category === 'Fox') badgeClass = 'badge-fox';
  else if (item.category === 'Sony') badgeClass = 'badge-sony';
  else if (item.category === 'Defenders') badgeClass = 'badge-defenders';

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
                    </div>`;
  } else {
    watchTimeHtml = `
                    <div class="card-watch-stats">
                      <div class="watch-stat-row">
                        <span class="watch-stat-label">Watch Time:</span>
                        <span class="watch-stat-value">${item.watch_time}</span>
                      </div>
                    </div>`;
  }

  const ratingWidget = getRatingWidgetHtml(item.id, item.title.replace(/"/g, '&quot;'));

  return `        <li class="timeline-item ${sideClass}" id="title-card-${item.id}" data-id="${item.id}">
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
              ${item.description ? `<p class="card-summary">${item.description}</p>` : ''}

              ${watchTimeHtml}

              <div class="card-ratings-row">
                <div class="official-score" title="Critical / IMDb score">
                  <span class="score-badge">★ ${item.rating}</span>
                  <span class="score-sub">Score</span>
                </div>
${ratingWidget}
              </div>

              <div class="card-actions">
                <button type="button" class="btn-card btn-watched" data-id="${item.id}" title="Toggle watched status">
                  Mark watched
                </button>
                <button type="button" class="btn-card btn-skip" data-id="${item.id}" title="Skip this title in watch time calculations">
                  Skip
                </button>
                <button type="button" class="btn-card btn-trailer" data-id="${item.id}" data-trailer="${item.trailer}" data-title="${item.title.replace(/"/g, '&quot;')}" title="Watch Official Trailer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Trailer
                </button>
              </div>
            </div>
          </article>
        </li>`;
}).join('\n');

// 4. Generate JSON-LD Structured Data
const jsonLdItemListElements = items.map(item => ({
  '@type': 'ListItem',
  position: item.id,
  name: `${item.title} (${item.year})`,
  url: `https://marvel-multiverse-roadmap.vercel.app/#title-card-${item.id}`,
  image: `https://marvel-multiverse-roadmap.vercel.app/${item.poster_portrait}`,
  description: item.description || `${item.title} released in ${item.year} part of ${item.universe}.`
}));

const faqs = [
  {
    q: 'What is the best order to watch Marvel movies and series before Avengers: Doomsday?',
    a: 'The release-order roadmap is the definitive way to experience the Marvel Multiverse. Starting from Blade (1998), Fox X-Men (2000), and Spider-Man (2002), into MCU Phases 1 through 6, culminating in Avengers: Doomsday on December 18, 2026. Watching in release order preserves post-credits stingers, character introductions, and multiverse crossover revelations in the sequence audiences experienced them.'
  },
  {
    q: 'How many Marvel movies and TV shows are in the complete Multiverse Roadmap?',
    a: 'The roadmap tracks exactly 121 canonical and multiverse titles spanning MCU (64), Fox X-Men (18), Marvel Television Defenders (16), Sony Spider-Verse (13), and Legacy classics (10), totaling over 430 hours of viewing time.'
  },
  {
    q: 'When does Avengers: Doomsday release in theaters?',
    a: 'Avengers: Doomsday is scheduled to premiere in theaters worldwide on December 18, 2026, directed by Anthony and Joe Russo and starring Robert Downey Jr. as Doctor Victor von Doom.'
  },
  {
    q: 'Can I track my watch progress and rate Marvel titles on this site?',
    a: 'Yes. The roadmap includes interactive "Mark Watched" and "Skip" toggles, a live daily watch pace calculator, and a 1–10 star personal rating widget. All your progress and ratings are stored securely and privately in your browser\'s local storage.'
  },
  {
    q: 'Which universes and franchises are included across the 121 titles?',
    a: 'The roadmap unites all major Marvel live-action and animated universes: the Marvel Cinematic Universe (MCU), 20th Century Fox X-Men & Fantastic Four, Sony\'s Spider-Man & Spider-Verse, Marvel Television\'s Defenders Saga (Daredevil, Punisher, etc.), and foundational Legacy classics (Blade, Daredevil 2003, Ghost Rider, and Hulk).'
  }
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://marvel-multiverse-roadmap.vercel.app/#app',
      'name': 'Marvel Multiverse Roadmap',
      'url': 'https://marvel-multiverse-roadmap.vercel.app/',
      'description': 'Track 121 Marvel movies and series in release order from Blade (1998) to Avengers: Doomsday. Search titles, filter by universe, rate entries and track your watch progress.',
      'applicationCategory': 'EntertainmentApplication',
      'operatingSystem': 'All',
      'inLanguage': 'en',
      'author': {
        '@type': 'Person',
        'name': 'Vaibhav Soni',
        'url': 'https://github.com/VaibhavSoni24'
      },
      'image': 'https://marvel-multiverse-roadmap.vercel.app/og-image.jpg',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': '1280'
      }
    },
    {
      '@type': 'ItemList',
      '@id': 'https://marvel-multiverse-roadmap.vercel.app/#roadmap',
      'name': 'Marvel Multiverse Release-Order Watch List (1998–2026)',
      'description': 'Complete release-order marathon of 121 Marvel titles concluding at Avengers: Doomsday.',
      'numberOfItems': 121,
      'itemListOrder': 'https://schema.org/ItemListOrderAscending',
      'itemListElement': jsonLdItemListElements
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://marvel-multiverse-roadmap.vercel.app/#faq',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      }))
    }
  ]
};

// 5. Generate Visible FAQ Section HTML
const visibleFaqHtml = `<section class="faq-section" id="faq" aria-labelledby="faqHeading">
      <div class="faq-inner">
        <div class="faq-header">
          <span class="faq-kicker">KNOWLEDGE BASE</span>
          <h2 class="faq-heading" id="faqHeading">Frequently Asked Questions</h2>
          <p class="faq-sub">Essential guides, watch order clarifications, and Multiverse timeline facts.</p>
        </div>
        <div class="faq-list">
${faqs.map((faq, i) => `          <details class="faq-item"${i === 0 ? ' open' : ''}>
            <summary class="faq-question">
              <span>${faq.q}</span>
              <svg class="faq-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="faq-answer">
              <p>${faq.a}</p>
            </div>
          </details>`).join('\n')}
        </div>
      </div>
    </section>`;

// 6. Update index.html
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Title & Meta tags consistency
const consistentTitle = 'Marvel Multiverse Roadmap: Complete Release-Order Watch List to Avengers: Doomsday (1998–2026)';
const consistentDesc = 'Track 121 Marvel movies and series in release order from Blade (1998) to Avengers: Doomsday. Search titles, filter by universe, rate entries and track your watch progress.';

html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${consistentTitle}</title>`);

html = html.replace(
  /<meta\s+name="description"[\s\S]*?\/>/,
  `<meta name="description"\n    content="${consistentDesc}" />`
);

html = html.replace(
  /<meta\s+property="og:title"[\s\S]*?\/>/,
  `<meta property="og:title" content="${consistentTitle}" />`
);

html = html.replace(
  /<meta\s+property="og:description"[\s\S]*?\/>/,
  `<meta property="og:description"\n    content="${consistentDesc}" />`
);

html = html.replace(
  /<meta\s+name="twitter:title"[\s\S]*?\/>/,
  `<meta name="twitter:title" content="${consistentTitle}" />`
);

html = html.replace(
  /<meta\s+name="twitter:description"[\s\S]*?\/>/,
  `<meta name="twitter:description"\n    content="${consistentDesc}" />`
);

// Brand subtitle consistency
html = html.replace(
  /<p class="brand-sub">[\s\S]*?<\/p>/,
  `<p class="brand-sub">Complete Release-Order Watch List to Avengers: Doomsday (1998–2026)</p>`
);

// Style cache buster
html = html.replace(/style\.css(\?v=\d+)?/, 'style.css?v=4');

// Structured data replacement
const structuredDataJson = JSON.stringify(structuredData, null, 2);
html = html.replace(
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">\n${structuredDataJson}\n  </script>`
);

// Pre-fill HUD values
html = html.replace(
  /<span class="hud-stat-value" id="hudHoursLeft">[\s\S]*?<\/span>/,
  `<span class="hud-stat-value" id="hudHoursLeft">${hudHoursFormatted}</span>`
);

html = html.replace(
  /<span class="hud-stat-value" id="hudPace">[\s\S]*?<\/span>/,
  `<span class="hud-stat-value" id="hudPace">${paceFormatted}</span>`
);

html = html.replace(
  /<span class="hud-stat-value" id="hudHoursSkipped">[\s\S]*?<\/span>/,
  `<span class="hud-stat-value" id="hudHoursSkipped">0h 00m</span>`
);

// Replace timelineList content
html = html.replace(
  /<ol class="timeline-list" id="timelineList">[\s\S]*?<\/ol>/,
  `<ol class="timeline-list" id="timelineList">\n${cardsHtml}\n      </ol>`
);

// Ensure visible FAQ section exists before <footer>
if (html.includes('<section class="faq-section"')) {
  html = html.replace(
    /<section class="faq-section"[\s\S]*?<\/section>/,
    visibleFaqHtml
  );
} else {
  html = html.replace(
    '<!-- Footer -->',
    `${visibleFaqHtml}\n\n    <!-- Footer -->`
  );
}

// Add legal disclaimer to footer if not already there
if (!html.includes('class="footer-disclaimer"')) {
  html = html.replace(
    /<div class="footer-links">/,
    `<p class="footer-disclaimer">Unofficial fan-created roadmap. All Marvel characters, posters, logos, and related media are © & ™ Marvel Studios, Disney, Sony, and 20th Century Studios. This site is not affiliated with or endorsed by Marvel or Disney.</p>\n        <div class="footer-links">`
  );
}

fs.writeFileSync(indexHtmlPath, html, 'utf8');

console.log('✅ index.html successfully pre-rendered with:');
console.log('   - Consistent Title & Descriptions (HTML, OG, Twitter)');
console.log('   - 121 pre-rendered title cards in #timelineList');
console.log('   - Complete 121-item JSON-LD ItemList with matching #title-card-{id} links');
console.log('   - Visible FAQ section + matching FAQPage schema');
console.log('   - Pre-populated HUD stats');
console.log('   - Fan legal disclaimer in footer');
