---
id: ea:publication:metadata-cataloguing-and-cultural-memory
type: publication
slug:
  canonical: metadata-cataloguing-and-cultural-memory
title: Metadata, Cataloguing and Cultural Memory
subtitle: Technical Article
abstract: This article explains metadata as a cultural memory layer, connecting cataloguing, Dublin Core, PREMIS, METS, provenance, archives and knowledge graphs.
description: A technical article on metadata, cataloguing, cultural memory, preservation standards and Electronic Artefacts graph records.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:digital-preservation
  - id: ea:concept:knowledge-graph
  - id: ea:project:vestiges
claims:
  - Metadata is not clerical residue; it is the interpretive infrastructure that makes cultural objects findable and understandable.
  - Knowledge graphs become more trustworthy when metadata records source, rights, format, relation and uncertainty.
evidence:
  - id: ea:concept:metadata
  - id: ea:project:vestiges
sources:
  - title: DCMI Metadata Terms
    publisher: Dublin Core Metadata Initiative
    publishedAt: "2020-01-20"
    accessedAt: "2026-06-24"
    url: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
  - title: Metadata Encoding and Transmission Standard
    publisher: Library of Congress
    accessedAt: "2026-06-24"
    url: https://www.loc.gov/standards/mets/
  - title: PREMIS Preservation Metadata
    publisher: Library of Congress
    accessedAt: "2026-06-24"
    url: https://www.loc.gov/standards/premis/
citation:
  preferred: "Electronic Artefacts. \"Metadata, Cataloguing and Cultural Memory.\" Technical article, version 1.0.0, 2026."
tags:
  - Metadata
  - Cataloguing
  - Archives
  - Cultural Memory
disciplines:
  - Archives
  - Knowledge Systems
  - Research Methods
  - History of Technology
---

## Problem

Digital culture creates enormous quantities of files, pages, exports, recordings, screenshots, notes, code and media fragments. Without metadata, those objects lose context quickly. A file may still open but no longer explain who made it, why it exists, what it relates to, whether it can be used or how it changed.

The problem is not only technical. Metadata is cultural memory. It preserves the conditions that make interpretation possible. Without it, archives become storage. Search becomes guesswork. Knowledge graphs become weak maps.

Electronic Artefacts needs metadata because its work crosses software, sound, research, design, art and systems. The same object may be a project output, evidence for a claim, a preserved artefact and a source for future work.

## Introduction

Metadata is structured information about a resource. It can be descriptive, administrative, structural or preservation-oriented. Descriptive metadata helps identify and discover an object. Administrative metadata records rights, technical properties and management context. Structural metadata explains parts and relationships. Preservation metadata records actions, agents, formats and fixity.

For the Knowledge Hub, metadata is not hidden paperwork. It is part of publication quality.

## Context

Dublin Core, METS and PREMIS come from library, archive and preservation contexts. Their details differ, but they share a premise: digital resources require structured context.

Electronic Artefacts does not need to reproduce every archival standard. It does need to respect the same logic. A public record should name title, identifier, creator, date, source, rights, relation, confidence and version where possible.

## History

Cataloguing predates digital systems. Libraries, museums and archives developed descriptive practices to make collections discoverable and accountable. Digital networks changed the scale and the fragility of the problem. Files can be copied endlessly while losing context. Links can circulate without provenance. Formats can become obsolete.

Metadata standards emerged to address different parts of this environment. Dublin Core offered a broad vocabulary for resource description. METS provided a way to encode descriptive, administrative and structural metadata for digital library objects. PREMIS focused on preservation metadata.

## Core concepts

Identifier: a stable reference to a resource.

Title: the name used to identify the resource.

Creator: the person or organization responsible for creation.

Source: the resource from which another resource derives.

Rights: legal and usage context.

Relation: a structured connection to another resource.

Fixity: evidence that a file has not changed unexpectedly.

## Architecture

A metadata architecture needs a schema, vocabulary, validation and publication path. The schema defines required fields. The vocabulary keeps terms consistent. Validation catches missing or malformed values. Publication exposes metadata to readers, search engines and machines.

Electronic Artefacts implements this through frontmatter, entity schemas, relation schemas, generated pages, JSON-LD and search documents. The architecture is strongest when article prose and machine metadata agree.

## Implementation

Implementation should begin with minimum viable metadata for every public record: identifier, type, title, abstract, status, maturity, dates, author, publisher, subjects and sources. For preservation-sensitive objects, add format, rights, provenance, fixity and relation to original files.

Metadata should be reviewed when content changes. A modified article should update modifiedAt. A speculative concept should not pretend to be canonical. A source should include accessedAt when it is web-based.

## Practical applications

