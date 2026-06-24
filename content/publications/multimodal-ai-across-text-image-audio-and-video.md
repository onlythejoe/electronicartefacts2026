---
id: ea:publication:multimodal-ai-across-text-image-audio-and-video
type: publication
slug:
  canonical: multimodal-ai-across-text-image-audio-and-video
title: Multimodal AI Across Text, Image, Audio and Video
subtitle: Technical Article
abstract: A durable guide to multimodal AI architecture, shared representations, cross-modal retrieval, generation, temporal media, provenance and creative applications.
description: Learn how multimodal AI connects text, images, audio and video, and how to evaluate cross-modal systems for creative and cultural use.
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
  - id: ea:concept:multimodal-ai
  - id: ea:concept:generative-ai
  - id: ea:concept:provenance
  - id: ea:program:oreth
  - id: ea:project:palimpsests
claims:
  - Multimodal capability depends on modality-specific encoding, alignment and evaluation rather than on a language interface alone.
  - Cultural multimodal systems should preserve the identity and provenance of each source modality.
evidence:
  - id: ea:concept:multimodal-ai
  - id: ea:program:oreth
sources:
  - title: Learning Transferable Visual Models From Natural Language Supervision
    author: Alec Radford et al.
    publisher: arXiv
    publishedAt: "2021-02-26"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2103.00020
  - title: Multimodal Foundation Models From Specialists to General-Purpose Assistants
    author: Chunyuan Li et al.
    publisher: arXiv
    publishedAt: "2023-09-18"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2309.10020
citation:
  preferred: "Electronic Artefacts. \"Multimodal AI Across Text, Image, Audio and Video.\" Technical article, version 1.0.0, 2026."
tags:
  - Multimodal AI
  - Vision Language
  - Audio AI
  - Video AI
  - Cross-Modal Retrieval
disciplines:
  - Artificial Intelligence
  - Machine Learning
  - Digital Art
  - Audio Engineering
---

## Problem

Multimodal products often imply equal understanding across media while relying mainly on language interfaces and uneven specialist components. This obscures what the system perceives, which transformations occur and where evidence is lost.

## Introduction

Human culture is multimodal. A musical release may include recordings, cover art, typography, notes, performance footage and metadata. A research archive may combine documents, photographs, diagrams, interviews and sensor measurements. A digital artwork may respond simultaneously to movement, sound and language.

Multimodal AI attempts to learn or operate across these different forms. A system may retrieve an image from a sentence, transcribe speech, describe video, generate sound from text, answer questions about a diagram or align an audio event with a visual timeline. The broad label hides many architectures and uneven capabilities.

The most important question is not whether a model accepts several file types. It is how each modality is represented, how relationships are learned, what information is lost, and how performance is evaluated. A language model wrapped around specialist tools is multimodal in a different way from an end-to-end model trained jointly on image, text and audio.

## What counts as a modality

A modality is a form through which information is represented or sensed. Text, image, audio and video are common examples, but structured tables, graphs, depth maps, motion capture, geospatial coordinates and biological signals can also be modalities.

Modalities differ in structure. Text is discrete and sequential. Images are spatial arrays. Audio is a time-varying waveform. Video combines space, time and often sound. Graphs encode entities and relations. Converting all of them into token-like units can simplify architecture but may discard domain-specific properties.

Multimodal systems need representations that preserve what matters for the task. Speech transcription can ignore some timbre while speaker identification depends on it. Image captioning can summarize a scene while art-historical analysis requires composition, material and provenance.

## Alignment

Alignment connects representations across modalities. A paired image and caption indicate that two records refer to related content. A video transcript aligns words with time. A music video may align rhythm, editing and movement more loosely.

CLIP demonstrated a scalable image-text approach by learning which captions corresponded to which images across a large paired dataset. The resulting shared representation allowed natural-language descriptions to retrieve or classify images without conventional task-specific labels.

Shared embedding spaces are powerful because they permit cross-modal search. They are also reductive. Proximity says that items are related under a learned objective, not what the relationship means. A graph can preserve explicit relations such as `depicts`, `documents`, `soundtrackOf` or `derivedFrom`.

## Architectural patterns

