---
id: ea:concept:browser-software-fr
type: concept
translationOf: ea:concept:browser-software
slug:
  canonical: browser-software
title: Logiciel de navigateur
definition: Un logiciel de navigateur est une application fournie par les standards du Web et exécutée dans le runtime du navigateur pour l’interface, le stockage, les permissions, les médias et la distribution.
abstract: Le logiciel de navigateur traite le navigateur comme un runtime applicatif, pas seulement comme un lecteur de documents ou une surface marketing.
description: Fiche canonique pour les applications construites directement sur les capacités du navigateur.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-09"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Applications web
  - Applications web progressives
  - Permissions navigateur
  - Stockage local
  - Déploiement statique
exclusions:
  - Pages statiques sans comportement applicatif
  - Logiciels natifs sans runtime navigateur
claims:
  - Le logiciel de navigateur réduit la friction d’installation mais demande une vraie conception du stockage, des permissions et de la compatibilité.
  - Les outils local-first dans le navigateur ont besoin de chemins d’export explicites, car le stockage navigateur n’est pas une archive permanente.
tags:
  - logiciel de navigateur
  - application web
  - PWA
  - local-first
disciplines:
  - développement web
  - interaction humain-machine
  - architecture logicielle
---

## Définition

Un logiciel de navigateur est une application qui s’exécute dans un navigateur et utilise les capacités de la plateforme Web.

## Périmètre

Le concept inclut routage, service workers, stockage navigateur, permissions micro et fichiers, APIs média, hébergement statique et amélioration progressive.

## Applications

Electronic Artefacts l’utilise pour des outils publics, des surfaces de recherche, des expériences local-first et des applications statiques durables.

## Limites

La distribution par navigateur ne supprime pas la responsabilité d’infrastructure. Stockage, hors-ligne, accessibilité, support matériel et exports restent à concevoir.
