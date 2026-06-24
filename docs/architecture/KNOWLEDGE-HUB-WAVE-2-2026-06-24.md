# Knowledge Hub Wave 2 - 2026-06-24

## Objective

Wave 2 expands the Electronic Artefacts Knowledge Hub from the first graph/preservation/audio foundation into a broader evergreen library for creative technology, cultural infrastructure, design systems, internet culture and AI-assisted workflows.

The editorial goal is volume with structure: many more articles, but each one is connected to stable entities, source trails, internal links and graph relations.

## Added content

Wave 2 adds:

- 12 long-form technical articles, each above 1500 words.
- 13 canonical concept records.
- 5 technology records.
- 1 editorial collection.
- 62 new typed relations, bringing the public graph to 114 typed relations after validation.

## New articles

- Hypertext and Augmented Knowledge Systems
- Personal Knowledge Systems and Digital Gardens
- Open Source as Cultural Infrastructure
- Metadata, Cataloguing and Cultural Memory
- Web Audio and Browser-Based Sound Systems
- Creative Coding Pedagogy from Logo to p5.js
- Procedural Graphics, Shaders and Visual Systems
- Motion Design, Time and Interface Semantics
- Typography, Reading Systems and Digital Interfaces
- Human Computer Interaction for Creative Tools
- Algorithmic Composition and Rule-Based Music
- Generative AI, Latent Space and Creative Workflows

## New concept records

- Algorithmic Composition
- Hypertext
- Augmented Intelligence
- Personal Knowledge System
- Open Source
- Metadata
- Web Audio
- Procedural Graphics
- Motion Design
- Typography
- Human Computer Interaction
- Internet Culture
- Generative AI

## New technology records

- Web Audio API
- WebGL
- Web Animations
- CSS Fonts
- ActivityPub

## Collection

`Knowledge Hub Second Wave` groups the new articles, concepts and technologies into a public editorial collection.

The collection is intended as an onboarding route for readers arriving through search. It also gives future contributors a clear boundary for this expansion wave.

## Editorial rationale

The selected topics were chosen because they are:

- evergreen rather than news-driven;
- useful to humans and AI retrieval systems;
- connected to existing Electronic Artefacts projects and programs;
- broad enough for organic search demand;
- precise enough to support future specialist articles;
- compatible with the existing entity and relation schema.

## Internal linking strategy

Each article includes:

- subjects in frontmatter;
- source records where applicable;
- explicit links to concept pages;
- suggested reading paths;
- related article links;
- glossary entries;
- graph relations in `content/relations/knowledge-hub.yaml`.

The key internal bridges are:

- Hypertext -> Linked Data -> Knowledge Graph -> Runtime Theory.
- Web Audio -> Signal Archaeology -> ORETH -> Palimpsests.
- Procedural Graphics -> Creative Coding -> Generative Systems -> Motion Design.
- Typography -> HCI -> Motion Design -> Knowledge reading systems.
- Generative AI -> Provenance -> Augmented Intelligence -> HCI.
- Open Source -> Creative Coding -> Digital Preservation.

## SEO role

Wave 2 targets durable informational search intent:

- "what is hypertext"
- "personal knowledge system"
- "digital garden"
- "open source infrastructure"
- "metadata cultural memory"
- "web audio"
- "creative coding pedagogy"
- "procedural graphics"
- "motion design interface"
- "typography reading systems"
- "HCI creative tools"
- "algorithmic composition"
- "generative AI workflow"

The articles avoid thin trend coverage. They are structured as reference pages that can remain useful for years and can be expanded with examples, methods, tools and case studies.

## Validation

After content integration, `npm run validate` reported:

- 58 validated entities.
- 114 typed relations.

Full build verification should be run after every later editorial wave so that generated pages, search documents, graph neighborhoods and sitemap entries stay aligned.
