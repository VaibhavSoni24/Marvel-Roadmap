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

check(indexHtml.includes('<title>Marvel Roadmap'), 'index.html missing targeted SEO <title>');
check(indexHtml.includes('name="description"'), 'index.html missing meta description');
check(indexHtml.includes('rel="canonical"'), 'index.html missing canonical URL link');
check(indexHtml.includes('property="og:image"'), 'index.html missing OpenGraph image tag');
check(indexHtml.includes('application/ld+json'), 'index.html missing JSON-LD structured data');
check(indexHtml.includes('name="google-site-verification"'), 'index.html missing google-site-verification meta tag');

// Report
console.log('');
if (errors.length > 0) {
  console.error(`❌ Validation failed with ${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log('🎉 All automated validation checks passed successfully! (121/121 titles, SEO, and assets verified)\n');
  process.exit(0);
}
