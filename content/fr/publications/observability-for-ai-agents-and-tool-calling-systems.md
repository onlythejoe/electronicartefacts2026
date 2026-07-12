---
id: ea:publication:observability-for-ai-agents-and-tool-calling-systems-fr
type: publication
slug:
  canonical: observability-for-ai-agents-and-tool-calling-systems
title: Observabilité des agents d'IA et des systèmes d'appel d'outils
subtitle: Article technique
abstract: "Une explication pratique de la télémétrie pour les agents d'IA, les appels d'outils, les traces, les événements, les approbations, les échecs, les évaluations et la responsabilisation dans les runtimes graphes."
description: "Comprendre l'observabilité des agents d'IA et des systèmes d'appel d'outils au moyen de traces, de mesures, de journaux, d'événements de vérification et d'OpenTelemetry."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.1
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:technology:opentelemetry
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:event-driven-architecture
  - id: ea:concept:contextual-execution
claims:
  - "Les agents d'IA ont besoin d'être observables pour les appels de modèles, les appels d'outils, les approbations, le contexte récupéré et les effets secondaires externes."
  - "La télémétrie de l'agent devrait enregistrer le comportement opérationnel et les métadonnées de responsabilité sans stocker par défaut des invites sensibles ou du contenu privé."
evidence:
  - id: ea:technology:opentelemetry
  - id: ea:technology:model-context-protocol
sources:
  - title: OpenTelemetry Semantic Conventions 1.42.0
    publisher: OpenTelemetry
    accessedAt: 2026-06-24
    url: https://opentelemetry.io/docs/specs/semconv/
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: 2026-06-24
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: 2026-06-24
    url: https://cloudevents.io/
citation:
  preferred: Electronic Artefacts. "Observabilité des agents d'IA et des systèmes d'appel d'outils".
    Article technique, version 1.1.1, 2026.
tags:
  - Observability
  - agents d'IA
  - Tool Calling
  - OpenTelemetry
  - Tracing
disciplines:
  - intelligence artificielle
  - architecture logicielle
  - conception de systèmes
  - Distributed Systems
translationOf: ea:publication:observability-for-ai-agents-and-tool-calling-systems
---

## Problème

Les agents d'IA et les workflows d'appel d'outils peuvent lire le contexte, appeler des outils, écrire des données et déclencher des effets secondaires externes. Sans observation, les équipes ne peuvent reconstruire ce qui s'est passé, expliquer les échecs, faire respecter le consentement ou améliorer la fiabilité.

## Présentation

L'observabilité est la capacité de comprendre le comportement d'un système à partir de ses signaux émis. Dans les systèmes distribués classiques, ces signaux comprennent des traces, des mesures, des journaux et des événements. Dans les systèmes d'IA, le problème s'étend : les appels de modèles, le contexte récupéré, les appels d'outils, les approbations, les refus, les retraits et les sorties générées affectent tous le comportement.

Un agent d'IA n'est pas seulement une réponse modèle. Il s'agit d'un chemin d'exécution à travers des appels, des ressources, des outils et des décisions. Un projet de publication défaillant peut comporter des erreurs de récupération, une inadéquation de schéma, un délai d'utilisation, une autorisation manquante ou un identifiant halluciné. Une ligne normale de log disant "demande échouée" ne suffit pas.

OpenTelemetry fournit un point de référence utile car il standardise les concepts de télémétrie et les conventions sémantiques. MCP fournit une surface de capacité utile car les outils et les ressources ont des noms, des serveurs et des appels structurés. Ensemble, ils orientent vers une infrastructure d'IA responsable.

## Architecture

Une architecture d'agent d'IA observable contient une demande d'utilisateur, une couche de récupération, des appels de modèles, des appels d'outils, une validation, des portes d'approbation, des effets secondaires, des traces, des métriques, des journaux et des événements d'audit durables. Le temps d'exécution devrait émettre suffisamment de télémétrie structurée pour reconstruire le comportement sans stocker par défaut des invites sensibles ou des documents privés.

## Traces

Une trace enregistre un flux de travail entre les composantes. Il est fait de travées, où chaque travée représente une opération chronométrée. Pour les systèmes d'IA, les champs utiles comprennent la demande de l'utilisateur, la récupération, l'appel modèle, la sélection d'outils, l'appel outil, la validation, l'approbation et le fonctionnement écrit.

La recherche aide à répondre aux questions de séquence. Le modèle a-t-il appelé l'outil avant ou après la récupération? Quel serveur a géré la requête ? Combien de temps a pris la recherche ? Quelle règle de validation a échoué?

Une trace doit inclure des identifiants stables sans exposer le contenu sensible par défaut. Les identifiants des entités, les noms d'outils, les noms de serveurs, les identifiants de modèles, les codes d'état et les durées sont souvent suffisants pour les opérations. Une politique de conservation plus stricte s'impose pour que les délais et les résultats soient complets.

## métriques

Les mesures décrivent le comportement agrégé. Pour les systèmes d'appel d'outils, le nombre de demandes de piste, le taux d'erreur, la latence, le nombre d'appels d'outils, le taux d'approbation, le taux de rejet, le nombre de réessayer, l'utilisation du token, le coût, la profondeur de la file d'attente et l'âge de projection.

