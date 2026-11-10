# 🎬 Marvel Multiverse Roadmap (1998 - 2026)

[![CI/CD Pipeline](https://github.com/VaibhavSoni24/Marvel-Roadmap/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/VaibhavSoni24/Marvel-Roadmap/actions/workflows/ci-cd.yml)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-22c55e?style=flat&logo=vercel)](https://marvel-multiverse-roadmap.vercel.app/)
[![Roadmap](https://img.shields.io/badge/Roadmap-121%20Titles-e50914?style=flat&logo=marvel)](https://marvel-multiverse-roadmap.vercel.app/)
[![Contributors](https://img.shields.io/github/contributors/VaibhavSoni24/Marvel-Roadmap?style=flat&logo=github&color=orange)](CONTRIBUTORS.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Complete release-order marathon across MCU, Fox X-Men, Sony Spider-Man, Marvel Television Defenders, and Legacy universes leading to Avengers: Doomsday.**
>
> 🌐 **Live Application**: [https://marvel-multiverse-roadmap.vercel.app/](https://marvel-multiverse-roadmap.vercel.app/)
>
> 📚 **Project Wiki & Guides**: [https://github.com/VaibhavSoni24/Marvel-Roadmap/wiki](https://github.com/VaibhavSoni24/Marvel-Roadmap/wiki)

---

## ✨ Features

- **🎯 Exact 121-Item Multiverse Path**: Complete chronological release marathon from *Blade (1998)* through *Avengers: Doomsday (December 18, 2026)*.
- **📝 Contextual One-Line Descriptions**: Every single movie and series card includes a concise one-line synopsis detailing what the entry is and its role in the Marvel Multiverse.
- **📊 Interactive Sticky HUD Rail**:
  - **LEFT**: Live watch hours & minutes remaining across unwatched & unskipped titles.
  - **PACE**: Calculated hours/day needed to finish before *Avengers: Doomsday* premiere.
  - **SKIPPED**: Live watch time of skipped titles, omitted from remaining watch time and pace calculations.
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
- **📺 "Where to Watch" Streaming Affiliates**:
  - Direct deep-links with official high-resolution badges for **Disney+ Hotstar, Amazon Prime Video, and Vi Movies & TV**.
  - One-click redirection to official stream, buy, or rent pages.
  - Powered by our Amazon Associates program partner integration (`vaibhavson083-21`).
- **⭐ Official & Personal Ratings**:
  - Includes critical IMDb ratings.
  - Interactive **Your Rating** popover widget (1-10 stars) with smooth micro-animations and instant local persistence.
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
- **🚀 One-Click "Continue" & "Go to Bottom" Navigation**:
  - Instant navigation to either your next unwatched milestone or directly to the final multiverse milestone (*Avengers: Doomsday*).
- **📱 Responsive Multi-Device Architecture**:
  - Engineered for clean presentation across all screen sizes: ultra-compact phones (320px-360px), modern iOS & Android devices (375px-430px), tablets (768px-1024px), up to 4K desktop screens.
  - Features zero horizontal overflow, touch-friendly 33px uniform action buttons, iOS safe-area insets, and aspect-ratio constrained tablet cards.

---

## 📁 Project Structure

```text
Marvel Roadmap/
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # GitHub Actions automated CI/CD pipeline
├── assets/              # Static branding, vector icons, provider badges & payment assets
│   └── providers/       # High-resolution vector badges for streaming platforms
├── data/
│   ├── data.js          # JavaScript dataset of all 121 Marvel titles
│   └── data.json        # JSON export of the complete roadmap dataset
├── pages/
│   ├── privacy-policy.html # Dedicated zero-tracking privacy and data policy
│   ├── support.html     # Dedicated Buy Me a Coffee & direct transfer page
│   └── supporters.html  # Community Hall of Supporters & Contributors hall of fame
├── scripts/
│   ├── app.js           # Application state, HUD calculations & interactivity
│   ├── prerender.js     # Automated SSR generator for cards, SEO & schema
│   ├── support.js       # Toast notifications & one-click clipboard copy
│   ├── supporters.js    # Tab switching & dynamic GitHub avatar resolution
│   └── sync-wiki.js     # Project wiki synchronization script
├── style/
│   └── style.css        # Handcrafted modern Vanilla CSS with dark theme
├── index.html           # Semantic HTML5 layout with rich SEO & JSON-LD
├── google28ae9fc02e0b86f1.html # Google Search Console ownership verification token
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
├── AGENTS.md            # Comprehensive guidelines for AI coding assistants
├── CLAUDE.md            # Anthropic Claude Code contributor instructions
├── .cursorrules         # Cursor AI editor developer rules
├── CONTRIBUTING.md      # Guidelines for contributors and PR submission
├── CONTRIBUTORS.md      # Recognition of project authors and contributors
├── CODE_OF_CONDUCT.md   # Community behavior standards and pledge
├── SECURITY.md          # Security policy and vulnerability reporting
├── CITATION.cff         # Academic and research citation metadata
├── wiki/                # Comprehensive documentation guides and reference wiki
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

## 👥 Contributors

A huge thank you to everyone who has contributed to the Marvel Multiverse Roadmap:

- **Vaibhav Soni** ([@VaibhavSoni24](https://github.com/VaibhavSoni24)) - Project Creator & Lead Maintainer (Owner)
- **Saumya Soni** ([@saumyasoni051203-oss](https://github.com/saumyasoni051203-oss)) - Open-Source Contributor (Trailer Corrections & Header Navigation)

For detailed contribution breakdowns, PR links, and milestones, please see [CONTRIBUTORS.md](CONTRIBUTORS.md) as well as our live [Hall of Supporters & Contributors](https://marvel-multiverse-roadmap.vercel.app/supporters#contributors) page.

---

## 📽️ Multiverse Scope (121 Titles)

- **Marvel Cinematic Universe (64 titles)**: Phases 1 through 6, culminating in *Avengers: Doomsday (December 18, 2026)*.
- **Fox X-Men & Fantastic Four (18 titles)**: *X-Men 1-3, First Class, Days of Future Past, Apocalypse, Logan, Deadpool 1 & 2, Dark Phoenix, The New Mutants, Fantastic Four*.
- **Marvel Television Defenders Saga (16 titles)**: *Daredevil, Jessica Jones, Luke Cage, Iron Fist, The Defenders, The Punisher*.
- **Sony's Spider-Man Universes (13 titles)**: *Sam Raimi Trilogy, The Amazing Spider-Man 1 & 2, Into/Across the Spider-Verse, Venom 1-3, Morbius, Madame Web, Kraven the Hunter*.
- **Legacy Marvel Classics (10 titles)**: *Blade Trilogy, Daredevil (2003), Elektra, Hulk (2003), The Punisher (2004), Punisher: War Zone, Ghost Rider 1 & 2*.

---

## 🛠️ Tech Stack

- **Core**: Vanilla HTML5 (Pre-rendered for search crawlers & zero-JS support), Vanilla JavaScript (ES6+), Vanilla CSS
- **Design**: Modern glassmorphism, responsive alternating timeline rail, CSS Custom Properties
- **Assets**: Local compressed WebP/JPEG assets with Pillow optimization
- **APIs & Data**: Curated metadata from TMDB, IMDb, and Doomsday Roadmap

---

## ☕ Support the Project

If this roadmap helped you conquer the Marvel Multiverse, you can support its hosting and ongoing maintenance:

- **☕ Buy Me a Coffee & Direct Transfer**: [https://marvel-multiverse-roadmap.vercel.app/support](https://marvel-multiverse-roadmap.vercel.app/support)
  - **UPI & QR Code (India - 0% Fee)**: Instant peer-to-peer support via PhonePe, Google Pay, Paytm, or BHIM (`6350366202-r52f@axl`).
  - **Direct Bank Transfer (India & International)**: Direct wire via NEFT/IMPS/RTGS or foreign SWIFT transfer.
- **🏆 Hall of Supporters**: [https://marvel-multiverse-roadmap.vercel.app/supporters](https://marvel-multiverse-roadmap.vercel.app/supporters)
  - Every supporter is recognized on our monthly community Hall of Fame! Email your payment confirmation or transaction ID to `vaibhavsoni280506@gmail.com` to be featured.
- **🔒 Privacy Policy**: [https://marvel-multiverse-roadmap.vercel.app/privacy-policy](https://marvel-multiverse-roadmap.vercel.app/privacy-policy)
  - Zero analytics, zero third-party cookies, and strictly client-side localStorage.

---

## 👤 Author & Project Owner

**Vaibhav Soni**
- **GitHub**: [VaibhavSoni24 (Vaibhav Soni)](https://github.com/VaibhavSoni24)
- **LinkedIn**: [Vaibhav Soni](https://www.linkedin.com/in/vaibhav-soni-867836285/)
- **Project Repository**: [VaibhavSoni24/Marvel-Roadmap](https://github.com/VaibhavSoni24/Marvel-Roadmap)

---

## ⚖️ Disclaimer & Third-Party Trademark / Asset Rights

This project is an **unofficial, non-commercial open-source fan project** created solely for the Marvel fan community to discover release orders and track movie/series marathon viewing progress.

- **Software Code License**: The custom application code, build and validation scripts, stylesheets, and documentation created for this repository are licensed under the [MIT License](LICENSE).
- **Trademarks & Copyrights**: Marvel, the Marvel Cinematic Universe (MCU), The Avengers, Spider-Man, X-Men, Fantastic Four, Daredevil, Blade, and all associated characters, logos, titles, poster artworks, backdrops, and video trailers are registered trademarks and copyrights of **Marvel Studios, The Walt Disney Company, Sony Pictures Entertainment, 20th Century Studios**, and their respective affiliates.
- **Affiliate Disclosure**: We participate in the Amazon Associates program. When you click an Amazon Prime Video link and choose to rent, buy, or subscribe, we earn an affiliate commission at no extra cost to you.
- **Asset Usage**: No ownership of any third-party character names, trademarks, promotional posters, or backdrops is claimed or granted by the open-source software license. All promotional posters, thumbnails, and backdrops are used strictly under fair use principles for identification, educational, and commentary purposes.

---

## 📄 License

This software is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
