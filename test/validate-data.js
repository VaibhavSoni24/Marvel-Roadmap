/**
 * Automated CI/CD Data & SEO Validation Suite
 * Verifies roadmap integrity, media paths, and SEO requirements.
 */

const fs = require('fs');
const path = require('path');

let errors = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error(`❌ ${message}`);
  }
}

console.log('🧪 Starting Marvel Multiverse Roadmap automated verification...\n');

// 1. Validate data.json
const dataJsonPath = path.resolve(__dirname, '../data.json');
check(fs.existsSync(dataJsonPath), 'data.json must exist');

let data = [];
try {
  data = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
  console.log(`✅ data.json is valid JSON with ${data.length} entries.`);
} catch (e) {
  errors.push(`data.json JSON parse error: ${e.message}`);
}

check(data.length === 121, `Expected exactly 121 items in roadmap, found ${data.length}`);

const validCategories = new Set(['MCU', 'Fox', 'Sony', 'Defenders', 'Legacy']);

data.forEach((item, index) => {
  const expectedId = index + 1;
  check(item.id === expectedId, `Item at index ${index} must have id ${expectedId}, got ${item.id}`);
  check(Boolean(item.title && item.title.trim()), `Item #${expectedId} missing title`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(item.release_date), `Item #${expectedId} invalid release_date: ${item.release_date}`);
  check(item.year >= 1998 && item.year <= 2026, `Item #${expectedId} unexpected year: ${item.year}`);
  check(validCategories.has(item.category), `Item #${expectedId} invalid category: ${item.category}`);
  check(typeof item.runtime_mins === 'number' && item.runtime_mins > 0, `Item #${expectedId} invalid runtime_mins: ${item.runtime_mins}`);
  check(Boolean(item.trailer && item.trailer.startsWith('https://')), `Item #${expectedId} missing or invalid trailer URL`);
  check(Boolean(item.description && item.description.length > 10), `Item #${expectedId} missing or too short description`);

  // Check that media exists on disk
  const portraitPath = path.resolve(__dirname, '..', item.poster_portrait);
  check(fs.existsSync(portraitPath), `Item #${expectedId} missing portrait poster on disk: ${item.poster_portrait}`);

  const landscapePath = path.resolve(__dirname, '..', item.poster_landscape);
  check(fs.existsSync(landscapePath), `Item #${expectedId} missing landscape backdrop on disk: ${item.poster_landscape}`);
});

// 2. Validate SEO Assets
const sitemapPath = path.resolve(__dirname, '../sitemap.xml');
check(fs.existsSync(sitemapPath), 'sitemap.xml must exist');

const robotsPath = path.resolve(__dirname, '../robots.txt');
check(fs.existsSync(robotsPath), 'robots.txt must exist');

const ogImagePath = path.resolve(__dirname, '../og-image.jpg');
check(fs.existsSync(ogImagePath), 'og-image.jpg must exist');

const manifestPath = path.resolve(__dirname, '../manifest.json');
check(fs.existsSync(manifestPath), 'manifest.json must exist');

const contributingPath = path.resolve(__dirname, '../CONTRIBUTING.md');
check(fs.existsSync(contributingPath), 'CONTRIBUTING.md must exist');

const contributorsPath = path.resolve(__dirname, '../CONTRIBUTORS.md');
check(fs.existsSync(contributorsPath), 'CONTRIBUTORS.md must exist');

const cocPath = path.resolve(__dirname, '../CODE_OF_CONDUCT.md');
check(fs.existsSync(cocPath), 'CODE_OF_CONDUCT.md must exist');

const securityPath = path.resolve(__dirname, '../SECURITY.md');
check(fs.existsSync(securityPath), 'SECURITY.md must exist');

const citationPath = path.resolve(__dirname, '../CITATION.cff');
check(fs.existsSync(citationPath), 'CITATION.cff must exist');

const wikiHomePath = path.resolve(__dirname, '../wiki/Home.md');
check(fs.existsSync(wikiHomePath), 'wiki/Home.md must exist');

const wikiSidebarPath = path.resolve(__dirname, '../wiki/_Sidebar.md');
check(fs.existsSync(wikiSidebarPath), 'wiki/_Sidebar.md must exist');

const gscFilePath = path.resolve(__dirname, '../google28ae9fc02e0b86f1.html');
check(fs.existsSync(gscFilePath), 'google28ae9fc02e0b86f1.html must exist');
if (fs.existsSync(gscFilePath)) {
  const gscContent = fs.readFileSync(gscFilePath, 'utf8');
  check(gscContent.includes('google-site-verification: google28ae9fc02e0b86f1.html'), 'google28ae9fc02e0b86f1.html has incorrect content');
}

