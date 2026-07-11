---
id: ea:publication:iiif-and-compound-cultural-objects
type: publication
slug:
  canonical: iiif-and-compound-cultural-objects
title: IIIF and Compound Cultural Objects
subtitle: Technical Article
abstract: A practical explanation of IIIF Presentation API concepts, compound objects, manifests, canvases, annotations and cultural archive interfaces.
description: Understand IIIF as presentation infrastructure for compound cultural objects, archives, manifests, canvases and annotations.
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
  - id: ea:technology:iiif
  - id: ea:concept:digital-preservation
  - id: ea:concept:linked-data
  - id: ea:concept:metadata
  - id: ea:project:vestiges
claims:
  - IIIF is useful for cultural infrastructure because it models compound objects as presentable structures rather than isolated files.
  - IIIF should be paired with richer metadata and knowledge graphs when discovery, interpretation and semantic search are required.
evidence:
  - id: ea:technology:iiif
  - id: ea:concept:digital-preservation
sources:
  - title: IIIF Presentation API 3.0
    publisher: IIIF Consortium
    accessedAt: "2026-06-24"
    url: https://iiif.io/api/presentation/3.0/
  - title: IIIF Image API 3.0
    publisher: IIIF Consortium
    accessedAt: "2026-06-24"
    url: https://iiif.io/api/image/3.0/
  - title: JSON-LD 1.1
    publisher: W3C
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/json-ld11/
citation:
  preferred: "Electronic Artefacts. \"IIIF and Compound Cultural Objects.\" Technical article, version 1.0.0, 2026."
tags:
  - IIIF
  - Digital Archives
  - Cultural Objects
  - Metadata
  - Linked Data
disciplines:
  - Digital Preservation
  - Cultural Infrastructure
  - Knowledge Systems
  - Web Development
---

## Problem

Cultural objects rarely fit one file. A book has pages, a sculpture has views, an album has tracks and artwork, an installation has video, audio, diagrams and documentation. Flat image galleries and download folders hide the structure that gives those objects meaning.

## Introduction

IIIF, the International Image Interoperability Framework, provides APIs and data models for presenting digital cultural objects. It is widely associated with high-resolution image viewers, but the Presentation API is broader: it models compound objects, views, sequences, ranges, annotations and descriptive context.

The IIIF Presentation API 3.0 describes resources such as collections, manifests, canvases, ranges and annotations. These are not only technical containers. They are a way to say how a cultural object should be seen, navigated and contextualized.

For Electronic Artefacts, IIIF is relevant because projects such as V6 and Palimpsests involve compound records. The work is not just a media file. It is a structured object with parts, views, traces, evidence and interpretation.

## Architecture

A IIIF presentation architecture contains source assets, derivative media, image or media services, manifests, canvases, ranges, annotations, viewers and external metadata records. IIIF describes presentational structure, while the surrounding knowledge graph records semantic identity, provenance, rights and cross-object relations.

## Compound objects

A compound object is made of multiple parts or views. A manuscript has pages. A painting may have visible, infrared and detail images. A music release may have tracks, cover art, liner notes and videos. A cultural technique may have photographs, diagrams, interviews and contextual records.

If each file is published independently, the object dissolves. Users can see pieces but not the whole. Search engines may index fragments without understanding their relation. Archives may preserve files while losing presentation structure.

IIIF helps by separating object structure from individual asset storage. A manifest can describe how parts belong together and how a viewer should present them.

## Collections

In IIIF, a collection groups manifests and other collections. It can represent an archive set, exhibition, search result, institution or curated body of objects.

Collections are useful because cultural infrastructure often needs nested navigation. A project may contain series. A series may contain objects. An object may contain canvases. This structure lets readers move from overview to detail without relying on a folder tree.

For V6, collections could group crafts, institutions, regions, techniques or documentation campaigns. The important point is that collection structure is editorial, not merely storage.

## Manifests

A manifest describes a single object or work for presentation. It includes descriptive information and the sequence or structure of views needed to render it.

The manifest is the central unit a viewer can load. It tells the client what the object is, which canvases it has, which resources are painted onto those canvases and which ranges or structures organize them.

For Palimpsests, one manifest might describe a release dossier: cover image, booklet pages, listening notes, track-related visuals and documentation. For a visual archive, a manifest might describe one artefact with multiple photographs and annotations.

## Canvases

A canvas is a virtual surface or time extent. It provides a coordinate or temporal frame where content resources are placed. This is a powerful abstraction because it can represent a page, image plane, video duration or audio timeline.

