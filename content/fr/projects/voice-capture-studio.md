---
id: ea:project:voice-capture-studio-fr
type: project
translationOf: ea:project:voice-capture-studio
slug:
  canonical: voice-capture-studio
title: Voice Capture Studio
subtitle: Studio d’enregistrement vocal local-first
abstract: Voice Capture Studio est une application open source de navigateur pour l’enregistrement vocal dirigé, la révision locale et l’export de voix structurée.
description: Un studio d’enregistrement local-first pour datasets vocaux, voix off et doublage, construit comme une application de navigateur open source avec exports WAV et métadonnées structurées.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: development
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-09"
  changeSummary: Intégration publique initiale du projet open source Voice Capture Studio.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: internal
brief: Standardiser l’enregistrement professionnel de parole dans le navigateur afin d’exporter des voix propres, révisables et accompagnées des métadonnées utiles aux workflows en aval.
context: Les données vocales sont souvent capturées avec des outils improvisés, des dossiers peu structurés et un contexte incomplet. Cela fragilise révision, consentement, contrôle qualité, doublage et préparation de datasets avant même tout workflow de modèle ou d’archive.
stakeholders:
  - id: ea:organization:electronic-artefacts
constraints:
  - Garder les enregistrements et workspaces locaux au navigateur et aux dossiers choisis par l’utilisateur.
  - Rendre visibles les permissions micro, la durabilité du stockage et les chemins d’export avant l’enregistrement.
  - Préserver la frontière entre préparation de dataset et entraînement de modèle.
  - Utiliser des formats ouverts et une documentation lisible hors de l’application.
  - Maintenir une application déployable comme surface statique GitHub Pages.
approach:
  - Construire une interface de capture autour de sessions guidées, du choix de langue, de profils locuteurs et de la révision des prises.
  - Capturer l’audio local via Web Audio, puis exporter WAV et JSON pour une révision structurée.
  - Traiter les états keeper, review et reject comme partie de la couverture du corpus.
  - Séparer l’orchestration React des domaines corpus, sessions, workspace, recording, export et settings.
  - Publier le code, la documentation, les modèles d’issues et le workflow GitHub Pages comme base open source.
outputs:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
outcomes:
  - Une application GitHub Pages live pour capturer la parole localement dans un navigateur sécurisé.
  - Un dépôt open source documenté avec notes d’architecture, de corpus, de workspace et d’export.
  - Un modèle d’export structuré pour WAV, transcriptions, timing, intentions, rapports qualité et manifestes.
  - Un workflow privacy-first où les enregistrements utilisateurs ne sont pas envoyés à un service distant par le site.
evidence:
  - id: ea:artefact:voice-capture-studio-repository
credits:
  - id: ea:organization:electronic-artefacts
media:
  - id: voice-capture-studio-capture-screen-fr
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-capture.png
    alt: Écran live de capture Voice Capture Studio montrant les modes Dataset ML, Doublage et Master audio.
    caption: Écran live GitHub Pages avec stockage navigateur local, modes de capture et état de calibration.
  - id: voice-capture-studio-quality-screen-fr
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-live.png
    alt: Écran qualité et exports de Voice Capture Studio.
    caption: Écran qualité et exports montrant progression locale, version du corpus et contrôles de préparation dataset.
visualLanguage:
  - Noir
  - Ivoire
  - Graphite
  - Vert signal
  - Rouge chaud
textures:
  - Console locale
  - Forme d’onde audio
  - Calibration studio
  - Export structuré
symbols:
  - Microphone
  - Corpus
  - Prise
  - Dossier local
developmentFocus:
  - React 19
  - Vite 6
  - TypeScript
  - Web Audio API
  - Export WAV PCM
  - Workspace navigateur privé
  - File System Access API
  - GitHub Pages
marketingFocus:
  - Enregistrement local-first
  - Préparation de dataset vocal
  - Outil de navigateur open source
  - Workflow voix off
  - Workflow doublage
  - Capture privacy-first
socialLinks:
  - label: Démo live
    href: https://electronicartefacts.github.io/voice-capture-studio/
  - label: Dépôt GitHub
    href: https://github.com/electronicartefacts/voice-capture-studio
  - label: Documentation
    href: https://github.com/electronicartefacts/voice-capture-studio/tree/main/docs
sources:
  - title: Voice Capture Studio live demo
    publisher: GitHub Pages
    accessedAt: "2026-07-09"
    url: https://electronicartefacts.github.io/voice-capture-studio/
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Voice Capture Studio architecture doctrine
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md
rights: Copyright 2026 Electronic Artefacts.
license: MIT
tags:
  - Voice Capture Studio
  - enregistrement vocal
  - dataset vocal
  - logiciel de navigateur
  - Web Audio
  - open source
  - local-first
  - vie privée
disciplines:
  - ingénierie audio
  - développement web
  - interaction humain-machine
  - apprentissage automatique
  - open source
featured: true
---

## Vue d’ensemble

Voice Capture Studio est une application de navigateur local-first pour la capture vocale dirigée. Elle aide un locuteur à passer d’une session vide à des prises propres, révisables et accompagnées de transcriptions, timing, qualité et structure d’export.

