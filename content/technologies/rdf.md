---
id: ea:technology:rdf
type: technology
slug:
  canonical: rdf
title: RDF
subtitle: Resource Description Framework
abstract: RDF is a W3C graph data model for representing information as subject-predicate-object statements about resources.
description: A technology record for RDF as a reference model behind knowledge graphs, Linked Data and semantic publication.
locale: en
visibility: public
publicationClass: published
status: active
maturity: production
confidence: published
version:
  version: 1.0.0
  createdAt: "2014-02-25"
  publishedAt: "2026-06-23"
  modifiedAt: "2026-06-23"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: protocol
roleInEcosystem: RDF provides the reference graph model for thinking about entities, predicates, resources, identifiers and semantic interoperability.
officialUrl: https://www.w3.org/TR/rdf11-concepts/
versions:
  - RDF 1.1
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    publisher: W3C
    publishedAt: "2014-02-25"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/rdf11-concepts/
tags:
  - RDF
  - Semantic Web
  - Linked Data
  - Graph
disciplines:
  - Web Development
  - Knowledge Systems
---

## Role

RDF is a reference model for representing information as graph statements. Electronic Artefacts uses RDF as a conceptual reference for entity identity and typed relationships, even when the internal source records are authored in Markdown and YAML.

## Use

RDF helps clarify the difference between a thing, a page about that thing, and a statement connecting that thing to another thing.

## Limitations

RDF interoperability requires precise identifiers, vocabularies and serialization choices. A site can learn from RDF without adopting a full RDF stack in its internal implementation.
