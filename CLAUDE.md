# CLAUDE.md - Instructions for Claude Code

## Project Context
The Marvel Multiverse Roadmap is a zero-dependency Vanilla HTML5/CSS3/ES6+ web application tracking 121 Marvel titles in release order to Avengers: Doomsday (2026).

- Live Production: https://marvel-multiverse-roadmap.vercel.app/
- Maintainer: Vaibhav Soni (@VaibhavSoni24)

## Commands
```bash
npm run lint      # Check JS syntax across scripts/, api/, data/, test/
npm test          # Run prerender.js and validate-data.js suite
npm run prerender # Rebuild index.html timeline cards, stats, and JSON-LD
npm start         # Local development server at http://localhost:3000
```

## Critical Rules & Guidelines

1. **Strict ASCII Hyphen Policy**:
   - Zero unicode em-dashes (U+2014) or en-dashes (U+2013) anywhere in the repo.
   - Always use standard ASCII hyphens (`-`) or commas (`, `).

2. **Dataset Synchronization**:
   - `data/data.json` and `data/data.js` must remain 100% synchronized.
   - Always run `npm test` after editing dataset files to rebuild `index.html`.
   - Every title includes `watch_providers` array and Amazon Associates tag `vaibhavson083-21`.

3. **Clean URLs & Routing**:
   - Never use `.html` extensions in internal links. Use `/`, `/support`, `/supporters`, and `/privacy-policy`.
   - Legacy `.html` routes must redirect via HTTP 308 in `vercel.json`.
   - Google verification file (`google28ae9fc02e0b86f1.html`) must return HTTP 200 directly.

4. **Code Architecture**:
   - Zero external frontend frameworks (no React, Next.js, Vue, or Tailwind).
   - Core files:
     - `index.html`: Pre-rendered roadmap layout with SSR cards and JSON-LD graph.
     - `pages/privacy-policy.html`: Zero-tracking privacy and data policy.
     - `pages/support.html`: Buy Me a Coffee direct transfer page.
     - `pages/supporters.html`: Hall of Supporters & Contributors directory.
     - `scripts/app.js`: Main roadmap state, HUD pace calculator, filtering, modals.
     - `scripts/support.js`: Toast notifications & one-click clipboard copy.
     - `scripts/supporters.js`: Tab switching & dynamic GitHub avatar resolution.
     - `scripts/prerender.js`: Automated pre-render generator.
     - `style/style.css`: Handcrafted modern Vanilla CSS.

5. **Contributor Protocol**:
   - Project Owner (Vaibhav Soni) is Lead Maintainer and not listed in external contributor cards on `pages/supporters.html`.
   - Contributor avatars are dynamically loaded via `https://github.com/<username>.png?size=96` with SVG fallback.

6. **Windows Git Execution**:
   - When executing git write operations (`commit`, `push`, `checkout`) on Windows, use elevated/unsandboxed execution (`BypassSandbox: true`).
