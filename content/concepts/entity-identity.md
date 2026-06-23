---
id: ea:concept:entity-identity
type: concept
slug:
  canonical: entity-identity
title: Entity Identity
definition: Entity identity is the durable naming of a person, concept, project, program, publication or artefact so that references remain stable as descriptions evolve.
abstract: Entity identity gives knowledge systems a way to cite things without confusing names, pages, files, versions and changing descriptions.
description: A canonical definition of entity identity for graph publishing, semantic URLs, archives and Electronic Artefacts records.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.0.0
  createdAt: "2026-06-23"
  publishedAt: "2026-06-23"
  modifiedAt: "2026-06-23"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Identifiers
  - Slugs
  - Canonical URLs
  - Identifier routes
  - Versioned descriptions
exclusions:
  - A display title that changes without preserving a canonical identifier
  - A file path used as the only identity of an intellectual object
claims:
  - Entity identity is a prerequisite for durable internal linking.
  - Public knowledge graphs need stable identifiers even when pages are redesigned.
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    publisher: W3C
    publishedAt: "2014-02-25"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: Cool URIs for the Semantic Web
    publisher: W3C
    publishedAt: "2008-12-03"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/cooluris/
tags:
  - Identity
  - URI
  - Canonical URL
  - Versioning
  - Knowledge Graph
disciplines:
  - Knowledge Systems
  - Web Development
  - Archives
---

## Definition

Entity identity is the durable naming of something that the system wants to reference. It can be a concept, person, project, program, publication, organization, artefact, event or dataset. The key requirement is stability: the identifier should continue to refer to the same thing even when the description, title, route or design changes.

## Scope

Entity identity includes internal IDs, canonical slugs, public URLs, identifier routes, aliases, version metadata and redirect strategy. It also includes editorial decisions: whether two similar names describe one entity or two distinct entities.

## Why identity matters

Without durable identity, internal links decay into text references. A publication cannot reliably document a concept if the concept has no stable record. Search cannot rank related entities if identifiers keep changing. A future AI system cannot cite a project if the project only exists as a visual card.

## Electronic Artefacts position

Electronic Artefacts uses entity IDs such as `ea:concept:graph-runtime` and canonical routes such as `/knowledge/concepts/graph-runtime/`. Identifier routes under `/id/` preserve machine-facing identity while public pages remain readable for humans.

## Applications

Entity identity supports citations, graph validation, JSON-LD, sitemap generation, redirects, search documents, local graph neighborhoods, version history and archive records.

## Limitations

Identity is not merely technical. Poor identity decisions create conceptual debt. Splitting one entity into many duplicates weakens authority, while merging different entities erases important distinctions. The rule is to define identity around stable meaning, not temporary wording.

## References

See RDF 1.1 Concepts, Cool URIs for the Semantic Web and the Electronic Artefacts route registry.
