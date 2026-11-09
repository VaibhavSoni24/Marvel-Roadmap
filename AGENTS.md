# 🤖 AGENTS.md - AI Coding Assistant & Contributor Guide

Welcome! This document provides operating instructions, architectural guidelines, and strict rules for AI assistants (Antigravity, Claude Code, Cursor, GitHub Copilot, Gemini CLI, etc.) and human contributors working on the **Marvel Multiverse Roadmap** repository.

---

## 🧭 Project Overview

The **Marvel Multiverse Roadmap** is an interactive, zero-dependency release-order marathon guide across 121 canonical and multiverse Marvel titles (spanning 1998 to 2026) culminating in *Avengers: Doomsday (December 18, 2026)*.

- **Production URL**: [https://marvel-multiverse-roadmap.vercel.app/](https://marvel-multiverse-roadmap.vercel.app/)
- **Repository**: [https://github.com/VaibhavSoni24/Marvel-Roadmap](https://github.com/VaibhavSoni24/Marvel-Roadmap)
- **Maintainer & Creator**: Vaibhav Soni ([@VaibhavSoni24](https://github.com/VaibhavSoni24))

---

## 🛠️ Architecture & Tech Stack

This project deliberately avoids heavyweight frameworks (React, Next.js, Vue, Tailwind) to maintain maximum speed, zero build-step fragility, and complete transparency.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Layout** | Semantic HTML5 | Pre-rendered SSR for instant crawlability and zero-JS accessibility |
| **Styling** | Vanilla CSS3 | Custom dark glassmorphic design, CSS variables, responsive timeline rail |
| **Interactivity** | Vanilla ES6+ | State management, LocalStorage synchronization, live HUD pace calculator |
| **Dataset** | JSON / JS | 121 curated titles in `data/data.json` and mirrored in `data/data.js` |
| **SSR Pre-Renderer** | Node.js | `scripts/prerender.js` generates static cards, SEO tags, and JSON-LD |
| **Telemetry** | Vercel Serverless | Lightweight presence heartbeat endpoint (`api/presence.js`) |
| **CI/CD** | GitHub Actions | Automated linting, test suite, Vercel deployment, and production smoke tests |

---

## 📁 Repository Directory Structure

```text
Marvel Roadmap/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions automated CI/CD pipeline
├── api/
│   └── presence.js            # Vercel serverless live presence heartbeat endpoint
├── assets/                    # Static branding and payment assets (UPI QR code)
├── data/
│   ├── data.js                # JavaScript dataset of all 121 Marvel titles
│   └── data.json              # JSON export of the complete roadmap dataset
├── pages/
│   ├── privacy-policy.html    # Zero-tracking privacy and data policy documentation
│   ├── support.html           # Dedicated Buy Me a Coffee & direct transfer page
│   └── supporters.html        # Community Hall of Supporters & Contributors wall of fame
├── poster/                    # High-resolution media repository
│   ├── portrait/              # Compressed portrait posters (.webp & .jpg)
│   └── landscape/             # Compressed landscape backdrops (.webp & .jpg)
├── scripts/
│   ├── app.js                 # Application state, HUD calculations & interactivity
│   ├── prerender.js           # Automated SSR generator for cards, SEO & schema
│   ├── support.js             # Toast notifications & one-click clipboard copy
│   ├── supporters.js          # Tab switching & dynamic GitHub avatar resolution
│   └── sync-wiki.js           # Project wiki synchronization script
├── style/
│   └── style.css              # Handcrafted modern Vanilla CSS with dark theme
├── test/
│   └── validate-data.js       # Automated dataset, media, and SEO test suite
├── wiki/                      # Markdown guides synced with GitHub Wiki
├── AGENTS.md                  # Unified AI coding assistant guidelines (this file)
├── CLAUDE.md                  # Anthropic Claude-specific instructions
├── CITATION.cff               # Academic and research citation metadata
├── CODE_OF_CONDUCT.md         # Community behavior standards and pledge
├── CONTRIBUTING.md            # Guidelines for contributors and PR submission
├── CONTRIBUTORS.md            # Recognition of project authors and contributors
├── index.html                 # Semantic HTML5 layout with rich SEO & JSON-LD
├── LICENSE                    # MIT License
├── manifest.json              # Web App Manifest for PWA and discoverability
├── og-image.jpg               # High-resolution social media sharing preview card
├── package.json               # NPM scripts, test commands, and project metadata
├── README.md                  # Comprehensive project documentation
├── robots.txt                 # Search engine crawler instructions
├── SECURITY.md                # Security policy and vulnerability reporting
├── sitemap.xml                # XML sitemap for search engine indexing
└── vercel.json                # Vercel routing, rewrites, redirects & headers
```

---

## ⚡ Essential Commands

Always run these commands before submitting changes:

```bash
# Lint JavaScript syntax across all scripts
npm run lint

# Pre-render HTML and run full validation test suite
npm test

# Run SSR pre-renderer independently
npm run prerender

# Start local preview server at http://localhost:3000
npm start
```

---

## 🚨 Strict Non-Negotiable Rules for Agents

### 1. Zero Prohibited Dashes (Strict ASCII Hyphens Only)
- **NEVER** use unicode em-dashes (U+2014) or en-dashes (U+2013) anywhere in HTML, JavaScript, JSON, CSS, Markdown, or workflow files.
- Always use standard ASCII hyphens (`-`) or commas (`, `).
- CI/CD will strictly fail if any prohibited dash is detected.

### 2. Dataset Synchronization (`data.json` & `data.js`)
- Whenever adding, editing, or correcting an entry in `data/data.json`, you **MUST** ensure `data/data.js` matches it identically.
- After modifying either dataset file, always execute `npm test` so that `scripts/prerender.js` rebuilds `index.html`.

### 3. Clean URLs & Routing
- Never link to `.html` in internal hrefs or sitemaps. Use clean URLs:
  - Homepage: `/`
  - Support: `/support`
  - Supporters: `/supporters`
  - Privacy Policy: `/privacy-policy`
- The Google Site Verification file (`google28ae9fc02e0b86f1.html`) must remain accessible directly at its root path with an HTTP 200 status.
- Legacy `.html` extensions are redirected with HTTP 308 permanent redirects in `vercel.json`.

### 4. Contributor Recognition Protocol
- **Maintainer**: Vaibhav Soni is recognized as Project Creator and Lead Maintainer (Owner). He must **NOT** be included in the external code contributor cards on `pages/supporters.html`.
- **Open-Source Contributors**: External contributors (e.g., Saumya Soni) are celebrated on `pages/supporters.html`, `CONTRIBUTORS.md`, `README.md`, and `wiki/`.
- Real GitHub avatars are dynamically fetched using `https://github.com/<username>.png?size=96` with automatic fallback to GitHub's official logo SVG.

### 5. Windows Shell & Git Execution
- On Windows operating systems, execute git write operations (`git add`, `git commit`, `git push`, `git checkout`) with unsandboxed/elevated permissions (`BypassSandbox: true`).
- In PowerShell, avoid shell command substitutions like `&&` across different commands; prefer sequential `;` execution or separate tool calls.

---

## 🧪 Testing & Verification Checklist

Before pushing or completing any turn:
- [ ] Run `npm run lint` - 0 errors allowed.
- [ ] Run `npm test` - validates 121 titles, 242 WebP media files, clean URLs, JSON-LD schema, and zero em-dash policy.
- [ ] Verify `git diff --exit-code` - ensure no unintended drift or uncommitted pre-render outputs.
- [ ] Push to `main` and verify that the GitHub Actions CI/CD workflow passes all quality checks, Vercel deployment, and live production smoke tests.
