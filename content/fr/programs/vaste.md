---
id: ea:program:vaste-fr
type: program
translationOf: ea:program:vaste
slug:
  canonical: vaste
title: VASTE
subtitle: Recherche et implémentation d’un runtime graph-native
abstract: "VASTE est un runtime graph-native expérimental pour construire des systèmes portables, contextuels et gouvernés à partir de cinq primitives : Vertex, Tie, Action, Surface et Environment."
description: "Le dossier public canonique de VASTE : architecture runtime, primitives, exécution gouvernée, extensions, Assisted Boot, format .vast expérimental, preuves et limites actuelles."
locale: fr
visibility: public
publicationClass: canonical
status: development
maturity: experimental
confidence: validated
version:
  version: 2.0.0
  createdAt: "2024-01-01"
  publishedAt: "2026-01-01"
  modifiedAt: "2026-07-12"
  reviewedAt: "2026-07-12"
  changeSummary: Ajout d’une Surface interactive responsive avec contenance récursive des Vertex et projections runtime, portabilité et Assisted Boot.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
mandate: Développer et valider un runtime graph-native où identité, topologie, exécution, observation et contexte local restent explicites, gouvernables et portables.
domain: Runtime Systems
capabilities:
  - Cinq primitives fondamentales fermées
  - État de graphe par System et exécution déterministe des Actions
  - Vérifications de capabilities et gouvernance dérivée du graphe
  - Snapshots rejouables et contrats d’event log
  - Cycle de vie des extensions enregistré par le runtime
  - Cognition Assisted Boot et planification de composition
  - Export expérimental .vast de Systems et sous-arbres
architecture:
  - Kernel et cinq primitives
  - Runtime Engine et couche System
  - Domaines et extensions
  - Capabilities, patterns, plateforme et opérations
  - Hosts remplaçables et Surfaces matérialisées
lifecycle:
  - Filiation de recherche VOID et ARCA
  - Consolidation du graph runtime
  - Enforcement du kernel et du runtime
  - Intégration des extensions et de VAB
  - Validation du round-trip .vast v1
  - Electronic Artefacts Genesis reste un seuil opérationnel futur
maintainers:
  - id: ea:organization:electronic-artefacts
officialUrl: https://www.vaste.space/
tags:
  - TypeScript
  - Graph Runtime
  - Exécution gouvernée
  - Portabilité
  - Extensions
  - Assisted Boot
disciplines:
  - architecture logicielle
  - Runtime Systems
  - systèmes de connaissance
---

## Définition

VASTE est un runtime graph-native expérimental pour modéliser, exécuter et exposer des systèmes logiciels, organisationnels ou scientifiques. Son vocabulaire fondamental est fermé : **Vertex, Tie, Action, Surface et Environment**. System n’est pas une sixième primitive : c’est une partition d’isolation et la clôture structurelle d’un Vertex racine.

L’implémentation est active et couverte par des tests, mais ce n’est ni une distribution publique stable ni une frontière de sécurité prête pour la production. Electronic Artefacts publie ce dossier pour distinguer ce qui s’exécute de ce qui est spécifié, observé ou encore étudié.

## Pourquoi VASTE existe

Les applications classiques dispersent souvent identité, données, permissions, automatisation et état d’interface entre plusieurs systèmes. Déplacer l’application ne déplace donc ni son sens ni sa gouvernance. VASTE étudie une autre fondation : la structure du graphe participe à l’exécution, l’observateur agit depuis une position déclarée, toute mutation passe par une Action admise, et la structure portable reste distincte de l’autorité locale d’un Environment.

VASTE n’est ni une base de données graphe complétée par une interface, ni l’operating system d’une machine. C’est une grammaire runtime pour des systèmes dont les entités, relations, exécutions et observations doivent rester explicites.

## Modèle runtime

L’architecture actuelle ordonne onze couches : Kernel, Core Primitives, Runtime Engine, System, Domain, Extensions, Capability, System Patterns, Platform, Operational et Apps. Les couches basses connaissent les mécanismes, pas le sens des produits. Les produits sont des assemblies de primitives, extensions, policies et projections. Des tests imposent la règle « Zero Kernel Diff » : plusieurs familles d’assemblies doivent être possibles sans modifier le kernel.

