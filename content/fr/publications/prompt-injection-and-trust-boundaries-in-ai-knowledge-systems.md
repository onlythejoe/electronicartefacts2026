---
id: ea:publication:prompt-injection-and-trust-boundaries-in-ai-knowledge-systems-fr
type: publication
slug:
  canonical: prompt-injection-and-trust-boundaries-in-ai-knowledge-systems
title: Injection de prompt et frontières de confiance dans les systèmes de connaissance IA
subtitle: Article technique
abstract: "Un article axé sur la sécurité sur l'injection de prompt, le contenu récupéré, l'utilisation d'outils, les serveurs MCP, les limites de confiance, les permissions et les workflows d'IA conscients du graphe."
description: "Comprendre l'injection de prompt dans les systèmes de connaissances d'IA par la récupération, les agents, les outils MCP, les permissions, le contenu non fiable et l'exécution contextuelle."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.1
  createdAt: 2026-06-25
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:graph-runtime
  - id: ea:technology:model-context-protocol
claims:
  - "L'injection de prompt est un échec lié à la confiance où un contenu non fiable peut influencer le comportement du modèle au-delà de son autorité."
  - "Les systèmes de connaissances sur l'IA devraient traiter les pages récupérées, les dossiers d'archives et les réponses aux outils comme des données, tandis que les politiques, les autorisations et l'autorité des outils demeurent en dehors de la transcription du modèle."
evidence:
  - id: ea:concept:ai-agent
  - id: ea:technology:model-context-protocol
sources:
  - title: OWASP Top 10 for Large Language Model Applications
    publisher: OWASP Foundation
    accessedAt: 2026-06-25
    url: https://owasp.org/www-project-top-10-for-large-language-model-applications/
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: 2026-06-25
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: AI Risk Management Framework
    publisher: National Institute of Standards and Technology
    accessedAt: 2026-06-25
    url: https://www.nist.gov/itl/ai-risk-management-framework
citation:
  preferred: Electronic Artefacts. "Injection de prompt et frontières de confiance dans les systèmes
    de connaissance IA". Article technique, version 1.1.1, 2026.
tags:
  - Prompt Injection
  - AI Security
  - agents d'IA
  - MCP
  - Trust Boundaries
disciplines:
  - intelligence artificielle
  - Security
  - systèmes de connaissance
  - architecture logicielle
translationOf: ea:publication:prompt-injection-and-trust-boundaries-in-ai-knowledge-systems
---

## Problème

Les systèmes de connaissances AI lisent des documents, récupèrent des pages Web, inspectent des archives, appellent des outils et parfois écrivent des données. L'injection de prompt se produit lorsque le contenu non fiable manipule le modèle en ignorant les limites, en révélant des données, en invoquant des outils ou en produisant une production trompeuse.

Le problème n'est pas seulement les invitations malveillantes des utilisateurs. L'injection de prompt indirecte peut arriver par des pages récupérées, des commentaires, des PDF, des courriels, des champs de métadonnées, des descriptions de problèmes, des textes de transcription ou des réponses d'outils. Si le système traite tous les textes comme des instructions, chaque source devient un canal de commande potentiel.

## Présentation

L'injection de prompt est l'un des problèmes de sécurité des applications de modèle de langue. OWASP énumère l'injection de prompt comme un risque majeur d'application LLM, en plus de la gestion des sorties non sécurisées, de la divulgation d'informations sensibles, de la conception de plugins non sécurisée et d'une agence excessive.

Les systèmes de connaissances sont particulièrement exposés parce que leur valeur provient de la lecture de documents externes ou semi-confiables. Un assistant de recherche peut récupérer des pages Web publiques. Un assistant d'archives peut analyser les notes des contributeurs. Un agent de codage peut inspecter les fichiers du dépôt. Un hôte MCP peut se connecter à plusieurs serveurs qui exposent des ressources et des outils.

