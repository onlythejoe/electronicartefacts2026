---
id: ea:publication:digital-preservation-and-living-archives
type: publication
slug:
  canonical: digital-preservation-and-living-archives
title: Digital Preservation and Living Archives
subtitle: Technical Article
abstract: This article explains digital preservation as an active cultural practice that keeps digital objects, metadata, provenance and interpretation usable over time.
description: A technical article on digital preservation, living archives, file formats, provenance and Electronic Artefacts cultural records.
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
  - id: ea:concept:digital-preservation
  - id: ea:concept:provenance
  - id: ea:project:palimpsests
  - id: ea:project:vestiges
  - id: ea:concept:knowledge-graph
claims:
  - Digital preservation is not backup; it is long-term care for objects, metadata, rights, formats and context.
  - Living archives need graph relationships because interpretation changes while provenance must remain inspectable.
evidence:
  - id: ea:project:palimpsests
  - id: ea:project:vestiges
sources:
  - title: Digital Preservation Handbook
    publisher: Digital Preservation Coalition
    publishedAt: "2015-01-01"
    accessedAt: "2026-06-23"
    url: https://www.dpconline.org/handbook
  - title: Sustainability of Digital Formats
    publisher: Library of Congress
    accessedAt: "2026-06-23"
    locator: Last updated 2024-06-18
    url: https://www.loc.gov/preservation/digital/formats/
  - title: Levels of Digital Preservation
    publisher: National Digital Stewardship Alliance
    accessedAt: "2026-06-23"
    url: https://www.ndsa.org/publications/levels-of-digital-preservation/
citation:
  preferred: "Electronic Artefacts. \"Digital Preservation and Living Archives.\" Technical article, version 1.0.0, 2026."
tags:
  - Digital Preservation
  - Living Archive
  - Provenance
  - Palimpsests
  - Vestiges
disciplines:
  - Archives
  - Digital Art
  - Knowledge Systems
  - History of Technology
---

## Problem

Digital culture is easy to copy and difficult to preserve. A file can be duplicated in seconds, but long-term meaning depends on much more than the bytes. Who made it? Which version is this? What software created it? Which rights apply? What project does it belong to? Is it a final work, a process trace, a reference image, a generated output, a damaged export or a public artefact?

Backup answers only one part of the problem: can the file be recovered after a failure? Digital preservation asks a larger question: can the object remain understandable, authentic, usable and accessible when formats, software, hardware, links and cultural context change?

This distinction matters for Electronic Artefacts because the site contains born-digital work: images, audio, code, generated pages, JSON-LD, research notes, project media and experimental publications. The archive is not a warehouse at the end of production. It is part of how the work remains intelligible.

## Introduction

Digital preservation is a long-term care practice for digital objects and their context. It combines storage, format strategy, metadata, provenance, rights, fixity checks, migration, access copies and interpretation.

A living archive is an archive that can continue to receive interpretation, relations and updated records without pretending that the past is unstable. The object's provenance should remain stable, but the public understanding of that object may deepen over time.

## Context

The Digital Preservation Coalition describes digital preservation as a practical field concerned with managing digital resources over time. The Library of Congress maintains format sustainability guidance because file formats differ in transparency, disclosure, adoption, dependencies and preservation risk. The NDSA Levels of Digital Preservation provide a way for organizations to assess and improve preservation practice.

Those references share a principle: preservation is organizational and technical. It is not enough to store files. A preservation system must know what it has, how it can verify it, how it can migrate it and how a future user can understand it.

## History

Archives long predate digital systems. Physical archives managed custody, description, conservation and access. Digital preservation inherited those concerns and added new ones: media failure, format obsolescence, software dependency, link rot, metadata loss, compression, version drift and platform disappearance.

The shift to born-digital culture intensified the problem. A digital artwork, website, recording session or software prototype may depend on tools, operating systems, plugins, APIs and interaction patterns that disappear. Preserving only the final export can erase the process that made the work significant.

## Core concepts

Fixity means verifying that a file has not changed unexpectedly, usually through checksums.

Provenance means recording origin, custody, authorship, transformation and evidence.

Representation information means the information needed to interpret the object.

Access copy means a version prepared for use, separate from a preservation master.

Migration means moving an object or metadata into a newer format or environment.

Selection means deciding what deserves preservation attention.

## Architecture

A living archive needs several layers:

- preservation storage for important source files;
- metadata records with identity, dates, rights and context;
- provenance statements;
- format monitoring;
- public access pages;
- graph relations to projects, concepts and publications;
- review states that distinguish canonical records from speculative interpretation.

