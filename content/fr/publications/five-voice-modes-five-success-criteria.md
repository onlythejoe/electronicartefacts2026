---
id: ea:publication:five-voice-modes-five-success-criteria-fr
type: publication
translationOf: ea:publication:five-voice-modes-five-success-criteria
slug: { canonical: five-voice-modes-five-success-criteria }
title: Pourquoi cinq modes vocaux exigent cinq critères de réussite
subtitle: Les modes produit comme contrats de travail distincts
abstract: Capture libre, dataset, doublage, interprétation et découpe lexicale méritent des modes séparés parce qu’ils changent entrées, gestes, règles d’acceptation et sorties utiles.
description: Un cadre produit pour décider quand un workflow vocal devient un mode plutôt qu’un preset.
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version: { version: 1.0.0, createdAt: "2026-07-18", publishedAt: "2026-07-18", modifiedAt: "2026-07-18" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: caseStudy
subjects:
  - id: ea:project:voice-capture-studio
  - id: ea:concept:human-computer-interaction
  - id: ea:concept:voice-technology
  - id: ea:concept:systems-thinking
  - id: ea:concept:speech-recording
  - id: ea:concept:speech-datasets
claims:
  - Un mode produit est justifié seulement lorsqu’il change ensemble parcours, réussite et sortie utile.
  - Réutiliser une même métrique visuelle entre workflows incompatibles peut produire un faux sens.
evidence: [{ id: ea:project:voice-capture-studio }]
sources:
  - { title: Grille d’expérience des modes, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md" }
citation: { preferred: 'Electronic Artefacts. « Pourquoi cinq modes vocaux exigent cinq critères de réussite ». Étude de cas, 2026.' }
tags: [Modes produit, UX vocale, Dataset, Doublage, design d’interaction]
disciplines: [Design produit, interaction humain-machine, ingénierie audio]
---

## Contexte

Un mode n’est pas un nouveau nom posé sur le même écran. [Voice Capture Studio](/fr/projects/voice-capture-studio/) applique un test plus strict : il faut modifier le parcours, la condition de réussite et l’export utile.

## Contraintes

Chaque parcours doit préserver l’intégrité de capture tout en n’exposant que les mesures et contrôles qui ont un sens pour son opérateur.

## Approche

La **Capture libre** commence sans corpus. Réussir signifie récupérer une prise complète et sa provenance ; une couverture dataset n’y aurait aucun sens.

Le **Dataset ML** commence avec corpus, profil et calibration. Seule une prise acceptée et stockée durablement fait progresser une cible déclarée. Ce contrat relie [enregistrement vocal](/fr/knowledge/concepts/speech-recording/) et [datasets vocaux](/fr/knowledge/concepts/speech-datasets/).

Le **Doublage** lie une réplique à l’image et au temps de scène. Voir, caler, jouer, comparer et reprendre conduisent à une voix isolée avec ses repères. Le son guide peut passer au casque, jamais contaminer le WAV.

L’**Interprétation** accompagne chant, narration ou texte joué par un support optionnel. Le résultat reste une voix isolée et un manifeste de performance.

La **Découpe lexicale** n’utilise pas le microphone. Elle transforme un média existant en clips de mots reliés à leur temps source et à leurs preuves.

## Mise en œuvre

Permissions, stockage, relecture, export et langage visuel peuvent être communs. Entrées, ordre, acceptation, progression et sortie divergent. C’est une application de la [pensée systémique](/fr/knowledge/concepts/systems-thinking/) : partager l’infrastructure, protéger les contrats de domaine.

Une interface uniforme n’est pas toujours cohérente. L’anneau de couverture phonétique appartient au Dataset ML. L’afficher à zéro en Capture libre suggérerait un échec inexistant. Le temps de scène appartient au Doublage, pas à une note de terrain.

L’[interaction humain-machine](/fr/knowledge/concepts/human-computer-interaction/) protège le sens d’un contrôle avant sa cohérence visuelle.

## Résultat

Le podcast reste un scénario de Capture libre jusqu’à exiger plusieurs intervenants, marqueurs et montage long. Le livre audio reste une Interprétation segmentée jusqu’à nécessiter chapitres, personnages et continuité éditoriale. Un nouveau mode devient légitime avec un nouveau modèle d’entrée, un geste différent, une autre réussite et un paquet propre. Sinon, c’est un scénario ou un preset.

## Éléments de preuve

Les cinq contrats et les hypothèses de modes refusées sont maintenus dans la grille d’expérience citée plus haut et implémentés dans le [projet public](/fr/projects/voice-capture-studio/).