// 3. Validate index.html SEO tags
const indexHtmlPath = path.resolve(__dirname, '../index.html');
check(fs.existsSync(indexHtmlPath), 'index.html must exist');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

check(indexHtml.includes('<title>Marvel Multiverse Roadmap: Complete Release-Order Watch List to Avengers: Doomsday (1998–2026)</title>'), 'index.html missing targeted consistent SEO <title>');
check(indexHtml.includes('name="description"'), 'index.html missing meta description');
check(indexHtml.includes('property="og:title" content="Marvel Multiverse Roadmap: Complete Release-Order Watch List to Avengers: Doomsday (1998–2026)"'), 'index.html missing consistent OpenGraph title');
check(indexHtml.includes('name="twitter:title" content="Marvel Multiverse Roadmap: Complete Release-Order Watch List to Avengers: Doomsday (1998–2026)"'), 'index.html missing consistent Twitter title');
check(indexHtml.includes('rel="canonical"'), 'index.html missing canonical URL link');
check(indexHtml.includes('property="og:image"'), 'index.html missing OpenGraph image tag');
check(indexHtml.includes('application/ld+json'), 'index.html missing JSON-LD structured data');
check(indexHtml.includes('name="google-site-verification"'), 'index.html missing google-site-verification meta tag');

// 4. Validate Pre-rendered HTML Content & Visible FAQ Section
check(indexHtml.includes('id="title-card-1"'), 'index.html missing pre-rendered card #1');
check(indexHtml.includes('id="title-card-121"'), 'index.html missing pre-rendered card #121');
check(indexHtml.includes('id="faq"'), 'index.html missing visible FAQ section');
check(indexHtml.includes('class="faq-item"'), 'index.html missing visible FAQ items');
check(indexHtml.includes('class="footer-disclaimer"'), 'index.html missing footer legal disclaimer');

// 5. Validate JSON-LD contains all 121 items and matching anchor links
const jsonLdMatch = indexHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
check(Boolean(jsonLdMatch && jsonLdMatch[1]), 'Failed to extract JSON-LD structured data script block');
if (jsonLdMatch && jsonLdMatch[1]) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    const itemList = parsed['@graph'].find(g => g['@type'] === 'ItemList');
    check(Boolean(itemList), 'JSON-LD missing ItemList');
    if (itemList) {
      check(itemList.numberOfItems === 121, `ItemList declared ${itemList.numberOfItems} items instead of 121`);
      check(itemList.itemListElement.length === 121, `ItemList has ${itemList.itemListElement.length} elements instead of 121`);
      check(itemList.itemListElement[0].url.endsWith('#title-card-1'), `Card #1 URL anchor mismatch: ${itemList.itemListElement[0].url}`);
      check(itemList.itemListElement[120].url.endsWith('#title-card-121'), `Card #121 URL anchor mismatch: ${itemList.itemListElement[120].url}`);
    }

    const webApp = parsed['@graph'].find(g => g['@type'] === 'WebApplication');
    check(Boolean(webApp), 'JSON-LD missing WebApplication');
    if (webApp) {
      check(Boolean(webApp.aggregateRating && webApp.aggregateRating.ratingValue), 'WebApplication missing aggregateRating schema');
    }

    const faqPage = parsed['@graph'].find(g => g['@type'] === 'FAQPage');
    check(Boolean(faqPage && faqPage.mainEntity && faqPage.mainEntity.length >= 3), 'JSON-LD missing valid FAQPage schema');
  } catch (err) {
    errors.push(`JSON-LD parse error: ${err.message}`);
  }
}

// 6. Validate Rating Lock & Stacking Hierarchy
const cssPath = path.resolve(__dirname, '../style.css');
check(fs.existsSync(cssPath), 'style.css must exist');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const hudMatch = css.match(/\.sticky-hud-rail\s*\{[^}]*z-index:\s*(\d+)/s);
  check(Boolean(hudMatch && parseInt(hudMatch[1], 10) >= 90), '.sticky-hud-rail must have z-index >= 90 to prevent card overlap');
  check(css.includes('.user-rating-btn.is-locked'), 'style.css missing .user-rating-btn.is-locked rule');
  check(css.includes('.rating-lock-icon'), 'style.css missing .rating-lock-icon rule');
}

