---
id: ea:publication:retrieval-augmented-generation-and-knowledge-systems-fr
type: publication
slug:
  canonical: retrieval-augmented-generation-and-knowledge-systems
title: Génération augmentée par récupération et systèmes de connaissance
subtitle: Article technique
abstract: "Une explication de bout en bout de l'architecture du RAG, l'ingestion, le chunking, l'intégration, la récupération hybride, les graphiques, les citations, les permissions et l'évaluation."
description: "Découvrez comment fonctionne la génération augmentée par la récupération et comment construire des systèmes RAG basés sur des sources avec des métadonnées, des graphes de connaissances et une évaluation."
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
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:knowledge-graph
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:large-language-model
  - id: ea:program:vaste
claims:
  - "La qualité du RAG dépend de l'architecture du corpus, de la récupération et de l'attribution plutôt que de la seule recherche vectorielle."
  - "Les systèmes hybrides peuvent combiner des embeddings avec des relations de graphe typées pour préserver l'identité sémantique et les chemins source."
evidence:
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:knowledge-graph
sources:
  - title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
    author: Patrick Lewis et al.
    publisher: arXiv
    publishedAt: 2020-05-22
    accessedAt: 2026-06-24
    url: https://arxiv.org/abs/2005.11401
  - title: Active Retrieval Augmented Generation
    author: Zhengbao Jiang et al.
    publisher: arXiv
    publishedAt: 2023-05-11
    accessedAt: 2026-06-24
    url: https://arxiv.org/abs/2305.06983
citation:
  preferred: Electronic Artefacts. "Génération augmentée par récupération et systèmes de
    connaissance". Article technique, version 1.1.1, 2026.
tags:
  - RAG
  - graphe de connaissances
  - Vector Search
  - Embeddings
  - Citations
disciplines:
  - intelligence artificielle
  - systèmes de connaissance
  - architecture de l’information
  - apprentissage automatique
translationOf: ea:publication:retrieval-augmented-generation-and-knowledge-systems
---

## Problème

Les modèles linguistiques peuvent générer des réponses fluides sans preuves actuelles ou attribuables. Les implémentations Naïves RAG ajoutent la recherche vectorielle mais laissent l'autorité du corpus, les permissions, l'identité source et la précision de citation non résolue.

## Présentation

La génération retrieval-augmentée, généralement raccourcie à RAG, relie un modèle générateur à un corps externe d'information. Au lieu de demander au modèle de ne répondre qu'à partir de paramètres appris et de l'invite de l'utilisateur, le système récupère les enregistrements pertinents et les place dans le contexte de travail du modèle. Le modèle produit ensuite une réponse éclairée par ces documents.

Le modèle traite de deux limites des modèles paramétriques. Les connaissances stockées dans les poids des modèles sont difficiles à mettre à jour avec précision, et les extrants des modèles n'exposent pas intrinsèquement la provenance. La recherche externe permet à un corpus de changer indépendamment du modèle et crée une occasion de citer des sources.

RAG est souvent réduit à trois étapes : des documents fractionnés, des morceaux d'intégration et une base de données vectorielle. Cette mise en œuvre peut produire une démonstration, mais elle n'est pas encore un système de connaissances digne de confiance. Le RAG durable exige la gouvernance de corpus, les métadonnées, les permissions, la conception des requêtes, le classement, l'assemblage contextuel, la citation, l'évaluation et la maintenance.

## L'architecture originale

Le document RAG 2020 de Lewis et de ses collègues a combiné un modèle de séquence à séquence préformé avec un indice vectoriel dense utilisé comme mémoire non paramétrique. Un récupérateur a sélectionné les passages pertinents à une entrée, et le générateur a conditionné sa sortie sur le matériau récupéré.

L'importante séparation conceptuelle est entre la mémoire paramétrique et la mémoire externe. Les paramètres du modèle encodent les modèles appris pendant l’entraînement. Le corpus de recherche contient des documents adressables qui peuvent être mis à jour, inspectés et attribués. Un système peut remplacer ou corriger une source sans recycler le modèle linguistique complet.

Les systèmes modernes de RAG prolongent cette conception avec la recherche hybride, le reclassage, les graphes de connaissances, la décomposition des requêtes, l'utilisation d'outils, la récupération active et l'évaluation en plusieurs étapes. La question sous-jacente demeure stable: comment le système devrait-il trouver et présenter les preuves appropriées pour une tâche génératrice?

## Architecture

L'architecture comprend l'ingestion de source, l'identité canonique, la segmentation, les métadonnées, les index lexiques ou vectoriels, la transformation des requêtes, la recherche de candidats, le reclassage, l'assemblage de contextes, la génération, la citation et l'évaluation.