La règle de conception centrale est simple : le contenu récupéré est des données, pas de l'autorité. Elle peut fournir une réponse, mais elle ne doit pas décider des permissions, de l'accès aux outils, des instructions du système ou de la politique de publication.

## Architecture

Une architecture résistante à l'injection de prompt sépare l'intention de l'utilisateur, la politique du système, les instructions de confiance, les preuves récupérées, l'autorité de l'outil, les vérifications d'autorisation, la validation de sortie et les dossiers de vérification. Le modèle peut justifier des données, mais les contrôles externes décident de ce qu'il peut accéder et des mesures qu'il peut prendre.

## Limites de confiance

Une frontière de fiducie sépare le contenu avec une autorité différente. Les instructions du système ont un niveau d'autorité. Les demandes des utilisateurs en ont une autre. Les documents récupérés, les pages Web publiques et les archives ont une autorité inférieure parce qu'ils peuvent être erronés, malveillants, périmés ou en dehors de la tâche actuelle.

Un modèle n'impose pas naturellement ces couches. Il reçoit des tokens. L'application doit structurer le contexte et les contrôles afin que le contenu de confiance inférieure ne devienne pas une instruction de confiance supérieure.

Pour Electronic Artefacts, un article public du Knowledge Hub peut expliquer un concept, mais il ne devrait pas être en mesure de dire à un agent de publier une page, de lire des fichiers restreints ou d'ignorer la validation.

## Injection directe et indirecte

L'injection directe se produit lorsqu'un utilisateur indique explicitement au modèle de contourner les règles. L'injection indirecte se produit lorsqu'un modèle lit du contenu qui contient des instructions contradictoires. L'injection indirecte est plus dangereuse dans les systèmes de récupération et d'agents parce que l'attaquant peut contrôler une source que l'utilisateur ne voit jamais.

Par exemple, une page Web qui dit à un assistant de révéler un contexte privé, un PDF qui demande à un résumé d'ignorer des instructions antérieures ou une note de projet qui tente de déclencher un outil d'envoi externe.

Il ne faut pas espérer que le modèle puisse distinguer toutes les attaques. L'atténuation vise à empêcher que le contenu non fiable ne soit autorisé à agir.

## Risques de récupération

Les systèmes RAG placent le texte récupéré dans le contexte du modèle. Ce texte peut contenir des instructions, des balisages, des contenus cachés, des revendications contradictoires ou des chaînes malveillantes. Un prompt naïve telle que « suivre le document fourni » crée une vulnérabilité car le document peut redéfinir la tâche.

L'assemblage du contexte doit indiquer le contenu récupéré comme preuve. Il doit citer ou délimiter les sources, préserver l'identité de la source et indiquer que les sources ne doivent pas être suivies comme instructions. Plus important encore, l'accès aux outils et les autorisations devraient être appliqués en dehors du modèle.

Les filtres de récupération sont aussi importants. Si le matériel privé est récupéré dans une conversation où il n'est pas permis, les défenses d'injection de prompt après récupération ne peuvent pas annuler l'exposition.

## Utilisation des outils

L'utilisation des outils soulève les enjeux. Un modèle qui ne peut qu'ébaucher un texte peut être manipulé en une mauvaise réponse. Un modèle qui peut appeler des outils peut être manipulé pour envoyer des données, modifier des enregistrements, ouvrir des URL, supprimer des fichiers ou publier du contenu.

Les autorisations d'outils doivent être étroites, typées et contextuelles. Un outil ne devrait pas exposer un large accès shell lorsque le système n'a besoin que de validation de la relation. Un outil de lecture ne devrait pas obtenir l'autorité d'écriture parce que le modèle décide qu'il est pratique.

Pour les actions écrites, exiger une approbation et une validation explicites. Le modèle peut proposer une modification. L'exécution doit vérifier les ID de l'entité, les prédicats, la visibilité, les droits des acteurs et les exigences de source avant toute mutation.

