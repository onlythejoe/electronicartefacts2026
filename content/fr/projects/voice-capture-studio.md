---
id: ea:project:voice-capture-studio-fr
type: project
translationOf: ea:project:voice-capture-studio
slug:
  canonical: voice-capture-studio
title: Voice Capture Studio
subtitle: Instrument vocal local-first
abstract: Voice Capture Studio est un instrument de navigateur open source et local-first pour capturer, interpréter, réviser et découper la voix au sein de cinq parcours spécialisés.
description: Un studio vocal ancré dans le signal, réunissant cinq modes de capture et segmentation, un design de verre translucide, des pipelines de preuves déterministes et des exports WAV/métadonnées ouverts.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: development
confidence: published
version:
  version: 2.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-18"
  changeSummary: Refonte du dossier depuis l’interface cinq modes livrée, la philosophie du signal, le pipeline d’observation déterministe et les contrats d’export actuels.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: internal
brief: "Transformer le navigateur en instrument vocal fiable : une surface calme pour la capture immédiate, les corpus ML, le doublage, l’interprétation avec support séparé et la découpe locale mot à mot."
context: Le travail vocal se fragmente souvent entre enregistreurs, outils de sous-titres, lecteurs média, dossiers et scripts propres aux modèles. Le son survit, mais prompt, locuteur, pièce, repère de scène, état de révision, timing, provenance et décision disparaissent.
stakeholders:
  - id: ea:organization:electronic-artefacts
constraints:
  - Garder les enregistrements et workspaces locaux au navigateur et aux dossiers choisis par l’utilisateur.
  - Rendre visibles les permissions micro, la durabilité du stockage et les chemins d’export avant l’enregistrement.
  - Préserver la frontière entre préparation de dataset et entraînement de modèle.
  - Utiliser des formats ouverts et une documentation lisible hors de l’application.
  - Maintenir une application déployable comme surface statique GitHub Pages.
  - Ne jamais présenter une animation ou une estimation navigateur comme une mesure physique.
  - Préserver la priorité de capture et la dégradation progressive sur les vrais navigateurs mobiles.
approach:
  - Organiser cinq modes visibles par résultat, avec entrées, geste de capture, critère de réussite et sortie propres.
  - Faire suivre au filament, au halo acoustique et à la waveform de révision un signal frais plutôt qu’un mouvement décoratif fondé sur le temps.
  - Conserver corpus, signal, VAD, ASR optionnel, alignement, preuves et confiance comme observations séparées avant fusion déterministe.
  - Capturer ou décoder localement, persister via stockage navigateur ou dossier choisi, puis empaqueter WAV et métadonnées inspectables.
  - Maintenir l’orchestration React hors des domaines et publier implémentation, doctrine, audits et déploiement en open source.
outputs:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
outcomes:
  - Une application GitHub Pages live pour capturer la parole localement dans un navigateur sécurisé.
  - Un dépôt open source documenté avec notes d’architecture, de corpus, de workspace et d’export.
  - Un modèle d’export structuré pour WAV, transcriptions, timing, intentions, rapports qualité et manifestes.
  - Un workflow privacy-first où les enregistrements utilisateurs ne sont pas envoyés à un service distant par le site.
  - "Cinq parcours cohérents : Capture libre, Découpe lexicale, Dataset ML, Doublage et Interprétation."
  - Un graphe d’observations déterministe qui distingue mesures physiques, estimations linguistiques, hypothèses navigateur et décisions fusionnées.
evidence:
  - id: ea:artefact:voice-capture-studio-repository
credits:
  - id: ea:organization:electronic-artefacts
