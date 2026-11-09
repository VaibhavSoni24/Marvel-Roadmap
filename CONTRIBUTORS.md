# 🌟 Marvel Multiverse Roadmap Contributors

Thank you to everyone who has contributed to making the **Marvel Multiverse Roadmap** the definitive release-order marathon guide leading to *Avengers: Doomsday (2026)*.

This project is built and maintained by open-source contributors who dedicate their time to curating data, building features, fixing bugs, and improving the fan marathon experience.

---

## 👥 Contributors Table

| Contributor | GitHub | Role | Key Contributions | PRs / Commits |
| :--- | :--- | :--- | :--- | :--- |
| **Vaibhav Soni** | [@VaibhavSoni24](https://github.com/VaibhavSoni24) | **Creator & Lead Maintainer (Owner)** | Project Conception, Full-Stack Architecture, 121-Title Dataset, UI/UX Design, Sticky HUD, Pre-render SEO, CI/CD | Initial Build, Commits `43bffd2` through `ad43f28` |
| **Saumya Soni** | [@saumyasoni051203-oss](https://github.com/saumyasoni051203-oss) | **Open-Source Contributor** | Incredible Hulk Trailer Fix, Header "Go to Bottom" Navigation, Mobile Responsive Layout | [PR #3](https://github.com/VaibhavSoni24/Marvel-Roadmap/pull/3), [PR #4](https://github.com/VaibhavSoni24/Marvel-Roadmap/pull/4) |

---

## 👑 Project Owner & Lead Maintainer

### **Vaibhav Soni**
- **GitHub**: [@VaibhavSoni24](https://github.com/VaibhavSoni24)
- **LinkedIn**: [Vaibhav Soni](https://www.linkedin.com/in/vaibhav-soni-867836285/)
- **Role**: Creator & Owner

#### Contributions Overview
- **Core Architecture & Dataset**:
  - Conceived, architected, and built the entire Marvel Multiverse Roadmap web application from scratch using zero-dependency Vanilla HTML5, CSS3, and modern ES6+ JavaScript.
  - Curated, researched, and verified the complete 121-title chronological release dataset (`data.json`, `data.js`) spanning 1998 to 2026 across MCU, Fox X-Men, Sony Spider-Verse, Marvel Television Defenders, and Legacy universes.
  - Curated, compressed, and optimized 242 local high-resolution portrait posters and landscape backdrops in WebP format with JPEG fallbacks.
  - Crafted concise, contextual one-line descriptions for all 121 entries explaining their role in the Marvel Multiverse.
- **UI & UX Engineering**:
  - Engineered the alternating chronological timeline with central gradient rail, numbered milestone nodes, and dark glassmorphic styling.
  - Designed and built the **Sticky HUD Progress Rail** with live remaining watch time (`LEFT`), daily watch pace calculator (`PACE` targeting December 18, 2026), skipped duration tracking (`SKIPPED`), and live percentage progress bar (`DONE`).
  - Implemented the interactive **1–10 star personal rating widget** with micro-animations, local storage persistence, rating lock enforcement (unlocked only after marking watched), and auto-removal fallbacks on unmark/skip.
  - Implemented **Mark as Watched** and **Skip** milestones with instant LocalStorage synchronization.
  - Created dynamic ambient landscape backdrop crossfading synchronized with viewport scroll proximity and active card detection.
  - Implemented multi-dimensional filtering (Universe chips with live item counts, Watch Status chips) and real-time instant search across titles, characters, years, and descriptions.
  - Built official YouTube trailer modal integration with responsive embedded playback.
  - Developed one-click header "Continue" navigation and dual floating action buttons (bottom-right smooth scroll-to-top and bottom-left dynamic continue card jump with directional travel indicators and top-of-page suppression).
- **Backend, Telemetry & CI/CD**:
  - Developed the live online presence visitor pulse powered by a lightweight Vercel Serverless heartbeat endpoint (`api/presence.js`).
  - Created automated Node.js pre-renderer (`scripts/prerender.js`) for full SSR SEO indexation, generating 121 pre-rendered cards, unified OpenGraph/Twitter metadata, visible FAQ accordion, and 121-item Schema.org JSON-LD structured data (`ItemList`, `WebApplication`, `FAQPage`).
  - Configured GitHub Actions automated CI/CD pipeline (`.github/workflows/ci-cd.yml`) and automated data & SEO integrity test suite (`test/validate-data.js`).
  - Production deployment, custom domain setup, and caching rules on Vercel (`vercel.json`).

---

## 🤝 Open-Source Contributors

### **Saumya Soni**
- **GitHub**: [@saumyasoni051203-oss](https://github.com/saumyasoni051203-oss)
- **Role**: Open-Source Contributor

#### Contributions Overview
- **PR #3 — The Incredible Hulk Official Trailer Link Fix** ([#3](https://github.com/VaibhavSoni24/Marvel-Roadmap/pull/3), Commit `3dff954`):
  - Identified and corrected the official trailer URL for *The Incredible Hulk* (#18) to the authentic high-definition official YouTube trailer.
  - Updated the trailer link consistently across `data.json`, `data.js`, and the pre-rendered `index.html`.
- **PR #4 — Header Quick Navigation "Go to Bottom" Button** ([#4](https://github.com/VaibhavSoni24/Marvel-Roadmap/pull/4), Commit `db4ebac`):
  - Designed, developed, and integrated the header "Go to Bottom" quick-jump pill button (`#bottomBtn` / `.bottom-pill-btn`), enabling users to smoothly navigate directly to the final multiverse milestone card (*Avengers: Doomsday* #121) with a single click.
  - Implemented responsive styling for `.header-continue-wrapper` (flex wrapping, mobile column stacking), ensuring both Continue and Go to Bottom buttons display cleanly across desktop and mobile screens.
  - Integrated click listener, dynamic target title binding, and smooth scrolling in `app.js`.
  - Added automated test validation for the Go to Bottom button in `test/validate-data.js` and updated feature documentation in `README.md`.

---

## 💡 How to Contribute

Want to see your name here? We welcome contributions from everyone!
Check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started with:
- Submitting trailer corrections or high-res replacements.
- Refining one-line contextual synopses.
- Proposing UI, performance, or accessibility enhancements.
- Updating release dates as Marvel Studios announces Phase 6 updates.

---

## 📄 License
All contributions are distributed under the project's [MIT License](LICENSE).