L’application est disponible sur [electronicartefacts.github.io/voice-capture-studio](https://electronicartefacts.github.io/voice-capture-studio/) et le code source est public sur [github.com/electronicartefacts/voice-capture-studio](https://github.com/electronicartefacts/voice-capture-studio).

## Objectif

Le projet existe parce que la voix professionnelle est souvent enregistrée avant que le workflow soit prêt. Une prise peut sembler utilisable, mais le prompt, la langue, le locuteur, la pièce, le micro, l’état de révision, le timing et le manifeste d’export peuvent se perdre dans des dossiers informels.

Voice Capture Studio traite ces détails comme une partie de l’enregistrement. L’application prépare un matériau vocal structuré pour archives, datasets de parole, voix off, doublage et workflows de machine learning en aval.

## Ce que l’application ne fait pas

Voice Capture Studio n’entraîne pas de modèles d’IA. L’application enregistre la parole, révise les prises et exporte un matériau structuré. Tout entraînement, alignement, normalisation, traitement d’archive ou évaluation de modèle appartient à un workflow séparé avec ses propres exigences de gouvernance et de consentement.

Cette frontière compte : l’application prépare le matériau source, elle ne prétend pas être une pipeline de modèle.

## Modes d’enregistrement

L’application live expose trois modes :

- Dataset ML : phrases calibrées, progression phonétique et exports prêts pour des workflows d’entraînement.
- Doublage : texte collé ou fichier découpé en répliques enregistrables.
- Master audio : texte local, piste de référence et capture de voix séparée.

La page utilise “dataset” au sens de préparation : des enregistrements acceptés et leurs métadonnées peuvent devenir des entrées utiles, mais l’entraînement de modèle reste en aval.

## Fonctions clés

- Sessions guidées pour corpus de départ français et anglais.
- Capture micro locale dans le navigateur.
- Export WAV PCM mono 48 kHz / 24-bit lorsque le navigateur le permet.
- Calibration du silence de pièce et premiers contrôles techniques.
- Métadonnées de transcription, timing, intention, prosodie et qualité pour chaque prise acceptée.
- États keeper, review et reject pour ne faire progresser la couverture que sur le matériau accepté.
- Workspace privé du navigateur avec téléchargements explicites et export dossier lorsque possible.
- Manifest PWA et service worker pour une distribution statique sur GitHub Pages.

## Architecture

Le dépôt sépare le shell applicatif React des modules de domaine. Le shell coordonne capture navigateur, adaptateurs de stockage et orchestration d’export. Les domaines portent corpus, sessions, workspace, couverture, recording, speakers, settings et contrats d’export.

La décision importante est la direction des dépendances : les domaines n’importent pas React, l’interface navigateur, les routes ou le CSS. Cela garde les comportements de capture, de planification du corpus et d’export testables hors d’une interface unique.

## Stack technique

Voice Capture Studio est construit avec React, Vite et TypeScript. L’application utilise Web Audio pour la capture locale, le stockage navigateur pour l’état du workspace, la File System Access API lorsque disponible, le téléchargement explicite en fallback, un manifest PWA et un workflow de déploiement GitHub Pages.

La validation du dépôt vérifie formatage, linting, références TypeScript, tests unitaires et build de production.

## Philosophie de design

L’interface n’est pas un enregistreur générique. Elle fonctionne comme une petite surface de studio : choisir un mode, vérifier l’environnement, confirmer locuteur et langue, capturer la calibration, enregistrer les prises, puis exporter la session avec assez de métadonnées pour la relire plus tard.

Le design rend l’état technique visible parce qu’un logiciel local-first doit produire de la confiance. Mode de stockage, micro, support WAV, accès dossier, version du corpus et calibration font partie de l’expérience.

## Open source

Le projet est publié sous licence MIT. L’open source est important ici parce que les workflows vocaux doivent être inspectables. Une équipe qui prépare de la voix doit savoir ce qui est stocké, ce qui est exporté, ce qui n’est jamais envoyé et où se situent les frontières de données.

Le dépôt inclut contribution guidelines, signalement sécurité, modèles d’issues, modèle de pull request et documentation d’architecture, corpus, workspace, export et GitHub Pages.

## Vie privée

Les enregistrements vocaux et workspaces générés sont des données utilisateur. L’application est conçue pour que les prises restent dans le navigateur ou dans le dossier choisi par l’utilisateur. Le dépôt public doit contenir code et définitions de corpus, pas des voix privées.

Le stockage navigateur est utile, mais ce n’est pas une archive permanente. Les exports explicites et les workflows dossier sont donc des parties centrales du produit.

## Modèle d’export

La cible principale est un dossier de session de capture structuré. Le dépôt documente fichiers JSON de session, locuteur, corpus et manifeste, WAV et transcript par prise, métadonnées de timing et d’intention, rapports qualité et rapports de préparation dataset.

Chaque prise acceptée est plus qu’un fichier audio. Elle porte assez de structure pour soutenir alignement, révision, analyse de couverture ou traitement d’archive en aval.

## Documentation

Points d’entrée utiles :

- [Architecture doctrine](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md)
- [System model](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/system-model.md)
- [Corpus structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/corpus-structure.md)
- [Workspace structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/workspace-structure.md)
- [Export structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md)

## Roadmap

La roadmap publique inclut la restauration/import de workspaces sauvegardés, des migrations explicites de schéma, des tombstones de corpus pour la compatibilité longue durée, un meilleur premier parcours de sélection de dossier, des cibles d’export supplémentaires et l’automatisation des captures/release artifacts.

Ces éléments relèvent de l’infrastructure produit. Ils distinguent une application locale prometteuse d’un vrai workflow d’archive vocale.

## Projets Electronic Artefacts liés

Voice Capture Studio se situe près d’[ORETH](/fr/programs/oreth/) parce que les deux traitent l’audio comme matériau structuré. Il se relie à l’[Audio web](/fr/knowledge/concepts/web-audio/) et au [Web Audio API](/fr/knowledge/technologies/web-audio-api/) parce que le navigateur est le runtime. Il se relie à l’[open source](/fr/knowledge/concepts/open-source/) parce que code et documentation sont inspectables.

Le projet étend aussi l’écosystème Electronic Artefacts vers un artefact pratique de technologie vocale : un outil qui fait une chose clairement avant qu’une archive, un modèle, un doublage ou un workflow de production ne reçoive les données.