Les paramètres de domaine sont tout aussi importants que les paramètres d'infrastructure. Si un agent d'assistance aux archives crée de nombreuses ébauches de métadonnées, mais qu'aucune n'est approuvée, le système ne réussit pas. Si un assistant graphique propose à plusieurs reprises des prédicats non valides, le modèle ou l'ajustement rapide doit être effectué.

Les mesures doivent distinguer la défaillance du modèle, la défaillance de l'outil, la défaillance de la validation et le rejet de l'utilisateur. Ce sont des causes différentes avec des corrections différentes.

## Registres

Les journaux fournissent des enregistrements discrets. Ils sont utiles pour les recherches humaines, mais dangereux quand ils capturent trop. Les systèmes d'IA peuvent fuiter du texte privé de l'utilisateur, des documents sources ou des identifiants dans les journaux si l'enregistrement est négligent.

La structure des registres est importante. Un événement log doit inclure l'ID de requête, la référence utilisateur ou acteur, le serveur, l'outil, l'ID de l'entité, le résultat et la classe d'erreur. Les journaux libres rendent les incidents plus difficiles à rechercher et plus faciles à recueillir.

Le contenu sensible doit être expurgé ou omis par défaut. Si un mode de débogage capture des invites, il doit être explicite, temporaire et protégé.

## Événements

Les événements enregistrent des changements d'état significatifs. Dans un système agentique, les événements de vérification utiles incluent `ToolCallRequested`, `ToolCallApproved`, `ToolCallDenied`, `ResourceRead`, `DraftCreated`, `ValidationFailed` et `PublicationQueued`.

Les événements diffèrent des traces. Une trace aide le débit de débogage. Un événement peut faire partie de la responsabilité durable. Une proposition écrite rejetée peut être importante des mois plus tard si une page publique change.

CloudEvents ou une enveloppe similaire peut aider à normaliser l'identité, le type, la source et le temps de l'événement. La charge utile du domaine doit encore être conçue avec soin.

## Télémétrie par appel d'outils

Chaque appel d'outils devrait être observable comme une opération de première classe. Enregistrez le nom de l'outil, le serveur, la version du schéma d'entrée, l'acteur, l'état d'approbation, l'heure de début, l'heure de fin, la classe de résultat et la classe d'effets secondaires.

Ne comptez pas sur la transcription du modèle comme journal de vérification. La transcription peut être résumée, cachée, taillée ou indisponible. L'exécution doit enregistrer l'appel de l'outil de manière indépendante.

Pour les outils d'écriture, enregistrer l'entité cible et, le cas échéant, les références antérieures. Pour les appels externes, enregistrez la classe de destination et la clé idempotence s'il y en a.

## Télémétrie de récupération

La récupération affecte la sortie du modèle. Une mauvaise réponse peut provenir de mauvaises sources plutôt que de mauvaises générations. L'observabilité devrait saisir l'index demandé, les filtres appliqués, les documents ou entités retournés et si les contrôles d'accès ont été appliqués.

Dans le cas d'un graphe de connaissances, la télémétrie de récupération devrait inclure les ID des entités et les champs de relation. Il ne devrait pas jeter des documents privés complets dans des traces.

Lorsqu'un utilisateur conteste une réponse, le système devrait pouvoir reconstituer les sources présentées au modèle.

## Approbation et consentement

Les approbations des utilisateurs sont des faits opérationnels. Si un outil envoie un courriel, publie une page, modifie une relation graphique ou partage des données, le système devrait consigner qui a approuvé l'action et ce qu'il a approuvé.

Le consentement devrait être précis. L'observabilité devrait distinguer les lectures automatiques, les lectures approuvées par l'utilisateur, les ébauches d'écrits et les publications publiques. Ceci est particulièrement important pour les systèmes de type MCP où plusieurs serveurs peuvent exposer différentes capacités.

Les dossiers d'approbation devraient être lisibles par les humains. Un futur examinateur ne devrait pas avoir à décoder JSON brut pour comprendre la décision.

## Évaluation

L'observation et l'évaluation se renforcent mutuellement. Les traces révèlent où un système échoue. Les évaluations permettent de déterminer si ces échecs s'améliorent.

Un agent doit être évalué sur les résultats des tâches, et pas seulement sur les réponses modèles. A-t-il utilisé des outils autorisés ? Y a-t-il des sources correctes ? A-t-elle évité les données restreintes? A-t-elle produit une ébauche valide? Un humain l'a approuvé ?

Les données d'évaluation devraient être mises en forme avec des définitions de modèles, d'indicateurs rapides et d'outils. Autrement, les améliorations ne peuvent être expliquées.

## Injection de prompt

L'injection de prompt est un problème d'observabilité ainsi qu'un problème de sécurité. Une ressource malveillante peut provoquer un modèle à demander un appel d'outil dangereux. Le système devrait consigner la ressource lue, la demande d'outil et la décision de politique.

La détection ne suffit pas. L'hôte devrait éviter une composition dangereuse, et la télémétrie devrait rendre les tentatives visibles. Si de nombreuses pages récupérées déclenchent des requêtes d'outils suspects, la récupération ou la limite rapide doit fonctionner.

