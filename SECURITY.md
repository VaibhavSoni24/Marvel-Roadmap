# Security Policy

The **Marvel Multiverse Roadmap** project takes security, data privacy, and safe user experiences seriously. This document outlines our security policies and how to report any discovered vulnerabilities responsibly.

---

## Supported Versions

Security updates and bug fixes are applied to the active branch deployed to production on Vercel:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| `main` (Live Production) | :white_check_mark: | Actively Maintained |
| Previous tags / forks    | :x:                | Please sync with `main` |

---

## Reporting a Vulnerability

If you discover a security vulnerability or sensitive bug in this repository:

1. **Do NOT open a public GitHub issue or discussion.**
   Public disclosure puts other users and visitors at risk before a fix can be prepared and deployed.

2. **Send an email directly to the project maintainer:**
   - **Contact**: Vaibhav Soni
   - **Email**: `vaibhavsoni280506@gmail.com`
   - **Subject Line**: `[SECURITY VULNERABILITY] Marvel Roadmap - <Brief Title>`

3. **Please include the following information in your report:**
   - A description of the issue and potential impact.
   - Exact steps or minimal proof-of-concept (PoC) to reproduce the vulnerability.
   - Affected file(s), endpoint(s), or browser environment.
   - Any suggested mitigations or patches (if available).

---

## Response Timeline & Procedure

- **Initial Acknowledgment**: You will receive an initial response acknowledging receipt within **48 hours**.
- **Investigation & Assessment**: The issue will be verified and triaged within **3 to 5 business days**.
- **Fix & Deployment**: Once validated, a fix will be implemented, tested against our CI test suite, and deployed to production.
- **Credit & Attribution**: Once the fix is published, we will gladly credit you in our [CONTRIBUTORS.md](CONTRIBUTORS.md) document (unless you prefer to remain anonymous).

---

## Scope & Architectural Context

The Marvel Multiverse Roadmap is a static frontend web application with a lightweight Vercel Serverless heartbeat endpoint:

- **Client-Side State**: All user progress (Watched status, Skipped titles, Personal ratings) is kept entirely private and isolated inside the client's local browser storage (`localStorage`). No personal viewing data is stored on remote servers or shared with third parties.
- **Media Embeds**: Video trailers are embedded using YouTube's privacy-enhanced domain (`youtube-nocookie.com`) to limit tracking and prevent arbitrary code execution.
- **Serverless API**: The `/api/presence` endpoint is rate-limited and returns only an anonymous active session count.

Thank you for helping keep the Marvel Multiverse Roadmap and its users safe!
