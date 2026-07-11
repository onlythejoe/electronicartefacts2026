---
id: ea:publication:why-graphs-are-more-powerful-than-folders
type: publication
slug:
  canonical: why-graphs-are-more-powerful-than-folders
title: Why Graphs Are More Powerful Than Folders
subtitle: Technical Article
abstract: A practical comparison of hierarchical folders and graph models for knowledge, projects, archives, identity, provenance and generated interfaces.
description: Learn when graph models outperform folder hierarchies, why relationships matter, and how to keep folders as useful projections over connected data.
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
  - id: ea:concept:graph-modeling
  - id: ea:concept:knowledge-graph
  - id: ea:concept:entity-identity
  - id: ea:concept:provenance
  - id: ea:program:vaste
  - id: ea:project:vestiges
claims:
  - Folders provide one primary containment path, while graphs preserve many simultaneous relationships among entities.
  - Graphs should not eliminate hierarchical views; they should generate several useful projections from one connected model.
evidence:
  - id: ea:concept:graph-modeling
  - id: ea:concept:knowledge-graph
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    author: Richard Cyganiak, David Wood and Markus Lanthaler
    publisher: W3C
    publishedAt: "2014-02-25"
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: "2026-06-24"
    url: https://www.cidoc-crm.org/
citation:
  preferred: "Electronic Artefacts. \"Why Graphs Are More Powerful Than Folders.\" Technical article, version 1.0.0, 2026."
tags:
  - Graph Modeling
  - Folders
  - Knowledge Graph
  - Information Architecture
  - VASTE
disciplines:
  - Knowledge Systems
  - Systems Design
  - Information Architecture
  - Software Architecture
---

## Problem

Folder hierarchies force connected objects into one primary location. As projects grow, identity, provenance, cross-disciplinary relations and multiple discovery paths become hidden in filenames, copies and institutional memory.

## Introduction

Folders are one of the most successful interfaces in computing. They provide a familiar way to group documents, navigate storage and assign names. Their limitation is not that hierarchy is obsolete. It is that a folder asks every item to occupy one primary place.

Most real knowledge is not shaped like a tree. A recording belongs to an album, was produced during a project, uses a technique, contains a performance by a person, derives from source files, and may be discussed by several publications. A folder can store the file under one path. The other relationships must be duplicated, written into filenames, hidden in metadata or remembered by people.

A graph makes relationships first-class. Entities keep stable identities, and typed edges connect them across many contexts. The same recording can remain one object while appearing in project, artist, technique, archive and publication views. This is why graphs are more powerful for knowledge systems, cultural infrastructure and complex products.

Power does not mean replacement. Folder and tree interfaces remain excellent projections. A graph architecture should let users browse hierarchically when that is useful, without making the hierarchy the only truth.

## How folders model information

A filesystem path expresses containment. `/projects/palimpsests/audio/final/master.wav` tells us that one file is inside a sequence of directories. The path can communicate project, medium, status and role through naming conventions.

This model works when ownership is clear and relationships are mostly one-to-many. A project contains deliverables. A year contains invoices. A software repository contains modules. Paths are easy to sync, archive and understand with basic tools.

Problems appear when one object belongs in several places. Teams copy the file, create shortcuts or choose one canonical location and rely on memory for the rest. Copies diverge. Shortcuts break. Naming conventions become encoded databases: `2026_Palimpsests_Master_v12_FINAL-2.wav`.

The hierarchy is carrying identity, version, status and context at once. A path change can look like an identity change even when the object remains the same.

## Graph primitives

A graph begins with nodes and edges. Nodes represent entities such as projects, people, files, concepts or institutions. Edges represent relationships such as `createdBy`, `partOf`, `documents`, `usesTechnology` or `derivedFrom`.

Properties attach additional values: dates, titles, status and descriptions. Stable identifiers let an entity remain the same even if its title or public URL changes.

Typed relations are essential. A network visualization where every line means "related" is not a useful knowledge graph. The type tells software and readers how to interpret the connection.

RDF formalizes graph statements as subject, predicate and object. A system does not need to store RDF internally to benefit from the discipline. Electronic Artefacts uses typed IDs and predicates that can be published through JSON-LD and generated graph outputs.

## Architecture

The architecture separates canonical nodes and typed relations from storage and presentation. Files remain in repositories or object stores, while stable IDs connect them to graph records and generated views.

## Multiple valid paths

