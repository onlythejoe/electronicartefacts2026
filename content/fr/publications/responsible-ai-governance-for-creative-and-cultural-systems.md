---
id: ea:publication:responsible-ai-governance-for-creative-and-cultural-systems-fr
type: publication
slug:
  canonical: responsible-ai-governance-for-creative-and-cultural-systems
title: Gouvernance responsable de l'IA pour les systèmes créatifs et culturels
subtitle: Article technique
abstract: "Un article pratique sur la gouvernance de l'IA dans les studios de création, les archives culturelles et les systèmes de connaissances, couvrant le risque, l'examen, la provenance, les droits et l'évaluation."
description: "Découvrez comment une gouvernance responsable de l'IA s'applique aux technologies créatives, aux infrastructures culturelles, aux archives, aux médias générateurs et aux flux de connaissances assistés par l'IA."
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
  - id: ea:concept:generative-ai
  - id: ea:concept:augmented-intelligence
  - id: ea:concept:provenance
  - id: ea:concept:systems-thinking
  - id: ea:concept:contextual-execution
claims:
  - "La gouvernance responsable de l'IA est une pratique opérationnelle, pas une politique PDF qui se trouve en dehors des flux de travail des produits, des archives et de la rédaction."
  - "Les systèmes d'IA créatifs et culturels ont besoin de provenance, d'examen humain, de sensibilisation aux droits, de limites de la vie privée et d'évaluation avant que l'automatisation ne devienne une infrastructure."
evidence:
  - id: ea:concept:generative-ai
  - id: ea:concept:provenance
sources:
  - title: AI Act
    publisher: European Commission
    accessedAt: 2026-06-25
    url: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
  - title: AI Risk Management Framework
    publisher: National Institute of Standards and Technology
    accessedAt: 2026-06-25
    url: https://www.nist.gov/itl/ai-risk-management-framework
  - title: Artificial Intelligence Risk Management Framework Generative Artificial Intelligence Profile
    publisher: National Institute of Standards and Technology
    publishedAt: 2024-07-26
    accessedAt: 2026-06-25
    url: https://doi.org/10.6028/NIST.AI.600-1
citation:
  preferred: Electronic Artefacts. "Gouvernance responsable de l'IA pour les systèmes créatifs et
    culturels". Article technique, version 1.1.1, 2026.
tags:
  - Responsible AI
  - gouvernance de l'IA
  - technologies créatives
  - infrastructure culturelle
  - Provenance
disciplines:
  - intelligence artificielle
  - infrastructure culturelle
  - systèmes de connaissance
  - conception de systèmes
translationOf: ea:publication:responsible-ai-governance-for-creative-and-cultural-systems
---

## Problème

Les organisations créatives et culturelles adoptent l'IA pour l'écriture, la recherche, la génération d'images, l'analyse audio, la rédaction de métadonnées, la traduction, le codage et les opérations. Le risque n'est pas seulement qu'un modèle produise une mauvaise réponse. Le risque plus grand est que l'IA devienne une infrastructure discrètement sans qu'il soit clairement question de propriété, d'examen, de suivi des sources, de politique des droits ou d'intervention en cas d'incident.

Les énoncés éthiques génériques de l'IA ne résolvent pas cela. Un studio a besoin d'une gouvernance opérationnelle : ce qui peut être automatisé, ce qui nécessite un examen, quels matériaux peuvent être envoyés à un modèle, comment les sources sont enregistrées, comment les extrants sont étiquetés et quand un système doit refuser ou augmenter.

## Présentation

La gouvernance responsable de l'IA est la discipline qui consiste à déterminer comment les systèmes d'IA sont sélectionnés, conçus, évalués, déployés, surveillés et retraités. Elle comprend des obligations juridiques, mais elle est plus large que la conformité. Il relie la gestion des risques, la conception de produits, les normes éditoriales, la sécurité, la vie privée, les droits et le jugement humain.

