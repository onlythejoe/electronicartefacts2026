---
id: ea:publication:webmcp-and-the-agentic-web-fr
type: publication
slug:
  canonical: webmcp-and-the-agentic-web
title: WebMCP et le web agentique
subtitle: Article de recherche
abstract: Guide critique de WebMCP et du web agentique émergent, où les pages exposent des capacités typées aux agents de navigateur tout en préservant interface, origine et contrôle humain.
description: Explorer WebMCP, les outils structurés du navigateur, les formulaires déclaratifs, les permissions et le rôle persistant du HTML sémantique et de l’accessibilité.
locale: fr
visibility: public
publicationClass: published
status: experimental
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
  - id: ea:technology:webmcp
  - id: ea:technology:model-context-protocol
  - id: ea:concept:browser-software
  - id: ea:concept:human-computer-interaction
  - id: ea:concept:ai-agent
  - id: ea:concept:linked-data
claims:
  - Des outils de page structurés peuvent réduire l’automatisation fragile sans remplacer l’interface web visible.
  - Les actions lisibles par agent doivent rester soumises à la sécurité des origines, à l’intention humaine, à l’accessibilité et à une autorisation explicite.
evidence:
  - id: ea:technology:webmcp
  - id: ea:concept:browser-software
sources:
  - title: WebMCP Explainer and Draft
    publisher: W3C Web Machine Learning Community Group
    accessedAt: "2026-07-12"
    url: https://github.com/webmachinelearning/webmcp
  - title: 6 May 2026 AI Agent Protocol Community Group Meeting
    publisher: W3C
    publishedAt: "2026-05-06"
    accessedAt: "2026-07-12"
    url: https://www.w3.org/events/meetings/cdb16df7-1ed9-4868-8429-b759e22b4bc7/20260506T210000/
citation:
  preferred: 'Electronic Artefacts. "WebMCP et le web agentique." Article technique, version 1.0.0, 2026.'
tags: [WebMCP, web agentique, agents de navigateur, collaboration humain-agent, standards du Web]
disciplines: [architecture web, interaction humain-machine, intelligence artificielle]
translationOf: ea:publication:webmcp-and-the-agentic-web
---

## Problème

La plupart des agents de navigateur agissent aujourd’hui comme des utilisateurs pressés. Ils inspectent captures ou arbres d’accessibilité, devinent le contrôle utile puis simulent des clics. L’approche est générale, mais lente et fragile : une refonte, un libellé ambigu ou un composant différé peut rompre le parcours.

WebMCP explore un autre contrat : laisser la page déclarer quelques outils structurés. Un agent pourrait invoquer `filter-archive`, `prepare-citation` ou `add-relation-draft` avec des arguments typés, en réutilisant la logique cliente et la session active.

## Architecture

La proposition expérimentale repose sur une interface de contexte au niveau de la page. Les scripts enregistrent des outils nommés avec description, schéma d’entrée et gestionnaire d’exécution. Une voie déclarative cherche à transformer les formulaires HTML ordinaires en capacités équivalentes, sans dupliquer leur comportement.

Le navigateur arbitre découverte et invocation. La page conserve ainsi son origine, son cycle de vie et son état visible. Contrairement à une intégration backend distante, l’outil intégré agit sur le document que l’utilisateur regarde.

## Plus robuste qu’un clic simulé, pas automatiquement sûr

Un outil typé est moins ambigu qu’une coordonnée, mais ses conséquences peuvent être plus larges. Un clic reste contraint par l’interface ; un outil peut condenser plusieurs opérations. Son schéma doit donc définir entrées étroites, sorties prévisibles, validation et effets de bord.

Les lectures constituent un bon départ. Recherche, filtrage, explication et préparation de brouillon apportent de la valeur sans valider silencieusement une transaction. Toute action destructive, financière, juridique ou éditoriale devrait déclencher une confirmation native indiquant précisément le changement.

## Origines, iframes et permissions

La sécurité du Web repose sur origines, contextes de navigation et permissions. Les capacités agentiques doivent suivre ces frontières. Les iframes inter-origines posent des questions concrètes : quel document a enregistré l’outil, quel agent le découvre et quelle session utilisateur porte l’autorité ?

Le brouillon aborde politique de permissions et exposition sélective, mais plusieurs détails restent ouverts. Cette incertitude invite à prototyper prudemment, pas à présenter la proposition comme un standard stabilisé.

## L’interface humaine reste première

Le web agentique ne doit pas devenir un second Web réservé aux machines. HTML sémantique, clavier, libellés, focus et erreurs claires servent humains, technologies d’assistance, moteurs de recherche et agents. Les outils structurés complètent ces bases ; ils ne réparent pas un produit inaccessible.

La meilleure implémentation partage une opération métier entre interface humaine, sémantique accessible et outil agentique. Chaque surface l’exprime différemment sans dupliquer la règle sous-jacente.

## Mise en œuvre

Pour un graphe, les outils de page peuvent proposer des opérations précises : récupérer un voisinage, comparer deux affirmations, exporter une citation ou préparer une relation. Identifiants stables et provenance facilitent l’évaluation par rapport à du texte extrait d’une carte visuelle.

Electronic Artefacts pourrait exposer des outils de lecture du Knowledge Hub tout en maintenant contenus canoniques, JSON-LD et navigation ordinaire comme vérité publique. VASTE pourrait valider une relation proposée sans autoriser sa publication.

## SEO et lisibilité machine

WebMCP n’est pas un raccourci SEO. La visibilité dépend toujours de pages explorables, titres précis, liens internes, données structurées, preuves et prose utile. Les outils pilotent des actions dans une session active ; ils ne remplacent pas l’architecture indexable.

Le recouvrement est conceptuel : moteurs et agents profitent d’entités, relations et sources explicites. Un site fondé sur des objets de connaissance stables est mieux préparé à la recherche humaine, à la récupération IA et aux futurs outils de navigateur qu’un site dont le sens n’existe que dans sa mise en page.

## Éléments de preuve

Le dépôt WebMCP documente l’enregistrement impératif, une voie déclarative pour les formulaires et des questions ouvertes de sécurité et de confidentialité. Les échanges communautaires W3C de 2026 le situent dans un espace de standardisation émergent, pas comme une Recommandation achevée.

## Limites

L’API reste expérimentale. Confirmations, schémas de sortie, streaming, navigation pendant l’exécution et exposition aux agents embarqués sont encore discutés. Le support navigateur et la compatibilité durable ne sont pas acquis.

WebMCP doit être lu comme une direction de recherche porteuse d’un principe utile : exposer la plus petite capacité significative, préserver le contexte visible et laisser le navigateur faire respecter les frontières qu’il connaît déjà.

## À lire ensuite

Voir [Model Context Protocol et systèmes d’IA utilisant des outils](/fr/publications/model-context-protocol-and-tool-using-ai-systems/), [Interaction humain-machine pour les outils créatifs](/fr/publications/human-computer-interaction-for-creative-tools/) et [Recherche IA, contenu structuré et SEO des graphes de connaissance](/fr/publications/ai-search-structured-content-and-knowledge-graph-seo/).

## Références

- W3C Web Machine Learning Community Group. Dépôt et document d’orientation WebMCP, consultés le 12 juillet 2026.
- W3C. Réunion de l’AI Agent Protocol Community Group, 6 mai 2026.
