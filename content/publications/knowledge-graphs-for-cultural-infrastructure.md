---
id: ea:publication:knowledge-graphs-for-cultural-infrastructure
type: publication
slug:
  canonical: knowledge-graphs-for-cultural-infrastructure
title: Knowledge Graphs for Cultural Infrastructure
subtitle: Technical Article
abstract: This article explains how knowledge graphs support cultural infrastructure by giving people, works, sources, concepts, projects and archives stable identities and explicit relations.
description: A technical article on knowledge graphs, cultural heritage, provenance and public knowledge pages, connected to Vestiges and the Electronic Artefacts graph.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-06-23"
  publishedAt: "2026-06-23"
  modifiedAt: "2026-06-23"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:knowledge-graph
  - id: ea:concept:entity-identity
  - id: ea:concept:provenance
  - id: ea:technology:rdf
  - id: ea:project:vestiges
claims:
  - Cultural knowledge graphs are useful when they preserve provenance, uncertainty and relationship semantics rather than only connectivity.
  - A public graph can be built from static pages if records, routes, structured data and relations are generated from typed sources.
evidence:
  - id: ea:project:vestiges
  - id: ea:program:vaste
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    publisher: W3C
    publishedAt: "2014-02-25"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: "2026-06-23"
    url: https://www.cidoc-crm.org/
  - title: PROV-Overview
    publisher: W3C
    publishedAt: "2013-04-30"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/prov-overview/
citation:
  preferred: "Electronic Artefacts. \"Knowledge Graphs for Cultural Infrastructure.\" Technical article, version 1.0.0, 2026."
tags:
  - Knowledge Graph
  - Cultural Infrastructure
  - Linked Data
  - Provenance
  - Vestiges
disciplines:
  - Knowledge Systems
  - Archives
  - Information Architecture
  - Research Methods
---

## Problem

Cultural knowledge is rarely simple. A craft technique can belong to a person, a place, a school, a material tradition, a set of tools, a historical period and a living practice. A musical work can be a release, a performance, a file, a memory object, a set of production decisions and evidence of a wider research question. A design archive can contain final images, discarded sketches, rights information, software versions, references and oral context.

Conventional websites flatten this complexity. They publish pages, categories and tags, but the relations between things remain vague. A tag can say that two records both concern "audio" or "archives", but it cannot explain that one document cites another, that one project applies a concept, that one program powers a platform, or that one object is evidence for a claim.

The result is familiar: cultural platforms become attractive but shallow catalogues. Search engines can find individual pages, but they cannot understand the system. Human readers can browse, but they cannot easily follow lineage, provenance, method or influence. AI retrieval systems may extract isolated paragraphs without knowing where a claim comes from or which internal records should be read next.

A knowledge graph addresses this problem by making entities and relationships first-class editorial objects.

## Introduction

A knowledge graph is a structured network of entities and typed relationships. In practice, that means a person, project, publication, concept, tool, artwork, archive record or organization receives a stable identity, then the site records meaningful relations between those identities.

The important word is "meaningful". A knowledge graph is not valuable because it draws many lines. It is valuable when those lines have predicates that can be interpreted: `documents`, `appliesConcept`, `usesTechnology`, `poweredBy`, `derivedFrom`, `publishedBy`, `evidencedBy`. Those predicates let readers and machines distinguish a citation from a dependency, a case study from an influence, and a component from a source.

For Electronic Artefacts, this matters because the site is not only a portfolio. It contains software programs, artistic projects, research fields, publications, concepts, archives and commercial work. A linear blog would separate those objects into posts. A knowledge graph lets each new publication strengthen existing entities.

## Context

The Web has always been a linking system, but not every link is a semantic relation. A link inside an essay may be navigational, rhetorical, evidential or decorative. A typed relation is different: it states what connects two records.

RDF formalizes graph statements as subject-predicate-object triples. That model is useful because it separates the thing being described, the relationship and the target. CIDOC CRM is useful for cultural heritage because it shows how cultural data needs shared conceptual structure across people, events, objects, places and documents. W3C PROV is useful because it treats provenance as information about entities, activities and people involved in producing a thing.

Electronic Artefacts does not need to reproduce every museum or semantic-web standard internally. The strategic lesson is simpler: cultural infrastructure needs stable identity, typed relation, provenance and review.

## History

The idea of connected knowledge has a long pre-web history. Libraries, catalogues, citation indexes, museums and archives have always tried to connect works to authors, subjects, dates, places and sources. The Web made linking public and cheap, but early web pages usually linked documents rather than modeling the things inside them.

Semantic Web research made a stronger claim: the Web could describe resources in machine-readable ways. Linked Data practices then focused on stable identifiers and connections between datasets. Cultural heritage communities developed models such as CIDOC CRM because museum and archive records could not be integrated reliably through shallow metadata alone.