## Surfaces MCP

MCP sépare les hôtes, les clients, les serveurs, les ressources, les invites et les outils. Cette séparation est utile, mais elle n'enlève pas le risque d'injection. Une ressource exposée par un serveur MCP peut contenir des instructions hostiles. Un outil exposé par un autre serveur peut avoir des effets secondaires. Un hôte qui les compose avec insouciance peut créer un pont data-to-action.

L'hôte doit rester la surface de confiance de l'utilisateur. Il devrait indiquer quels serveurs sont connectés, quelles ressources ont été lues et quels outils sont demandés. Il devrait également faire respecter les autorisations même lorsqu'une sortie de modèle apparaît confiante.

Les serveurs MCP devraient exposer des capacités précises. Un serveur graphique peut fournir `validate_relation` avant de fournir `write_relation`. Un serveur multimédia peut exposer des métadonnées en lecture seule avant d'exposer des outils de publication.

## Traitement des produits

La sortie du modèle n'est pas fiable jusqu'à validation. Si la sortie devient HTML, SQL, commandes shell, correctifs JSON, relations de graphe ou entrée API, il faut vérifier le schéma et s'échapper. La gestion de sortie non sécurisée transforme un problème de génération de texte en un exploit logiciel.

Pour les systèmes de connaissances, valider les citations, les ID, les prédicats de relation, la visibilité et la politique de contenu. Un modèle ne devrait pas inventer un concept ID et faire accepter le système parce que la chaîne semble plausible.

Les schémas tapés sont un contrôle de sécurité. Ils réduisent la quantité de texte libre qui peut se croiser en action exécutable.

## Excessif

Un organisme excessif apparaît lorsqu'un système accorde un modèle plus d'autonomie que la tâche n'exige. Un assistant qui peut parcourir, récupérer des fichiers privés, éditer des enregistrements et publier des pages a une grande surface d'attaque. Si la tâche est seulement de résumer un article public, ces pouvoirs sont inutiles.

Le moindre privilège s'applique aux agents. Donnez au modèle le contexte minimum et les outils nécessaires à l'étape actuelle. Ajouter les portes d'examen avant les effets secondaires irréversibles ou externes.

L'autonomie devrait être gagnée par l'évaluation. Un workflow qui passe des tests contrôlés peut gagner une automatisation limitée. Il ne devrait pas commencer par une large autorité parce que la démo est impressionnante.

## Observabilité

Les tentatives d'injection de prompts doivent être observables. Le système devrait enregistrer les lectures des ressources, les demandes d'outils suspects, les actions refusées, les décisions stratégiques et les échecs de validation. Cela aide les équipes à trouver des sources dangereuses et à améliorer les frontières.

La transcription ne suffit pas. Un modèle peut ne pas indiquer pourquoi il a demandé un outil. Le temps d'exécution devrait enregistrer indépendamment la ressource, l'outil, l'acteur, l'état d'approbation et le résultat.

L'observabilité appuie également la responsabilisation. Si une page publique change, l'équipe doit savoir si le changement provient d'une édition humaine, d'une proposition d'IA, d'une construction programmée ou d'un appel à outils.

## Contrôles graphe-connaissance

Un graphe de connaissances peut imposer des limites sémantiques. Elle peut savoir qu'une publication peut documenter un concept, qu'un projet peut utiliser une technologie, qu'une entité restreinte ne peut être liée à une relation publique, et que certains prédicats exigent des preuves.

Cela donne moins de place aux systèmes d'IA pour improviser la structure. Un modèle peut proposer une relation, mais l'exécution du graphique décide si la relation est valide. Un modèle peut demander une source, mais l'exécution contextuelle décide si l'acteur peut la lire.

Les contrôles Graph-aware transforment l'atténuation de l'injection de prompt en architecture de domaine, et non pas seulement une formulation rapide.

## Implications pour Electronic Artefacts