In a folder tree, every item has a parent path. In a graph, a node can be reached through many meaningful paths.

A reader can move from Palimpsests to ORETH through `poweredBy`, then to Signal Archaeology through `appliesConcept`, then to a publication through `documentedBy`. Another reader can begin with Digital Preservation and arrive at the same project through archive relations.

These paths reflect different questions. "Which program powers this project?" differs from "Which works demonstrate this concept?" A graph can answer both without duplicating the underlying records.

This is especially valuable for discovery. Users rarely know the exact folder chosen by an editor. They approach through people, themes, tools, places or problems.

## Stable identity

Folder systems often equate location with identity. Moving a file changes its path and can break links. A graph assigns an identifier independent of current placement.

Electronic Artefacts IDs such as `ea:program:vaste` or `ea:concept:knowledge-graph` remain stable while public pages, labels and metadata evolve. Relations refer to the identifier, not a copied title.

Stable identity also supports merging. If two imports describe the same institution, they can be reconciled to one node. If they describe different institutions with similar names, separate IDs preserve the distinction.

Canonical identity is foundational for SEO. Multiple articles can link to one concept page rather than competing as definitions. Redirects and aliases can preserve older URLs.

## Provenance

Folders show where a file is stored, not necessarily where it came from. Provenance needs relations: derived from, created by, digitized from, reviewed by, supersedes or generated from.

A graph can connect an artefact to source material, transformation events, software versions and publication decisions. This makes lineage queryable.

For Palimpsests, a final audio file can link to stems, sessions, reference recordings, ORETH analyses and release records. Publishing every private source is unnecessary; the graph can maintain restricted provenance and expose a public projection.

Provenance also helps AI systems. A generated answer can cite canonical source nodes rather than relying on anonymous text fragments.

## Time

Hierarchies are weak at representing change. A file can move from `draft` to `final`, but the earlier state may disappear unless version control or backups preserve it.

Graphs can model time through version entities, event records and relation validity. A person held a role during a period. A project used one technology before migrating. A claim was superseded by a later publication.

Temporal modeling prevents current state from erasing history. Cultural knowledge often depends on sequence: who learned from whom, how a technique moved, when an institution changed name.

V6 needs this capacity because craft and cultural transmission are processes, not static profiles.

## Permissions and context

Folder permissions apply to paths and inherited subtrees. This is effective for many storage tasks. Graph systems may need permissions based on entity type, relation, project membership or purpose.

An editor could read a restricted source record but publish only a derived citation. A contributor could propose a relation to an institution but not change the institution's canonical identity. A model could analyze private documents while retrieving only records authorized for the current user.

This is contextual execution: behavior depends on actor, entity, relation and state. VASTE treats these conditions as runtime concerns.

Graph permissions are more expressive but more difficult to reason about. Systems need explicit rules and tests to avoid accidental traversal into restricted nodes.

## Querying

Folder queries usually search paths, names or file contents. Graph queries can ask about patterns: which publications document concepts applied by VASTE? Which techniques are connected to a material through a person? Which artefacts derive from a source and lack preservation metadata?

Path queries expose indirect relationships. They can support recommendations, impact analysis and anomaly detection.

Search and graph traversal complement one another. Full-text search finds passages. Graph queries find structural patterns. A knowledge interface can resolve an entity through search and then explore its neighborhood.

The query value depends on modeling quality. Vague relations and duplicate identities produce vague answers.

## Generated views

A graph should not force every user into a node-link visualization. It can generate conventional views: project pages, chronological timelines, category indexes, folders, tables and maps.

The same entity can appear in several views without duplication. A publication index sorts by date. A discipline page groups by theme. A project page displays related programs and articles. A timeline shows events.

This separation between model and projection is one of the strongest architectural benefits. Editors maintain one canonical record; build systems produce audience-specific surfaces.

Electronic Artefacts already follows this pattern. Markdown frontmatter feeds entity pages, identifier routes, search documents, JSON-LD, sitemap entries and graph neighborhoods.

## Graphs and filesystems

Graphs do not remove the need for files. Source documents, media and code still need storage. The graph should reference and describe them.

A practical architecture keeps binary assets in a filesystem or object store, source records in version control or a database, and graph relations in structured data. Stable IDs bridge these layers.

Human-readable folder conventions remain useful for maintenance. The mistake is treating those conventions as the only domain model.

Version control also complements graphs. Git records textual change history, while graph entities describe semantic relationships. One cannot replace the other.

