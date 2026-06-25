---
id: ea:concept:retrieval-augmented-generation-fr
type: concept
slug:
  canonical: retrieval-augmented-generation
title: Génération augmentée par récupération
alternateNames:
  - RAG
definition: Retrieval-augmented generation est un architecture that retrieves
  external information at query time et supplies selected evidence à a
  generative modèle before ou during response production.
abstract: RAG relie search, embeddings, document segmentation, métadonnées,
  provenance, context assembly, language modèles et answer evaluation.
description: A canonical definition de retrieval-augmented generation pour
  systèmes de connaissance et source-grounded AI.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.0.0
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-06-25
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Information retrieval
  - Embeddings et indexes
  - Context assembly
  - Source grounding
  - Citation
  - Evaluation
exclusions:
  - Adding an entire uncontrolled document dump à a prompt
  - Assuming retrieval guarantees that generated claims sont supported
claims:
  - RAG separates updonnéesble external knowledge from modèle parameters.
  - Retrieval quality, chunk design, métadonnées et answer attribution determine
    système reliability.
sources:
  - title: Retrieval-Augmented Generation pour Knowledge-Intensive NLP Tasks
    author: Patrick Lewis et al.
    publisher: arXiv
    publishedAt: 2020-05-22
    accessedAt: 2026-06-24
    url: https://arxiv.org/abs/2005.11401
tags:
  - RAG
  - Retrieval
  - Embeddings
  - Vector Search
  - Grounding
disciplines:
  - Intelligence artificielle
  - Systèmes de connaissance
  - Information Architecture
  - Machine Learning
translationOf: ea:concept:retrieval-augmented-generation
---

## Rôle

Génération augmentée par récupération est documenté ici comme une entrée française du graphe public d’Electronic Artefacts. RAG relie search, embeddings, document segmentation, métadonnées, provenance, context assembly, language modèles et answer evaluation.

## Usage

Cette notion sert à relier les projets, publications et technologies qui partagent un même vocabulaire de conception. Retrieval-augmented generation est un architecture that retrieves external information at query time et supplies selected evidence à a generative modèle before ou during response production.

## Domaines

Cette entrée croise notamment les domaines suivants : Intelligence artificielle, Systèmes de connaissance, Information Architecture, Machine Learning.

## Références

Les références principales restent les sources indiquées dans la fiche canonique, notamment Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.
