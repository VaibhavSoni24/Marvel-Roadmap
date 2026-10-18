# 🎬 Marvel Multiverse Roadmap (1998 - 2026)

[![CI/CD Pipeline](https://github.com/VaibhavSoni24/Marvel-Roadmap/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/VaibhavSoni24/Marvel-Roadmap/actions/workflows/ci-cd.yml)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-22c55e?style=flat&logo=vercel)](https://marvel-multiverse-roadmap.vercel.app/)
[![Roadmap](https://img.shields.io/badge/Roadmap-121%20Titles-e50914?style=flat&logo=marvel)](https://marvel-multiverse-roadmap.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Complete release-order marathon across MCU, Fox X-Men, Sony Spider-Man, Marvel Television Defenders, and Legacy universes leading to Avengers: Doomsday.**
>
> 🌐 **Live Application**: [https://marvel-multiverse-roadmap.vercel.app/](https://marvel-multiverse-roadmap.vercel.app/)

---

## ✨ Features

- **🎯 Exact 121-Item Multiverse Path**: Complete chronological release marathon from *Blade (1998)* through *Avengers: Doomsday (December 18, 2026)*.
- **📝 Contextual One-Line Descriptions**: Every single movie and series card includes a concise one-line synopsis detailing what the entry is and its role in the Marvel Multiverse.
- **📊 Interactive Sticky HUD Rail**:
  - **LEFT**: Live watch hours & minutes remaining across unwatched titles.
  - **PACE**: Calculated hours/day needed to finish before *Avengers: Doomsday* premiere.
  - **DONE**: Live completion counter (`x/121`) with real-time percentage and progress bar.
- **🎨 Dynamic Ambient Landscape Backdrop**:
  - Full-screen high-definition backdrop automatically transitions as you scroll or hover over movie cards.
  - Dark cinematic vignette preserves high contrast and legibility.
- **🖼️ High-Quality Compressed Posters**:
  - Every title includes local high-resolution portrait posters and landscape backdrops stored in `./poster/`.
  - Served in ultra-fast, compressed WebP format with JPEG fallbacks.
- **📺 Series vs. Movie Specific Metrics**:
  - **Movies**: Displays total watch time (e.g. `2h 00m`).
  - **Series**: Displays **Total Time**, **Average Time per Episode**, and **Total Episodes** (e.g. `11h 42m | 54m/ep | 13 eps`).
- **⭐ Official & Personal Ratings**:
  - Includes critical IMDb ratings.
  - Interactive **Your Rating** popover widget (1–10 stars) with smooth micro-animations and instant local persistence.
- **💾 100% LocalStorage Persistence**:
  - Tracks **Mark as Watched**, **Skip**, and **Personal Ratings** directly on your device with instant feedback.
  - One-click **Reset All Progress** in footer.
- **👥 Real-Time Online Presence Pulse**:
  - Dynamic live counter (`● 1 online`) powered by a lightweight Vercel Serverless heartbeat endpoint (`/api/presence`) reflecting active concurrent browser sessions on the instance.
  - *Note on Analytics*: This counter provides a lightweight real-time pulse of active users. For persistent, comprehensive visitor telemetry and traffic source breakdown, integrate a dedicated analytics service such as Vercel Web Analytics or Google Analytics.
- **🎬 Official YouTube Trailers**:
  - Embedded responsive modal player with direct YouTube links for all titles.
- **⚡ Real-Time Search & Universe Filtering**:
  - Instant search across title, release year, character, universe tags, and descriptions.
  - Quick chips with exact dataset counts: **All (121)**, **MCU (64)**, **Fox (18)**, **Defenders (16)**, **Sony (13)**, and **Legacy (10)**.
  - Status filters: **All**, **Remaining**, **Watched**, and **Skipped**.
- **🚀 One-Click "Continue" Button**:
  - Automatically identifies the next unwatched milestone and scrolls smoothly into view.

---

## 📁 Project Structure

```text
Marvel Roadmap/
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # GitHub Actions automated CI/CD pipeline
├── index.html           # Semantic HTML5 layout with rich SEO & JSON-LD
├── style.css            # Handcrafted modern Vanilla CSS with dark theme
├── app.js               # Application state, HUD calculations & interactivity
├── data.js              # JavaScript dataset of all 121 Marvel titles
├── data.json            # JSON export of the complete roadmap dataset
├── api/
│   └── presence.js      # Vercel serverless live presence heartbeat endpoint
├── test/
│   └── validate-data.js # Automated dataset, media, and SEO test suite
├── vercel.json          # Vercel deployment config, headers & caching rules
├── sitemap.xml          # XML sitemap for search engine indexing
├── robots.txt           # Crawler instructions and sitemap link
├── manifest.json        # Web App Manifest for PWA and discoverability
├── og-image.jpg         # High-resolution social media sharing preview card
├── package.json         # NPM scripts, test commands, and project metadata
├── CONTRIBUTING.md      # Guidelines for contributors and PR submission
├── .gitignore           # Git ignore rules
└── poster/              # High-resolution media repository
    ├── portrait/        # Compressed portrait posters (.webp & .jpg)
    └── landscape/       # Compressed landscape backdrops (.webp & .jpg)
```

---

## 🚀 Getting Started & Deployment

### Deploy to Vercel (Recommended)

This project is pre-configured for instant Vercel deployment:

```bash
# Deploy to production with Vercel CLI
vercel --prod
```

### Local Development

#### Option 1: Using Node.js / NPM

```bash
# Start local server
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Using Python

```bash
# Python 3 built-in HTTP server
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000).

### Option 3: Direct File Opening
You can also directly open `index.html` in modern web browsers (Chrome, Edge, Firefox, Safari).

---

## 🧪 Automated Testing & CI/CD Pipeline

The project features a full **Continuous Integration & Continuous Deployment** pipeline powered by GitHub Actions:

- **Lint & Syntax Checks**: Validates all JavaScript files using `node --check`.
- **Integrity Test Suite**: Runs `npm test` (`test/validate-data.js`) to verify:
  - Exact 121 sequentially indexed titles.
  - Presence of all 242 local WebP images.
  - Validity of release dates, runtimes, and trailer URLs.
  - SEO readiness (`sitemap.xml`, `robots.txt`, `og-image.jpg`, meta tags).
- **Automated Deployment**: Automatically deploys the production build to Vercel upon merging or pushing to `main`.

Run tests locally:
```bash
npm run lint
npm test
```

---

## 🤝 Contributing

Contributions, bug reports, and trailer corrections are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting a pull request.

---

## 📽️ Multiverse Scope (121 Titles)

- **Marvel Cinematic Universe (64 titles)**: Phases 1 through 6, culminating in *Avengers: Doomsday (December 18, 2026)*.
- **Fox X-Men & Fantastic Four (18 titles)**: *X-Men 1–3, First Class, Days of Future Past, Apocalypse, Logan, Deadpool 1 & 2, Dark Phoenix, The New Mutants, Fantastic Four*.
- **Marvel Television Defenders Saga (16 titles)**: *Daredevil, Jessica Jones, Luke Cage, Iron Fist, The Defenders, The Punisher*.
- **Sony's Spider-Man Universes (13 titles)**: *Sam Raimi Trilogy, The Amazing Spider-Man 1 & 2, Into/Across the Spider-Verse, Venom 1–3, Morbius, Madame Web, Kraven the Hunter*.
- **Legacy Marvel Classics (10 titles)**: *Blade Trilogy, Daredevil (2003), Elektra, Hulk (2003), The Punisher (2004), Punisher: War Zone, Ghost Rider 1 & 2*.

---

## 🛠️ Tech Stack

- **Core**: Vanilla HTML5 (Pre-rendered for search crawlers & zero-JS support), Vanilla JavaScript (ES6+), Vanilla CSS
- **Design**: Modern glassmorphism, responsive alternating timeline rail, CSS Custom Properties
- **Assets**: Local compressed WebP/JPEG assets with Pillow optimization
- **APIs & Data**: Curated metadata from TMDB, IMDb, and Doomsday Roadmap

---

## 👤 Author

**Vaibhav Soni**
- **GitHub**: [VaibhavSoni24 (Vaibhav Soni)](https://github.com/VaibhavSoni24)
- **LinkedIn**: [Vaibhav Soni](https://www.linkedin.com/in/vaibhav-soni-867836285/)
- **Project Repository**: [VaibhavSoni24/Marvel-Roadmap](https://github.com/VaibhavSoni24/Marvel-Roadmap)

---

## ⚖️ Disclaimer & Third-Party Trademark / Asset Rights

This project is an **unofficial, non-commercial open-source fan project** created solely for the Marvel fan community to discover release orders and track movie/series marathon viewing progress.

- **Software Code License**: The custom application code, build and validation scripts, stylesheets, and documentation created for this repository are licensed under the [MIT License](LICENSE).
- **Trademarks & Copyrights**: Marvel, the Marvel Cinematic Universe (MCU), The Avengers, Spider-Man, X-Men, Fantastic Four, Daredevil, Blade, and all associated characters, logos, titles, poster artworks, backdrops, and video trailers are registered trademarks and copyrights of **Marvel Studios, The Walt Disney Company, Sony Pictures Entertainment, 20th Century Studios**, and their respective affiliates.
- **Asset Usage**: No ownership of any third-party character names, trademarks, promotional posters, or backdrops is claimed or granted by the open-source software license. All promotional posters, thumbnails, and backdrops are used strictly under fair use principles for identification, educational, and commentary purposes.

---

## 📄 License

This software is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