One pattern uses separate encoders. An image encoder and text encoder map inputs into a shared representation for retrieval or comparison. This is effective when the task is alignment rather than open-ended generation.

A second pattern adds a modality adapter to a language model. Visual or audio features are transformed into representations the language model can process. The language model becomes a reasoning and response layer, while specialist encoders handle perception.

A third pattern uses a unified token space and trains one model across many media types. This can support flexible generation but requires enormous data and computation.

A fourth pattern is tool orchestration. A language model calls speech recognition, object detection, image generation, audio analysis or video processing services and combines their results. This architecture can be more inspectable because each specialist tool has a defined function.

No pattern is universally superior. Tool composition may be easier to evaluate and replace. End-to-end models may capture interactions that modular pipelines miss.

## Architecture

A multimodal architecture combines modality encoders, alignment or fusion layers, shared representations, generative decoders, retrieval, temporal grounding and an interface that exposes source-specific observations.

## Text and image

Text-image systems support captioning, visual question answering, search, classification, editing and generation. They can make image collections more accessible and allow users to specify visual intentions through language.

Language can also dominate. A model may rely on textual cues or learned stereotypes rather than visual evidence. Small text inside images, spatial relationships and exact counting remain difficult for some systems. Generated captions often describe recognizable objects while ignoring style, power, cultural context or uncertainty.

For an archive, automatic descriptions should be treated as derived metadata. They can improve discovery but should not replace cataloguer observations or creator-supplied titles. The record should identify model, date and confidence.

## Audio and speech

Audio includes speech, music, environmental sound, noise and silence. Speech recognition maps waveforms to text, but that transformation removes information about timbre, room, rhythm and nonverbal expression. Audio classification labels events, while source separation estimates component signals. Music models may generate or transform sound from text, notation or examples.

Machine listening depends on representation. Spectrograms turn time-domain audio into time-frequency images. Learned audio embeddings can support similarity search. Event detectors segment transients or patterns. Each representation foregrounds some properties and suppresses others.

ORETH provides an Electronic Artefacts context for this work. The program treats sound as material and evidence. A multimodal system could connect an audio segment to a spectrogram, analysis note, visual reference and Palimpsests project record. It should preserve the difference between automated measurement and artistic interpretation.

## Video and time

Video is not simply a sequence of independent images. Meaning depends on movement, duration, editing, causality and sound. Sampling a few frames can miss brief events or reverse temporal relationships. Processing every frame can exceed context and compute budgets.

Video systems often combine frame selection, visual encoding, speech transcription and temporal aggregation. Queries may require locating an event, summarizing a sequence or connecting dialogue with action.

For cultural archives, timecodes are essential provenance. A generated summary should link back to exact intervals. Motion, music and typography may form one composition that cannot be understood from isolated frames.

## Multimodal generation

Generative systems can translate between modalities: text to image, image to video, text to speech, audio to notation or gesture to sound. They can also transform within one modality under guidance from another.

The creative value is not limited to automatic output. Cross-modal models can become instruments for exploring correspondences. An artist may navigate images through sound descriptors, generate motion from a musical structure or use text to control a procedural visual system.

Control is a central challenge. Prompt language may not express exact timing, composition or material behavior. Reference inputs, masks, timelines, graphs and parameter controls can make the system more editable. A creative tool should allow iteration and selection rather than presenting generation as one-click completion.

## Datasets and cultural representation

Multimodal models depend on paired or aligned data. Captions may be noisy, culturally narrow or optimized for search rather than interpretation. Web-scale datasets reproduce uneven visibility and rights conditions. Audio datasets may overrepresent speech and commercial music while neglecting local sound cultures.

Dataset documentation should state source, collection method, filtering, language, consent and known gaps. When full disclosure is unavailable, downstream users should avoid claims of neutrality.

For Electronic Artefacts, provenance is a design requirement. If a system generates a visual from archive material or aligns a sound with external references, the process should record inputs, model context and editorial decisions.

## Evaluation by modality

A multimodal system needs more than one aggregate score. Evaluate perception within each modality, alignment between modalities and the final task.

For image question answering, test whether the answer depends on visual evidence rather than prompt priors. For audio retrieval, test event localization and false matches. For video, test temporal order and timecode accuracy. For generation, evaluate controllability, consistency, rights and editability.

