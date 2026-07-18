---
id: ea:publication:browser-as-a-local-first-voice-studio-fr
type: publication
translationOf: ea:publication:browser-as-a-local-first-voice-studio
slug: { canonical: browser-as-a-local-first-voice-studio }
title: Le navigateur comme studio vocal local-first
subtitle: Capacités, stockage et dégradation progressive
abstract: Le navigateur peut accueillir une capture vocale sérieuse lorsque microphone, traitement audio, workers, persistance locale, exports ouverts et limites de capacités forment un seul système.
description: L’architecture browser-native de Voice Capture Studio et son modèle de vie privée local-first.
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
  - id: ea:concept:browser-software
  - id: ea:concept:open-source
  - id: ea:concept:web-audio
  - id: ea:concept:machine-learning-workflows
  - id: ea:program:vaste
  - id: ea:technology:web-audio-api
  - id: ea:technology:webnn
claims:
  - Un logiciel navigateur local-first doit exposer durabilité et chemins d’export au lieu d’assimiler stockage local et stockage permanent.
  - La dégradation progressive doit préserver la capture et isoler les fonctions optionnelles.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:artefact:voice-capture-studio-repository }]
sources:
  - { title: Manifeste d’ingénierie browser-native, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/browser-native-engineering-manifesto.md" }
  - { title: Web Audio API 1.1, publisher: W3C, accessedAt: "2026-07-18", url: "https://www.w3.org/TR/webaudio/" }
citation: { preferred: 'Electronic Artefacts. « Le navigateur comme studio vocal local-first ». Article technique, 2026.' }
tags: [Logiciel navigateur, Local First, Web Audio, IndexedDB, open source]
disciplines: [architecture web, ingénierie audio, ingénierie logicielle]
---

## Problème

Un studio navigateur n’imite pas une station audio native. Il organise les forces du web : microphone sous permission, distribution immédiate, calcul local, stockage structuré, téléchargements explicites et code inspectable.

[Voice Capture Studio](/fr/projects/voice-capture-studio/) garde les voix dans le stockage navigateur, un dossier choisi ou un export explicite tant que l’opérateur ne décide pas d’une autre destination.

## Architecture

Le produit vérifie microphone, traitement audio, stockage persistant, dossiers, workers, wake lock et inférence optionnelle. L’absence de File System Access mène au téléchargement. L’absence d’ASR retire une hypothèse, pas la capture. Un runtime contraint réduit la profondeur d’analyse tout en conservant une vérification indépendante.

## Mise en œuvre

L’[Audio web](/fr/knowledge/concepts/web-audio/) fournit le graphe de signal ; AudioWorklet protège le traitement du thread d’interface. L’[API Web Audio](/fr/knowledge/technologies/web-audio-api/) alimente le feedback live, sans laisser le rendu concurrencer l’enregistreur. Décodage, transcription et packaging passent dans des workers après la capture critique.

## Local-first n’est pas permanent

Un [logiciel de navigateur](/fr/knowledge/concepts/browser-software/) peut garder la matière privée près de l’utilisateur, mais IndexedDB peut être évincé. Le produit expose donc trois chemins : workspace intégré, dossier visible et paquet téléchargeable. Une couverture dataset ne progresse pas si l’audio n’a pas atteint un stockage durable.

## Portabilité ouverte

WAV, JSON, JSONL, CSV et checksums permettent de rejoindre archives, aligneurs, systèmes de révision et [workflows de machine learning](/fr/knowledge/concepts/machine-learning-workflows/). L’[open source](/fr/knowledge/concepts/open-source/) rend le comportement inspectable ; les formats ouverts préservent le droit de partir avec un matériau utilisable.

WASM, WebGPU et [WebNN](/fr/knowledge/technologies/webnn/) étendent l’analyse locale sans rendre tous les appareils équivalents. Le manifeste doit dire ce qui a réellement tourné et conserver l’alignement navigateur comme estimation.

Cette architecture rejoint [VASTE](/fr/programs/vaste/) : découverte de capacités, autorité explicite, exécution locale bornée, traces durables et sorties portables. Local-first n’est pas un slogan sur la position des octets, mais un contrat d’autorité, de durabilité, d’échec et de sortie.

## Éléments de preuve

Le manifeste d’ingénierie browser-native et le dépôt public documentent vérification des capacités, fallbacks de stockage, frontières de workers et contrats d’export ouverts.

## Limites

APIs, durabilité du stockage, mémoire et inférence locale varient selon l’appareil. Cette architecture ne garantit ni performance de DAW native ni permanence sans action explicite.

## Références

- Voice Capture Studio. Manifeste d’ingénierie browser-native.
- W3C. Web Audio API 1.1.
