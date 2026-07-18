---
id: ea:publication:local-lexical-segmentation-for-speech-and-song-fr
type: publication
translationOf: ea:publication:local-lexical-segmentation-for-speech-and-song
slug: { canonical: local-lexical-segmentation-for-speech-and-song }
title: Découper localement la parole et le chant, mot par mot
subtitle: Analyse adaptative sans téléversement distant
abstract: La segmentation lexicale locale combine décodage borné, activité vocale, hypothèses adaptatives et consensus temporel tout en conservant l’audio original comme preuve.
description: Le pipeline lexical de Voice Capture Studio pour voix parlée, chant et médias mixtes.
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
  - id: ea:concept:voice-technology
  - id: ea:concept:web-audio
  - id: ea:concept:multimodal-ai
  - id: ea:concept:signal-archaeology
  - id: ea:program:oreth
  - id: ea:technology:web-audio-api
claims:
  - Les clips lexicaux doivent provenir de la source décodée intacte même lorsque des signaux dérivés aident la transcription.
  - Un budget adaptatif doit conserver une vérification indépendante sur les appareils contraints.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:artefact:voice-capture-studio-repository }]
sources:
  - { title: Audit des technologies de capture, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md" }
  - { title: ONNX Runtime Web Execution Providers, publisher: Microsoft, accessedAt: "2026-07-18", url: "https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html" }
citation: { preferred: 'Electronic Artefacts. « Découper localement la parole et le chant, mot par mot ». Article technique, 2026.' }
tags: [Segmentation lexicale, IA locale, Chant, Whisper, Preuve audio]
disciplines: [ingénierie audio, apprentissage automatique, développement web]
---

## Problème

La segmentation lexicale transforme un audio ou une vidéo locale en extraits mot à mot avec timecodes et preuves. Une simple transcription suivie de coupes échoue vite sur chant, musique, réverbération, silences ambigus et appareils contraints.

Le mode de [Voice Capture Studio](/fr/projects/voice-capture-studio/) traite la découpe comme un pipeline de preuves. Les pixels vidéo sont ignorés ; seule la piste audio décodée entre dans l’analyse. La taille et la durée sont contrôlées avant le décodage complet.

## Architecture

Une première hypothèse locale et une activité vocale indépendante classent la scène. Une parole claire peut s’arrêter après une passe. Chant, musique et voix difficile justifient une vérification plus forte et des signaux vocal-focus. Le budget suit la performance mesurée sur la source réelle, pas une supposition liée au navigateur.

## Mise en œuvre

Résidu mid/side, accentuation vocale ou référence de salle peuvent aider le modèle et introduire des artefacts. Ils proposent ou vérifient donc les limites, tandis que les clips exportés viennent de la source intacte. Ce choix relie [technologie vocale](/fr/knowledge/concepts/voice-technology/) et [archéologie du signal](/fr/knowledge/concepts/signal-archaeology/).

## Parole et chant

Un VAD de parole interprète mal voyelles tenues, silences instrumentaux et phrasé mélodique. Le pipeline fusionne activité de parole et soutien vocal continu sans prétendre que le chant est simplement de la parole. Dans un conteneur vidéo, cette restriction explicite relève aussi de l’[IA multimodale](/fr/knowledge/concepts/multimodal-ai/) : le mode choisit d’étudier le son.

## Consensus et export

Le consensus temporel rapproche variantes lexicales, récupère les omissions soutenues par plusieurs passes et rejette les propositions isolées. Chaque mot garde début, fin, hypothèses sources, confiance et révision. Le ZIP contient WAV mono, JSON et CSV ; le manifeste décrit scène, budget, modèles, signaux, masque vocal, consensus et performance observée.

L’[Audio web](/fr/knowledge/concepts/web-audio/) et son [API](/fr/knowledge/technologies/web-audio-api/) assurent décodage et accès au signal ; workers et inférence locale protègent l’interface. [ORETH](/fr/programs/oreth/) donne le cadre de recherche : relier média, activité vocale, hypothèses lexicales, temps source et preuve exportée.

## Éléments de preuve

L’audit des technologies de capture documente classifieur de scène, budget adaptatif, règles de consensus et champs de manifeste utilisés par l’implémentation.

## Limites

La transcription locale dépend de l’appareil, le chant reste plus difficile que la parole claire et les limites de mots exigent une révision lorsque les hypothèses indépendantes divergent.

## Références

- Voice Capture Studio. Audit des technologies de capture.
- ONNX Runtime. Guide des fournisseurs d’exécution web.
