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

The active GA4 Measurement ID is set in `assets/js/core/analytics-config.js`:

```js
window.EA_ANALYTICS_CONFIG = {
  enabled: true,
  provider: "Google Analytics 4",
  measurementId: "G-67DKY05YS7",
  privacyUrl: "/confidentialite.html",
};
```

With an empty or invalid ID, the runtime exposes `window.EA_ANALYTICS.configured === false` and does not display a banner or contact Google.

## Event Taxonomy

The runtime exposes `window.EA_ANALYTICS.track(eventName, params)` and only sends events after a stored or freshly granted analytics consent. Events are not queued before consent.

Every event includes shared page context:

- `page_type`: `document.body.dataset.page`
- `page_locale`: `en` or `fr`
- `page_path`: current path without query parameters
- `content_group`: first public route segment
- `entry_id`: body or nearest public `data-entry-id`, when present

Recommended GA4 events used:

- `search`: site search terms, source and result count
- `select_content`: internal navigation, cards, tabs, local likes, command palette opens and search pagination
- `share`: successful native-share or clipboard-share actions
- `generate_lead`: `mailto:` or `tel:` contact links
- `file_download`: direct public file/media downloads

Custom Electronic Artefacts events:

- `ea_page_context`: first consented context snapshot for the current page
- `ea_scroll_depth`: 25%, 50%, 75%, 90% and 100% scroll milestones
- `ea_section_view`: first consented view of major page sections
- `ea_time_milestone`: 30s, 60s, 120s and 300s active-time milestones
- `ea_outbound_click`: external-domain clicks without query strings
- `ea_filter_change`: taxonomy, search and moodboard filters
- `ea_graph_node_select`: graph-surface and project-graph node selections
- `ea_contact_intent`: internal links toward the contact page
- `ea_contact_discovery_start`: first local interaction that opens the contact brief, with the inferred pathway and signal count only
- `ea_contact_pathway_select`: manual change of the proposed collaboration pathway
- `ea_contact_brief_ready`: contact details become valid, with completion counts only
- `ea_contact_brief_copy`: successful local brief copy, with completion counts only
- `ea_language_switch`: language-menu choices
- `ea_privacy_preferences`: cookie-preference panel opens
- `ea_command_search`: command-palette searches
- `ea_share_intent`: share-button clicks before the browser share/copy operation resolves
- `ea_ui_action`: small UI actions that do not fit a recommended event

Search terms and labels are trimmed, length-limited and pass through simple redaction for obvious email addresses and phone numbers before being sent. Contact-brief analytics deliberately contain only pathway and completion counts: never the intent text, answers, name, email address, organisation or copied brief. The implementation does not intentionally send message bodies, account identifiers, ad user data or ad personalization signals.

Suggested GA4 custom dimensions:

- Event scope: `page_type`, `page_locale`, `content_group`, `entry_id`
- Event scope: `link_location`, `link_text`, `content_type`, `content_id`
- Event scope: `search_source`, `result_count`
- Event scope: `filter_key`, `filter_value`, `filter_scope`
- Event scope: `graph_type`, `node_label`, `node_title`
- Event scope: `percent_scrolled`, `active_time_seconds`, `section_label`
- Event scope: `contact_pathway`, `answered_question_count`, `detected_signal_count`

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