A canvas is not the image itself. It is the space onto which images, text, video or audio can be associated. That distinction allows annotations, overlays and alternate representations.

For audio-visual work, this model is especially useful. A canvas can refer to time-based media and annotations can point to moments or segments.

## Annotations

IIIF uses annotations to associate content with canvases or parts of canvases. An annotation might place an image on a canvas, add transcription, mark a region, attach commentary or link to another resource.

Annotations make cultural objects active surfaces for interpretation. A researcher can connect a visual detail to a note. A curator can identify a technique. A system can associate transcript text with audio.

Annotation workflows require governance. Public annotations, editorial annotations and machine-generated annotations should not be collapsed into one layer. Each should carry author, confidence and review status.

## Presentation, not discovery

The IIIF Presentation API explicitly focuses on presenting compound objects to humans. It does not try to replace metadata standards for discovery or search.

This matters. IIIF can tell a viewer how to render an object and move through its parts. A knowledge graph can describe why the object matters, which people are involved, which techniques it uses, which sources support claims and how it relates to other objects.

The best architecture pairs them. IIIF handles rich object presentation. Linked Data and site metadata handle discovery, semantic identity and cross-object relations.

## Linked Data

IIIF uses JSON-LD and adopts Linked Data principles. This gives the model web-native identifiers and interoperability benefits.

However, using JSON-LD does not automatically make an archive semantically rich. A manifest may include descriptive labels that are intended for human display rather than machine reasoning. Deeper semantic work still requires controlled vocabularies, entity identifiers and relation modeling.

Electronic Artefacts already has a graph model for entities and relations. IIIF could complement it by adding presentation-level structure for selected media-rich objects.

## Digital preservation

Preservation is not only keeping files. It is keeping enough structure and context for future interpretation. IIIF can help preserve presentation structure: which page followed which, which image showed which view, which annotation explained which region.

It does not replace fixity, storage redundancy, rights records, format monitoring or provenance. It adds a presentational layer that can remain useful across viewers and institutions.

A preservation plan should keep source assets, derivative assets, manifests, annotations, rights metadata and graph records together enough that future systems can reconstruct the object.

## V6

V6 is a natural IIIF-adjacent future platform because art and craft records can need more than one image and one paragraph. A craft object can have material details, maker context, workshop images, tool diagrams and institutional references.

An IIIF manifest could expose the object for interoperable viewing. The Electronic Artefacts graph could connect that object to concepts, places, materials, techniques and evidence.

This division prevents the public page from becoming either a generic article or a raw viewer. The page can explain, the graph can relate and IIIF can present.

## Implementation

Start with one compound object that has multiple images or media parts. Create stable IDs for the object and assets. Produce a IIIF manifest that describes canvases, labels, summaries and resource links. Validate it in a IIIF viewer.

Then connect the manifest back to the site graph: project, concept, provenance, rights and source records. Avoid treating the manifest as the only metadata source.

## Evidence

The IIIF Presentation API 3.0 defines collections, manifests, canvases, ranges and annotations for presenting compound objects. It states that presentation is its core purpose and that discovery metadata is outside its direct scope.

## Electronic Artefacts implications

IIIF gives Electronic Artefacts a mature reference for media-rich cultural objects. It is especially useful where the site needs a viewer-like experience without inventing a custom archive format.

The design principle is complementarity: IIIF for presentation, knowledge graph records for meaning, provenance and discovery.

## Limitations

IIIF can add implementation complexity, especially when a small project only needs a simple public page. It is most valuable when objects have multiple views, deep zoom needs, timed media, annotations or institutional interoperability requirements.

## Related concepts

Read [Digital Preservation](/knowledge/concepts/digital-preservation/), [Linked Data](/knowledge/concepts/linked-data/), [Metadata](/knowledge/concepts/metadata/) and [Knowledge Graph](/knowledge/concepts/knowledge-graph/).

## Related technology

See [IIIF](/knowledge/technologies/iiif/) and [JSON-LD](/knowledge/technologies/json-ld/).

## Glossary

Manifest: a IIIF resource describing how to present one compound object.

Canvas: a spatial or temporal frame for object content.

Range: a structural grouping inside a manifest.

Annotation: a link between a canvas or region and content or commentary.

Collection: a grouping of manifests or other collections.

## References

- IIIF Consortium. IIIF Presentation API 3.0.
- IIIF Consortium. IIIF Image API 3.0.
- W3C. JSON-LD 1.1.
