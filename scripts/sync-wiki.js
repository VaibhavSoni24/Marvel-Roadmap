/**
 * Helper script to sync local wiki/ markdown files to GitHub Wiki git repo.
 * Pre-requisite: The first wiki page must have been created once on GitHub Web UI
 * at https://github.com/VaibhavSoni24/Marvel-Roadmap/wiki
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const wikiDir = path.resolve(__dirname, '../wiki');
const tempDir = path.resolve(__dirname, '../scratch/wiki-sync');
const remoteUrl = 'https://github.com/VaibhavSoni24/Marvel-Roadmap.wiki.git';

if (!fs.existsSync(wikiDir)) {
  console.error('❌ wiki/ directory not found.');
  process.exit(1);
}

// Clean previous temp dir if any
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log('📥 Attempting to clone GitHub Wiki repository...');
try {
  execSync(`git clone "${remoteUrl}" "${tempDir}"`, { stdio: 'inherit' });
} catch {
  console.error('\n⚠️ Could not clone wiki repository.');
  console.error('👉 Make sure you have created the first page at: https://github.com/VaibhavSoni24/Marvel-Roadmap/wiki\n');
  process.exit(1);
}

console.log('📋 Copying wiki files...');
const files = fs.readdirSync(wikiDir);
files.forEach(file => {
  if (file.endsWith('.md')) {
    fs.copyFileSync(path.join(wikiDir, file), path.join(tempDir, file));
    console.log(`  ✓ Copied ${file}`);
  }
});

console.log('📤 Committing and pushing to GitHub Wiki...');
try {
  execSync('git add .', { cwd: tempDir, stdio: 'inherit' });
  try {
    execSync('git commit -m "docs(wiki): update Marvel Multiverse Roadmap wiki guides"', { cwd: tempDir, stdio: 'inherit' });
  } catch {
    console.log('No changes to commit in wiki.');
  }
  execSync('git push origin master', { cwd: tempDir, stdio: 'inherit' });
  console.log('\n🎉 Successfully synced all wiki pages to GitHub Wiki!');
} catch (err) {
  console.error('❌ Failed to push to wiki repo:', err.message);
} finally {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
