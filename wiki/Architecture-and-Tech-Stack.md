# 🛠️ Architecture & Technical Specification

The **Marvel Multiverse Roadmap** is engineered using pure Vanilla Web technologies with zero heavy dependencies, achieving sub-second load times, 100% SEO indexability, and clean mobile performance.

---

## 🏗️ Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                     Client Browser                     │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ Semantic HTML │  │ Glassmorph CSS │  │ App State │  │
│  │ (Pre-rendered)│  │ (Custom Props) │  │  (app.js) │  │
│  └───────────────┘  └────────────────┘  └─────┬─────┘  │
│                                               │        │
│          ┌────────────────────────────────────┼──────┐ │
│          ▼                                    ▼      │ │
│   LocalStorage                        DOM Updates    │ │
│   - Watched IDs                       - Sticky HUD   │ │
│   - Skipped IDs                       - Filters      │ │
│   - Star Ratings                      - Modal        │ │
└───────────────────────────────────────────────┼────────┘
                                                │ fetch()
                                                ▼
                                    ┌───────────────────────┐
                                    │ Vercel Serverless API │
                                    │     /api/presence     │
                                    └───────────────────────┘
```

---

## 1. Zero-Dependency Vanilla Core

Instead of heavyweight frontend frameworks (React, Next.js, Vue) that ship megabytes of JavaScript runtime overhead, this application uses:
* **HTML5**: Fully semantic structure (`<header>`, `<main>`, `<article>`, `<details>`, `<ol>`).
* **Vanilla JavaScript (ES6+)**: Custom DOM rendering, event delegation, and micro-animations with 0 external npm dependencies.
* **Modern CSS3**: Handcrafted dark glassmorphism utilizing CSS custom properties, backdrop blur filters, and CSS grid/flexbox.

---

## 2. Static Pre-Rendering Pipeline (`scripts/prerender.js`)

To ensure search engines (Googlebot, Bing) and non-JavaScript clients can immediately parse all 121 title cards:
* **Build Step**: `npm run prerender` executes `node scripts/prerender.js`.
* **Output**:
  * Injects all 121 fully formed `<li class="timeline-item">` elements directly into `index.html`.
  * Computes initial HUD values (`LEFT`, `PACE`) for instant first-paint display before client-side hydration.
  * Injects 121-item Schema.org `ItemList`, `WebApplication`, and `FAQPage` JSON-LD structured data.

---

## 3. Stacking Context & Z-Index Hierarchy

The application maintains a strict z-index stacking model to prevent card overlap while scrolling past sticky navigation:

| Layer | CSS Class / Selector | `z-index` | Purpose |
| :--- | :--- | :---: | :--- |
| **Toast Notifications** | `.toast-container` | `1100` | Always on top of all modals and menus |
| **Trailer Modal Overlay** | `.modal-overlay` | `1000` | Fullscreen backdrop dialog |
| **Online Presence Badge** | `.online-presence` | `100` | Fixed top-right live visitor indicator |
| **Floating Navigation** | `.floating-fab` | `95` | Bottom-left & bottom-right jump FABs |
| **Sticky HUD Rail** | `.sticky-hud-rail` | `90` | Floats cleanly above all scrolling cards |
| **Active Popovers** | `.has-open-popover` | `60` | Elevates card above adjacent siblings |
| **Timeline Nodes** | `.timeline-node` | `10` | Central numbered milestone circles |
| **Central Rail Line** | `.timeline-central-rail` | `1` | Alternating gradient timeline spine |
| **Dynamic Hero Canvas** | `.hero-bg` | `0` | Crossfading ambient poster background |

---

## 4. Live Telemetry (`/api/presence`)

The online presence indicator at the top right displays active visitors without requiring continuous WebSockets:
* A lightweight Vercel Serverless Function tracks active sessions via ephemeral memory with expiration timestamps.
* The frontend heartbeats periodically using `fetch('/api/presence', { cache: 'no-store' })`.
* Graceful fallback defaults to `1 online` if offline or deployed locally.

---

## 5. Automated CI/CD & Testing Suite

Every pull request and push to `main` executes GitHub Actions (`.github/workflows/ci-cd.yml`):
* `npm run lint`: Verifies syntax across all JS files via `node --check`.
* `npm test`: Executes `test/validate-data.js`:
  * Validates sequential dataset integrity (1 to 121).
  * Asserts all 242 portrait and landscape WebP images exist on disk.
  * Asserts all community documents (`README.md`, `CONTRIBUTING.md`, `CONTRIBUTORS.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CITATION.cff`) exist.
  * Validates SEO metadata, Schema.org graph, and z-index regression rules.
