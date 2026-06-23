# Electronic Artefacts Knowledge Hub Taxonomy

**Date:** 2026-06-23  
**Purpose:** durable taxonomy for hundreds or thousands of interconnected knowledge records  
**Principle:** broad categories belong in `disciplines`; specific retrieval vocabulary belongs in `tags`; semantic meaning belongs in typed relations.

## Taxonomy model

Every public knowledge entry can belong to multiple categories. A technical article on signal archaeology may belong to `Audio Engineering`, `Archives`, `Digital Art` and `Research Methods`. Tags then add specificity such as `Machine Listening`, `Spectrogram`, `Provenance` or `Palimpsests`.

The taxonomy has four layers:

| Layer | Field or mechanism | Purpose |
|---|---|---|
| Entity type | `type` | What kind of thing this is |
| Category | `disciplines` | Broad, durable subject areas |
| Tag | `tags` | Specific topic, tool, technique, movement or project vocabulary |
| Relation | `content/relations/*.yaml` | Typed semantic connection between entities |

## Core categories

| Category | Scope |
|---|---|
| Music Production | recording, arrangement, mixing, mastering, production workflow |
| Sound Design | synthesis, sampling, texture, sonic identity, interaction sound |
| Audio Engineering | signal flow, acoustics, measurement, restoration, formats |
| Electronic Music | synthesis, electroacoustic practice, club culture, experimental music |
| Machine Listening | audio analysis, feature extraction, classification, listening systems |
| Creative Coding | code as artistic and design medium |
| Programming | languages, runtime behavior, software practices |
| Web Development | static sites, APIs, structured data, performance, accessibility |
| Systems Design | architecture, workflows, runtime, governance, constraints |
| Design | visual systems, identity, product design, interaction design |
| Motion Design | temporal graphics, animation systems, procedural motion |
| Typography | type systems, legibility, publication design, interface type |
| Visual Culture | images, references, aesthetics, media history |
| Digital Art | computational art, networked work, generative practice |
| Artificial Intelligence | AI systems, agents, model behavior, creative AI |
| Machine Learning | training, inference, datasets, embeddings, evaluation |
| Robotics | embodied systems, sensing, control, interaction |
| Human Computer Interaction | interfaces, augmentation, ergonomics, interaction history |
| Open Source | licensing, communities, governance, public code |
| Philosophy | epistemology, ontology, aesthetics, ethics |
| Cybernetics | feedback, control, communication, regulation |
| Complexity | emergence, adaptive systems, nonlinear dynamics |
| Emergence | patterns, self-organization, collective behavior |
| Knowledge Systems | graphs, taxonomies, ontologies, retrieval, semantic publishing |
| Research Methods | observation, evidence, documentation, field notes |
| Innovation | invention, adoption, institutional change, technology transfer |
| Creative Business | studios, licensing, services, positioning, intellectual property |
| Entrepreneurship | ventures, platforms, markets, operations |
| Archives | preservation, provenance, cataloguing, curation |
| History of Technology | computing, media systems, standards, instruments |
| History of Music | genres, instruments, production, listening cultures |
| Internet Culture | platforms, memes, web history, communities |
| Network Culture | protocols, distributed systems, online publics |
| Cultural Heritage | museums, craft, institutions, intangible knowledge |
| Publishing | editorial systems, citation, formats, public knowledge |
| SEO | discoverability, structured data, search intent, internal linking |

## Tag principles

Tags should be specific, reusable and non-synonymous. Avoid tags that duplicate entity type or status unless they are useful retrieval labels.

Preferred tag families:

- standards: `RDF`, `JSON-LD`, `Schema.org`, `PROV`, `CIDOC CRM`, `OAIS`
- systems: `Graph Runtime`, `Contextual Execution`, `Event Propagation`, `Identity`
- audio: `Machine Listening`, `Spectrogram`, `Signal Processing`, `Noise Floor`, `Sampling`
- archive: `Digital Preservation`, `Fixity`, `Provenance`, `Migration`, `Format Sustainability`
- creative systems: `Generative Art`, `Creative Coding`, `Algorithmic Composition`, `Cybernetic Feedback`
- EA anchors: `VASTE`, `ORETH`, `Palimpsests`, `Vestiges`, `Runtime Theory`
- SEO and publishing: `Canonical URL`, `Structured Data`, `Internal Linking`, `Search Intent`

## Relation patterns

Preferred relation patterns:

| Pattern | Example |
|---|---|
| Publication documents concept | article `documents` concept |
| Publication uses technology | article `usesTechnology` RDF |
| Program applies concept | VASTE `appliesConcept` contextual execution |
| Project powered by program | Palimpsests `poweredBy` ORETH |
| Project applies concept | Vestiges `appliesConcept` knowledge graph |
| Collection has part | Knowledge Hub Foundations `hasPart` foundation article |
| Research field defines concept | Runtime Theory `defines` contextual execution |

Avoid generic links when a precise predicate exists.

## Suggested reading model

Every major article should contain:

- one canonical concept link;
- one adjacent concept link;
- one project or program link when relevant;
- one publication link for continuation;
- at least three external sources for historical or technical claims when the article makes broad claims;
- a glossary for durable retrieval vocabulary.

## Collection strategy

Create collections when an editorial thesis is useful. Do not create a collection for every category. Collections should answer: "why should these records be read together?"

Recommended long-term collections:

- Knowledge Hub Foundations
- Runtime and Graph Systems
- Signal, Audio and Machine Listening
- Digital Preservation and Living Archives
- Creative Coding and Generative Systems
- Cultural Infrastructure and Vestiges
- Palimpsests Research Dossier
- SEO and Semantic Publishing
- History of Computing and Knowledge Systems
- Cybernetics, Complexity and Emergence

## Redundancy rules

- Do not create both a concept and a publication with the same purpose. The concept defines; the publication argues, explains or documents.
- Do not create tags that duplicate categories unless useful for search.
- Do not create a project article when the project page should be expanded.
- Do not create a source entity until source-level navigation becomes necessary.
- Do not use collections as categories; use them as curated arguments.

## Next schema recommendations

The next schema improvements should add:

- optional `readingLevel`;
- optional `seoIntent`;
- optional `canonicalQuestions`;
- optional `suggestedReading`;
- optional `glossary`;
- optional `wordCount` generated at build time;
- body-link validation for internal routes.