Cross-modal failure cases are particularly important. What happens when text contradicts the image? Does a transcript overwhelm an audio cue? Does a visual reference change the meaning of an ambiguous prompt? A robust system should expose conflict rather than silently choosing the easiest modality.

Human evaluation remains necessary for cultural and creative tasks. Technical similarity may not capture symbolism, historical context or aesthetic coherence.

## Interfaces

Multimodal interfaces should show what the system perceived. A user needs to inspect selected frames, transcript segments, audio intervals or retrieved images. Hidden preprocessing makes correction difficult.

Timeline interfaces work well for audio and video. Spatial overlays help images. Graph views can connect media records to concepts and sources. Text remains useful for commands and explanation, but it should not become the only visible representation.

Accessibility can improve when modalities reinforce one another: captions for audio, descriptions for images, transcripts for video and sonification for data. Generated accessibility content still needs review, especially for names and culturally specific material.

## Knowledge systems

Multimodal archives need stable identities for original files, derivatives, segments and descriptions. A transcript should link to its recording. A frame should link to its video and timestamp. An embedding should be treated as a derived index rather than the primary record.

Knowledge graphs are well suited to this compound structure. They can express that an image documents a project, an audio segment was analyzed by ORETH, a publication interprets a motif and a generated artefact derives from several sources.

RAG systems can then retrieve across modalities. A text query can select audio segments and images, while the answer cites their canonical records.

## Electronic Artefacts applications

Palimpsests is already multimodal by design. It combines music, visual language, memory, research and archival traces. AI could support discovery and transformation, but the project should not be reduced to model output.

ORETH can provide machine-listening methods and audio-derived observations. VASTE can model identities, permissions and relations across media. The Knowledge Hub can explain the concepts and preserve citations. Together they form a stronger architecture than an isolated multimodal demo.

Potential applications include a compound album explorer, cross-modal archive search, real-time installation, visual response to audio features and research interfaces that connect waveform evidence to cultural interpretation.

## Risks

Multimodal systems can create persuasive synthetic evidence. Generated images, voices and video may be mistaken for records. Provenance and disclosure are therefore critical.

Privacy risk increases because images and audio contain biometric, spatial and contextual information. A photograph may reveal a location; a recording may contain bystanders. Local processing can reduce exposure but does not remove consent obligations.

Automation can flatten difference. Translating every medium into text may privilege what is easy to name. Cultural systems should preserve ambiguity and sensory specificity.

## Future direction

The future is likely to combine general multimodal models with specialist tools and structured knowledge. A shared model can interpret a request, while domain systems perform precise audio analysis, graph retrieval or rendering.

The durable architecture is modular and inspectable. Each modality keeps source identity. Transformations become explicit. Human creators can intervene at meaningful points. Evaluation follows actual media properties rather than a generic AI score.

## Implementation

Choose one cross-modal task, preserve original media and time or spatial locators, test each modality separately, then test alignment. Store generated descriptions and embeddings as derived records with model and version metadata.

## Evidence

CLIP demonstrates scalable image-text alignment through paired supervision. Multimodal foundation-model research documents the progression from specialist encoders toward general assistants while retaining modality-specific challenges.

## Limitations

The field changes rapidly and no single architecture covers every medium equally. Audio, video and cultural interpretation require domain-specific evaluation beyond generic image-text benchmarks.

## Related concepts

Read [Multimodal AI](/knowledge/concepts/multimodal-ai/), [Generative AI](/knowledge/concepts/generative-ai/), [Provenance](/knowledge/concepts/provenance/) and [Signal Archaeology](/knowledge/concepts/signal-archaeology/).

## Related programs and projects

See [ORETH](/programs/oreth/) and [Palimpsests](/projects/palimpsests/).

## Glossary

Modality: a form of represented or sensed information.

Alignment: learned or explicit correspondence between modalities.

Encoder: a model component that transforms input into a representation.

Cross-modal retrieval: searching one modality with a query from another.

Temporal grounding: linking an interpretation to a specific time interval.

## References

- Radford et al. Learning Transferable Visual Models From Natural Language Supervision. 2021.
- Li et al. Multimodal Foundation Models. 2023.