Pour Electronic Artefacts, les pages de connaissances publiques peuvent être traitées comme des sources et non comme des instructions. Leur contenu ne devrait pas avoir d'autorité sur les outils.

## Confidentialité

La télémétrie AI peut devenir une archive d'ombre de travail privé. Les propositions peuvent contenir des projets non publiés, des notes personnelles, des références ou du matériel client. Les sorties peuvent contenir des données sensibles transformées.

La valeur par défaut devrait être la première observation des métadonnées. Structure de saisie, ID, calendriers, résultats et décisions stratégiques. Capturer le contenu complet uniquement sous des contrôles de débogage explicites et avec des limites de conservation.

La protection de la vie privée comprend également la visibilité des fournisseurs de modèles. Si un modèle hébergé est utilisé, l'observabilité devrait enregistrer que la demande a quitté l'infrastructure locale.

## OpenTelemétrie

OpenTelemetry fournit des concepts communs pour les échelles, les métriques, les logs et les attributs sémantiques. Sa valeur n'est pas seulement l'instrumentation de la bibliothèque. Il donne aux équipes un vocabulaire partagé pour ce qu'un système émet.

Les conventions sémantiques spécifiques à l'IA évoluent, y compris les travaux sur l'IA générative et le MCP. Même lorsqu'un projet n'adopte pas toutes les conventions, il peut suivre le même principe : noms cohérents, attributs stables et limites claires.

L'utilisation d'OpenTelemetry permet également d'observer les systèmes d'IA aux côtés des systèmes non-AI. Un appel à outils qui écrit une ligne de base de données doit apparaître dans le même univers opérationnel que tout autre appel de service.

## VASTE et graphes

VASTE peut ajouter la sémantique graphique à l'observabilité. Une trace peut comprendre des identifiants d'entité, des prédicats, des noms de projection et des contextes politiques. Un événement de vérification peut indiquer quelle relation graphique a été proposée et quelle règle de validation a été acceptée ou rejetée.

C'est plus fort que le logage générique de l'IA car il relie le comportement d'exécution à la structure sémantique. Le système peut demander non seulement « quel outil a échoué » mais « quel type d'opération de connaissance a échoué ».

L'observabilité des graphiques favorise également la confiance du public. Si une page publique a été générée à partir d'une projection graphique, le système devrait savoir quels enregistrements et quels événements ont contribué.

## Mise en œuvre

Commencez par instrumenter un outil utilisant le flux de travail de bout en bout. Créez une trace pour la demande de l'utilisateur, les champs de recherche, l'appel de modèle, la validation et l'appel d'outils, les mesures de la latence et le taux d'erreur, et les événements d'audit pour l'approbation et la mutation.

Définir une politique de suppression avant de collecter du contenu. Stocker l'identificateur de modèle, la version de modèle, la version de schéma d'outil et les identifiants d'entité cible. Examiner la sortie télémétrique avec le même sérieux que les données orientées vers l'utilisateur.

## Éléments de preuve

OpenTelemetry définit la sémantique de télémétrie partagée pour les traces, les mesures, les journaux et les attributs. MCP définit un modèle de capacité autour des ressources, des appels et des outils. CloudEvents fournit une référence utile pour les événements d'audit durables.

## Implications pour Electronic Artefacts

L'observation est essentielle si Electronic Artefacts connecte les systèmes d'IA à VASTE, aux archives ou aux flux de travail de publication. Il protège la fiabilité, la responsabilité éditoriale et le consentement des utilisateurs.

Le principe pratique est d'observer le comportement sans garder silencieusement le contenu. Un système doit savoir ce qui s'est passé, qui l'a autorisé et quelle entité a changé, tout en gardant le matériel privé hors de la télémétrie par défaut.

## Limites

La télémétrie peut créer des risques liés aux coûts, au bruit et à la vie privée. Plus de journaux ne produisent pas automatiquement une meilleure compréhension. L'instrumentation doit être conçue autour des questions auxquelles l'équipe doit répondre.

## Concepts connexes

Lire [Agent d'IA](/fr/knowledge/concepts/ai-agent/), [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/) et [Provenance](/fr/knowledge/concepts/provenance/).

## Technologies connexes

Voir [OpenTelemétrie](/fr/knowledge/technologies/opentelemetry/), [Modèle de protocole de contexte](/fr/knowledge/technologies/model-context-protocol/) et [Événements nuageux](/fr/knowledge/technologies/cloudevents/).

## Glossaire

Trace : enregistrement lié d'une requête ou d'un flux de travail entre les composants.

Span : une opération chronométrée à l'intérieur d'une trace.

métrique : mesure agrégée comme la latence, le nombre ou le taux d'erreur.

Événement de vérification : document durable d'une action ou d'une décision significative.

Redaction : suppression du contenu sensible avant stockage ou affichage.

## Références

- La télémétrie ouverte. Conventions sémantiques 1.42.0.
- Modèle de protocole contextuel. Spécification. 2025-06-18.
- Nuage Native Computing Foundation. Les événements nuageux.
