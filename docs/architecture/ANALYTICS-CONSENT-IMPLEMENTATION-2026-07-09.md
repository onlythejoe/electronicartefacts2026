# Analytics Consent Implementation

Date: 2026-07-09

## Purpose

Electronic Artefacts now has a consent-gated Google Analytics 4 foundation for public audience measurement. The implementation is intentionally conservative:

- Google Analytics is not loaded until the visitor grants consent.
- Refusing analytics uses the same first-level banner as accepting.
- The footer exposes a persistent cookie-preferences control.
- A refusal is stored locally for up to six months.
- Withdrawing consent sends a denied consent signal and removes accessible GA cookies.
- Advertising storage, ad user data and ad personalization remain denied.

## Activation

Set the GA4 Measurement ID in `assets/js/core/analytics-config.js`:

```js
window.EA_ANALYTICS_CONFIG = {
  enabled: true,
  provider: "Google Analytics 4",
  measurementId: "G-XXXXXXXXXX",
  privacyUrl: "/confidentialite.html",
};
```

Leave `measurementId` empty until a real GA4 property is ready. With an empty ID, the runtime exposes `window.EA_ANALYTICS.configured === false` and does not display a banner or contact Google.

## Compliance Notes

This is not a legal opinion. The implementation follows a conservative reading of:

- CNIL cookie guidance: refusal must be as easy as acceptance, and consent can be withdrawn.
- CNIL audience-measurement guidance: consent exemptions are narrow; tools involving third-party transfers need careful analysis.
- Google Consent Mode basic mode: tags are blocked until user interaction; no data is sent before consent.
- Google Analytics cookie documentation: GA4 may set `_ga` and `_ga_<container-id>` cookies with a default duration of up to two years.

Before enabling a real Measurement ID, verify the GA4 property settings:

- Disable Google Signals unless there is a documented need and consent coverage.
- Disable ads personalization for the analytics stream.
- Confirm data-retention settings.
- Review Google account region, data-processing terms and transfer posture.
- Test with browser devtools that no request to `googletagmanager.com` or `google-analytics.com` occurs before opt-in.
