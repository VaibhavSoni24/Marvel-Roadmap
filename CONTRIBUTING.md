# Contributing to Marvel Multiverse Roadmap 🎬

Thank you for your interest in improving the **Marvel Multiverse Roadmap**! Whether you are fixing an outdated trailer, fine-tuning a movie's one-line description, or adding upcoming Marvel Phase 6 announcements, your contributions are welcome.

---

## 📋 Table of Contents
- [How You Can Contribute](#-how-you-can-contribute)
- [Local Development Setup](#-local-development-setup)
- [Running Automated Verification (CI)](#-running-automated-verification-ci)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Data Structure Guidelines](#-data-structure-guidelines)
- [Recognition of Contributors](#-recognition-of-contributors)
- [Code of Conduct](#-code-of-conduct)

---

## 🌟 How You Can Contribute

1. **Official Trailer Fixes**: If a YouTube trailer is broken, regional-locked, or has a higher-quality official version, update the `trailer` field in `data/data.json`.
2. **Contextual Descriptions**: Make one-line descriptions punchier, more informative, or more accurate to their multiverse relevance.
3. **New Announcements**: When Marvel Studios, Sony, or Fox releases new release dates or official trailers, submit an issue or PR with the official source.
4. **UI & Accessibility Enhancements**: Help improve responsive design, keyboard navigation, or performance.

---

## 💻 Local Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/VaibhavSoni24/Marvel-Roadmap.git
   cd Marvel-Roadmap
   ```

2. **Run locally using Node.js**:
   ```bash
   npm start
   ```
   Then open `http://localhost:3000` in your browser.

   *(Alternatively, run with Python: `python -m http.server 3000`)*

---

## 🧪 Running Automated Verification (CI)

Before submitting changes, ensure your local changes pass all automated integrity checks:

```bash
# Validate JavaScript syntax
npm run lint

# Validate all 121 items, media paths, and SEO metadata
npm test
```

---

## 🤖 AI-Assisted Contributions (Agents & Copilots)

If you use AI coding assistants (such as Claude Code, Cursor, Antigravity, GitHub Copilot, or Gemini) to contribute:
- Please review [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) for strict architectural rules, dataset synchronization protocols, and our zero-prohibited-dash policy.
- Configuration for Cursor is available in [.cursorrules](.cursorrules).
- Ensure all automated checks (`npm run lint` and `npm test`) pass cleanly before submitting your pull request.

The validation suite checks:
- JSON structure and sequential ID order (1 to 121).
- Existence of portrait posters (`poster/portrait/*.webp`) and landscape backdrops (`poster/landscape/*.webp`).
- Format of release dates (`YYYY-MM-DD`), runtime minutes, and trailer URLs.
- SEO assets (`sitemap.xml`, `robots.txt`, `og-image.jpg`).

---

## 🚀 Submitting a Pull Request

1. Create a feature branch:
   ```bash
   git checkout -b feature/update-trailer-xyz
   ```
2. Commit your changes with clear, descriptive commit messages following Conventional Commits (e.g. `fix(trailer): update Spider-Man 2 trailer link`).
3. Push to your fork:
   ```bash
   git push origin feature/update-trailer-xyz
   ```
4. Open a **Pull Request** against the `main` branch. GitHub Actions will automatically run the CI test suite on your PR.

---

## 📊 Data Structure Guidelines

When updating entries in `data/data.json`:

```json
{
  "id": 17,
  "title": "Iron Man",
  "release_date": "2008-05-02",
  "year": 2008,
  "type": "movie",
  "universe": "MCU",
  "category": "MCU",
  "runtime_mins": 126,
  "watch_time": "2h 06m",
  "rating": "7.9/10",
  "trailer": "https://www.youtube.com/watch?v=8ugaeA-nMTc",
  "tmdb_id": 1726,
  "is_tv": false,
  "poster_portrait": "poster/portrait/17.webp",
  "poster_landscape": "poster/landscape/17.webp",
  "description": "Introduces Robert Downey Jr. as Tony Stark and officially launches the Marvel Cinematic Universe.",
  "watch_providers": ["hotstar", "prime"]
}
```

*Note: Whenever `data/data.json` is modified, make sure `data/data.js` matches its content identically.*

---

## 👥 Recognition of Contributors

All accepted contributions, bug fixes, feature implementations, and trailer updates are recognized in our [CONTRIBUTORS.md](https://github.com/VaibhavSoni24/Marvel-Roadmap/blob/main/CONTRIBUTORS.md) document as well as on our live [Hall of Supporters & Contributors](https://marvel-multiverse-roadmap.vercel.app/supporters#contributors) page. Thank you for helping make this community roadmap better!

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By contributing, you are expected to uphold this code. Please report any unacceptable behavior to **vaibhavsoni280506@gmail.com**.

---

## 📄 License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
