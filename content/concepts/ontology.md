---
id: ea:concept:ontology
type: concept
slug:
  canonical: ontology
title: Ontology
definition: In knowledge engineering, an ontology is an explicit specification of the kinds of entities, properties, relationships and constraints used to represent a domain.
abstract: Ontologies make domain meaning explicit and interoperable, while taxonomies organize concepts primarily through classification and hierarchy.
description: A canonical definition distinguishing ontology, taxonomy, thesaurus and folksonomy.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Entity classes
  - Properties
  - Relations
  - Constraints
  - Shared domain meaning
  - Semantic interoperability
exclusions:
  - A list of tags with no defined meaning
  - A navigation menu presented as a complete model of a domain
claims:
  - Ontologies should formalize distinctions that produce real retrieval, validation or interoperability value.
  - Lightweight vocabularies are often more sustainable than premature formal complexity.
sources:
  - title: OWL 2 Web Ontology Language Document Overview
    publisher: W3C
    publishedAt: "2012-12-11"
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/owl2-overview/
  - title: SKOS Simple Knowledge Organization System Reference
    publisher: W3C
    publishedAt: "2009-08-18"
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/skos-reference/
tags:
  - Ontology
  - Taxonomy
  - SKOS
  - OWL
  - Controlled Vocabulary
disciplines:
  - Knowledge Systems
  - Information Architecture
  - Philosophy
  - Semantic Web
---

## Definition

An ontology specifies what kinds of things exist in a modeled domain and how statements about them can be formed. In formal systems it can define classes, properties, individuals, constraints and inference rules.

## Difference from taxonomy

A taxonomy primarily classifies concepts, often through broader and narrower categories. A thesaurus adds preferred labels, synonyms and associative relations. A folksonomy emerges from user-created tags. An ontology can include classification but also expresses richer domain semantics.

## Electronic Artefacts position

Electronic Artefacts uses a pragmatic entity and predicate vocabulary. The goal is not maximum formalism. It is enough explicit meaning to validate records, generate pages, publish JSON-LD and preserve relations over time.

## Limitations

Ontologies can become expensive, politically narrow or disconnected from use. The model should evolve from real questions and records, with versioning and mappings when terms change.

## References

See W3C OWL 2, W3C SKOS, Knowledge Graph, Linked Data and Metadata.