media:
  - id: voice-capture-studio-lexical-screen-2026-fr
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-lexical-2026.png
    alt: Interface actuelle de Voice Capture Studio montrant les cinq modes et la console locale de découpe lexicale.
    caption: "Interface livrée en juillet 2026 : panneaux de verre blanc chaud, capsules des cinq modes et découpe lexicale locale."
  - id: voice-capture-studio-dataset-screen-2026-fr
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-dataset-2026.png
    alt: Console Dataset ML actuelle avec couverture du corpus, calibration et vérification des capacités.
    caption: Le mode Dataset maintient couverture, calibration et capacités du navigateur visibles avant la capture.
  - id: voice-capture-studio-original-signal-screen-fr
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-capture.png
    alt: Ancienne surface sombre Dataset documentant l’évolution de Voice Capture Studio vers l’instrument actuel.
    caption: Ancienne surface livrée conservée comme filiation graphique ; l’application utilise désormais le langage d’instrument blanc chaud.
visualLanguage:
  - Blanc chaud
  - Noir carbone
  - Bleu glacier
  - Rose poudré
  - Verre translucide
textures:
  - Panneaux de verre dépoli
  - Profondeur diffuse
  - Filament de signal
  - Grille instrumentale fine
  - Capsules de mode arrondies
symbols:
  - Microphone
  - Filament live
  - Halo acoustique
  - Anneau de couverture
  - Archive locale
developmentFocus:
  - React 19
  - Vite 6
  - TypeScript
  - Web Audio API
  - AudioWorklet
  - IndexedDB
  - File System Access API
  - Web Workers et WebAssembly
  - Analyse Whisper locale
  - Export WAV PCM et JSONL
  - GitHub Pages
marketingFocus:
  - Instrument vocal cinq modes
  - Expérience ancrée dans le signal
  - Pipeline de recherche déterministe
  - Traitement audio local-first
  - Provenance dataset
  - Ingénierie navigateur open source
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
    accessedAt: "2026-07-18"
    url: https://electronicartefacts.github.io/voice-capture-studio/
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Voice Capture Studio architecture doctrine
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md
  - title: Voice Capture Studio phenomenology
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/design/PHENOMENOLOGY.md
  - title: Voice Capture Studio mode experience grid
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md
  - title: Voice Capture Studio capture technology audit
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md
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
  - recherche déterministe
  - interaction humain-machine
  - pipeline audio
disciplines:
  - ingénierie audio
  - développement web
  - interaction humain-machine
  - apprentissage automatique
  - open source
featured: true
---

## Vue d’ensemble

Voice Capture Studio est un instrument vocal local-first qui fonctionne dans le navigateur. Il réunit désormais cinq workflows distincts : enregistrement immédiat, production de corpus ML, doublage à l’image, interprétation avec support séparé et découpe mot à mot d’un audio ou d’une vidéo locale.

