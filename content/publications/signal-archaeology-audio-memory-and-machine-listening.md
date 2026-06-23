---
id: ea:publication:signal-archaeology-audio-memory-and-machine-listening
type: publication
slug:
  canonical: signal-archaeology-audio-memory-and-machine-listening
title: Signal Archaeology, Audio Memory and Machine Listening
subtitle: Technical Article
abstract: This article explains signal archaeology as a way to read sonic and technical traces through audio analysis, provenance, memory and machine listening.
description: A technical article on signal archaeology, audio memory, machine listening, ORETH and Palimpsests.
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
  - id: ea:concept:signal-archaeology
  - id: ea:concept:provenance
  - id: ea:concept:digital-preservation
  - id: ea:program:oreth
  - id: ea:project:palimpsests
claims:
  - Technical residue can become cultural evidence when interpreted with provenance and context.
  - Machine listening can support signal archaeology, but it cannot replace human and archival interpretation.
evidence:
  - id: ea:program:oreth
  - id: ea:project:palimpsests
sources:
  - title: PROV-Overview
    publisher: W3C
    publishedAt: "2013-04-30"
    accessedAt: "2026-06-23"
    url: https://www.w3.org/TR/prov-overview/
  - title: Digital Preservation Handbook
    publisher: Digital Preservation Coalition
    publishedAt: "2015-01-01"
    accessedAt: "2026-06-23"
    url: https://www.dpconline.org/handbook
citation:
  preferred: "Electronic Artefacts. \"Signal Archaeology, Audio Memory and Machine Listening.\" Technical article, version 1.0.0, 2026."
tags:
  - Signal Archaeology
  - Audio
  - Machine Listening
  - ORETH
  - Palimpsests
disciplines:
  - Audio Engineering
  - Sound Design
  - Digital Art
  - Archives
  - Research Methods
---

## Problem

Digital audio carries more than audible content. It carries traces of rooms, microphones, conversion, compression, editing, noise reduction, saturation, resampling, plugins, clipping, export settings, file naming and archival decisions. Some traces are audible. Some are visible only through analysis. Some survive as metadata. Some are lost and must be inferred cautiously.

The problem is that these traces are often ignored. Music platforms privilege final tracks. Production systems privilege project files. Archives privilege description. Machine-learning systems privilege features. Signal archaeology asks how those layers can be interpreted together without pretending that analysis alone proves history.

## Introduction

Signal archaeology is the interpretation of technical, sonic, visual or archival traces as evidence of hidden processes, transformations and histories. In audio, it studies residue: noise floors, spectral fingerprints, repeated motifs, compression artifacts, edits, room tones and production marks.

Machine listening can support this work by extracting features, detecting events and comparing patterns. But signal archaeology is not the same as automated classification. A model can detect similarity; it cannot by itself explain cultural significance.

## Context

ORETH gives Electronic Artefacts a program for machine listening, audio analysis and experimental production. Palimpsests gives the work a cultural frame around memory, inheritance and transmission. Digital Preservation and Provenance provide the archival discipline needed to keep interpretations honest.

The connection matters because audio is both material and memory. A sound can be a work, a sample, a signal, a trace of process and an archival object.

## History

Listening has always included inference. Engineers hear rooms, microphones and distortion. Musicians hear references, performance habits and production eras. Archivists read carriers, labels, catalogues and provenance.

Digital tools changed the scale and visibility of that inference. Spectrograms, waveform editors, metadata readers and machine-learning tools reveal patterns that are difficult to perceive directly. But they also create a risk: the visual or statistical representation can feel more certain than it is.

Signal archaeology sits between listening, analysis and archive practice. It treats technical evidence as meaningful, but it requires provenance before making strong claims.

## Core concepts

Signal: measurable or perceptible information carried by sound or media.

Residue: a trace left by process, material or transformation.

Noise floor: background energy that may reveal recording or processing conditions.

Feature: a measurable property extracted from audio.

Provenance: source and transformation context.

Interpretation: a claim made from evidence, context and judgment.

## Architecture

A signal archaeology workflow needs:

- audio objects with stable identity;
- preservation files and access copies;
- metadata and provenance records;
- analysis outputs;
- human listening notes;
- relation statements connecting audio to projects, concepts and publications;
- confidence levels for claims.

The graph matters because interpretation is relational. An audio fragment may relate to a project, an artist, a production session, a concept, a source file, a publication and a preservation decision.

## Implementation

Implementation can begin with simple practices. Preserve the original file when possible. Record source, date, project and rights. Generate access copies separately. Add notes about processing and uncertainty. Use analysis tools to inspect spectral or temporal features. Connect the artefact to concepts such as signal archaeology, digital preservation and provenance.

Machine listening should be used as support. It can suggest events, clusters, similarities or anomalies. Those results should be published only with context and confidence.

## Practical applications