For a static website, preservation also includes generated outputs. HTML pages, JSON-LD, sitemaps and graph exports are part of the public record. They should be reproducible from source records, but preserving generated snapshots can still help future audits.

## Implementation

The implementation path should begin with inventory. What exists? Which files are public? Which files are source material? Which files are evidence? Which formats are risky? Which records have no provenance?

Next comes identity. Important objects should receive stable IDs and routes. A record should not depend only on an image filename or a folder name.

Then comes relation. An artefact should say what project it belongs to, what publication documents it, which concept it demonstrates and what source or production process it derives from.

Finally comes review. Preservation is ongoing. Records need modification dates, confidence states and periodic checks.

## Practical applications

For Palimpsests, digital preservation means more than storing album artwork and audio exports. It means preserving enough context to understand memory, residue, signal and production decisions.

For ORETH, it means preserving research notes and audio analysis context without overclaiming machine-listening results.

For Vestiges, preservation is central because the platform thesis depends on living cultural knowledge, contribution, provenance and public interpretation.

For the Electronic Artefacts site, it means treating generated knowledge pages as durable public artefacts.

## Tools

Useful tools include checksums, file inventories, format registries, controlled vocabularies, provenance records, versioned source control, metadata schemas, static exports, web archives and graph indexes.

## Evidence

The current repository already distinguishes source content, generated pages, graph outputs, search documents and identifier routes. That separation makes preservation possible because source and projection can be inspected separately.

## Preservation checklist

A small studio or research site can begin with a practical checklist.

Identify the object. Give important works, publications, media and datasets stable IDs. Do not depend on filenames alone.

Record provenance. Document creator, publisher, date, source project, rights, transformations and confidence. If the object came from a legacy system, say so.

Separate preservation copies from access copies. A compressed web image is useful for visitors, but it may not be the best preservation object.

Track formats and dependencies. A file is easier to preserve when its format is open, documented, widely adopted and not locked to one abandoned tool.

Verify fixity. Checksums do not explain meaning, but they help detect unexpected change.

Connect the object. A preserved item should link to the project, publication, concept or program that makes it meaningful.

Review periodically. Preservation is not a single action. It is a maintenance practice.

## Common mistakes

The first mistake is treating cloud storage as preservation. Cloud storage can be part of an infrastructure, but without metadata, rights, fixity, format awareness and retrieval practice, it is only remote storage.

The second mistake is preserving final outputs while discarding context. For a cultural work, drafts, references, process notes and production decisions may carry interpretive value. Not all should be public, but significant context should be described.

The third mistake is over-preserving without selection. If everything is kept with equal priority, the archive becomes hard to maintain and hard to interpret.

## Electronic Artefacts implications

Electronic Artefacts should treat every major project as a preservation context. VASTE needs versioned architecture and licensing records. Palimpsests needs audio, visual and interpretive provenance. Vestiges needs contribution and validation history. The website itself needs generated snapshots and source records because the public graph is part of the institution's intellectual output.

This approach gives the archive value beyond nostalgia. It makes the site a working memory system.

## Related concepts

Read [Digital Preservation](/knowledge/concepts/digital-preservation/), [Provenance](/knowledge/concepts/provenance/), [Knowledge Graph](/knowledge/concepts/knowledge-graph/), [Palimpsests](/projects/palimpsests/) and [Vestiges](/projects/vestiges/).

## Suggested reading

Start with the Digital Preservation Coalition Handbook, Library of Congress Sustainability of Digital Formats and NDSA Levels of Digital Preservation.

## Related articles

Continue with [Knowledge Graphs for Cultural Infrastructure](/publications/knowledge-graphs-for-cultural-infrastructure/) and [Signal Archaeology, Audio Memory and Machine Listening](/publications/signal-archaeology-audio-memory-and-machine-listening/).

## Glossary

Fixity: evidence that a file has not changed unexpectedly.

Migration: moving content or metadata to a new format or environment.

Living archive: an archive that preserves stable provenance while allowing interpretation to grow.

Representation information: context needed to understand a preserved object.

## Limitations

Preservation can become infinite if no selection criteria exist. A living archive should not keep everything equally. It should preserve objects that carry evidence, meaning, rights or future interpretive value.

Preservation also has ecological and economic cost. Storage, migration and redundancy should be proportional to significance.

## References

- Digital Preservation Coalition. Digital Preservation Handbook, 2nd Edition.
- Library of Congress. Sustainability of Digital Formats.
- National Digital Stewardship Alliance. Levels of Digital Preservation.
- Electronic Artefacts. Palimpsests and Vestiges records.