Metadata improves search by giving documents clear subjects and descriptions.

It improves navigation by allowing related content to be generated from real entities.

It improves preservation by recording origin, format and change.

It improves trust by showing what a claim depends on.

In Vestiges, metadata can connect culture, craft, institutions, techniques and sources. In Palimpsests, it can preserve audio and visual residue. In ORETH, it can document analysis outputs and machine-listening context.

## Tools

Useful tools include Dublin Core vocabularies, PREMIS, METS, JSON-LD, RDF, YAML frontmatter, checksums, file inventories, source registers, validation scripts and graph neighborhood generation.

## Evidence

The Knowledge Hub already demonstrates metadata's value. Every entity carries type, status, maturity, confidence, dates and subjects. Generated pages turn those records into public knowledge surfaces.

## Editorial method

Editors should treat metadata as writing. A vague abstract or broad tag weakens the article. A precise subject list makes the record discoverable and helps future authors link to it.

Metadata should also record uncertainty. If a date is approximate, if attribution is unclear or if rights are unknown, the record should say so rather than conceal the gap.

## Common mistakes

The first mistake is postponing metadata until the end. Context is easiest to capture when work is created.

The second mistake is over-customization. A private vocabulary may feel expressive but become difficult to integrate.

The third mistake is treating tags as enough. Tags group content; metadata explains resources.

## Electronic Artefacts implications

Electronic Artefacts can use metadata to connect creative production with research memory. This matters because the site is not only presenting work. It is documenting an ecosystem.

The Knowledge Hub should continue to add concept records, article subjects, source trails and relation statements before content volume overwhelms structure.

## Knowledge graph role

Metadata is the bridge between a page and a graph. A prose article can explain an idea, but metadata makes that article addressable, sortable and reusable. Subjects connect it to entities. Sources connect it to evidence. Dates make revision visible. Confidence levels tell readers how stable the record is.

In Electronic Artefacts, this is especially important because many pages are not simply articles. A project page may be evidence for a concept. A program page may implement a framework. A technology page may support several publications. Metadata lets those roles remain distinct while still connected.

## Evaluation criteria

A metadata record should be evaluated by usefulness, not density. The best question is not "did we fill every field?" but "will this help a future reader understand, retrieve, trust or preserve the object?"

Good metadata names the resource clearly, distinguishes the resource from the page describing it, identifies creators and sources, records rights where relevant, connects related records and avoids false precision. When information is unknown, the record should preserve uncertainty rather than invent certainty.

## Editorial standard

The Knowledge Hub should treat metadata changes as editorial changes. If a source is added, a concept becomes canonical or an article is substantially revised, the metadata should change with the text. This keeps the graph honest. It also makes generated search documents and JSON-LD reflect the actual publication state.

## Reader pathway

Metadata can feel abstract until a reader loses context. The article should therefore guide readers from everyday questions, such as "what is this file?" or "where did this source come from?", toward archival concepts like provenance, preservation metadata and graph relations. The strongest path leads from [Metadata](/knowledge/concepts/metadata/) to [Provenance](/knowledge/concepts/provenance/), [Digital Preservation](/knowledge/concepts/digital-preservation/) and [Vestiges](/projects/vestiges/).

## Future work

Future entries should cover preservation metadata, rights metadata, source criticism, file format sustainability, checksums, cataloguing for audio and graph-based archival description.

## Related concepts

Read [Metadata](/knowledge/concepts/metadata/), [Provenance](/knowledge/concepts/provenance/), [Digital Preservation](/knowledge/concepts/digital-preservation/), [Knowledge Graph](/knowledge/concepts/knowledge-graph/) and [Vestiges](/projects/vestiges/).

## Suggested reading

Start with Dublin Core for general description, then study METS and PREMIS for digital library and preservation contexts.

## Related articles

Continue with [Digital Preservation and Living Archives](/publications/digital-preservation-and-living-archives/) and [Knowledge Graphs for Cultural Infrastructure](/publications/knowledge-graphs-for-cultural-infrastructure/).

## Glossary

Metadata: structured information about a resource.

Cataloguing: the practice of describing resources for discovery and management.

PREMIS: a preservation metadata standard.

METS: a standard for encoding digital library object metadata.

## Limitations

Metadata can create false authority. A well-structured record may still be wrong. Review, sources and confidence levels remain necessary.

Metadata also costs time. The right response is not to describe everything exhaustively, but to capture the context future readers will actually need.

## References

- Dublin Core Metadata Initiative. DCMI Metadata Terms.
- Library of Congress. METS.
- Library of Congress. PREMIS.
- Electronic Artefacts. Vestiges, Knowledge Graph and Digital Preservation records.
