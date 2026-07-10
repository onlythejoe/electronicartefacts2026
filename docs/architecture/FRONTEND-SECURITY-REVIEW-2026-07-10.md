# Frontend security review

Date: 10 July 2026
Scope: published HTML, TypeScript templates, vanilla browser JavaScript, dependencies and GitHub Pages constraints.

## Executive summary

No critical, high or medium vulnerability was confirmed. The review traced URL-derived values, browser storage, dynamic HTML insertion, external links and third-party script loading. Search results escape every catalog field before insertion, shared HTML includes resolve only to same-origin repository partials, external links use `rel="noreferrer"`, analytics remains disabled until explicit consent, and `npm audit --omit=dev` reported zero vulnerabilities.

Two low-severity defense-in-depth limits remain. They should be handled as deployment policy decisions rather than patched blindly into static HTML.

## Low severity

### SEC-001 — No enforceable Content Security Policy is visible in the repository

- Rule ID: JS-CSP-001
- Severity: Low
- Location: `src/templates/layout.ts:17-63`, plus the hand-authored page heads updated by `scripts/build-seo.mjs`
- Evidence: generated layouts load same-origin CSS and JavaScript but do not declare a CSP header or meta policy.
- Impact: a future HTML-injection defect would have less defense in depth than it would under a reviewed CSP. No current attacker-controlled path to a dangerous sink was confirmed.
- Fix: prefer a response-header CSP at the hosting edge. If the site remains limited to GitHub Pages, test a meta-delivered policy against every legacy route, JSON-LD block and consented analytics flow before adoption.
- Mitigation: current dynamic content is escaped or restricted to same-origin repository files; third-party analytics is consent-gated.
- False positive notes: a CDN or reverse proxy may already set security headers. Verify production response headers separately because that configuration is not visible in this repository.

### SEC-002 — Consented analytics executes vendor JavaScript without SRI

- Rule ID: JS-SUPPLY-001 / JS-SRI-001
- Severity: Low
- Location: `assets/js/core/analytics.js:599-615`
- Evidence: after consent, the runtime creates a script element for `https://www.googletagmanager.com/gtag/js` using the configured measurement ID.
- Impact: once accepted, vendor JavaScript executes with first-party page privileges. The endpoint is dynamic and therefore cannot be pinned with a practical static SRI hash.
- Fix: retain analytics only while its product value justifies the supply-chain exposure; otherwise remove it. If retained, constrain the production CSP to the exact required Google origins.
- Mitigation: the tag is not requested before opt-in, advertising storage and personalization signals remain denied, and refusal clears accessible analytics cookies.
- False positive notes: the public measurement ID is not a secret. This is a residual third-party execution risk, not evidence of credential exposure.

## Audited safe paths

- `assets/js/search/client.js:1-56` escapes catalog fields before building result markup.
- `assets/js/core/includes.js:5-38` resolves includes to fixed same-origin paths before inserting repository-owned partials.
- `src/templates/layout.ts:60` escapes `<` inside JSON-LD serialization.
- No `eval`, `new Function`, string timers, `document.write`, unsafe `postMessage` handler or secret-like credential was found in the reviewed source.
- `npm audit --omit=dev`: zero vulnerabilities on 10 July 2026.