```text
Apps et hosts remplaçables
          ↓
Platform · Operations · System patterns
          ↓
Extensions · capabilities · sens des domaines
          ↓
System layer · exécution gouvernée
          ↓
Vertex · Tie · Action · Surface · Environment
          ↓
Mécanique déterministe du kernel
```

## Les cinq primitives

- **Vertex** : atome de graphe sérialisable et sans comportement, avec ID stable, type namespaced, données et appartenance à un System.
- **Tie** : relation explicite, typée et orientée. Une relation inter-System échoue sans déclaration explicite.
- **Action** : intention admise, déclarative, sérialisable, rejouable et déterministe. Elle ne contient pas de code exécutable.
- **Surface** : membrane sans autorité pour observer et interagir. Une projection est un comportement de Surface, pas la vérité canonique.
- **Environment** : contexte d’exécution immuable et éphémère — System, claims d’Actor, scope, position, autorité, temps et budgets. Il ne conserve aucun état métier.

Ces responsabilités et leurs invariants testés sont détaillés dans [Les cinq primitives de VASTE](/fr/knowledge/concepts/vaste-five-primitives/).

Dans une projection du graphe, seuls les Vertex et les Ties qui les relient sont dessinés comme objets du graphe. Les extensions sont attachées aux Vertex, jamais représentées comme des nœuds. Chaque Vertex est exposé par sa propre Surface-membrane et résolu dans un Environment local ; sélectionner ce Vertex révèle les extensions qu’il porte, les Actions admises par cet Environment et les éventuels Vertex qu’il contient. Un noyau peut exister, mais il reste facultatif et n’est pas requis au centre d’un Vertex root.

## Exécution gouvernée

Une Action traverse un namespace enregistré, est résolue dans un System et un Environment, contrôlée pour l’accès et l’autorité, interprétée par l’execution engine puis traduite en effets typés. Seule la couche d’effets du runtime peut modifier l’état canonique. Receipts, événements et replay rendent ce chemin inspectable ; cela ne signifie pas que tout backend est durable ou tout effet externe réversible.

L’identité Actor appartient à une extension. Un host peut transporter des credentials, mais il ne peut ni fabriquer un Actor humain ni attribuer implicitement un rôle administrateur. La gouvernance peut être lue depuis le graphe via l’extension Actor. Les gates principaux sont implémentés ; l’infrastructure complète de confiance portable ne l’est pas.

## Actors situés

Un Actor est un Vertex spécialisé fourni par l’extension Actor, pas une primitive ni un compte omniscient extérieur au graphe. Une exécution admise se tient dans un Environment et peut porter un `locationVertexId`. Observation et action dépendent de la partition, de la topologie, des bindings, des capabilities et des policies du runtime.

Identité, capability déclarée et autorité effective sont distinctes. Un graphe portable peut transporter identités et déclarations de gouvernance ; l’Environment d’arrivée doit encore résoudre les credentials locaux et revalider l’autorité. Voir [Actors situés et gouvernance topologique](/fr/knowledge/concepts/situated-actors-and-governance/).

## Portabilité `.vast`

Le code définit actuellement `vast/1`, package JSON expérimental pour un System entier ou un sous-arbre contenu. L’export produit une forme canonique relative au System, un manifeste, des compteurs, des métadonnées de compatibilité, des références de frontière et un hash SHA-256. L’import vérifie format et scellement avant de relier la structure à un nouvel ID de System.

Les tests d’intégration internes démontrent : export sur disque, import dans un runtime neuf sous un autre System ID, poursuite d’Actions canoniques et réexport avec le même hash en l’absence d’écriture après import. Un System né via VAB a également suivi ce parcours E2E.

Un `.vast` ne contient **pas** un Environment actif, des credentials vivants, des secrets locaux, des processus host ou une autorité automatiquement valide. Les contrats de signature et de confiance existent, mais vérification, isolation, révocation et résolution de dépendances ne constituent pas encore une sécurité de marketplace. Détails : [Format de graphe portable `.vast`](/fr/knowledge/concepts/vast-portable-graph-format/).

## VAB — Assisted Boot

VAB est le chemin d’orchestration Assisted Boot, pas l’intelligence permanente de chaque System. L’implémentation conserve une session de conversation, compose une cognition heuristique ou reliée à un modèle configuré, produit un plan déclaratif, enregistre l’assentiment explicite par hash, résout les extensions et crée un graphe né par les chemins du runtime.