## Architecture Corpus

RAG commence avant l'intégration. Le corpus a besoin d'une portée définie, d'un modèle d'autorité et d'un processus de mise à jour. Un dossier de PDF, d'exportations et de notes mixtes peut contenir des duplicatas, des versions remplacées, du matériel privé et des titres incohérents. L'indexation sans gouvernance rend ces problèmes plus difficiles à voir.

Chaque source devrait avoir une identité stable et des métadonnées utiles : titre, auteur, date, type, droits, langue, version, visibilité et URL canonique. Les sections devraient conserver leur document et leur contexte de rubrique. Le texte dérivé du ROC ou la transcription doit pouvoir être distingué du texte source vérifié.

Electronic Artefacts modélisent déjà beaucoup de ces exigences. Publications, concepts, programmes et projets ont des ID canoniques, des versions, des niveaux de confiance et des sources. Les relations les relient. Ce corpus structuré est meilleur matériel RAG que les morceaux anonymes car la récupération peut préserver le sens au-delà de la similitude textuelle.

## Segmentation et découpage

Les modèles linguistiques reçoivent un contexte délimité, si longtemps les documents sont divisés en unités de recherche. Le découpage détermine ce que le récupérateur peut retourner. Les catégories trop petites peuvent perdre des définitions et des qualifications. Les morceaux trop gros peuvent diluer la pertinence et consommer le contexte.

Les fenêtres en token fixes sont faciles mais ignorent la structure. Des tentatives sémantiques pour séparer les changements de sujet, mais peuvent être instables. Le découpage des documents est effectué suivant les rubriques, paragraphes, listes, tableaux ou blocs de codes. La meilleure stratégie dépend du matériel et des questions.

Un morceau devrait conserver un pointeur vers sa source et son emplacement parent. Il peut comprendre un préfixe de titre ou un résumé pour la recherche, tandis que le texte original reste disponible pour la citation. Overlap peut préserver la continuité, mais augmente la duplication et peut crowd résultats avec des passages presque identiques.

Pour le centre de connaissances, les titres de section offrent des unités naturelles. Une question sur les limitations devrait récupérer la section de limitation avec l'identité de l'article et les sources, et non un paragraphe sans contexte.

## Récupération sparmée, dense et hybride

La récupération sparse utilise des preuves lexicales telles que les termes exacts et la fréquence des termes. Il est fort pour les noms, les identifiants, les symboles de code et les phrases distinctives. Recherche dense des requêtes et des passages dans l'intégration des vecteurs, puis trouve des représentations à proximité. Il peut saisir la similitude sémantique lorsque la formulation diffère.

Ni domine toutes les tâches. Une recherche dense peut confondre des concepts connexes ou manquer des identifiants exacts rares. La recherche lexique peut manquer les paraphrases. La récupération hybride combine des scores ou des ensembles de candidats. Les reclasseurs peuvent alors évaluer les résultats les plus prometteurs avec un modèle plus cher.

La stratégie de recherche devrait refléter le corpus. Une archive technique avec des ID stables bénéficie d'une correspondance exacte. Une collection d'essais culturels bénéficie de la récupération sémantique. Le contenu multilingue peut nécessiter des embeddings translingues ou une indexation linguistique.

L'évaluation doit permettre de déterminer si les éléments de preuve pertinents figurent dans l'ensemble des candidats, et non seulement si la réponse finale semble bonne.

## Embedures et leurs limites

Une intégration est une représentation numérique conçue de façon à ce que les intrants connexes occupent les régions voisines sous une mesure de similarité choisie. Les inscriptions rendent la recherche sémantique pratique, mais elles n'expriment pas pourquoi deux éléments sont liés.

Deux passages peuvent être proches parce qu'ils partagent un sujet, un style ou un vocabulaire. Une relation graphique typée peut dire qu'une publication documente un concept, un projet applique une méthode ou un programme alimente un produit. Ces significations sont différentes même lorsque le texte apparaît similaire.

Les inscriptions changent aussi avec les modèles et le prétraitement. La réindexation peut modifier les quartiers. La similitude vectorielle est donc un indice, pas une couche de vérité canonique. Préserver l'identité de la source et la structure de la relation à l'extérieur du magasin d'intégration.

## Graphes de connaissances et RAG fondé sur un graphe

Un graphe de connaissances représente explicitement les entités et les relations typées. Il peut améliorer la récupération en s'étendant d'une entité reconnue, en suivant les prédicats pertinents, en filtrant par type ou en assemblant un quartier délimité.