VASTE doit traiter l'injection de prompt comme une préoccupation de base. Tout assistant futur qui lit le Knowledge Hub, modifie les relations, rédige les métadonnées d'archives ou appelle les outils MCP devrait supposer que le contenu récupéré n'est pas fiable.

Le site public peut également modéliser les bonnes pratiques. Les articles peuvent citer des sources, exposer des entités de provenance et de lien sans transformer le contenu visible en instructions exécutables. Le graphique reste la couche d'autorité.

Pour Palimpsests, ORETH et Vestiges, ceci est important parce que les archives contiennent du matériel hétérogène : notes, noms de fichiers, légendes, transcriptions, commentaires et métadonnées intégrées. Tout cela peut éclairer l'interprétation. Rien de tout cela ne devrait contrôler silencieusement les outils.

## Mise en œuvre

Commencez par classer le contexte en niveaux d'autorité : politique du système, workflow du développeur, requête de l'utilisateur, enregistrement interne fiable, source publique récupérée, source externe non fiable et sortie du modèle. Gardez ces niveaux visibles dans les instructions et le code.

Appliquer les permissions en dehors du modèle. Utiliser les outils listés, les schémas typés, la validation de la relation, les portes d'approbation et l'assainissement de sortie. Pour la récupération, appliquer le contrôle d'accès avant l'assemblage contextuel et les sources d'étiquetage comme preuve.

Ajouter la télémétrie pour les appels d'outils refusés, les défaillances de validation et les modèles de sources suspectes. Révisez régulièrement ces événements et convertissez les échecs récurrents en tests.

## Éléments de preuve

OWASP identifie l'injection de prompt, la manipulation de sortie non sécurisée, la divulgation d'informations sensibles, la conception de plugins non sécurisée et l’agentivité excessive comme des risques majeurs d'application LLM. MCP définit un modèle de capacité autour des ressources, des appels et des outils, ce qui rend le consentement et l'autorisation côté hôte central. NIST AI RMF fournit un cadre plus large de gestion des risques pour la cartographie et la gestion des risques d'IA.

Ces sources convergent sur une leçon pratique : le comportement du modèle de langue doit être entouré de contrôles explicites.

## Limites

Aucun prompt ne peut résoudre complètement l'injection de prompt. Les défenses au niveau du modèle, les délimiteurs et les instructions de refus aident, mais les commandes robustes vivent dans l'architecture : permissions, validation, conception d'outils, filtrage de récupération et approbation humaine.

Il y a aussi un compromis de facilité d'utilisation. Trop d'invitations d'approbation peuvent former les utilisateurs à accepter tout. Les contrôles de sécurité devraient être suffisamment précis pour être importants.

## Concepts connexes

Lire [Agent d'IA](/fr/knowledge/concepts/ai-agent/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/), [Génération augmentée par récupération](/fr/knowledge/concepts/retrieval-augmented-generation/) et [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/).

## Technologies connexes

Voir [Modèle de protocole de contexte](/fr/knowledge/technologies/model-context-protocol/) et [OpenTelemétrie](/fr/knowledge/technologies/opentelemetry/).

## Glossaire

Injection de prompt : une tentative de manipuler un modèle de langage à travers des instructions qui vont à l'encontre de l'intention du système.

Injection de prompt indirecte : injection de prompt par le contenu récupéré ou externe.

Limite de confiance : séparation entre les intrants ou les composants ayant une autorité différente.

Autorité de l'outil: la permission d'effectuer des actions en dehors de la génération de texte.

Agentivité excessive : accorder un modèle plus d'autonomie ou d'accès aux outils qu'une tâche n'exige.

## Références

- Fondation OWASP. Top 10 de l'OWASP pour les applications de modèles linguistiques de grande envergure.
- Modèle de protocole contextuel. Spécification. 2025-06-18.
- Institut national de normalisation et de technologie. Cadre de gestion des risques de l'IA.