La loi européenne sur l'IA et le cadre de gestion des risques de l'IA NIST donnent une orientation claire. La gouvernance de l'IA passe de principes abstraits à des rôles documentés, à des contrôles des risques, à la transparence, à la responsabilisation et à la gestion du cycle de vie. Même lorsqu'un studio créatif n'est pas un fournisseur de modèles de fondation, il agit toujours en tant que déployeur, intégrateur, éditeur ou concepteur de système en aval.

Electronic Artefacts devraient traiter cela comme faisant partie de leur langage de conception. Des systèmes tels que VASTE, ORETH, Palimpsests et le Knowledge Hub peuvent utiliser l'IA, mais ils devraient exposer la provenance, préserver l'organisme humain et garder l'interprétation culturelle distincte de la production du modèle.

## Architecture

Une architecture responsable de gouvernance de l'IA comprend l'inventaire des systèmes, la classification des cas d'utilisation, la politique sur les données, les dossiers des modèles et des fournisseurs, les limites des outils et des délais, l'examen humain, la saisie de la provenance, l'évaluation, le traitement des incidents, le contrôle de l'accès, les événements de vérification et la divulgation publique, le cas échéant.

## Inventaire des cas d ' utilisation

La gouvernance commence par un inventaire. Les équipes doivent savoir où l'IA est utilisée avant de pouvoir la gérer. Un cas d'utilisation peut être la génération de contenu public, la recherche interne, la transcription d'archives, la variation d'image, la segmentation audio, la suggestion de métadonnées, l'assistance en code, la communication client ou la publication automatisée.

Chaque cas d'utilisation devrait enregistrer le but, les utilisateurs, les sources de données, le fournisseur de modèles, les extrants, le niveau d'examen, les personnes touchées et les conséquences d'échec. Cela n'a pas besoin d'être bureaucratique. Une petite table est meilleure que l'adoption invisible.

L'inventaire devrait distinguer les expériences des systèmes de production. Un prototype privé qui résume les articles publics est différent d'un workflow qui réécrit les documents clients ou publie des métadonnées d'archives.

## Classification des risques

Le risque dépend du contexte. Le même modèle peut présenter un faible risque pour les titres de brainstorming et un risque élevé pour la prise de décisions concernant les personnes, les droits ou les preuves publiques. Une archive culturelle a des préoccupations particulières parce que les métadonnées peuvent affecter l'attribution, la réputation, la sensibilité culturelle et l'interprétation future.

Classer les cas d'utilisation par impact. L'aide à faible impact peut être plus légère. Les réclamations publiques, les déclarations de droits, les données à caractère personnel, le matériel culturel restreint et la publication irréversible nécessitent des contrôles plus stricts.

L'objectif n'est pas de bloquer l'expérimentation. Il s'agit d'aligner les efforts d'examen sur les conséquences.

## Examen humain

L'examen humain ne devrait pas être vague. Un examinateur doit savoir ce qu'il vérifie : exactitude des faits, soutien de la source, tonalité, droits, vie privée, sensibilité culturelle, accessibilité, sécurité ou ajustement de la marque.

Pour le travail créatif, la revue protège également la paternité. L'IA peut proposer, transformer et annoter, mais elle ne doit pas écraser silencieusement les décisions artistiques. Un système utile montre des alternatives, préserve les versions et rend l'acceptation explicite.

En termes d'Electronic Artefacts, l'intelligence augmentée est le cadre préféré. L'IA devrait élargir la perception et la mémoire tout en laissant le jugement responsable aux gens.

## Provenance

La gouvernance de l'IA échoue lorsque les extrants perdent leur origine. Un champ texte, image, annotation audio ou métadonnées devrait préserver suffisamment de provenance pour expliquer comment il a été produit. Cela peut inclure le modèle, le modèle rapide, les enregistrements sources, l'éditeur, la date, la version d'outil et l'état d'examen.

La provenance n'exige pas la publication de tous les détails privés. Elle exige un dossier interne fiable et une politique de divulgation publique. Une image générée peut nécessiter une étiquette visible. Une ébauche de métadonnées assistée par l'IA peut n'exiger qu'une piste de vérification interne jusqu'à ce qu'elle soit approuvée.