Par exemple, une question sur l'écoute automatique dans Palimpsests pourrait résoudre l'entité du projet, suivre `poweredBy` à ORETH, suivre les concepts appliqués à l'archéologie des signaux, et récupérer les publications support. La recherche vectorielle seule peut renvoyer des articles audio similaires sans exposer ce chemin projet-programme-concept.

La recherche de graphiques n'élimine pas la recherche de texte. Le graphique peut identifier les documents qui comptent, tandis que la récupération lexicale et sémantique sélectionne les meilleurs passages en eux. Cette architecture hybride préserve la structure explicable et le langage expressif.

VASTE est un contexte de recherche naturel pour ce design. L'exécution contextuelle peut déterminer quel voisinage de graphe un utilisateur peut récupérer et quelles relations devraient influencer une réponse.

## Compréhension des requêtes

Les questions des utilisateurs sont rarement des requêtes de recherche parfaites. Le système peut normaliser la terminologie, résoudre des entités, générer d'autres formulations ou décomposer une requête complexe en sous-questions. Chaque transformation peut améliorer le rappel ou introduire la dérive.

La résolution des entités est particulièrement précieuse. "VASTE runtime" devrait cartographier le programme canonique plutôt qu'un sens générique de vaste. Les dates, versions et lieux peuvent restreindre la recherche. Une question de comparaison nécessite des preuves pour les deux parties, pas seulement le passage le plus similaire.

Les systèmes actifs de récupération décident quand des preuves supplémentaires sont nécessaires pendant la génération. Cela peut aider les réponses à long terme, mais augmente les coûts et fait de la trajectoire de récupération une partie de l'évaluation.

Les transformations de requêtes doivent être enregistrées. Lorsqu'un système répond mal, les ingénieurs doivent savoir si la source était absente, la question était fausse, le classement a échoué ou la génération a ignoré les preuves.

## Montage du contexte

Les passages récupérés doivent être disposés dans un contexte que le modèle peut utiliser. L'assembleur peut regrouper les résultats par source, supprimer les duplicatas, attribuer des budgets symboliques et inclure des métadonnées. Questions de commande : les modèles peuvent prioriser les passages précoces ou tardifs différemment.

Le contexte devrait distinguer les instructions de la preuve. Les documents récupérés sont des données non fiables et peuvent contenir du texte qui ressemble à des commandes. La demande doit indiquer que les sources doivent être analysées et non pas être suivies comme instructions du système.

Les sources conflictuelles ne devraient pas être fusionnées silencieusement. Les dates, la confiance et la provenance aident le modèle à représenter un désaccord. Lorsque le corpus contient un enregistrement canonique et une note remplacée, les métadonnées d'état doivent affecter la sélection.

Le contexte idéal n'est pas le plus grand contexte possible. Il s'agit de la plus petite preuve suffisante pour répondre avec exactitude à la question.

## Création et citation

Il faudrait demander au générateur de répondre à partir des éléments de preuve fournis, d'identifier l'incertitude et de joindre des citations aux allégations. Le format de citation devrait utiliser des identifiants source stables ou des URL plutôt que des chaînes bibliographiques générées par un modèle.

Une citation n'est utile que si elle appuie l'énoncé connexe. Les systèmes doivent tester l'implication de citation: le passage cité justifie-t-il réellement la revendication? Un modèle peut citer une source pertinente tout en ajoutant des détails non pris en charge.

Pour les réponses complexes, le système peut produire une représentation structurée intermédiaire avec des revendications et des références sources avant de rendre la prose. Le code déterministe peut valider que chaque citation indique un enregistrement récupéré.

L'interface finale devrait permettre aux lecteurs d'ouvrir la source et de comprendre son autorité. Les citations cachées disponibles uniquement dans les journaux ne créent pas de confiance publique.

## Autorisations et vie privée

RAG peut fuir l'information si la récupération ignore le contrôle d'accès. Le filtrage après génération est trop tard car le contenu privé peut déjà influencer la réponse. Les contraintes d'autorisation doivent s'appliquer lors de la sélection des candidats et de l'assemblage du contexte.

Le récupérateur a besoin de l'identité de l'acteur, du but et de la visibilité des ressources. Un visiteur public ne devrait recevoir que des documents publics. Un membre du studio peut récupérer des notes internes. Un agent spécifique à un projet peut avoir accès à des documents restreints aux fins d'analyse, mais ne publier que les revendications dérivées approuvées.

Les inscriptions elles-mêmes peuvent révéler une structure sensible. Des index distincts ou des filtres à métadonnées robustes peuvent être nécessaires. La suppression doit supprimer le texte source, les vecteurs, les caches et les résumés générés lorsque la politique l'exige.

C'est une autre raison de connecter RAG avec l'exécution contextuelle plutôt que de le traiter comme un chatbot autonome.