L’application est disponible sur [electronicartefacts.github.io/voice-capture-studio](https://electronicartefacts.github.io/voice-capture-studio/) et le code source est public sur [github.com/electronicartefacts/voice-capture-studio](https://github.com/electronicartefacts/voice-capture-studio).

## L’expérience fait partie de l’instrument

L’interface actuelle est volontairement calme : blanc chaud plutôt que noir studio, typographie carbone très ample, capsules arrondies, bordures fines, focus bleu glacier, alertes rose poudré et panneaux translucides qui gardent la page légère tout en créant de la profondeur. Le glassmorphism sert ici de couche d’information : le contexte reste perceptible pendant que mode, disponibilité, calibration et export demeurent lisibles.

La courbe principale — le filament — forme la colonne perceptive du produit. Dans l’application d’enregistrement, elle représente un audio frais, jamais une boucle arbitraire. Son halo tire son énergie de l’amplitude mesurée. Pendant la réécoute, le même langage visuel suit la prise décodée. Si une frame live devient obsolète, la surface revient vers un signal de repos honnête au lieu d’exposer une ancienne mesure comme actuelle.

Cette règle s’étend au mouvement entier : rien de ce qui ressemble à une mesure ne peut être simulé. Le silence reste une donnée. La capture reçoit le budget de rendu complet. Le mouvement réduit supprime la chorégraphie sans supprimer le sens. L’interface se comporte donc davantage comme une vitre posée sur un instrument acoustique que comme un tableau de bord classique.

## Cinq modes, cinq résultats

- **Capture libre** démarre directement, sans corpus, et enregistre jusqu’à dix minutes avec arrêt manuel, WAV et provenance.
- **Découpe lexicale** reçoit un audio ou une vidéo locale, écarte l’image, analyse parole ou chant et exporte un WAV horodaté pour chaque mot soutenu par les preuves, avec JSON et CSV.
- **Dataset ML** planifie les phrases depuis la couverture du corpus, calibre la pièce, produit des prises comparables et ne fait progresser la couverture que si le matériau est accepté et stocké durablement.
- **Doublage** associe un script local ou des cues SRT/VTT à une vidéo locale ou une référence YouTube explicitement activée. L’interprète voit la scène, conserve les timecodes et exporte une voix isolée.
- **Interprétation** enregistre une performance continue ou segmentée contre un support audio optionnel au casque. Le support guide la voix sans jamais être mixé dans le WAV capturé.

Ce sont des modes produit, pas des presets de format. Chacun change les entrées, le geste de capture, la définition de réussite et la sortie utile. Le podcast reste un scénario de Capture libre ; la voix off, un scénario de Doublage ; le livre audio, un scénario d’Interprétation tant que ces usages n’exigent pas de moteurs vraiment différents.

## Du signal à la décision

Le parcours commence par une inspection progressive des capacités : permission et entrées micro, Web Audio, durabilité du stockage, accès dossier, téléchargements, wake lock, APIs de parole optionnelles, Workers et rendu accéléré. L’absence d’une capacité optionnelle ne dégrade que le workflow qui en dépend.

La capture micro utilise `getUserMedia` et un recorder PCM. Elle privilégie `AudioWorkletNode`, conserve `ScriptProcessorNode` comme compatibilité, encode un WAV mono RIFF-padded en 48 kHz / 24-bit lorsque le runtime le permet et calcule les premières métriques techniques depuis le signal enregistré. Les médias importés sont décodés vers des signaux d’analyse 16 kHz avant segmentation locale.

Après la capture, les observations restent séparées :

- le corpus immuable déclare texte attendu, langue, intention et direction de jeu ;
- le signal PCM fournit mesures physiques et prosodiques, VAD énergétique, segments, silences et pauses ;
- la reconnaissance vocale navigateur, lorsqu’elle existe, reste une hypothèse optionnelle ;
- la conversion graphème-phonème et le timing des mots restent des estimations préparatoires ;
- les décisions fusionnées citent leurs preuves, raisons et confiance sans effacer les observations qui les ont produites.

C’est la couche de recherche déterministe : des observations bornées identiques alimentent des politiques explicites et l’incertitude reste visible. L’ASR navigateur peut demander une révision, mais il ne peut ni rejeter ni autoriser une capture physique. Une divergence de transcript n’efface pas une prise techniquement valide. Un import d’alignement acoustique forcé peut remplacer une carte de timing estimée sans réécrire la preuve brute.

## Pipeline de découpe lexicale

La Découpe lexicale est le cinquième mode et l’exemple le plus net du pipeline local. Elle accepte jusqu’à 200 Mo et dix minutes, décode le média sur l’appareil, reconnaît le type de scène et choisit un budget rapide, vérifié ou approfondi. Une première passe Whisper explore la source. Une parole difficile, du chant ou de la musique peuvent déclencher une passe de modèle base, un signal vocal-focus, une séparation spectrale mid/side et un consensus temporel par majorité floue.

Chaque mot exporté conserve début, fin, contexte de clip, support acoustique, confiance, votes de consensus et classe de preuve. Le ZIP contient les extraits WAV mono 16 kHz / 24-bit, un manifeste versionné et une timeline. Les pixels vidéo ne sont pas traités dans ce mode ; seule la piste audio entre dans le pipeline.

## Persistance local-first et exports ouverts

Le workspace privilégie IndexedDB, peut utiliser un dossier choisi via la File System Access API et conserve toujours le téléchargement explicite comme fallback. Une prise ne peut pas créditer la couverture dataset si son audio n’a pas été accepté par un stockage local durable. Les archives de workspace sont vérifiées avant restauration et n’écrasent pas silencieusement les WAV existants.

Le paquet principal contient session, locuteur et corpus ; WAV, transcript, timing, phonèmes, intention, qualité, observation et preuves par prise ; rapports dataset ; manifeste d’entraînement JSONL ; checksums SHA-256. Les estimations navigateur restent marquées `forcedAlignmentRequired` tant qu’une validation acoustique ne les a pas remplacées ou confirmées.

Voice Capture Studio prépare le matériau pour archives, recherche, doublage et workflows de machine learning. Il **n’entraîne pas** de modèle, ne promet pas un alignement acoustique de niveau recherche dans tous les navigateurs et ne téléverse pas les prises privées vers un service distant.

## Architecture et technologies

L’application repose sur React 19, TypeScript et Vite. Web Audio, AudioWorklet, le décodage média du navigateur, IndexedDB, la File System Access API, les Workers, l’analyse locale capable d’utiliser WebAssembly/WebGPU, le service worker PWA et GitHub Pages constituent le châssis navigateur.

Les domaines portent corpus, sessions, workspace, couverture, recording, observations, phonétique, locuteurs, settings et contrats d’export. Ils n’importent ni React, ni CSS, ni DOM, ni API navigateur. Le shell applicatif porte l’orchestration et les adaptateurs. Cette direction des dépendances garde planification, règles keeper, fusion des preuves et contrats de paquet testables hors d’une interface particulière.

La gate de release couvre formatage, linting, références TypeScript, couverture unitaire, budgets de bundle et build de production. Les suites end-to-end exercent capture, layouts responsives, Chromium, Firefox, WebKit, redémarrage offline et contrôles d’accessibilité automatisés.

## Open source, vie privée et frontières

Le dépôt sous licence MIT rend le comportement inspectable. Les enregistrements et workspaces générés restent des données utilisateur ; ils appartiennent au stockage navigateur, au dossier local choisi ou à un téléchargement explicite, jamais au dépôt public.

Local-first ne signifie pas que le stockage navigateur est permanent. L’interface expose durabilité, capacités manquantes et chemins d’export afin que l’utilisateur sache ce qui survivra à un rechargement, ce qui doit être téléchargé et ce qu’un navigateur donné ne peut pas fournir.

## Documentation et preuves

Points d’entrée utiles dans les sources :

- [Phénoménologie](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/design/PHENOMENOLOGY.md) — lois du signal, du mouvement et des états perceptifs.
- [Grille d’expérience des modes](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md) — publics, entrées, gestes, sorties et réussite des cinq modes.
- [Modèle système](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/system-model.md) — flux runtime observé et tensions actuelles.
- [Audit des technologies de capture](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md) — pipeline d’observation, limites du timing et frontière de validation.
- [Structure d’export](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md) — paquet, qualité et étapes Forge en aval.
- [Manifeste d’ingénierie browser-native](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/browser-native-engineering-manifesto.md) — capacités progressives et principes local-first.

## Relais Connaissance

Les six briefs éditoriaux présentés plus haut sont conçus pour devenir des articles Connaissance, pas des notes de version. Chacun peut rester utile après une évolution de l’interface parce qu’il traite un problème durable : UX audio digne de confiance, provenance, recherche déterministe, segmentation locale, conception des modes ou architecture browser-native.

Voice Capture Studio se situe près d’[ORETH](/fr/programs/oreth/) parce que les deux traitent l’audio comme matériau structuré. Il se relie à l’[Audio web](/fr/knowledge/concepts/web-audio/), à la [Web Audio API](/fr/knowledge/technologies/web-audio-api/), à l’[interaction humain-machine](/fr/knowledge/concepts/human-computer-interaction/), aux [métadonnées](/fr/knowledge/concepts/metadata/) et à l’[open source](/fr/knowledge/concepts/open-source/) comme mise à l’épreuve concrète de ces idées.

Le rôle du projet est précis : rendre le premier artefact vocal plus propre, plus inspectable et plus réutilisable avant qu’une archive, un modèle, un montage de doublage ou un workflow de production ne le reçoive.