check(indexHtml.includes('class="user-rating-btn is-locked"'), 'index.html missing locked rating button state');
check(indexHtml.includes('class="rating-lock-icon"'), 'index.html missing rating lock icon');

const appJsPath = path.resolve(__dirname, '../app.js');
check(fs.existsSync(appJsPath), 'app.js must exist');
if (fs.existsSync(appJsPath)) {
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  check(appJs.includes('!watchedSet.has(id) || skippedSet.has(id)'), 'app.js missing rating lock check');
  check(appJs.includes('delete ratingsMap[id]'), 'app.js missing rating cleanup on unmark/skip');
  check(appJs.includes("card.classList.remove('has-open-popover')"), 'app.js missing popover cleanup in updateSingleRatingWidget');
}

// 7. Validate Floating Action Navigation Buttons
check(indexHtml.includes('id="backToTopBtn"'), 'index.html missing #backToTopBtn');
check(indexHtml.includes('id="floatingContinueBtn"'), 'index.html missing #floatingContinueBtn');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  check(css.includes('.floating-fab'), 'style.css missing .floating-fab rule');
  check(css.includes('.fab-top'), 'style.css missing .fab-top rule');
  check(css.includes('.fab-continue'), 'style.css missing .fab-continue rule');
}
if (fs.existsSync(appJsPath)) {
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  check(appJs.includes('updateFloatingNavButtons'), 'app.js missing updateFloatingNavButtons');
  check(appJs.includes('backToTopBtn'), 'app.js missing backToTopBtn reference');
  check(appJs.includes('floatingContinueBtn'), 'app.js missing floatingContinueBtn reference');
  check(appJs.includes('isAtTop'), 'app.js missing isAtTop check to suppress continue button on top');
}

// 8. Validate Header Quick Navigation & Go To Bottom Button
check(indexHtml.includes('id="bottomBtn"'), 'index.html missing #bottomBtn');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  check(css.includes('.bottom-pill-btn'), 'style.css missing .bottom-pill-btn rule');
}
if (fs.existsSync(appJsPath)) {
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  check(appJs.includes('bottomBtn'), 'app.js missing bottomBtn reference');
}

// 9. Validate Support & Supporters Pages and Assets
const supportPath = path.resolve(__dirname, '../support.html');
check(fs.existsSync(supportPath), 'support.html must exist');
if (fs.existsSync(supportPath)) {
  const supportHtml = fs.readFileSync(supportPath, 'utf8');
  check(supportHtml.includes('6350366202-r52f@axl'), 'support.html missing UPI ID');
  check(supportHtml.includes('43330823145'), 'support.html missing Account Number');
  check(supportHtml.includes('SBIN0015336'), 'support.html missing IFSC Code');
  check(supportHtml.includes('SBININBB'), 'support.html missing SWIFT Code');
  check(supportHtml.includes('assets/upi-qr.jpg'), 'support.html missing QR image path');
  check(supportHtml.includes('supporters.html'), 'support.html missing link to supporters.html');
  check(supportHtml.includes('index.html'), 'support.html missing link to index.html');
}

const supportersPath = path.resolve(__dirname, '../supporters.html');
check(fs.existsSync(supportersPath), 'supporters.html must exist');
if (fs.existsSync(supportersPath)) {
  const supportersHtml = fs.readFileSync(supportersPath, 'utf8');
  check(supportersHtml.includes('Vaibhav Soni'), 'supporters.html missing Vaibhav Soni');
  check(supportersHtml.includes('Saumya Soni'), 'supporters.html missing Saumya Soni');
  check(supportersHtml.includes('support.html'), 'supporters.html missing link to support.html');
  check(supportersHtml.includes('index.html'), 'supporters.html missing link to index.html');
}

const qrImgPath = path.resolve(__dirname, '../assets/upi-qr.jpg');
check(fs.existsSync(qrImgPath), 'assets/upi-qr.jpg must exist');
if (fs.existsSync(qrImgPath)) {
  const stats = fs.statSync(qrImgPath);
  check(stats.size > 1000, 'assets/upi-qr.jpg must be a valid non-empty image file');
}

check(indexHtml.includes('href="support.html"'), 'index.html missing link to support.html');
check(indexHtml.includes('href="supporters.html"'), 'index.html missing link to supporters.html');

// Report
console.log('');
if (errors.length > 0) {
  console.error(`❌ Validation failed with ${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log('🎉 All automated validation checks passed successfully! (121/121 titles, SEO, and assets verified)\n');
  process.exit(0);
}