## Évaluation

L'évaluation du RAG devrait séparer les étapes. La couverture Corpus demande si la réponse existe dans le matériel indexé. Le rappel de récupération demande si des documents pertinents apparaissent. Le classement demande s'ils sont prioritaires. La qualité du contexte demande si les preuves sont suffisantes et non redondantes. La fidélité des générations demande si les revendications découlent de sources. Réponse qualité demande si le résultat est utile.

Construisez un ensemble de questions à partir des besoins réels des utilisateurs. Inclure les questions sans réponse, les termes ambigus, les sources contradictoires, les faits sensibles aux versions et les limites des permissions. Un système doit savoir quand s'abstenir ou demander des éclaircissements.

Les mesures automatisées peuvent comparer les passages récupérés avec des preuves marquées, tandis que les évaluateurs humains évaluent la nuance et l'utilité. Les évaluateurs basés sur des modèles peuvent aider mais ne devraient pas être la seule autorité.

Défauts de piste par cause. "La réponse était fausse" n'est pas suffisamment actionnable pour un système à plusieurs étapes.

## Entretien

Un indice RAG est un produit dérivé. Lorsqu'une source change, les morceaux et les éléments d'intégration touchés doivent être mis à jour. Les suppressions et les changements d'accès doivent se propager. Les mises à jour de modèles peuvent nécessiter une re-embuding du corpus. Les matériaux dupliqués ou stalles doivent être taillés.

Index buildings besoin manifeste que la version source d'enregistrement, la stratégie de découpe, le modèle d'intégration et la date. Cela permet une reproductibilité et un retour en arrière. La qualité de la recherche devrait être réévaluée après les changements.

Le graphique peut aider à identifier l'impact. Si un concept change, les publications et les collections connexes peuvent être mises en attente pour examen. L'infrastructure de récupération fait alors partie de la gouvernance éditoriale plutôt que d'une expérience distincte.

## Mise en œuvre

Commencez par un petit corpus faisant autorité et un ensemble de questions. Préserver les documents parent et les chemins de section, combiner la récupération exacte et sémantique, retourner les citations stables, et tester le filtrage de permission avant d'ajouter l'extension de requête agentique.

## Éléments de preuve

Lewis et al. ont procédé à la récupération officielle en tant que mémoire non paramétrique combinée à un générateur. Plus tard, la recherche active-récupération explore des systèmes qui récupèrent des preuves supplémentaires pendant la génération plutôt qu'une seule fois au début.

## Implications pour Electronic Artefacts

Le Knowledge Hub peut alimenter un assistant de recherche basé sur la source, un moteur de lecture connexe et une interface de recherche sémantique. VASTE peut fournir une recherche de graphiques identitaires. V6 peut répondre à des questions sur les personnes, les techniques, les matériaux et les institutions tout en exposant les chemins de relations. ORETH peut récupérer les annotations audio, les analyses et le contexte du projet.

La surface publique devrait rester utile sans l'IA. Les pages canoniques, les citations et la navigation sont primaires. RAG est un moyen de demander cette bibliothèque structurée, pas un remplacement pour elle.

Cet ordre est important pour la conservation à long terme. Les modèles et les index peuvent être reconstruits; les documents sources bien établis demeurent l'actif durable.

## Limites

RAG ne garantit ni vérité ni exhaustivité. Les sources pertinentes peuvent être absentes, le classement peut échouer et les modèles peuvent ignorer ou fausser les données recueillies. L'évaluation du domaine et la responsabilité éditoriale demeurent nécessaires.

## Concepts connexes

Lire [Génération augmentée par récupération](/fr/knowledge/concepts/retrieval-augmented-generation/), [Graphe de connaissances](/fr/knowledge/concepts/knowledge-graph/), [Métadonnées](/fr/knowledge/concepts/metadata/), [Provenance](/fr/knowledge/concepts/provenance/) et [Grand modèle de langage](/fr/knowledge/concepts/large-language-model/).

## Programmes connexes

Voir [VASTE](/fr/programs/vaste/) et [V6](/fr/projects/v6/).

## Glossaire

Corpus: la collection de matériel disponible pour la récupération.

Chunk : unité de récupération délimitée dérivée d'une source.

Embedding : représentation vectorielle utilisée pour la recherche de similitude.

Rerancher : un modèle qui réorganise les résultats des candidats.

Fidèle : la mesure dans laquelle les revendications générées découlent des preuves fournies.

Quartier graphique : un ensemble limité d'entités et de relations autour d'un nœud.

## Références

- Lewis et al. Génération accrue de données pour les tâches de PNL axées sur le savoir. 2020.
- Jiang et al. Active Retrieval Augmented Generation. 2023.
