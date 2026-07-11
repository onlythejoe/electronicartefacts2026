---
id: ea:concept:vaste-extension-architecture-fr
type: concept
translationOf: ea:concept:vaste-extension-architecture
slug: { canonical: vaste-extension-architecture }
title: Architecture d’extensions VASTE
definition: Une extension VASTE est une unité optionnelle de capability, limitée à un System, qui déclare actions de domaine, bindings et Surfaces tandis que l’autorité runtime reste dans le chemin d’exécution central.
abstract: Manifests, lifecycle, familles mesurées, boot sans extension, frontière Intelligence et limite de confiance in-process.
description: Le système d’extensions implémenté et spécifié de VASTE, présenté selon sa maturité réelle.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Manifests d’extension, Lifecycle runtime, Frontières de capability, Familles d’extensions]
exclusions: [Marketplace publique, Exécution tierce sûre, Maturité uniforme]
claims:
  - Le runtime démarre et exécute sans extension installée.
  - Installation et exposition visible sont deux états distincts.
tags: [VASTE, Extensions, Runtime, Intelligence]
disciplines: [architecture logicielle, systèmes d’exécution]
---

## Frontière

Les extensions ajoutent sens et capabilities sans changer les primitives. Elles possèdent actions, manifests, bindings, domaines et Surface specs ; le runtime conserve namespaces, routage, scheduling, exécution, effets typés, mutation et lifecycle. Un manifest demande une capability, il ne s’accorde pas une permission.

## Lifecycle

Install, enable, disable, upgrade et remove existent. Artifacts et registrations sont limités au System. Installer n’expose pas automatiquement une Surface ; désactiver ne doit pas effacer la vérité canonique. Les tests couvrent packaging, identité, lifecycle, couplage et boot sans extension.

## Familles mesurées

Le recensement du dépôt regroupe les extensions en cinq familles : foundational ; coordination ; knowledge et cognition ; experience ; tooling. Actor, Knowledge, Assets, Flow, Program, Simulation, World Model, Intelligence, Perception, Workspace, Studio, Expression et SDK n’ont pas tous la même maturité. Certains ont registrations et Actions exécutables ; d’autres restent partiels ou doctrinaux.

## Intelligence

Intelligence est une extension consultative avec adapters de providers et configuration de modèles. Elle peut proposer une sortie structurée ou diffuser du langage ; elle ne contourne ni admission Actor, ni policy, ni Action. Provider, modèle et capability runtime restent distincts.

## Limite de confiance

Les extensions first-party de confiance s’exécutent actuellement in-process. Provenance, signatures, trust tiers, grants et sandbox futur ont des contrats, mais vérification cryptographique et isolation marketplace sont incomplètes. VASTE ne considère donc pas encore du code tiers arbitraire comme sûr.
