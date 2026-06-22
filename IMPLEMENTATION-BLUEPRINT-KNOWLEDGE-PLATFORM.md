# Electronic Artefacts Knowledge Platform — Implementation Blueprint

**Repository:** `Website Electronic Artefacts (Vitrine 2026)`  
**Prepared:** 22 June 2026  
**Status:** implementation specification  
**Deployment constraint:** static hosting at `electronicartefacts.com` through the repository root and `CNAME`

This blueprint converts the approved architecture into a migration that can be executed in the current repository. It deliberately avoids a framework rewrite. The target is a typed, validated static publishing pipeline that generates canonical HTML, search data, graph data and semantic exports while reusing the existing visual system and client-side interactions.

---

# 1. Current architecture analysis

## 1.1 Runtime and build topology

The site is a static application with two build scripts and no package manifest.

```text
assets/js/data/*.js
        │
        ▼
scripts/build-assets.mjs
        │
        ├── filters private records
        ├── concatenates data and runtime modules
        └── generates assets/js/app.js

assets/css/*.css
        │
        ▼
scripts/build-assets.mjs
        └── generates assets/css/app.css

flat *.html files
        │
        ▼
scripts/build-seo.mjs
        ├── injects static metadata into shell pages
        └── generates sitemap.xml
```

At runtime:

```text
HTML shell
  → assets/js/app.js
  → window.EA_ENTITIES / EA_RELATIONS / EA_COLLECTIONS / ...
  → EA_CATALOG builds indexes
  → main.js selects renderer from body[data-page]
  → browser renders page content
  → behaviors.js replaces title, canonical, robots, social metadata and JSON-LD
```

The deployment output and source files currently occupy the same directories. Generated files are committed:

- `assets/js/app.js`
- `assets/css/app.css`
- SEO blocks inside root HTML files
- `sitemap.xml`

## 1.2 Current component map

| Concern | Current implementation | Assessment |
|---|---|---|
| Entity source | `assets/js/data/entities.js` | Rich content; untyped and structurally inconsistent |
| Taxonomies | `assets/js/data/taxonomies.js` | Reusable; should become validated controlled vocabularies |
| Relations | Embedded `relations` plus `assets/js/data/relations.js` | Duplicated, weakly typed, `relatedTo` overloaded |
| Collections | `assets/js/data/collections.js` with runtime rule resolver | Reusable concept; rules need validation and deterministic build resolution |
| Timelines | `assets/js/data/timelines.js` | Reusable; timeline entries should become Event entities |
| Activity | `assets/js/data/activity.js` | Reusable as change/event input; not a durable publication model |
| Catalog | `assets/js/catalog.js` | Useful runtime indexes; should consume generated public data |
| Search index | `assets/js/data/search-index.js` | Basic substring index; replace with build-generated weighted index |
| Routing | Hard-coded helpers in `main.js`, `view.js`, `behaviors.js` | Must be centralized |
| Page templates | Flat HTML shells plus `data-render` targets | Reusable for hubs; detail pages must become generated HTML |
| Detail rendering | `renderDetailPage()` in `assets/js/main.js` | Reusable section renderers; currently too generic and browser-only |
| Graph visualization | `graphSurface()` in `assets/js/core/surface.js` | Reusable visual shell; not yet driven by typed graph APIs |
| Metadata | `scripts/build-seo.mjs` plus `syncSeoMeta()` | Duplicated build/runtime authority; replace with build-only entity metadata |
| Sitemap | `scripts/build-seo.mjs` | Replace with route-manifest-driven sitemap indexes |
| Includes | `assets/js/core/includes.js` fetches partial HTML | Can remain during first waves |
| CSS | Modular source CSS bundled to `app.css` | Preserve |
| Deployment | Root static files with `CNAME` | Preserve initially |

## 1.3 Current data inventory

The source contains:

- 70 entities;
- 9 collections;
- 7 timelines;
- 5 activity records;
- 79 total addressable records when collections are included;
- 47 public/archive entities;
- 8 public collections.

Current entity families:

```text
program
artist
channel
researchField
project
artefact
researchLog
universe
collection
```

Current relationship usage is dominated by:

| Predicate | Approximate references |
|---|---:|
| `relatedTo` | 175 |
| `partOf` | 67 |
| `influences` | 66 |
| `origin` | 43 |
| `parent` | 43 |
| `producedBy` | 43 |
| `maintainedBy` | 41 |
| `publishedBy` | 40 |
| `children` | 36 |
| `poweredBy` | 24 |
| `dependencies` | 22 |

The data is graph-like, but relations are stored both inside entity records and in a separate graph list. There is no single statement identity, source, confidence, temporal validity or validation of allowed subject/object combinations.

## 1.4 Current routing

Current public detail routes use shared query-string templates:

```text
/project.html?id=vestiges
/program.html?id=vaste
/entity.html?id=runtime-theory
/artefact.html?id=foundational-lineage-001
/collection.html?id=runtime-collection
/artist.html?id=oreth
/channel.html?id=electronic-artefacts
```

URL construction is repeated in:

- `assets/js/main.js` — `entryHref`
- `assets/js/core/view.js` — `entryHrefFor`
- `assets/js/core/behaviors.js` — `makeEntryHref`
- `assets/js/core/surface.js` — hand-written navigation URLs
- data records containing optional `route`

The browser reads `URLSearchParams` to resolve the entity. This prevents initial HTML from containing the canonical entity content.

## 1.5 Current metadata behavior

Static shell metadata is generated by `scripts/build-seo.mjs`. Dynamic entity templates receive:

- generic title;
- generic description;
- `noindex,follow`;
- no canonical URL.

`syncSeoMeta()` in `assets/js/core/behaviors.js` then changes those values in the browser and injects generic `CreativeWork` or `SoftwareApplication` JSON-LD.

This creates two metadata authorities. The target must have one: the build output.

Client-side metadata updates may remain for non-canonical interactive state, but must not determine indexing, canonical identity or structured data.

## 1.6 Current search

`assets/js/data/search-index.js` creates one lowercase concatenated string per entity. Search then performs filtering in `main.js` by:

- query substring;
- status;
- kind.

Strengths:

- all public entity classes are searchable;
- relations and tags contribute text;
- results retain type and status;
- no service dependency.

Gaps:

- no tokenization or field weighting;
- no exact-title boost;
- no definition/question field;
- no stemming or phrase handling;
- no relationship query;
- no matched passage;
- no concept aliases;
- no publication text index;
- ranking is effectively entity-type ordering after filtering.

## 1.7 Current graph visualization

`graphSurface()` is a reusable presentational component with:

- central node;
- positioned surrounding nodes;
- animated canvas;
- links through node anchors;
- accessibility labels.

It currently receives manually assembled nodes. It does not consume a normalized graph, calculate neighborhoods, distinguish predicates or expose lineage/dependency semantics.

## 1.8 Current state → target state

| Current state | Target state |
|---|---|
| JavaScript globals as content database | Typed source records validated during build |
| Multiple arrays by legacy family | One discriminated entity union plus typed projections |
| Relations embedded in entities and separate graph | One normalized statement store |
| Query-string detail pages | Generated canonical directory routes |
| Browser-rendered detail body | Complete semantic HTML in initial response |
| Browser-generated canonical and JSON-LD | Build-generated metadata and JSON-LD |
| One sitemap with query URLs | Route-manifest-driven sitemap index and typed sitemaps |
| Substring search assembled in browser | Weighted build-generated search documents |
| Manual graph nodes | Reusable graph selectors and typed views |
| Timeline entries nested by subject | Event entities plus timeline projections |
| Collections resolved at runtime | Validated and resolved at build time |
| Duplicated route helpers | Central route registry |
| Unvalidated visibility filtering | Explicit publication policy and public projection |
| Generated and source files mixed | Typed source/build modules with controlled generated output |

