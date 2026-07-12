---
id: ea:publication:a2a-agent-interoperability-and-governed-delegation-fr
type: publication
slug:
  canonical: a2a-agent-interoperability-and-governed-delegation
title: A2A, interopérabilité des agents et délégation gouvernée
subtitle: Article technique
abstract: Analyse pratique du protocole Agent2Agent, de la découverte d’agents, du cycle des tâches, des artefacts et de la gouvernance nécessaire avant de déléguer entre agents IA indépendants.
description: Comprendre les Agent Cards, messages, tâches et artefacts A2A, la différence avec MCP et le besoin persistant d’identité, de politique et de traces d’audit.
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-07-12"
  publishedAt: "2026-07-12"
  modifiedAt: "2026-07-12"
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:technology:agent2agent-protocol
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:provenance
  - id: ea:program:vaste
claims:
  - L’interopérabilité des agents est un contrat d’échange, pas une preuve que le travail délégué est autorisé ou correct.
  - Une délégation durable exige identité de tâche, autorité limitée, provenance et transitions d’état inspectables autour du protocole.
evidence:
  - id: ea:technology:agent2agent-protocol
  - id: ea:concept:contextual-execution
sources:
  - title: Agent2Agent Protocol Specification
    publisher: A2A Protocol Project
    accessedAt: "2026-07-12"
    url: https://a2a-protocol.org/latest/specification/
  - title: Google Cloud donates A2A to Linux Foundation
    publisher: Google for Developers
    publishedAt: "2025-06-23"
    accessedAt: "2026-07-12"
    url: https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/
citation:
  preferred: 'Electronic Artefacts. "A2A, interopérabilité des agents et délégation gouvernée." Article technique, version 1.0.0, 2026.'
tags: [A2A, Agents IA, interopérabilité des agents, délégation, VASTE]
disciplines: [intelligence artificielle, systèmes distribués, architecture logicielle]
translationOf: ea:publication:a2a-agent-interoperability-and-governed-delegation
---

## Problème

Les agents IA passent d’assistants isolés à des systèmes capables de se répartir du travail. La difficulté n’est pas de faire circuler du JSON, mais de préserver le sens lorsque modèles, fournisseurs et runtimes différents négocient capacités, progression et résultats.

Agent2Agent, ou A2A, traite cette couche d’échange. Le protocole ouvert décrit comment un agent annonce ses capacités, reçoit des messages, suit une tâche et renvoie des artefacts. L’agent distant peut rester opaque : collaborer ne doit pas exiger l’accès à sa mémoire privée, son prompt ou ses outils internes.

## Agent Cards et découverte

Une Agent Card est la description publique d’un point d’accès A2A. Elle peut préciser identité, compétences, modes d’interaction, endpoint et authentification attendue. Elle rend la découverte lisible par machine, mais reste une déclaration, pas une attestation. Le client doit encore établir qui l’a publiée, si l’endpoint est fiable et quelles compétences sont autorisées.

La découverte comporte donc deux couches : le protocole dit ce que l’agent affirme savoir faire ; la gouvernance décide sous quelle identité et quelle autorité cette affirmation peut être utilisée.

## Architecture

A2A distingue les messages conversationnels des tâches dont l’état évolue. Cette séparation convient aux travaux qui s’interrompent, demandent une précision ou produisent plusieurs livrables. Les messages portent instructions et clarifications ; les artefacts représentent textes, fichiers ou données structurées.

Un vocabulaire partagé évite à chaque intégration d’inventer son cycle. Mais un état commun ne garantit pas une sémantique commune. « Terminé » signifie que l’exécution distante s’est achevée, pas que le résultat est vrai, sûr, licencié ou publiable.

## A2A et MCP

MCP et A2A sont complémentaires. MCP expose du contexte et des outils à une application IA ; A2A fait collaborer deux applications agentiques. Un agent peut employer MCP en interne et A2A à sa frontière, sans partager le même modèle de permissions.

Cette distinction limite le rayon d’action. L’agent A2A distant ne doit pas hériter de tous les outils MCP du délégant. Chaque délégation mérite une enveloppe de capacités plus étroite et explicite.

## Mise en œuvre

Une délégation sûre commence par un contrat de tâche : objectif, provenance des entrées, opérations permises, types d’artefacts, expiration, budget et politique de revue. Ce contrat relie acteur demandeur, agent distant, tâche et résultats à des identifiants stables.

Chaque transition doit rester observable. Une trace durable consigne qui a délégué, quelle version de l’Agent Card a servi, quelles données ont franchi la frontière, quels états se sont succédé et quel artefact a été accepté. L’audit utile n’exige pas de conserver tous les prompts privés.

## Conséquences pour VASTE

Pour VASTE, A2A est un protocole de bord. Un runtime pourrait projeter une capacité gouvernée dans une Agent Card, traduire une tâche reçue en entités et événements typés, puis retourner un artefact avec sa provenance. Le runtime — pas le protocole distant — validerait droits de l’acteur, contraintes relationnelles et état de publication.

La règle de conception est nette : l’interopérabilité ouvre un canal, l’autorité reste locale. Un agent peut proposer ou exécuter un travail délimité ; il ne définit pas le sens du graphe qu’il rejoint.

## Éléments de preuve

La spécification A2A définit Agent Cards, messages, tâches, artefacts et transports. La gouvernance via la Linux Foundation établit un cadre de projet ouvert ; elle ne dispense pas de vérifier chaque implémentation et sa politique de confiance.

## Limites

A2A évolue encore et son adoption ne prouve pas une compatibilité de bout en bout. Authentification, confiance de service, injection de prompt, résidence des données, coûts et évaluation restent à la charge des applications. Les architectures multi-agents ajoutent aussi boucles, doublons, contradictions et relances en cascade.

Le protocole est utile lorsqu’il remplace une vraie couture d’intégration. Là où une API déterministe suffit, ajouter une délégation agent-à-agent ne fait qu’augmenter l’incertitude.

## À lire ensuite

Poursuivre avec [Model Context Protocol et systèmes d’IA utilisant des outils](/fr/publications/model-context-protocol-and-tool-using-ai-systems/), [Agents IA et workflows IA](/fr/publications/ai-agents-vs-ai-workflows/) et [Exécution contextuelle et runtimes de graphe](/fr/publications/contextual-execution-and-graph-runtimes/).

## Références

- A2A Protocol Project. Spécification Agent2Agent, dernière version consultée le 12 juillet 2026.
- Google for Developers. « Google Cloud donates A2A to Linux Foundation », 23 juin 2025.
