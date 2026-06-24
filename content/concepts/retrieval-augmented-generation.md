---
id: ea:concept:retrieval-augmented-generation
type: concept
slug:
  canonical: retrieval-augmented-generation
title: Retrieval-Augmented Generation
alternateNames:
  - RAG
definition: Retrieval-augmented generation is an architecture that retrieves external information at query time and supplies selected evidence to a generative model before or during response production.
abstract: RAG connects search, embeddings, document segmentation, metadata, provenance, context assembly, language models and answer evaluation.
description: A canonical definition of retrieval-augmented generation for knowledge systems and source-grounded AI.
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
  - Information retrieval
  - Embeddings and indexes
  - Context assembly
  - Source grounding
  - Citation
  - Evaluation
exclusions:
  - Adding an entire uncontrolled document dump to a prompt
  - Assuming retrieval guarantees that generated claims are supported
claims:
  - RAG separates updatable external knowledge from model parameters.
  - Retrieval quality, chunk design, metadata and answer attribution determine system reliability.
sources:
  - title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
    author: Patrick Lewis et al.
    publisher: arXiv
    publishedAt: "2020-05-22"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2005.11401
tags:
  - RAG
  - Retrieval
  - Embeddings
  - Vector Search
  - Grounding
disciplines:
  - Artificial Intelligence
  - Knowledge Systems
  - Information Architecture
  - Machine Learning
---

## Definition

Retrieval-augmented generation combines a retriever with a generative model. The retriever selects passages, records or graph neighborhoods relevant to a request. The model receives that material as context and produces a response.

## Architecture

A practical system includes ingestion, segmentation, metadata, indexing, query transformation, retrieval, ranking, context assembly, generation, citation and evaluation. Each stage can fail independently.

## Knowledge graph role

Vector similarity can find semantically related passages, while graph relations can preserve identity, type, provenance and explicit paths. Hybrid retrieval can use both rather than treating embeddings as a replacement for structured knowledge.

## Electronic Artefacts position

The Knowledge Hub can provide high-quality retrieval material because its pages expose stable entities, sources, confidence labels and relations. Future RAG systems should cite canonical records and retain the distinction between retrieved evidence and generated synthesis.

## Limitations

Retrieved passages may be irrelevant, outdated, inaccessible or misleading. A model can ignore evidence or attach a citation to an unsupported claim. Evaluation must test retrieval recall, source precision, faithfulness and answer usefulness separately.

## References

See Lewis et al., Knowledge Graph, Metadata, Provenance and Large Language Model.