For ORETH, signal archaeology can guide machine-listening prototypes and audio research notes.

For Palimpsests, it can explain how memory and residue operate as sonic material.

For a cultural archive, it can help preserve not only final media but also interpretive context.

For music production, it can help creators understand how processing histories shape sound.

## Tools

Useful tools include waveform editors, spectrograms, metadata readers, checksum tools, Python audio libraries, annotation systems, listening notes, file inventories and graph records.

## Evidence

Electronic Artefacts already connects ORETH, Palimpsests, provenance and digital preservation as public graph entities. This article makes that relation explicit and gives future audio artefacts a conceptual home.

## Listening protocol

A signal archaeology workflow should combine listening, documentation and analysis.

Begin with ordinary listening. Note perceptual features before opening analysis tools: density, space, distortion, repetition, silence, noise, cuts, transitions and emotional pacing.

Then inspect the object. Record file format, duration, channels, sample rate, bit depth, loudness, metadata and naming context. None of these details explain the work alone, but they can reveal production and preservation conditions.

Next, use visual or computational analysis. A spectrogram may reveal energy bands, dropouts, edits or noise. Feature extraction may suggest similarity or segmentation. These outputs should be treated as evidence to interpret, not as final truth.

Finally, connect the record. Link the audio object to its project, program, concepts, sources and preservation state. A trace becomes more useful when it enters the graph.

## Common mistakes

The first mistake is forensic overconfidence. A spectral mark can suggest a process, but it rarely proves intention by itself.

The second mistake is treating machine listening as neutral. Feature extraction depends on models, parameters and assumptions. A system trained for music information retrieval may not understand artistic noise, silence or intentional degradation.

The third mistake is separating analysis from memory. In Palimpsests, residue is not only technical. It is part of the conceptual structure of the work. The archive should preserve that interpretive layer.

## Electronic Artefacts implications

ORETH can become the methodological home for machine listening and audio research. Palimpsests can become the cultural home for memory, residue and transmission. Signal archaeology is the bridge: it lets the site discuss technical analysis without losing artistic context.

This is also valuable for SEO and AI retrieval. Many audio articles online are either production tutorials or reviews. A sourced reference article about signal archaeology, machine listening and digital preservation can occupy a more durable research niche.

## Future work

Future Knowledge Hub entries should cover spectrogram reading, audio feature extraction, metadata for audio archives, sampling as memory, compression artefacts, restoration ethics, room tone, noise floors and the preservation of project files.

## Editorial standard

Claims about audio traces should be labeled carefully. Use observed when a trace is visible or audible. Use validated only when independent evidence supports the interpretation. Use speculative when the trace suggests a possibility but the source context is incomplete.

## Publication pattern

A public signal archaeology entry should separate object description, technical observation and interpretation. Object description identifies the file, source, project, date, format and preservation state. Technical observation records what can be heard, measured or seen: edits, noise, spectral shapes, metadata, repeated fragments, level changes or compression marks. Interpretation explains what those traces might mean in relation to a work, archive, production process or cultural memory.

This separation protects the reader. It lets a future researcher reuse the observations even if they disagree with the interpretation. It also makes the Knowledge Hub more useful for AI retrieval, because entities, claims and confidence levels are easier to extract when the article does not collapse evidence and meaning into one paragraph.

For Electronic Artefacts, this pattern can be applied to ORETH notes, Palimpsests materials, audio experiments and future archives. Each signal record can become a small node in a larger graph of projects, programs, tools, traces and concepts.

## Related concepts

Read [Signal Archaeology](/knowledge/concepts/signal-archaeology/), [Provenance](/knowledge/concepts/provenance/), [Digital Preservation](/knowledge/concepts/digital-preservation/), [ORETH](/programs/oreth/) and [Palimpsests](/projects/palimpsests/).

## Suggested reading

Start with the PROV family of documents for provenance and the Digital Preservation Handbook for preservation practice. Then inspect audio analysis methods in the context of actual listening and archive records.

## Related articles

Continue with [Digital Preservation and Living Archives](/publications/digital-preservation-and-living-archives/) and [Generative Systems, Cybernetics and Creative Coding](/publications/generative-systems-cybernetics-and-creative-coding/).

## Glossary

Machine listening: computational analysis of audio signals.

Spectrogram: visual representation of frequency content over time.

Residue: process trace that remains in a signal or record.

Provenance: information about origin, custody and transformation.

## Limitations

Signal archaeology can over-interpret. A compression artifact may indicate an export path, but it does not necessarily reveal intention. A repeated motif may suggest memory, but interpretation needs context.

The strongest practice is layered: preserve files, document provenance, analyze signals, listen carefully and publish claims with confidence levels.

## References

- W3C. PROV-Overview. 2013.
- Digital Preservation Coalition. Digital Preservation Handbook, 2nd Edition.
- Electronic Artefacts. ORETH and Palimpsests records.
