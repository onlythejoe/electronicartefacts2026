---
id: ea:concept:multimodal-ai
type: concept
slug:
  canonical: multimodal-ai
title: Multimodal AI
definition: Multimodal AI describes systems that learn from, align, transform or generate more than one modality such as text, image, audio, video, sensor data or structured records.
abstract: Multimodal AI connects representation learning, modality encoders, shared embedding spaces, generation, alignment and cross-modal interfaces.
description: A canonical definition of multimodal AI for creative systems, archives and machine perception.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Text and image
  - Audio and speech
  - Video and time
  - Shared representations
  - Cross-modal retrieval
  - Multimodal generation
exclusions:
  - A page that merely places unrelated media formats beside one another
  - Assuming that competence in one modality transfers equally to all others
claims:
  - Multimodal systems depend on how modalities are encoded, aligned and evaluated.
  - Cross-modal interfaces create new creative possibilities and new provenance risks.
sources:
  - title: Learning Transferable Visual Models From Natural Language Supervision
    author: Alec Radford et al.
    publisher: arXiv
    publishedAt: "2021-02-26"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2103.00020
tags:
  - Multimodal AI
  - Vision Language
  - Audio
  - Video
  - Cross-Modal Retrieval
disciplines:
  - Artificial Intelligence
  - Machine Learning
  - Digital Art
  - Audio Engineering
---

## Definition

Multimodal AI processes relationships across different forms of data. A model may connect an image with a caption, speech with text, video with temporal descriptions, or audio with visual and metadata records.

## Architecture

Systems may use separate encoders for each modality, a shared representation space, a language model as an orchestration layer, or an end-to-end architecture. The integration method determines what relationships the system can learn.

## Creative use

Applications include image search from language, audio description, video indexing, generative storyboards, performance systems, accessibility interfaces and compound archives.

## Electronic Artefacts position

ORETH and Palimpsests make multimodal structure concrete: sound, images, notes, analyses and provenance form one compound record. A multimodal system should preserve those distinctions rather than flattening every input into an opaque embedding.

## Limitations

Performance can be uneven across modalities. Text may dominate a nominally visual system, temporal structure may be lost, and generated outputs may obscure their sources. Evaluation must test each modality and cross-modal task independently.

## References

See CLIP, Generative AI, Signal Archaeology, ORETH and Palimpsests.
