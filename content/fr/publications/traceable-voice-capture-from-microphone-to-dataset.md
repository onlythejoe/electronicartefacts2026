---
id: ea:publication:traceable-voice-capture-from-microphone-to-dataset-fr
type: publication
translationOf: ea:publication:traceable-voice-capture-from-microphone-to-dataset
slug: { canonical: traceable-voice-capture-from-microphone-to-dataset }
title: Du microphone au dataset, anatomie d’une prise vocale traçable
subtitle: Capture, provenance et paquets ouverts
abstract: Une prise devient une donnée réutilisable lorsque son audio brut, son prompt, son contexte, ses observations, sa révision, sa persistance et son manifeste restent reliés.
description: Le pipeline Voice Capture Studio, de la capture PCM au paquet dataset local et vérifiable.
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version: { version: 1.0.0, createdAt: "2026-07-18", publishedAt: "2026-07-18", modifiedAt: "2026-07-18" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:project:voice-capture-studio
  - id: ea:concept:speech-recording
  - id: ea:concept:speech-datasets
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:machine-learning-workflows
  - id: ea:concept:digital-preservation
claims:
  - Un dataset vocal commence au moment de la capture, pas au début de l’entraînement.
  - Audio brut immuable et artefacts dérivés explicites doivent coexister dans un paquet avec provenance.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:artefact:voice-capture-studio-repository }]
sources:
  - { title: Audit des technologies de capture, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md" }
  - { title: Structure d’export Voice Capture Studio, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md" }
citation: { preferred: 'Electronic Artefacts. « Du microphone au dataset, anatomie d’une prise vocale traçable ». Article technique, 2026.' }
tags: [dataset vocal, Provenance, PCM, métadonnées, Local First]
disciplines: [ingénierie audio, ingénierie des données, apprentissage automatique]
---

## Problème

Un WAV peut conserver le son tout en perdant les conditions qui le rendent utile : prompt, version du corpus, locuteur, salle, révision, origine du transcript, stockage et checksum. [Voice Capture Studio](/fr/projects/voice-capture-studio/) traite donc l’outil d’enregistrement comme une partie de la méthode dataset.

## Architecture

Le navigateur établit d’abord microphone, stockage, workers et accès fichier. L’absence d’une fonction optionnelle ne doit dégrader que le parcours concerné. Une mesure de room tone reste séparée du flux vocal optimisé afin de ne pas confondre ambiance brute et traitement navigateur.

## Mise en œuvre

Le WAV PCM canonique n’est jamais écrasé. Un signal vocal dérivé peut aider l’inspection ou l’ASR, mais ses paramètres, son hash source et son hash dérivé accompagnent le résultat. Cette règle relie l’[enregistrement vocal](/fr/knowledge/concepts/speech-recording/) à la [préservation numérique](/fr/knowledge/concepts/digital-preservation/).

## Observations séparées

Le corpus déclare texte, langue et intention. Le signal fournit mesures acoustiques, silences et activité vocale. L’ASR navigateur reste une hypothèse optionnelle. L’alignement mot-phonème reste estimé jusqu’à une preuve acoustique plus forte. Les décisions finales citent ces observations au lieu de les fusionner dans un résultat opaque.

## Révision et persistance

Une prise ne fait progresser le dataset que lorsqu’elle est acceptée et stockée durablement. IndexedDB, dossier choisi et téléchargement explicite forment trois chemins visibles. Le statut keeper, la raison de rejet, le rapport qualité et le stockage appartiennent aux [métadonnées](/fr/knowledge/concepts/metadata/).

## Paquet ouvert

L’export relie session, locuteur et corpus aux WAV, transcripts, timings, phonèmes, intentions, observations, rapports, checksums et manifeste JSONL. La [provenance](/fr/knowledge/concepts/provenance/) permet à un outil en aval de choisir source brute ou dérivée, de voir ce qui reste estimé et de vérifier l’intégrité.

Voice Capture Studio prépare la matière pour les [workflows de machine learning](/fr/knowledge/concepts/machine-learning-workflows/) ; il n’entraîne ni ne certifie un modèle. La question [Comment rendre les datasets vocaux reproductibles, structurés et privacy-first ?](/fr/research/questions/speech-dataset-reproducibility/) documente cette frontière comme recherche active.

## Éléments de preuve

Le dépôt expose l’audit des technologies de capture, les contrats d’export et les tests qui séparent artefacts bruts et dérivés.

## Limites

Le stockage navigateur n’est pas automatiquement permanent, l’alignement local reste préparatoire et un paquet structuré exige encore consentement, révision et évaluation aval.

## Références

- Voice Capture Studio. Audit des technologies de capture.
- Voice Capture Studio. Structure d’export.
