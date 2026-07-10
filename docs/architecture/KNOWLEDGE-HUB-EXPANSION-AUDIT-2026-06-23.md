# Electronic Artefacts Knowledge Hub Expansion Audit

**Date:** 2026-06-23  
**Scope:** repository architecture, content model, knowledge graph, SEO surface, taxonomy and first expansion wave  
**Status:** implemented foundation wave

## Executive summary

Electronic Artefacts already has the correct foundation for a long-term Knowledge Hub: typed Markdown entities, YAML relation statements, generated canonical pages, JSON-LD, identifier routes, search documents, graph neighborhoods and a sitemap. The correct expansion path is therefore not to add a blog system. The expansion should add durable entities and publications to the existing graph.

This wave keeps the architecture intact and extends it in four places:

- validation now accepts the entity families already declared in TypeScript but not previously authorable from content;
- generated hubs now expose methods, frameworks, technologies and collections in addition to concepts and publications;
- a first editorial collection groups the foundation wave;
- six sourced publications, ten concepts, two technology records and two EA practice records were added and connected through typed relations.

## Current architecture

The site is a static knowledge platform generated from repository source files.

| Layer | Current implementation | Audit position |
|---|---|---|
| Source content | `content/**/*.md` with YAML frontmatter | Correct source of truth for knowledge records |
| Relations | `content/relations/*.yaml` | Correct place for typed graph statements |
| Validation | `src/schema/validation.ts` and `src/build/validate-graph.ts` | Strong and worth preserving |
| Routes | `src/config/routes.ts` | Stable canonical routing by entity type |
| Rendering | `scripts/build-site.ts` and `src/templates/*` | Generates full server-visible HTML |
| SEO | `src/seo/metadata.ts`, `src/seo/sitemaps.ts`, JSON-LD | Strong foundation after generated entity pages |
| Search | `src/search/documents.ts` and `search/*.json` | Good foundation for weighted future search |
| Graph outputs | `graph/entities.json`, `graph/relations.json`, `graph/neighborhoods/*` | Useful for AI and local graph navigation |
| Legacy data | `src/legacy-data/*.js` | Historical corpus, not the current canonical source and not publicly served |

## Existing structures

The current canonical source model supports:

- `concept`
- `method`
- `framework`
- `technology`
- `researchField`
- `project`
- `program`
- `publication`
- `collection`
- `artefact`
- `timeline`
- `artist`
- `organization`
- `tool`
- `dataset`
- `event`

Before this wave, the validation layer only accepted `concept`, `researchField`, `program`, `project`, `publication` and `organization`. The repository already declared broader types, routes and interfaces, so the correct move was to enable those types rather than invent a parallel content system.

## Existing taxonomies

The project already has useful taxonomy fields:

- `type` for entity family;
- `status` for lifecycle;
- `maturity` for development state;
- `confidence` for epistemic status;
- `visibility` for publication boundary;
- `publicationClass` for public contract;
- `tags` for flexible topical labels;
- `disciplines` for high-level category membership;
- relation predicates for graph semantics.

The recommended long-term category system should use `disciplines` as the category layer and `tags` as the granular keyword layer. This avoids creating redundant category pages too early.

## Navigation audit

The generated public hubs now include:

- `/knowledge/`
- `/knowledge/concepts/`
- `/knowledge/methods/`
- `/knowledge/frameworks/`
- `/knowledge/technologies/`
- `/publications/`
- `/archive/collections/`

This is sufficient for the next wave. A future navigation refinement can expose these in the header once there are enough methods, frameworks and technologies to justify direct top-level discovery.

## SEO audit

The strong SEO features are:

- canonical URLs generated per entity;
- entity-specific titles and descriptions;
- indexable robots metadata for public published/canonical entities;
- generated JSON-LD;
- sitemap entries for indexable entities;
- complete HTML body generated at build time;
- search documents generated from body text, headings, tags and relations.

The key risk before the current architecture was browser-only entity metadata. The current generated route system is the correct fix. Future work should avoid adding knowledge content only to legacy browser-rendered data files.

## Integration points for new knowledge

New durable knowledge should be integrated as follows:

| Need | Correct place |
|---|---|
| Definitions | `content/concepts/` |
| Technical articles, essays, research notes | `content/publications/` |
| Repeatable procedures | `content/methods/` |
| Conceptual operating models | `content/frameworks/` |
| Languages, standards, protocols, tools-as-technologies | `content/technologies/` |
| Curated editorial groupings | `content/collections/` |
| Programs such as VASTE or ORETH | `content/programs/` |
| Projects such as Vestiges or Palimpsests | `content/projects/` |
| Graph connections | `content/relations/*.yaml` |
| Strategic editorial plans | `docs/architecture/` |

## Structures enriched in this wave

- `src/schema/validation.ts`: added validation for method, framework, technology, collection, tool, dataset and event.
- `src/build/validate-graph.ts`: added reference validation for frameworks, collections and events.
- `src/schema/predicates.ts`: allowed publications to use `usesTechnology`.
- `src/seo/sitemaps.ts`: added static hub routes for methods, frameworks, technologies and collections.
- `scripts/build-site.ts`: added generated hubs for methods, frameworks, technologies and collections.

## Structures created in this wave

- `content/programs/oreth.md`
- `content/projects/palimpsests.md`
- `content/technologies/rdf.md`
- `content/technologies/json-ld.md`
- `content/collections/knowledge-hub-foundations.md`
- `content/relations/knowledge-hub.yaml`
- ten new canonical concept records
- six new sourced publication records

## Structures not created

No blog collection was created. No separate category engine was created. No duplicate project summaries were created outside the graph. No legacy `src/legacy-data/*.js` mutation was made because those files are no longer the best canonical source for new knowledge.

## Recommendations

1. Keep adding knowledge as typed entities, not as flat posts.
2. Use `disciplines` for broad categories and `tags` for specific vocabulary.
3. Add methods and frameworks in the next wave so the Knowledge Hub is not only conceptual.
4. Add source entities only when the project needs source-level graph navigation; until then, use `sources` arrays.
5. Migrate additional legacy public records into `content/` before linking them heavily.
6. Add article word-count and source-count tests once the corpus grows.
7. Add internal link validation for Markdown body links.
8. Keep relation predicates precise and avoid fallback `relatedTo` style relations.

## Verification status

`npm run validate` passed after the schema and relation updates:

```text
Validated 27 entities and 52 typed relations.
```

Full build and test verification should be run after the generated outputs are refreshed.