Le dépôt contient une interface web conversationnelle, streaming et parole, la réconciliation après redémarrage, l’admission du Founding Actor et les tests reliant un System né à l’export `.vast`. C’est une implémentation substantielle, mais pas encore le protocole Genesis/handover autonome complet. [VAB et Genesis](/fr/knowledge/concepts/vab-and-genesis/) sépare le chemin fonctionnel de l’horizon opérationnel.

## Architecture d’extensions

Les extensions possèdent actions de domaine, bindings, manifests et Surfaces optionnelles ; le runtime possède routage, exécution, effets et cycle de vie. La taxonomie mesurée du dépôt forme cinq familles : foundational, coordination, knowledge, experience et tooling. Actor, Assets, Knowledge, Workspace, Flow, Intelligence, Perception, Program, Simulation, Studio, Expression et World Model existent à des maturités différentes.

Le runtime démarre sans extension. Install, enable, disable, upgrade et remove existent ; installation ne signifie pas exposition. Aujourd’hui, les extensions de confiance s’exécutent dans le processus. Le code tiers non fiable n’a pas de frontière sûre avant enforcement du sandboxing et de la vérification cryptographique. Voir [Architecture d’extensions VASTE](/fr/knowledge/concepts/vaste-extension-architecture/).

## Intelligence optionnelle

Intelligence est une extension consultative et une frontière de providers, pas VASTE lui-même. Le dépôt contient des adapters, des chemins locaux et OpenAI-compatible, du streaming et des readiness checks. Actor, modèle, provider, policy et Action restent distincts. La réponse d’un modèle ne lui confère aucune autorité implicite sur le graphe.

## Implémentation actuelle

Le workspace TypeScript contient contrats publics, validateurs de primitives, services runtime, stores mémoire et filesystem, bootstrap et replay, extensions, hosts web et shell, surfaces VAB, tests d’intégration et benchmarks dédiés. Node.js 22.12 ou plus est déclaré. Des surfaces navigateur sont servies par un host Node ; cela ne prouve pas que le cœur soit un runtime navigateur autonome.

## Registre de preuves

Le [registre public des validations VASTE](/fr/archive/artefacts/vaste-validation-record/) associe les claims à un commit, un scénario, un statut et des limites. Au 11 juillet 2026, les preuves fortes couvrent notamment invariants des primitives, gouvernance dérivée du graphe, mutations atomiques et replay, boot sans extension, Zero Kernel Diff, round-trip `.vast`, E2E VAB→package et scellement du plan d’assentiment.

Ce sont des validations internes du dépôt, consultables lors d’une revue technique. Elles ne sont ni une certification indépendante, ni une preuve d’uptime, ni un audit de sécurité achevé.

## Limites

- Le dépôt est privé ; VASTE n’est ni un téléchargement public ni un SDK stable.
- `vast/1` est expérimental et sa politique de migration peut évoluer.
- Les extensions non fiables ne sont pas isolées de manière sûre.
- Event log durable, exécution distribuée et opérations multi-Environment restent incomplets ou dépendants du backend.
- Des benchmarks existent, mais aucune valeur générale n’est publiée sans contexte reproductible de machine et de commit.
- VAB est un boot path réel ; provisioning autonome, rollback et handover de production restent incomplets.
- Electronic Artefacts ne s’opère pas encore lui-même comme un System VASTE.

## Electronic Artefacts Genesis

L’objectif opérationnel est de représenter Electronic Artefacts par un System racine, un Founding Actor, une gouvernance, des registries et des Surfaces opérationnelles ; puis d’utiliser VAB et `.vast` pour préparer, inspecter et approuver un Environment candidat.

```text
VASTE boote Electronic Artefacts
→ Electronic Artefacts gouverne ses opérations
→ Electronic Artefacts gouverne le développement de VASTE
→ un System candidat est construit et exporté
→ structure et autorité sont revalidées
→ le Founding Actor approuve le handover
```

Cette boucle est une trajectoire, pas une capacité de production démontrée. Le prochain seuil décisif est un graphe EA Genesis gouverné accomplissant export, import neuf, rebinding local et handover humain sans contourner l’autorité runtime.

## Accès

Le [briefing interactif](https://www.vaste.space/) illustre la direction stratégique mais contient actuellement des affirmations plus larges ou plus anciennes que les preuves du dépôt. Ce dossier et ses pages liées forment le registre factuel canonique. Des revues techniques bornées sont accessibles via [Electronic Artefacts](/fr/contact.html).