Pour les archives et les infrastructures culturelles, la provenance n'est pas des frais administratifs. Elle fait partie de l'intelligibilité future du travail.

## Droits et droit d'auteur

La gouvernance créative de l'IA doit inclure les droits. Les équipes devraient savoir si le matériel source peut être téléchargé vers un fournisseur modèle, si les extrants générés peuvent être publiés, si les questions de formation ont une incidence sur les achats et comment les accords de collaboration traitent l'aide à l'IA.

Les droits et la provenance sont liés mais non identiques. Un système peut enregistrer avec précision qu'une sortie a été générée à partir d'une source et n'a toujours pas la permission d'utiliser cette source. Inversement, un workflow sous licence nécessite toujours des dossiers d'attribution et de transformation clairs.

Le plus sûr par défaut est de garder le matériel sensible, client, non libéré et tiers hors des modèles externes, sauf autorisation et conditions contractuelles explicites.

## Confidentialité

Les outils d'IA transforment souvent le travail privé en traitement externe. Une invitation peut comprendre des noms, des emplacements, des détails sur la santé, des pouvoirs, des ébauches, des contrats ou du matériel de projet non publié. La gouvernance doit définir ce qui peut quitter l'infrastructure locale.

Les contrôles de confidentialité devraient fonctionner avant les appels de modèle. La réaction après génération est trop tardive. Pour les assistants internes, les filtres de recherche et le routage du modèle devraient dépendre du rôle de l'utilisateur, de la tâche et de la classe de données.

Les systèmes locaux ou à poids ouvert peuvent réduire l'exposition des fournisseurs, mais ils ne suppriment pas les obligations de confidentialité. Les journaux, les intégrations, les caches et les résumés générés peuvent tous conserver des informations sensibles.

## Évaluation

L'IA responsable nécessite une évaluation liée à la tâche. Un assistant aux métadonnées devrait être mis à l'essai pour déterminer le soutien de la source, la validité du champ, les noms hallucinés et la confiance inappropriée. Un flux d'images créatives devrait être évalué pour les droits, la divulgation et le contrôle des processus. Un flux de travail d'agent devrait être évalué pour les limites de sécurité et de permission des outils.

L'évaluation devrait comprendre des cas contradictoires, des sources ambiguës et des scénarios sans réponse. Un système qui produit toujours quelque chose peut être moins digne de confiance que celui qui peut s'abstenir.

Conservez les dossiers d'évaluation avec la version modèle, la version rapide, la version corpus et la version de schéma d'outil. Autrement, les améliorations et les régressions ne peuvent être expliquées.

## Documentation

La documentation doit être écrite pour les exploitants, les évaluateurs et les futurs responsables. Elle devrait expliquer l'objet, la portée, les limites connues, les sources de données, le processus d'examen, la voie d'escalade et les règles de divulgation publique.

Pour les systèmes publics, la documentation peut faire partie de la confiance. Une page de centre de connaissances devrait identifier son auteur, son éditeur, sa date de modification et ses sources. Une future page assistée par l'IA devrait également être en mesure de dire comment l'IA a été utilisée si cette utilisation affecte l'interprétation.

La documentation ne remplace pas les contrôles. C'est la carte qui permet d'inspecter les contrôles.

## Réponse aux incidents

Les incidents liés à l'IA comprennent des erreurs factuelles, des fuites de renseignements personnels, des appels d'outils dangereux, des extrants biaisés, des violations des droits, une injection de prompt, une publication non autorisée et une provenance trompeuse. La gouvernance a besoin d'un chemin pour les rapports, trier, corriger et postmortem.

Un petit studio peut garder cette légèreté. Définir qui peut interrompre un workflow d'IA, comment les corrections publiques sont émises, où les événements d'audit sont stockés et comment les dossiers touchés sont examinés.

La réponse à l'incident devrait être reprise dans l'évaluation. Si un système échoue dans la production, ajouter un test qui l'aurait attrapé.

## Implications pour Electronic Artefacts

