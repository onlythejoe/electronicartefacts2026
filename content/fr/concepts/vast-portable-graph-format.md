---
id: ea:concept:vast-portable-graph-format-fr
type: concept
translationOf: ea:concept:vast-portable-graph-format
slug: { canonical: vast-portable-graph-format }
title: Format de graphe portable .vast
definition: Un fichier .vast est un package JSON scellé expérimental `vast/1` qui transporte une clôture relative au System — System entier ou sous-arbre — avec manifeste et hash d’intégrité, jamais un Environment vivant.
abstract: Modèle d’export/import .vast implémenté, garanties d’intégrité, références de frontière, round-trip testé et limites de confiance et migration.
description: Guide public factuel du format expérimental de package de graphe portable VASTE.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: prototype
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Package vast/1, Canonicalisation et intégrité, Clôture System et sous-arbre, Rebinding à l’import]
exclusions: [Environment vivant, Autorité locale automatique, Certification de confiance production]
claims:
  - L’implémentation actuelle fait le round-trip d’un System par fichier sous un nouvel ID.
  - Le scellement détecte une altération du contenu ou du manifeste avant import.
tags: [VASTE, Portabilité, Graph Closure, Intégrité]
disciplines: [Runtime Systems, Portabilité des données]
---

## Sens implémenté

`.vast` est une convention de fichier soutenue par le runtime, pas un acronyme développé par les contrats. Le dépôt n’établit pas « Vertex Action Surface Tie » comme signification technique. `vast/1` sérialise une clôture portable en JSON.

Le corps canonique contient Vertices et Ties relatifs au System. Le manifeste enregistre ID et version du package, type et racine de clôture, compteurs, compatibilité, références de frontière et `packageHash` SHA-256. La canonicalisation stable rend l’identité indépendante du System ID d’arrivée.

## Deux formes de clôture

- **System closure** : partition structurelle complète avec Vertex racine.
- **Subtree closure** : containment depuis une ancre. Les Ties traversant la frontière sont refusés ou externalisés comme références déclarées, jamais copiés silencieusement.

## Round-trip validé

Le scénario interne exporte le System A, écrit puis relit le JSON, vérifie le scellement, importe dans un runtime neuf comme System B, poursuit l’exécution canonique et compare le hash d’un réexport avant nouvelle écriture. Les tests couvrent aussi version inconnue, altération et collision. Un scénario E2E exporte un graphe né via VAB et un sous-arbre Workspace utilisé.

## Portable et local

Sont portables : identité relative, données Vertex/Tie, structure, manifeste, déclarations de provenance, compatibilité et références de frontière.

Restent locaux : Environment actif, credentials, secrets, processus, emplacement filesystem, providers, grants de ressources et autorité effective. Ils doivent être résolus ou revalidés à l’arrivée.

## Limites

`vast/1` est expérimental. Un hash prouve l’intégrité, pas l’identité de l’auteur. Signatures et provenance ne forment pas encore une chaîne de confiance marketplace. Montage multiple, upgrade atomique, migrations, limites de ressources et durcissement hostile ne sont pas présentés comme garanties livrées.