Knowledge graphs entered product and search vocabulary later, but the underlying issue is older: how can a system preserve meaning across changing records, institutions, technologies and readers?

## Core concepts

The first concept is entity identity. A record needs to know whether it describes a concept, a project, a person, a publication or an artefact. It also needs a stable identifier that should not change when the title, page design or summary changes.

The second concept is relationship semantics. "Related" is rarely enough. If a publication explains a concept, the relation should say `defines` or `documents`. If a project uses a runtime, it should say `poweredBy`. If a concept influenced a framework, it should say `influencedBy`.

The third concept is provenance. Cultural knowledge depends on context. A graph should record sources, authors, publishers, dates, confidence and evidence, because those elements help readers evaluate trust.

The fourth concept is public projection. A private database does not become a public knowledge graph until it produces readable pages, search documents, JSON-LD, sitemaps, canonical URLs and exports that other systems can consume.

## Architecture

A practical cultural knowledge graph needs a few layers.

The source layer stores canonical records. In this repository, those records live in Markdown frontmatter and body content under `content/`. The relation layer stores typed statements in YAML. The validation layer checks IDs, allowed predicates, public visibility and required fields. The rendering layer generates public HTML, identifier routes, JSON-LD, graph neighborhoods and search documents.

This architecture is deliberately static. It does not require a server-side database to publish useful graph knowledge. The build step becomes the authority: it validates the corpus, renders complete pages and writes machine-readable outputs.

That choice matters for cultural publishing because static output is durable. A future reader, crawler or archive can inspect the generated page without needing a running application server.

## Implementation

The implementation pattern is straightforward:

1. Define entity types.
2. Give each record a canonical ID and route.
3. Require publication metadata.
4. Keep body content substantive enough to stand alone.
5. Store relations as typed statements.
6. Generate pages and JSON-LD from the same source.
7. Build search documents from titles, abstracts, bodies, tags and relations.
8. Reject broken references during validation.

The Electronic Artefacts graph already applies this pattern to VASTE, Runtime Theory, Graph Runtime and Vestiges. This article expands the same model into a broader knowledge hub.

## Practical applications

For Vestiges, a knowledge graph can connect people, techniques, materials, works, documents and institutions. A reader could start from a craft material, follow it to a technique, then to a practitioner, then to a publication, then to a provenance record.

For Palimpsests, a graph can connect tracks, visual references, audio analysis, memory concepts, signal archaeology and publication context.

For VASTE, a graph can document runtime concepts and show where they are applied in projects.

For the public site, a graph improves SEO because every article becomes a route into related canonical records. It improves AI discoverability because sources, identifiers and relations are explicit.

## Tools

Useful tools and standards include RDF for graph thinking, JSON-LD for structured data, Schema.org for web metadata, PROV for provenance, CIDOC CRM for cultural heritage modeling, static site generation for durable output, and search indexes built from structured records.

## Evidence

The current Electronic Artefacts build already generates canonical entity pages, identifier routes, JSON-LD files, search documents, a sitemap and local graph neighborhoods. That means the knowledge graph is not theoretical. It is the publishing substrate of the site.

Vestiges is the strongest applied case because it needs to model living cultural knowledge without flattening people, materials and techniques into isolated cards.

## Related concepts

Read the records for [Knowledge Graph](/knowledge/concepts/knowledge-graph/), [Entity Identity](/knowledge/concepts/entity-identity/), [Provenance](/knowledge/concepts/provenance/), [Linked Data](/knowledge/concepts/linked-data/) and [Graph Runtime](/knowledge/concepts/graph-runtime/).

## Suggested reading

Start with W3C RDF 1.1 Concepts, the CIDOC CRM overview and W3C PROV. Then compare those models with the Electronic Artefacts records for VASTE, Runtime Theory and Vestiges.

## Related articles

Continue with [Linked Data and Public Knowledge Pages](/publications/linked-data-and-public-knowledge-pages/) and [Contextual Execution and Graph Runtimes](/publications/contextual-execution-and-graph-runtimes/).

## Glossary

Entity: a thing with identity in the graph.

Predicate: the named relationship between two entities.

Provenance: information about origin, authorship, activity and transformation.

Canonical URL: the preferred public URL for a record.

Identifier route: a stable machine-facing route for an entity.

## Limitations

Knowledge graphs can become over-modeled. Not every noun deserves an entity. Not every association deserves a relation. Editorial discipline is required to prevent duplication, weak predicates and noise.

The graph should also avoid false certainty. Cultural knowledge often contains uncertainty, contested interpretation and incomplete provenance. A good graph records confidence rather than hiding it.

## References

- W3C. RDF 1.1 Concepts and Abstract Syntax. 2014.
- CIDOC CRM Special Interest Group. The CIDOC Conceptual Reference Model.
- W3C. PROV-Overview. 2013.
- Electronic Artefacts. VASTE, Runtime Theory, Graph Runtime and Vestiges records.