## 1.9 Reuse, extend, replace, preserve

### Reuse

- all approved public entity content;
- CSS source modules and generated bundle;
- card, panel, metadata, gallery and graph visual styles;
- header/footer include mechanism during Waves 1–2;
- entity cards in `assets/js/core/view.js`;
- detail-section logic where it reflects project-specific content;
- collection definitions and timeline content;
- taxonomies for status, maturity, confidence and visibility;
- current privacy filtering principle.

### Extend

- catalog indexes;
- search UI;
- graph surface;
- detail-section components;
- collections with editorial metadata;
- timelines with sources and event IDs;
- SEO generator into a complete site generator.

### Replace

- `window.EA_*` files as the canonical source of truth;
- query-string canonical routes;
- browser-generated SEO;
- embedded relation arrays;
- generic `relatedTo` as a catch-all;
- duplicate URL functions;
- runtime collection resolution;
- manual sitemap URL assembly.

### Leave untouched in the foundation sprint

- visual design;
- contact workflow;
- legal and privacy pages;
- media assets;
- project-specific gallery behavior;
- animation implementation;
- CSS class contracts;
- externally hosted VASTE site;
- unrelated current working-tree changes.

---

# 2. Target data model

## 2.1 Inheritance strategy

Use TypeScript discriminated unions:

- `BaseEntity` contains identity, publication, temporal and provenance fields.
- Each entity family extends `BaseEntity` and sets a literal `type`.
- Publications use an additional `format` discriminator.
- Relationships are stored outside entities as first-class statements.
- Collections and timelines reference entity IDs and query rules but do not embed copied entities.

Do not use class inheritance. Content is immutable data, and interfaces plus schema validation are sufficient.

## 2.2 Core TypeScript interfaces

Create `src/schema/entity.ts`:

```ts
export type EntityId = `ea:${EntityType}:${string}`;
export type IsoDate = `${number}-${number}-${number}`;
export type Locale = "en" | "fr";

export type EntityType =
  | "concept"
  | "method"
  | "framework"
  | "technology"
  | "researchField"
  | "project"
  | "program"
  | "publication"
  | "collection"
  | "artefact"
  | "timeline"
  | "artist"
  | "organization"
  | "tool"
  | "dataset"
  | "event";

export type Visibility = "public" | "archive" | "internal" | "restricted";
export type PublicationClass = "canonical" | "published" | "supporting" | "internal";
export type LifecycleStatus =
  | "concept"
  | "research"
  | "experimental"
  | "prototype"
  | "development"
  | "production"
  | "released"
  | "active"
  | "archived"
  | "deprecated";

export type Maturity =
  | "concept"
  | "research"
  | "prototype"
  | "experimental"
  | "development"
  | "production"
  | "released"
  | "archived"
  | "deprecated";

export type Confidence =
  | "speculative"
  | "observed"
  | "validated"
  | "published"
  | "canonical";

export interface EntityRef {
  id: EntityId;
  label?: string;
}

export interface AgentRef extends EntityRef {
  id: `ea:artist:${string}` | `ea:organization:${string}`;
  role?: string;
}

export interface SourceRef {
  id?: string;
  title: string;
  url?: string;
  author?: string;
  publisher?: string;
  publishedAt?: IsoDate;
  accessedAt?: IsoDate;
  locator?: string;
}

export interface MediaRef {
  id: string;
  type: "image" | "audio" | "video" | "document";
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  rights?: string;
}

export interface VersionInfo {
  version: string;
  createdAt: IsoDate;
  publishedAt?: IsoDate;
  modifiedAt: IsoDate;
  reviewedAt?: IsoDate;
  supersedes?: EntityId;
  changeSummary?: string;
}

export interface SlugSet {
  canonical: string;
  aliases?: string[];
}

export interface BaseEntity {
  id: EntityId;
  type: EntityType;
  slug: SlugSet;
  title: string;
  alternateNames?: string[];
  subtitle?: string;
  definition?: string;
  abstract: string;
  description?: string;
  locale: Locale;
  visibility: Visibility;
  publicationClass: PublicationClass;
  status: LifecycleStatus;
  maturity: Maturity;
  confidence: Confidence;
  version: VersionInfo;
  authors: AgentRef[];
  contributors?: AgentRef[];
  publisher: `ea:organization:${string}`;
  tags?: string[];
  disciplines?: string[];
  media?: MediaRef[];
  sources?: SourceRef[];
  rights?: string;
  license?: string;
  featured?: boolean;
}
```

`id` is stable and is not derived from the route. Initial IDs:

```text
ea:program:vaste
ea:project:vestiges
ea:researchField:runtime-theory
ea:artist:oreth
ea:organization:electronic-artefacts
```

## 2.3 Type-specific interfaces

Create `src/schema/entities.ts`:

```ts
import type {
  AgentRef,
  BaseEntity,
  EntityId,
  EntityRef,
  IsoDate,
  SourceRef,
} from "./entity.js";
import type { RelationPredicate } from "./relation.js";

export interface ConceptEntity extends BaseEntity {
  type: "concept";
  definition: string;
  scope: string[];
  exclusions?: string[];
  claims?: string[];
  contrastsWith?: EntityRef[];
  examples?: EntityRef[];
}

export interface MethodStep {
  order: number;
  title: string;
  description: string;
}

export interface MethodEntity extends BaseEntity {
  type: "method";
  purpose: string;
  useWhen: string[];
  avoidWhen?: string[];
  inputs: string[];
  steps: MethodStep[];
  outputs: string[];
  assumptions?: string[];
  limitations: string[];
}

export interface FrameworkEntity extends BaseEntity {
  type: "framework";
  principles: string[];
  components: EntityRef[];
  evaluationCriteria?: string[];
  limitations: string[];
}

export interface TechnologyEntity extends BaseEntity {
  type: "technology";
  category: "language" | "library" | "protocol" | "database" | "platform" | "approach";
  officialUrl?: string;
  versions?: string[];
  roleInEcosystem: string;
  implementationNotes?: string[];
}

export interface ResearchQuestion {
  id: string;
  question: string;
  status: "open" | "active" | "answered" | "retired";
}

export interface ResearchFieldEntity extends BaseEntity {
  type: "researchField";
  questions: ResearchQuestion[];
  scope: string[];
  methods?: EntityRef[];
  findings?: string[];
  openQuestions?: string[];
  bibliography?: SourceRef[];
}

export interface ProjectEntity extends BaseEntity {
  type: "project";
  category: "internal" | "client" | "cultural" | "research" | "collaboration";
  brief: string;
  context: string;
  stakeholders: EntityRef[];
  constraints?: string[];
  approach: string[];
  outputs: EntityRef[];
  outcomes?: string[];
  evidence: EntityRef[];
  credits: AgentRef[];
}

export interface ProgramEntity extends BaseEntity {
  type: "program";
  mandate: string;
  domain: string;
  capabilities: string[];
  architecture?: string[];
  lifecycle: string[];
  maintainers: AgentRef[];
  documentation?: EntityRef[];
}

export type PublicationFormat =
  | "conceptPage"
  | "methodPage"
  | "researchNote"
  | "technicalArticle"
  | "essay"
  | "caseStudy"
  | "documentation"
  | "archiveRecord"
  | "experimentalPublication";

export interface PublicationSection {
  id: string;
  heading: string;
  body: string;
}

export interface PublicationEntity extends BaseEntity {
  type: "publication";
  format: PublicationFormat;
  sections: PublicationSection[];
  subjects: EntityRef[];
  claims?: string[];
  evidence?: EntityRef[];
  citation: {
    preferred: string;
    doi?: string;
  };
}

export interface CollectionRule {
  entityTypes?: BaseEntity["type"][];
  tagsAny?: string[];
  relation?: {
    predicate: RelationPredicate;
    target: EntityId;
  };
}

export interface CollectionEntity extends BaseEntity {
  type: "collection";
  thesis: string;
  curator: AgentRef[];
  explicitMembers: EntityRef[];
  rules?: CollectionRule[];
  selectionNote: string;
}

export interface ArtefactEntity extends BaseEntity {
  type: "artefact";
  artefactType: "audio" | "visual" | "document" | "prototype" | "code" | "record";
  createdAt?: IsoDate;
  provenance: string;
  sourceProject?: EntityRef;
  format?: string;
  preservationStatus: "active" | "stable" | "at-risk" | "lost" | "superseded";
  significance: string;
}

export interface TimelineEntity extends BaseEntity {
  type: "timeline";
  subject: EntityRef;
  events: EntityRef[];
  editorialScope: string;
}

export interface ArtistEntity extends BaseEntity {
  type: "artist";
  biography: string;
  roles: string[];
  affiliations?: EntityRef[];
  externalIds?: Record<string, string>;
}

export interface OrganizationEntity extends BaseEntity {
  type: "organization";
  organizationType:
    | "studio"
    | "label"
    | "institution"
    | "company"
    | "collective"
    | "client"
    | "publisher";
  description: string;
  externalIds?: Record<string, string>;
}

export interface ToolEntity extends BaseEntity {
  type: "tool";
  purpose: string;
  users: string[];
  inputs: string[];
  outputs: string[];
  access?: string;
  repository?: string;
}

export interface DatasetEntity extends BaseEntity {
  type: "dataset";
  methodology: string;
  schemaUrl?: string;
  formats: string[];
  size?: string;
  downloadUrl?: string;
  limitations: string[];
}

export interface EventEntity extends BaseEntity {
  type: "event";
  eventType: "creation" | "publication" | "release" | "milestone" | "exhibition" | "decision";
  startDate: IsoDate;
  endDate?: IsoDate;
  participants: EntityRef[];
  result?: EntityRef[];
  location?: EntityRef;
}

export type Entity =
  | ConceptEntity
  | MethodEntity
  | FrameworkEntity
  | TechnologyEntity
  | ResearchFieldEntity
  | ProjectEntity
  | ProgramEntity
  | PublicationEntity
  | CollectionEntity
  | ArtefactEntity
  | TimelineEntity
  | ArtistEntity
  | OrganizationEntity
  | ToolEntity
  | DatasetEntity
  | EventEntity;
```

The interfaces above are the compile-time contract. Mirror them with Zod schemas in `src/schema/validation.ts` so content loaded from Markdown/YAML is validated at runtime during the build.

## 2.4 Relationship model

Create `src/schema/relation.ts`:

```ts
import type { Confidence, EntityId, IsoDate, SourceRef } from "./entity.js";

export type RelationPredicate =
  | "defines"
  | "refines"
  | "contrastsWith"
  | "influencedBy"
  | "tests"
  | "supportsClaim"
  | "contradictsClaim"
  | "cites"
  | "appliesConcept"
  | "usesMethod"
  | "implementsFramework"
  | "usesTechnology"
  | "implementedBy"
  | "demonstratedBy"
  | "createdBy"
  | "contributedBy"
  | "producedBy"
  | "publishedBy"
  | "commissionedBy"
  | "maintainedBy"
  | "fundedBy"
  | "hasPart"
  | "partOf"
  | "memberOfCollection"
  | "documents"
  | "documentedBy"
  | "subjectOf"
  | "dependsOn"
  | "poweredBy"
  | "integratesWith"
  | "supersedes"
  | "versionOf"
  | "forkedFrom"
  | "evidencedBy"
  | "derivedFrom"
  | "usesDataset"
  | "generatedArtefact"
  | "hasSource"
  | "precededBy"
  | "followedBy"
  | "occurredDuring"
  | "resultedIn";

export interface RelationStatement {
  id: `ear:${string}`;
  subject: EntityId;
  predicate: RelationPredicate;
  object: EntityId;
  statement: string;
  confidence: Confidence;
  sources?: SourceRef[];
  validFrom?: IsoDate;
  validTo?: IsoDate;
  createdAt: IsoDate;
  reviewedAt?: IsoDate;
  visibility: "public" | "internal";
}
```

Relations are stored once in `content/relations/*.yaml`, not copied into entity files.

## 2.5 Versioning model

Use semantic editorial versions:

- patch: metadata, spelling, link or non-substantive clarification;
- minor: new section, relation, evidence or changed interpretation;
- major: changed definition, core claim, schema meaning or superseding identity.

Each build writes:

```text
generated/manifest/entities.json
generated/manifest/relations.json
generated/manifest/routes.json
generated/manifest/build.json
```

`build.json` contains build timestamp, schema version, content commit when available and counts by type.

Do not create a new URL for each editorial version. Keep a stable canonical URL and expose version metadata. A separately citable historical version can later be generated under `/versions/{entity-id}/{version}/`.

## 2.6 Confidence model

Retain the current values, but define their meaning:

| Value | Meaning |
|---|---|
| speculative | proposed, imagined or not yet evidenced |
| observed | documented observation or implementation signal |
| validated | tested against an explicit method or evidence |
| published | formally released or externally available |
| canonical | authoritative identity/definition within Electronic Artefacts |

Confidence applies to entities and relation statements. It does not replace lifecycle status or publication class.

## 2.7 Publication model

An entity is indexable only when:

```ts
const isIndexable = (entity: Entity): boolean =>
  entity.visibility === "public" &&
  ["canonical", "published"].includes(entity.publicationClass) &&
  Boolean(entity.abstract) &&
  Boolean(entity.authors.length) &&
  Boolean(entity.version.publishedAt);
```

Archive-visible records may be indexable when explicitly `published`, but `archive` visibility alone does not imply indexability.

Supporting nodes remain in the public graph and can appear inside other pages without generating thin canonical pages.

---

# 3. Routing architecture

## 3.1 Canonical route registry

Create `src/config/routes.ts`:

```ts
export const routeByType = {
  concept: (slug: string) => `/knowledge/concepts/${slug}/`,
  method: (slug: string) => `/knowledge/methods/${slug}/`,
  framework: (slug: string) => `/knowledge/frameworks/${slug}/`,
  technology: (slug: string) => `/knowledge/technologies/${slug}/`,
  researchField: (slug: string) => `/research/fields/${slug}/`,
  publication: (slug: string) => `/publications/${slug}/`,
  project: (slug: string) => `/projects/${slug}/`,
  program: (slug: string) => `/programs/${slug}/`,
  collection: (slug: string) => `/archive/collections/${slug}/`,
  artefact: (slug: string) => `/archive/artefacts/${slug}/`,
  timeline: (slug: string) => `/archive/timelines/${slug}/`,
  artist: (slug: string) => `/artists/${slug}/`,
  organization: (slug: string) => `/organizations/${slug}/`,
  tool: (slug: string) => `/tools/${slug}/`,
  dataset: (slug: string) => `/datasets/${slug}/`,
  event: (slug: string) => `/events/${slug}/`,
} satisfies Record<EntityType, (slug: string) => string>;

export const hubRoutes = {
  home: "/",
  work: "/work/",
  projects: "/projects/",
  programs: "/programs/",
  research: "/research/",
  researchFields: "/research/fields/",
  researchNotes: "/research/notes/",
  publications: "/publications/",
  knowledge: "/knowledge/",
  concepts: "/knowledge/concepts/",
  methods: "/knowledge/methods/",
  frameworks: "/knowledge/frameworks/",
  technologies: "/knowledge/technologies/",
  archive: "/archive/",
  artefacts: "/archive/artefacts/",
  collections: "/archive/collections/",
  timelines: "/archive/timelines/",
  search: "/search/",
} as const;
```

All renderers, cards, search documents, JSON-LD and sitemaps consume this registry. No other module builds entity URLs.

## 3.2 Static route generation

Generate directory routes with an `index.html`:

```text
projects/vestiges/index.html
programs/vaste/index.html
knowledge/concepts/graph-runtime/index.html
research/fields/runtime-theory/index.html
archive/artefacts/foundational-lineage-001/index.html
```

This works on static hosting without server routing.

## 3.3 Legacy redirects

Static GitHub Pages does not provide configurable HTTP redirects. Use two layers:

1. Add canonical links and immediate client redirects to legacy query templates.
2. Preserve dedicated historical files such as `palimpsests.html` as lightweight redirect documents.

Example legacy resolver in `project.html`:

```html
<meta name="robots" content="noindex,follow">
<script>
  const id = new URLSearchParams(location.search).get("id");
  const routes = {/* generated legacy id → canonical path map */};
  if (id && routes[id]) location.replace(routes[id] + location.hash);
</script>
```

Generate this map into `generated/legacy-routes.js`.

Legacy templates remain for at least 12 months and are excluded from sitemaps. Unknown IDs return a visible not-found state and remain `noindex`.

## 3.4 Hub route migration

Wave 1 keeps current `.html` hubs operational. Wave 2 generates clean directory equivalents:

```text
/projects/  ← canonical
/projects.html ← noindex redirect/fallback
```

Change internal links only after both routes exist and have been verified.

## 3.5 Identifier routes

Generate identifier documents:

```text
/id/program/vaste/index.html
/id/concept/graph-runtime/index.html
```

Initially these are minimal HTML documents with:

- `noindex,follow`;
- canonical link to the human page;
- machine links to JSON-LD and Turtle;
- immediate redirect to the canonical page.

Also generate:

```text
/id/program/vaste/index.json
/id/program/vaste/index.jsonld
/id/program/vaste/index.ttl
```

Content negotiation cannot be guaranteed on static hosting, so explicit representation links are required.

---

# 4. Publication system

## 4.1 Source format

Use Markdown with YAML frontmatter for authored resources:

```text
content/
  concepts/
  methods/
  frameworks/
  technologies/
  research-fields/
  projects/
  programs/
  publications/
  collections/
  artefacts/
  timelines/
  artists/
  organizations/
  tools/
  datasets/
  events/
  relations/
```

Example `content/concepts/graph-runtime.md`:

```md
---
id: ea:concept:graph-runtime
type: concept
slug:
  canonical: graph-runtime
title: Graph Runtime
definition: A runtime in which addressable graph entities and typed relations participate directly in execution.
abstract: Electronic Artefacts uses graph runtime to describe...
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.0.0
  createdAt: 2026-06-22
  publishedAt: 2026-07-01
  modifiedAt: 2026-07-01
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Contextual execution
  - Addressable graph entities
---

## Definition

...
```

Use:

- `gray-matter` for frontmatter;
- `yaml` for relation-only and configuration records;
- `markdown-it` for deterministic Markdown rendering;
- `zod` for runtime schema validation;
- `tsx` for build scripts;
- TypeScript for contracts.

## 4.2 Publication contracts

Validation has two levels:

- **schema validation:** required metadata and field types;
- **editorial validation:** required headings, relations and evidence by format.

Create `src/publication/contracts.ts`.

### Concept

Required sections:

```text
Definition
Scope
Electronic Artefacts position
Applications
Limitations
References
```

Required metadata:

```text
definition
authors
publishedAt
modifiedAt
confidence
version
```

Required relations:

- at least one publication or framework that `defines` or `refines` the concept;
- at least one inverse `appliesConcept` relation if public applications exist;
- optional `contrastsWith`.

Structured data:

- `DefinedTerm`
- `WebPage`
- `BreadcrumbList`

### Method

Required sections:

```text
Purpose
Use when
Inputs
Procedure
Outputs
Limitations
Examples
References
```

Required relations:

- at least one `usesMethod` inverse or `implementsFramework`;
- at least one concept relation.

Structured data:

- `HowTo` when genuinely procedural;
- otherwise `CreativeWork`;
- `BreadcrumbList`.

### Research note

Required sections:

```text
Question
Context
Method or observation
Result
Interpretation
Limitations
References
```

Required metadata:

- `format: researchNote`;
- authors;
- dates;
- subjects;
- preferred citation.

Required relations:

- `subjectOf`/subject reference;
- at least one `documents`, `tests`, `supportsClaim` or `contradictsClaim`.

Structured data:

- `ScholarlyArticle` or `Article`;
- `citation`;
- `about`;
- `BreadcrumbList`.

### Technical article

Required sections:

```text
Problem
Architecture or mechanism
Alternatives
Decisions and tradeoffs
Implementation
Evidence
Limitations
References
```

Required relations:

- `documents` a program/project/tool;
- at least one `usesTechnology`, `implementsFramework` or `evidencedBy`.

Structured data:

- `TechArticle`;
- `about`;
- `citation`;
- `BreadcrumbList`.

### Essay

Required sections:

```text
Abstract
Thesis
Argument
Counterpositions
Conclusion
References
```

Required relations:

- subjects;
- concepts defined/refined/cited;
- evidence where claims are empirical.

Structured data:

- `Article`;
- author/publisher/dates;
- `citation`;
- `BreadcrumbList`.

### Case study

Required sections:

```text
Context
Initial condition
Constraints
Approach
Decisions
Implementation
Outcome
Evidence
Unresolved questions
Credits
```

Required relations:

- `documents` exactly one primary project;
- `appliesConcept` or `usesMethod`;
- `evidencedBy`;
- `commissionedBy` when applicable.

Structured data:

- `Article` plus referenced `CreativeWork`/`SoftwareApplication`;
- `about`;
- `mentions`;
- `BreadcrumbList`.

### Documentation

Required sections:

```text
Scope
System boundary
Usage or interface
Version
Change history
Support status
```

Required relations:

- `documents` one program/tool/framework/dataset;
- `versionOf` where versioned.

Structured data:

- `TechArticle` or `APIReference` when appropriate;
- `isPartOf`;
- `BreadcrumbList`.

### Archive record

Required sections:

```text
Description
Provenance
Context
Significance
Rights
Preservation status
```

Required metadata:

- creator;
- date when known;
- artefact type;
- provenance;
- preservation status;
- rights.

Required relations:

- source project/program/publication;
- at least one `evidencedBy` inverse, `derivedFrom` or `partOf`.

Structured data:

- `CreativeWork`, `MediaObject`, `MusicRecording` or `DigitalDocument`;
- `isPartOf`;
- creator;
- rights;
- `BreadcrumbList`.

### Experimental publication

Required sections:

```text
Context
Work
Constituent artefacts
Credits
Rights
Preservation
```

Required relations:

- `hasPart`;
- `createdBy`;
- `publishedBy`;
- related research/concepts where explicitly intended.

Structured data:

- appropriate creative-work subtype;
- `hasPart`;
- `creator`;
- `publisher`;
- `BreadcrumbList`.

## 4.3 Template architecture

Create:

```text
src/templates/
  layout.ts
  hub-page.ts
  entity-page.ts
  publication-page.ts
  not-found-page.ts
  legacy-redirect-page.ts
  components/
    breadcrumbs.ts
    entity-header.ts
    entity-metadata.ts
    publication-body.ts
    relationship-groups.ts
    evidence-list.ts
    citation-panel.ts
    timeline.ts
    local-graph.ts
    related-entities.ts
    structured-data.ts
```

The generated HTML must include the main entity content without JavaScript. Existing client code enhances filters, lightboxes, graph animation and search.

## 4.4 Content sanitization

Markdown content is repository-controlled but still must be rendered safely:

- disable raw HTML by default;
- allow a small explicit component syntax only through build transforms;
- escape all data values in templates;
- validate all local paths;
- reject `javascript:` and unknown protocols;
- verify referenced media exists during build.

---

# 5. Relationship system

## 5.1 Storage

Store normalized relations in thematic YAML files:

```text
content/relations/core.yaml
content/relations/vaste.yaml
content/relations/palimpsests.yaml
content/relations/unionmob.yaml
content/relations/vestiges.yaml
```

Example:

```yaml
- id: ear:vestiges-powered-by-vaste
  subject: ea:project:vestiges
  predicate: poweredBy
  object: ea:program:vaste
  statement: Vestiges uses VASTE as its graph runtime and contextual execution foundation.
  confidence: observed
  sources:
    - title: Vestiges product architecture
      locator: Architecture section
  createdAt: 2026-06-22
  reviewedAt: 2026-06-22
  visibility: public
```

## 5.2 Predicate registry

Create `src/schema/predicates.ts`:

```ts
export interface PredicateDefinition {
  id: RelationPredicate;
  label: string;
  inverse?: RelationPredicate;
  inverseLabel?: string;
  symmetric?: boolean;
  allowedSubjects: EntityType[];
  allowedObjects: EntityType[];
  requiresSource: boolean;
}
```

Examples:

```ts
{
  id: "appliesConcept",
  label: "Applies concept",
  allowedSubjects: ["project", "program", "method", "publication"],
  allowedObjects: ["concept"],
  requiresSource: false,
}

{
  id: "commissionedBy",
  label: "Commissioned by",
  allowedSubjects: ["project", "artefact", "publication"],
  allowedObjects: ["organization", "artist"],
  requiresSource: true,
}
```

## 5.3 Rendering

Render relations by semantic group:

```text
Knowledge
  Defines
  Applies
  Tests
  Supports

Implementation
  Uses method
  Uses technology
  Powered by
  Depends on

Production
  Created by
  Produced by
  Published by
  Commissioned by

Evidence and history
  Evidenced by
  Derived from
  Preceded by
  Supersedes

Structure
  Part of
  Has part
  Member of collection
```

Every visible edge includes:

- predicate label;
- linked object;
- human statement when present;
- confidence where useful;
- source link in expanded view.

## 5.4 Validation rules

The build fails on:

- missing subject or object;
- duplicate relation ID;
- duplicate subject/predicate/object triple unless temporal ranges differ;
- relation to an unknown entity;
- public relation involving an internal/restricted entity;
- predicate not in registry;
- invalid subject/object type combination;
- self-loop unless predicate allows it;
- missing source when predicate requires one;
- `validTo` earlier than `validFrom`;
- public relationship statement with empty explanatory text.

The build warns on:

- more than five residual `relatedTo` migrations for one entity;
- high-degree entities with no curated relationship groups;
- an indexable entity with no inbound or outbound public relation;
- inverse statements that conflict.

## 5.5 Legacy relation migration

Create `scripts/migrate-legacy-relations.ts`.

Mapping:

| Legacy | Target |
|---|---|
| `origin` | `derivedFrom`, `createdBy` or `precededBy` after review |
| `parent` / `children` | `partOf` / `hasPart` |
| `dependencies` | `dependsOn` |
| `influences` | `influencedBy` with subject direction reviewed |
| `derivedFrom` | `derivedFrom` |
| `inspiredBy` | `influencedBy` with statement |
| `poweredBy` | `poweredBy` |
| `producedBy` | `producedBy` |
| `publishedBy` | `publishedBy` |
| `maintainedBy` | `maintainedBy` |
| `partOf` | `partOf` |
| `relatedTo` | manual classification required |

The migration script outputs unresolved edges to:

```text
generated/reports/unresolved-relations.json
```

No automatic conversion of `relatedTo` is allowed.

---

# 6. SEO and semantic web

## 6.1 Metadata generation

Replace `scripts/build-seo.mjs` with:

```text
scripts/build-site.ts
  → load and validate content
  → build graph
  → resolve routes
  → render HTML
  → generate metadata
  → generate structured data
  → generate search documents
  → generate graph exports
  → generate sitemaps and feeds
  → run integrity checks
```

Create `src/seo/metadata.ts`:

```ts
export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description: string;
    url: string;
    image: string;
    imageAlt: string;
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
}
```

Rules:

- title ≤ 60 characters where possible;
- description 90–160 characters;
- one canonical URL;
- `index,follow` only when publication policy passes;
- entity-specific social image when available;
- fallback institutional image otherwise;
- no client-side canonical replacement.

## 6.2 JSON-LD mapping

Create `src/semantic/jsonld.ts`.

Mapping:

| Entity type | Schema.org type |
|---|---|
| concept | `DefinedTerm` |
| method | `HowTo` or `CreativeWork` |
| framework | `CreativeWork` |
| technology | `SoftwareSourceCode` or `DefinedTerm` |
| research field | `DefinedTerm` plus `CollectionPage` context |
| project | `CreativeWork` |
| program | `SoftwareApplication`, `SoftwareSourceCode` or `ResearchProject` |
| publication | format-specific article type |
| collection | `CollectionPage` |
| artefact | appropriate `CreativeWork`/`MediaObject` subtype |
| timeline | `CollectionPage` containing `Event` |
| artist | `Person` or `MusicGroup` |
| organization | `Organization` |
| tool | `SoftwareApplication` |
| dataset | `Dataset` |
| event | `Event` |

Every detail page emits one `@graph` containing:

- `WebPage`;
- primary entity;
- publisher organization;
- authors/creators used on the page;
- `BreadcrumbList`;
- directly referenced public entities where required.

Use stable `/id/` URLs for every `@id`.

## 6.3 RDF compatibility

Create:

```text
src/semantic/context.ts
src/semantic/rdf.ts
src/semantic/vocabulary.ts
```

Reuse:

- Schema.org;
- Dublin Core Terms;
- PROV-O;
- SKOS;
- DCAT.

Generate:

```text
graph/knowledge.jsonld
graph/knowledge.ttl
vocabulary/index.html
vocabulary/context.jsonld
```

The first implementation may serialize Turtle directly from the normalized graph; a full triplestore is not required.

## 6.4 Sitemaps

Generate:

```text
sitemap.xml                 # sitemap index
sitemaps/pages.xml
sitemaps/knowledge.xml
sitemaps/research.xml
sitemaps/projects.xml
sitemaps/programs.xml
sitemaps/publications.xml
sitemaps/archive.xml
sitemaps/people.xml
```

Include:

- canonical URL;
- `lastmod` from `version.modifiedAt`.

Exclude:

- search pages;
- legacy redirect pages;
- identifier redirects;
- internal/supporting entities without canonical pages;
- query-string URLs.

## 6.5 Feeds and AI directory

Generate:

```text
feeds/publications.xml
feeds/research.xml
llms.txt
```

`llms.txt` lists canonical hubs, important concepts, publications and graph exports. It does not duplicate publication bodies.

---

# 7. Search system

## 7.1 Architecture

Keep search client-side in the first three waves. Generate a compact search corpus at build time:

```text
search/index.json
search/documents/{entity-id}.json
```

Use MiniSearch for indexing and querying. It is small, supports field weighting, prefix search, fuzzy search and stored fields without requiring a backend.

Create:

```text
src/search/documents.ts
src/search/build-index.ts
assets/js/search/client.js
assets/js/search/query-parser.js
assets/js/search/render-results.js
```

## 7.2 Search document

```ts
export interface SearchDocument {
  id: EntityId;
  route: string;
  type: EntityType;
  format?: PublicationFormat;
  title: string;
  alternateNames: string[];
  definition?: string;
  abstract: string;
  headings: string[];
  body: string;
  tags: string[];
  questions: string[];
  relationLabels: string[];
  relatedEntityIds: EntityId[];
  status: LifecycleStatus;
  confidence: Confidence;
  modifiedAt: IsoDate;
}
```

## 7.3 Ranking model

Field boosts:

| Field | Boost |
|---|---:|
| exact title | 12 |
| alternate name | 9 |
| definition | 8 |
| research question | 7 |
| heading | 5 |
| abstract | 4 |
| tag | 3 |
| relation label | 2 |
| body | 1 |

Post-score modifiers:

- exact phrase: ×1.5;
- canonical publication class: ×1.2;
- published class: ×1.1;
- recently modified within 12 months: max ×1.05, never enough to outrank relevance;
- archived status: no penalty when query contains archive/history terms, otherwise ×0.95.

Do not rank by business priority. Search relevance must remain epistemically credible.

## 7.4 Query support

Phase 1 query parser supports:

```text
type:concept graph runtime
type:project governance
status:archived oracle
"contextual execution"
```

Phase 2 supports relationship filters:

```text
poweredBy:vaste
appliesConcept:graph-runtime
createdBy:oreth
```

Question lookup:

- index explicit `ResearchQuestion.question`;
- index publication headings written as questions;
- boost concept definitions when query begins with “what is”, “how does” or “why”.

## 7.5 Search result contract

Each result renders:

- type and publication format;
- title;
- definition or abstract;
- matched passage;
- status/confidence;
- modified date;
- up to three relationship paths;
- canonical URL.

Search state remains in URL parameters:

```text
/search/?q=graph+runtime&type=concept
```

Search results remain `noindex,follow`.

---

# 8. Graph visualization

## 8.1 Graph data API

Generate static graph documents:

```text
graph/entities.json
graph/relations.json
graph/neighborhoods/{entity-id}.json
graph/maps/{map-slug}.json
graph/lineages/{entity-id}.json
graph/dependencies/{entity-id}.json
```

Types:

```ts
export interface GraphNode {
  id: EntityId;
  type: EntityType;
  title: string;
  route: string;
  status: LifecycleStatus;
  confidence: Confidence;
}

export interface GraphEdge {
  id: string;
  source: EntityId;
  target: EntityId;
  predicate: RelationPredicate;
  label: string;
  statement: string;
  confidence: Confidence;
}

export interface GraphView {
  id: string;
  kind: "local" | "conceptMap" | "lineage" | "dependency";
  focus: EntityId;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

## 8.2 Reusable components

Create:

```text
assets/js/graph/graph-loader.js
assets/js/graph/graph-controller.js
assets/js/graph/local-graph.js
assets/js/graph/concept-map.js
assets/js/graph/lineage-map.js
assets/js/graph/dependency-map.js
assets/js/graph/graph-accessible-list.js
```

Reuse visual primitives from `assets/js/core/surface.js`, but separate:

- data loading;
- graph layout;
- rendering;
- interaction;
- accessible textual representation.

## 8.3 View definitions

### Local graph

- focus entity;
- first-degree public relations;
- maximum 12 visible neighbors;
- group by predicate;
- prioritize manually curated edges;
- full relation list remains available as text.

### Concept map

- editorially selected nodes and relations;
- stored as a Map entity/configuration;
- no automatic force-directed “hairball.”

### Lineage map

- only temporal/derivation predicates;
- directional left-to-right layout;
- events displayed on a time axis.

### Project dependency map

- programs, frameworks, technologies and tools used by a project;
- distinguish direct dependency, implementation and influence.

## 8.4 Performance strategy

- do not ship the full graph on every page;
- neighborhood files target <50 KB uncompressed;
- lazy-load graph data when visualization approaches viewport;
- render accessible relationship HTML in initial page;
- use canvas only for decorative/interactive edges;
- use DOM links/buttons for nodes;
- cap animated nodes at 20;
- respect `prefers-reduced-motion`;
- cache fetched graph documents in memory;
- precompute layouts for editorial maps and lineages.

---

# 9. Build and validation pipeline

## 9.1 Package manifest

Create `package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "build": "npm run validate && tsx scripts/build-site.ts && node scripts/build-assets.mjs",
    "validate": "tsx scripts/validate-content.ts",
    "migrate:entities": "tsx scripts/migrate-legacy-entities.ts",
    "migrate:relations": "tsx scripts/migrate-legacy-relations.ts",
    "test": "node --test tests/**/*.test.mjs",
    "check": "npm run validate && npm test && npm run build"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "fast-glob": "^3.3.3",
    "gray-matter": "^4.0.3",
    "markdown-it": "^14.1.0",
    "minisearch": "^7.1.2",
    "tsx": "^4.20.0",
    "typescript": "^5.8.0",
    "yaml": "^2.8.0",
    "zod": "^3.25.0"
  }
}
```

Pin exact resolved versions in `package-lock.json`. Versions shown are implementation starting points and should be resolved when the sprint begins.

## 9.2 Build modules

Create:

```text
src/build/load-content.ts
src/build/load-relations.ts
src/build/validate-graph.ts
src/build/build-catalog.ts
src/build/build-routes.ts
src/build/write-output.ts
src/build/report.ts
scripts/build-site.ts
scripts/validate-content.ts
```

Pipeline:

```text
load content
→ validate individual records
→ load relations
→ validate references and predicate constraints
→ compute public projection
→ resolve collections
→ derive timelines from events
→ build route manifest
→ render canonical HTML
→ render legacy redirects
→ generate search index
→ generate graph views
→ generate JSON-LD/RDF
→ generate sitemaps/feeds
→ verify links and output invariants
```

## 9.3 Required build failures

Fail the build when:

- duplicate entity ID or canonical route;
- unknown entity type;
- invalid frontmatter;
- broken public relation;
- broken local media path;
- public entity references private data;
- indexable entity lacks title, abstract, author, publisher or dates;
- canonical URL is duplicated;
- generated page lacks one H1;
- generated indexable page lacks canonical, description or JSON-LD;
- sitemap contains a non-indexable route;
- a legacy ID maps to multiple canonical routes.

## 9.4 Tests

Create:

```text
tests/schema.test.mjs
tests/routes.test.mjs
tests/relations.test.mjs
tests/publication-contracts.test.mjs
tests/seo.test.mjs
tests/search.test.mjs
tests/graph.test.mjs
tests/build-smoke.test.mjs
```

Add browser smoke coverage later for:

- canonical entity page renders without JavaScript;
- legacy route redirects;
- search opens canonical result;
- local graph loads;
- no console errors.

---

# 10. Migration plan

## Wave 1 — Foundation

**Objective:** introduce typed build infrastructure and canonical routes without changing the current visual system.

### Files created

- `package.json`
- `tsconfig.json`
- `src/schema/*`
- `src/config/routes.ts`
- `src/build/*`
- `src/templates/*`
- `src/seo/*`
- `scripts/build-site.ts`
- `scripts/validate-content.ts`
- `scripts/migrate-legacy-entities.ts`
- `scripts/migrate-legacy-relations.ts`
- `content/organizations/electronic-artefacts.md`
- five pilot entity records
- initial normalized relations
- tests listed above.

### Files modified

- `scripts/build-assets.mjs`
- `assets/js/catalog.js`
- `assets/js/main.js`
- `assets/js/core/view.js`
- `assets/js/core/behaviors.js`
- `assets/partials/header.html`
- `assets/partials/footer.html`
- `.gitignore`

### Risk

Medium. Build architecture changes, but current pages remain available.

### Effort

10–15 engineering days.

### Dependencies

- Node/npm environment;
- approval of route and ID conventions;
- author/publisher identity record.

### Expected impact

- first server-visible canonical entity pages;
- one route authority;
- content validation;
- no loss of current UI.

## Wave 2 — Knowledge system

**Objective:** add concepts, methods, frameworks and technologies as first-class entities and migrate research fields.

### Files affected

- `content/concepts/*`
- `content/methods/*`
- `content/frameworks/*`
- `content/technologies/*`
- `content/research-fields/*`
- `src/templates/entity-page.ts`
- `src/templates/components/relationship-groups.ts`
- hub templates and header/footer;
- generated knowledge routes.

### Risk

Medium. Editorial classification and relation migration are the primary risks.

### Effort

15–25 engineering/editorial days.

### Dependencies

- Wave 1 schema and build;
- classification of legacy `relatedTo` relations;
- first canonical definitions.

### Expected impact

- Knowledge section;
- stable concept routes;
- research field authority pages;
- useful local graph neighborhoods.

## Wave 3 — Publication system

**Objective:** publish research notes, articles, essays, case studies, documentation and archive records through formal contracts.

### Files affected

- `content/publications/*`
- `src/publication/contracts.ts`
- `src/templates/publication-page.ts`
- citation, references and evidence components;
- feeds and publication sitemaps;
- existing research logs migrated into publications/artefacts.

### Risk

Medium–high. Editorial workflow, sources and rights must be reliable.

### Effort

20–35 engineering/editorial days plus ongoing publishing.

### Dependencies

- authorship and citation model;
- source management;
- publication review process.

### Expected impact

- citable resources;
- stronger project evidence;
- differentiated publication formats;
- recurring research feed.

## Wave 4 — Advanced graph

**Objective:** expose curated graph views, lineages and dependency maps.

### Files affected

- `assets/js/graph/*`
- `src/graph/*`
- map configurations;
- neighborhood and lineage generators;
- graph components in detail templates.

### Risk

Medium. Main risk is visual complexity and graph over-fetching.

### Effort

15–25 engineering days.

### Dependencies

- normalized relations;
- curated edge priorities;
- complete event/timeline migration.

### Expected impact

- meaningful graph traversal;
- explicit project dependencies;
- institutional lineage;
- reusable knowledge maps.

## Wave 5 — AI and semantic layer

**Objective:** publish interoperable graph and retrieval outputs.

### Files affected

- `src/semantic/*`
- JSON-LD and RDF exporters;
- vocabulary pages;
- graph snapshots;
- optional read-only search API if hosting changes;
- `llms.txt`;
- data-license documents.

### Risk

Medium. Semantic drift and public-data leakage require strict validation.

### Effort

15–30 engineering days.

### Dependencies

- stable ontology;
- explicit public projection;
- versioned graph releases;
- license decision.

### Expected impact

- machine-resolvable entities;
- public graph reuse;
- stronger retrieval and citation;
- interoperability with research systems.

---

# 11. First implementation sprint

## 11.1 Sprint objective

Deliver the smallest complete vertical slice:

```text
typed source
→ validated relation graph
→ canonical static page
→ generated metadata and JSON-LD
→ generated search result
→ local graph data
→ legacy redirect
```

Pilot entities:

1. Electronic Artefacts — organization
2. Graph Runtime — concept
3. Runtime Theory — research field
4. VASTE — program
5. Vestiges — project
6. Foundational Lineage #001 — research-note publication or archive record

This set exercises identity, knowledge, research, software, project, publication and lineage.

## 11.2 Exact files to create

### Tooling

```text
package.json
package-lock.json
tsconfig.json
```

### Schema

```text
src/schema/entity.ts
src/schema/entities.ts
src/schema/relation.ts
src/schema/predicates.ts
src/schema/validation.ts
```

### Configuration

```text
src/config/site.ts
src/config/routes.ts
src/config/publication-contracts.ts
```

### Content loading and graph

```text
src/build/load-content.ts
src/build/load-relations.ts
src/build/build-catalog.ts
src/build/build-routes.ts
src/build/validate-graph.ts
src/build/write-output.ts
src/graph/selectors.ts
src/graph/build-views.ts
```

### Rendering

```text
src/templates/layout.ts
src/templates/entity-page.ts
src/templates/publication-page.ts
src/templates/legacy-redirect-page.ts
src/templates/components/breadcrumbs.ts
src/templates/components/entity-header.ts
src/templates/components/entity-metadata.ts
src/templates/components/relationship-groups.ts
src/templates/components/citation-panel.ts
src/templates/components/local-graph.ts
```

### SEO and semantics

```text
src/seo/metadata.ts
src/seo/sitemaps.ts
src/semantic/jsonld.ts
src/semantic/identifiers.ts
```

### Search

```text
src/search/documents.ts
src/search/build-index.ts
assets/js/search/client.js
assets/js/search/query-parser.js
assets/js/search/render-results.js
```

### Scripts

```text
scripts/build-site.ts
scripts/validate-content.ts
scripts/migrate-legacy-entities.ts
scripts/migrate-legacy-relations.ts
```

### Pilot content

```text
content/organizations/electronic-artefacts.md
content/concepts/graph-runtime.md
content/research-fields/runtime-theory.md
content/programs/vaste.md
content/projects/vestiges.md
content/publications/foundational-lineage-001.md
content/relations/core.yaml
content/relations/runtime.yaml
```

### Tests

```text
tests/schema.test.mjs
tests/routes.test.mjs
tests/relations.test.mjs
tests/seo.test.mjs
tests/search.test.mjs
tests/build-smoke.test.mjs
```

## 11.3 Exact files to modify

### `scripts/build-assets.mjs`

- stop treating legacy data files as the long-term canonical source;
- accept generated public catalog at `generated/public/catalog.json`;
- during transition, bundle a compatibility assignment:

```js
window.EA_PUBLIC_CATALOG = /* generated catalog */;
```

- keep CSS bundling unchanged.

### `assets/js/catalog.js`

- read `window.EA_PUBLIC_CATALOG` when present;
- fall back to legacy `window.EA_ENTITIES` during migration;
- expose route, relation and graph indexes;
- remove local title-slug route inference once route manifest is complete.

### `assets/js/main.js`

- import/use a single runtime route resolver supplied by catalog;
- remove `entryHref` after all calls use the route manifest;
- allow generated detail pages to skip `renderDetailPage()`;
- keep hub-page renderers and interactive enhancement behavior;
- update search renderer to new result contract.

### `assets/js/core/view.js`

- replace `entryHrefFor` with `catalog.routeFor(item.id)`;
- retain all card markup and media behavior.

### `assets/js/core/behaviors.js`

- replace `makeEntryHref` with route manifest lookup;
- remove dynamic canonical, robots and JSON-LD mutation for generated pages;
- retain title/state updates only for interactive non-canonical UI;
- update command palette to canonical routes.

### `assets/js/core/surface.js`

- allow graph nodes to accept generated typed predicate data;
- use canonical route manifest for node links;
- do not rewrite the animation implementation in Sprint 1.

### `search.html`

- preserve as a legacy redirect or canonicalize to `/search/`;
- load generated search client.

### Detail templates

```text
project.html
program.html
entity.html
artefact.html
collection.html
artist.html
channel.html
```

- convert to generated legacy redirect shells;
- keep `noindex,follow`;
- embed generated legacy ID route map.

### Navigation

`assets/partials/header.html`:

- add `KNOWLEDGE`;
- keep current labels until clean hub routes exist;
- point pilot canonical routes through the new route registry in generated output.

`assets/partials/footer.html`:

- add Knowledge and Publications;
- add graph/data link only after exports exist.

### `.gitignore`

Add:

```text
node_modules/
.cache/
generated/reports/
```

Do not ignore generated public output if deployment continues from the repository root.

## 11.4 New routes in Sprint 1

```text
/knowledge/
/knowledge/concepts/
/knowledge/concepts/graph-runtime/
/research/fields/runtime-theory/
/programs/vaste/
/projects/vestiges/
/publications/foundational-lineage-001/
/organizations/electronic-artefacts/
/id/concept/graph-runtime/
/id/research-field/runtime-theory/
/id/program/vaste/
/id/project/vestiges/
/id/publication/foundational-lineage-001/
/id/organization/electronic-artefacts/
/search/
```

Legacy routes redirect:

```text
/entity.html?id=runtime-theory
/program.html?id=vaste
/project.html?id=vestiges
/artefact.html?id=foundational-lineage-001
```

## 11.5 New entity types in Sprint 1

Implemented and tested:

- `organization`
- `concept`
- `researchField`
- `program`
- `project`
- `publication`

Defined in schema but migration deferred:

- `method`
- `framework`
- `technology`
- `collection`
- `artefact`
- `timeline`
- `artist`
- `tool`
- `dataset`
- `event`

## 11.6 New components in Sprint 1

- canonical entity header;
- publication header;
- breadcrumbs;
- typed relationship groups;
- identity/version metadata;
- citation panel;
- evidence list;
- local graph placeholder and accessible relation list;
- legacy redirect shell;
- search result with matched passage.

Use current CSS classes wherever possible:

```text
zone-card
hero
panel
panel--soft
section-head
card__meta
card__title
card__copy
link-row
tag
knowledge-panel
detail-grid
```

Add new CSS only for missing semantics, not redesign.

## 11.7 New metadata system in Sprint 1

For every generated pilot page:

- title;
- description;
- robots;
- canonical;
- OpenGraph;
- Twitter card;
- author/publisher;
- date published;
- date modified;
- JSON-LD `@graph`;
- breadcrumbs;
- stable entity `@id`;
- alternate machine representations.

Remove runtime metadata mutation from those pages by setting:

```html
<body data-generated-page="true">
```

`syncSeoMeta()` exits immediately when that attribute is present.

## 11.8 New search requirements in Sprint 1

- index six pilot entities plus all legacy public entities through an adapter;
- exact-title and definition boosting;
- type filtering;
- canonical route output;
- matched passage;
- question lookup for Runtime Theory;
- no index of private/restricted records;
- search index generated during build;
- search UI remains client-side.

## 11.9 New graph requirements in Sprint 1

- normalized relations for pilot entities;
- generated local neighborhoods;
- predicate labels;
- public/private validation;
- accessible HTML relationship list on canonical pages;
- graph JSON loaded only when the visual component enters viewport;
- legacy `relatedTo` edges involving pilot entities classified manually.

## 11.10 Ordered execution checklist

1. Create `package.json`, install pinned dependencies and commit lockfile.
2. Add TypeScript configuration for Node ESM build scripts.
3. Implement core entity and relation interfaces.
4. Implement Zod validation schemas.
5. Define site configuration, canonical origin and route registry.
6. Create the Electronic Artefacts organization record.
7. Create pilot content records by migrating—not duplicating—existing data.
8. Create normalized pilot relation statements.
9. Implement content and relation loaders.
10. Implement graph/reference validation.
11. Implement public projection and route manifest.
12. Implement base layout and canonical entity template using existing CSS.
13. Implement publication template and citation panel.
14. Implement metadata and JSON-LD generators.
15. Generate pilot canonical pages and ID representations.
16. Generate legacy route map and redirect shells.
17. Add compatibility catalog output for existing runtime components.
18. Replace duplicated URL helpers with route-manifest lookup.
19. Build weighted search documents and client search.
20. Generate pilot local graph neighborhoods.
21. Generate sitemap entries only for canonical indexable pages.
22. Add schema, route, relation, SEO, search and build smoke tests.
23. Run full build and verify generated files contain complete content without JavaScript.
24. Run a local static server and verify canonical and legacy routes.
25. Verify JavaScript-disabled rendering for all pilot pages.
26. Verify no internal/restricted entity appears in HTML, search or graph exports.
27. Verify existing non-pilot pages and interactions remain unchanged.
28. Document content-authoring and release commands in `README.md`.

## 11.11 Sprint acceptance criteria

The sprint is complete only when:

- `/knowledge/concepts/graph-runtime/` returns complete indexable HTML;
- `/programs/vaste/` and `/projects/vestiges/` render without client data loading;
- each pilot page has a stable `/id/` identifier and JSON-LD representation;
- legacy query routes resolve to canonical routes;
- the build fails for an invalid entity or relation;
- search finds “graph runtime,” “contextual execution” and the Runtime Theory question in relevance order;
- the VASTE/Vestiges/Graph Runtime neighborhood is generated from normalized statements;
- sitemap contains canonical routes and no query-string detail URLs;
- existing CSS and core interactions remain functional;
- no private entity leaks into generated public artifacts.

---

# 12. Architectural decisions fixed by this blueprint

1. The site remains statically deployable.
2. TypeScript is introduced at build time, not as a requirement for browser execution.
3. Existing CSS and client interaction modules are preserved.
4. Canonical content is generated into initial HTML.
5. The entity graph is the source for routes, links, search, SEO and semantic exports.
6. Relationships are first-class sourced statements.
7. Markdown plus validated frontmatter is the authoring format.
8. Query-string templates become backward-compatibility shims.
9. Search remains client-side until corpus size or retrieval requirements justify a service.
10. Graph visualization consumes small generated views, not the complete graph.
11. Publication status, lifecycle, visibility and confidence remain separate dimensions.
12. Public output is generated from an explicit publication projection.