Pour VASTE, la gouvernance signifie les limites des outils, les permissions graphiques, les événements d'audit et l'exécution contextuelle. Pour ORETH, cela signifie une séparation soigneuse entre les mesures d'écoute et l'interprétation artistique. Pour Palimpsests, cela signifie documenter les milieux synthétiques ou transformés sans réduire l'œuvre à une étiquette d'avertissement. Pour le Knowledge Hub, cela signifie l'édition éditoriale basée sur la source.

Le modèle commun est l'infrastructure avec la mémoire. Toute action d'IA qui change les connaissances, les médias ou la représentation du public devrait laisser une trace responsable.

## Mise en œuvre

Commencez par un registre d'utilisation d'IA d'une page et une liste de vérification. Pour chaque workflow, définir les données autorisées, les données interdites, le fournisseur de modèles, le type de sortie, l'examinateur humain, la politique de conservation et la règle de divulgation.

Ensuite, implémentez les contrôles dans le système : récupération basée sur le rôle, modèles rapides sous contrôle de version, schémas d'outils, portes d'approbation, télémétrie, champs de provenance et validation. Ne vous fiez pas à la seule politique lorsque le code peut empêcher un comportement dangereux.

Enfin, examinez le registre tous les trimestres ou chaque fois qu'un modèle, un fournisseur, un ensemble de données ou un processus de publication change.

## Éléments de preuve

La Commission européenne décrit la loi sur l'IA comme un cadre réglementaire comportant un calendrier d'application échelonné, y compris des dispositions déjà en vigueur et une applicabilité plus large le 2 août 2026. Le cadre de gestion des risques d'IA du NIST offre une structure volontaire pour la cartographie, la mesure, la gestion et la gestion des risques d'IA. Le Profil d'IA générative du NIST identifie les risques et les actions propres aux systèmes d'IA génératifs.

Ensemble, ces sources indiquent une gouvernance du cycle de vie opérationnelle plutôt que des déclarations éthiques ponctuelles.

## Limites

Cet article n'est pas un avis juridique. Les obligations en matière d'IA dépendent de la compétence, du rôle, du secteur, de l'utilisation des systèmes et du contexte contractuel. La gouvernance peut réduire les risques, mais elle ne peut éliminer l'incertitude dans les environnements de modèle, de plate-forme et de réglementation en évolution rapide.

Les petites équipes ont également besoin de proportionnalité. Un processus de gouvernance trop lourd sera ignoré. L'objectif pratique est suffisamment clair pour guider les décisions réelles.

## Concepts connexes

Lire [IA générative](/fr/knowledge/concepts/generative-ai/), [Intelligence augmentée](/fr/knowledge/concepts/augmented-intelligence/), [Provenance](/fr/knowledge/concepts/provenance/), [Systèmes de réflexion](/fr/knowledge/concepts/systems-thinking/) et [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/).

## Articles connexes

Continuer avec [C2PA Titres de compétence et provenance des médias génériques](/fr/publications/c2pa-content-credentials-and-generative-media-provenance/), [Observabilité des agents d'IA et des systèmes d'appel d'outils](/fr/publications/observability-for-ai-agents-and-tool-calling-systems/) et [Systèmes de production et de connaissances enrichis par récupération](/fr/publications/retrieval-augmented-generation-and-knowledge-systems/).

## Glossaire

Gouvernance de l'IA: le système d'exploitation des décisions, des contrôles et des dossiers autour de l'utilisation de l'IA.

Registre des cas d'utilisation : inventaire de l'endroit et des raisons pour lesquelles l'IA est utilisée.

Examen humain : inspection responsable des extrants de l'IA en fonction de critères explicites.

Provenance : information sur les sources, les transformations, les personnes, les outils et les décisions.

Incident : une défaillance liée à l'IA qui nécessite une correction, un confinement ou un examen.

## Références

- Commission européenne. Loi sur l'IA.
- Institut national de normalisation et de technologie. Cadre de gestion des risques de l'IA.
- Institut national de normalisation et de technologie. Cadre de gestion des risques de l'intelligence artificielle Profil de l'intelligence artificielle.