## Modeling the world

The phrase "model the world with graphs" can invite overreach. No graph captures reality completely. A model selects entities and relations according to purpose.

The first step is competency questions. What must the system answer? For V6: who practices a technique, which materials it uses, where it is taught, what documents support the claim, and how it changed over time. These questions determine the graph.

The second step is evidence. A relation should have a source when it makes a substantive cultural claim.

The third is governance. New predicates and entity types require review. Otherwise the graph becomes an uncontrolled collection of personal interpretations.

The fourth is humility. Alternative models may be valid. Cultural categories should support local terms and contested interpretations.

## When a folder is enough

Use folders when the domain has one stable containment structure, the number of objects is limited and cross-relations are not important. Personal tax documents, build artifacts and a small project export may need nothing more.

A graph introduces identity management, relation governance, query tooling and interface complexity. It should solve real problems.

A common migration path begins with files and frontmatter. Stable IDs and references are added. A build step generates indexes and relation outputs. A database becomes necessary only when contribution, scale or runtime queries exceed static workflows.

Electronic Artefacts uses this incremental approach. The public system gains graph properties without discarding Markdown and static publishing.

## Common graph failures

The first failure is graph theater: a visual web of nodes with no typed semantics or useful questions.

The second is entity explosion. Every phrase becomes a node, producing thousands of empty pages.

The third is universal relation. All edges become `relatedTo`, so traversal carries no meaning.

The fourth is missing provenance. Claims appear as facts without sources or confidence.

The fifth is ignoring projections. Users are forced to navigate the data model directly.

The sixth is centralizing everything. A graph becomes a mandatory platform even for independent components that only need a simple file.

## VASTE

VASTE extends graph modeling into execution. Entities and relations do not merely describe a domain; they participate in permissions, context, events and projections.

This makes the graph a runtime substrate. A relation can influence which operation is allowed or which event propagates. Public applications can share identity and semantics while exposing different interfaces.

The approach is valuable for systems where knowledge and workflow are inseparable: archives, cultural platforms, rights systems and institutional memory.

It also requires stronger controls. Execution should use bounded neighborhoods and validated predicates rather than arbitrary traversal.

## V6

V6 demonstrates why folders are insufficient for cultural knowledge. A craft technique belongs to people, places, materials, tools, institutions and works. No single hierarchy can represent all of these paths.

A graph allows the platform to preserve transmission: a person learned from another person, taught at an institution, used a material and contributed to a work. Public pages can then tell coherent stories from the same structured records.

Economic services can emerge from the graph. A marketplace listing is connected to verified skills, materials and provenance rather than existing as an isolated product card.

## Knowledge Hub

The Knowledge Hub uses graph architecture to prevent articles from becoming isolated blog posts. Each publication documents concepts, technologies, projects and programs. Collections create curated reading paths. Concept pages accumulate authority.

Folders still organize the repository. The graph provides the public intellectual structure. This coexistence is the practical answer to the title: graphs are more powerful because they can preserve many relations, while folders remain useful as one view.

## Implementation

Start by adding stable identifiers and typed references to existing records. Preserve folder storage, generate relation indexes and public views, then introduce a graph database only when runtime queries or collaborative updates require it.

## Evidence

RDF provides a standard subject-predicate-object graph model, while CIDOC CRM shows how cultural entities and events can be integrated across heterogeneous collections.

## Limitations

Graphs add governance and query complexity. Poor predicates, duplicate identities and unrestricted traversal can make a graph less usable than a disciplined hierarchy. Not every file collection requires a graph.

## Related concepts

Read [Graph Modeling](/knowledge/concepts/graph-modeling/), [Knowledge Graph](/knowledge/concepts/knowledge-graph/), [Entity Identity](/knowledge/concepts/entity-identity/) and [Provenance](/knowledge/concepts/provenance/).

## Related programs and projects

See [VASTE](/programs/vaste/) and [V6](/projects/v6/).

## Glossary

Hierarchy: a structure where items are organized through parent-child containment.

Node: an addressable entity in a graph.

Edge: a relationship between nodes.

Predicate: the type or meaning of a graph relation.

Projection: a view generated from an underlying model.

Path query: a query that follows a sequence of relations.

## References

- W3C. RDF 1.1 Concepts and Abstract Syntax.
- CIDOC CRM Special Interest Group. The CIDOC Conceptual Reference Model.
