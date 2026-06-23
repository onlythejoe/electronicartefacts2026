# Contact Discovery Interface

## 1. UX architecture

The page is an ecosystem entry point rather than a conventional form.

1. Free expression: the visitor describes the situation.
2. Intent classification: one pathway is suggested without hiding alternatives.
3. Signal confirmation: detected tags can be removed or extended.
4. Progressive qualification: only pathway-specific questions appear.
5. Live brief: the project summary updates continuously.
6. Identity and submission: the brief is prepared as an email.
7. Direct routes: all existing contact channels remain available below.

## 2. Information architecture

- Discovery hero and command input.
- Suggested pathway.
- Detected signals.
- Relevant questions.
- Contact identity.
- Sticky live brief.
- Direct email and public channels.

The five pathways are:

- Build Something
- Work With VASTE
- Support The Ecosystem
- Creative & Artistic Collaboration
- Label & Publishing

## 3. User flows

### Client project

Free text → Build Something → website/brand/development signals → stage, audience, timing, budget and requirements → email brief.

### VASTE

Free text → Work With VASTE → VASTE/developer/research signals → background, expertise, interest and collaboration goal → email brief.

### Institution or supporter

Free text → Support The Ecosystem → institution/partnership/cultural signals → organization, interest, resources and objective → email brief.

### Creative collaboration

Free text → Creative & Artistic Collaboration → discipline and medium signals → references and desired outcome → email brief.

### Label and publishing

Free text → Label & Publishing → music/label/publishing/audiovisual signals → format, stage, material and collaboration goal → email brief.

## 4. Wireframe

```text
┌────────────────────────────────────────────────────────────┐
│ PROJECT / COLLABORATION DISCOVERY                          │
│ What should exist that doesn’t exist yet?                  │
│                                                            │
│ ┌──────────────── COMMAND INPUT ──────────────────────────┐ │
│ │ Describe the idea freely…                              │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌────────────────────────────┐ ┌─────────────────────────┐ │
│ │ 01 Likely pathway          │ │ LIVE BRIEF              │ │
│ │ pathway controls           │ │ pathway                 │ │
│ ├────────────────────────────┤ │ intent                  │ │
│ │ 02 Detected signals        │ │ signals                 │ │
│ │ removable + custom tags    │ │ answers                 │ │
│ ├────────────────────────────┤ │                         │ │
│ │ 03 Relevant questions      │ │ Prepare email           │ │
│ ├────────────────────────────┤ │ Copy brief              │ │
│ │ 04 Contact details         │ └─────────────────────────┘ │
│ └────────────────────────────┘                              │
└────────────────────────────────────────────────────────────┘

┌──────────────── DIRECT ROUTES ──────────────────────────────┐
│ Email │ Instagram │ CreativeStuff │ GitHub / SoundCloud / VASTE
└────────────────────────────────────────────────────────────┘
```

## 5. Component hierarchy

- `ContactDiscovery`
  - `DiscoveryIntro`
  - `CommandInput`
  - `DiscoveryWorkspace`
    - `PathwaySelector`
    - `DetectedTags`
    - `DynamicQuestions`
    - `ContactIdentity`
    - `LiveBrief`
- `DirectContactRoutes`

## 6. Taxonomy system

Classification uses explicit keyword dictionaries. Each pathway has:

- label;
- explanatory copy;
- classification keywords;
- pathway-specific questions.

Tag extraction uses a separate vocabulary so pathway and project signals remain independent.

## 7. Qualification logic

- Normalize the free text.
- Score each pathway by matched keywords.
- Prefer the highest score.
- Default to Build Something when the intent remains ambiguous.
- Extract up to eight relevant signals.
- Allow manual pathway correction.
- Allow signal removal and custom tags.
- Reset irrelevant answers after a pathway change.

No AI, network request or hidden profiling is used.

## 8. Mobile-first strategy

- Single-column workspace.
- Brief follows questions rather than remaining sticky.
- Large free-text input.
- Two-column fields collapse to one.
- Command keyboard hint is hidden.
- Controls maintain touch-friendly height.

## 9. Accessibility

- Explicit labels for every input.
- Native textarea, input, select, button and link elements.
- `aria-live` status for classification and tags.
- `aria-pressed` for pathway selection.
- Keyboard shortcut is optional, never required.
- Reduced-motion preference disables placeholder rotation.
- No information is communicated by color alone.

## 10. Recommended copy

Headline:

> What should exist that doesn’t exist yet?

Supporting copy:

> Describe the situation in your own words. This interface organizes your intent into a concise brief.

Direct route:

> Prefer to contact us directly?

## 11. Front-end implementation

- Static HTML generated through the existing page renderer.
- Local JavaScript state.
- Rule-based keyword matching.
- No dependency, backend or AI service.
- Email submission through a prepared `mailto:` URL.
- Clipboard copy as a secondary action.

## 12. Animations and micro-interactions

- Slow placeholder rotation when the input is empty and unfocused.
- Immediate workspace reveal after meaningful input.
- Selected pathway uses an inverted pill.
- Brief completeness updates after each answer.
- Copy button temporarily confirms success.

Avoid chat bubbles, typing indicators, avatars or assistant language.

## 13. Data model

```js
{
  intent: string,
  pathway: "build" | "vaste" | "support" | "creative" | "label",
  tags: string[],
  answers: Record<string, string>,
  contact: {
    name: string,
    email: string,
    organization: string
  }
}
```

## 14. Submission workflow

1. Build a plain-text brief.
2. Encode subject and body.
3. Open the visitor’s mail application.
4. Keep the brief editable before sending.

No data leaves the browser before the visitor activates the email action.

## 15. Progressive enhancement

- Direct contact routes remain functional without JavaScript.
- The discovery workspace requires JavaScript but does not block email.
- A future server endpoint can replace `mailto:` without changing the data model.

## 16. Integration strategy

The previous hero, generic expectations and process cards are replaced by the discovery interface. Existing email, Instagram, GitHub, SoundCloud and VASTE routes remain below as an alternative.

## 17. Final recommendation

Keep the interface concise. Its purpose is not to capture every project requirement. It should help visitors locate themselves in the ecosystem and produce enough context for a high-quality first conversation.
