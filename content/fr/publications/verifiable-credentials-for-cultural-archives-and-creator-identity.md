---
id: ea:publication:verifiable-credentials-for-cultural-archives-and-creator-identity-fr
type: publication
slug:
  canonical: verifiable-credentials-for-cultural-archives-and-creator-identity
title: Identifiants vérifiables pour les archives culturelles et l’identité des créateurs
subtitle: Article technique
abstract: "Un article pratique sur Verifiable Credentials du W3C, identité du créateur, archives culturelles, provenance, revendications, vie privée et confiance lisible par machine."
description: "Comprendre comment les justificatifs vérifiables peuvent soutenir l'identité du créateur, la provenance des archives, les flux de travail des droits et les revendications de confiance dans les systèmes de connaissances culturelles."
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
  - id: ea:concept:provenance
  - id: ea:concept:entity-identity
  - id: ea:concept:digital-preservation
  - id: ea:concept:linked-data
  - id: ea:technology:c2pa
claims:
  - "Les justificatifs vérifiables peuvent exprimer des revendications signées concernant les créateurs, les oeuvres, les droits ou les événements d'archives, mais la confiance dépend toujours du contexte de l'émetteur et de la politique de vérification."
  - "Les systèmes culturels devraient utiliser les justificatifs d'identité comme une seule couche de provenance, parallèlement aux registres graphiques, à l'examen rédactionnel, aux métadonnées sur les droits et à l'interprétation publique."
evidence:
  - id: ea:concept:provenance
  - id: ea:concept:entity-identity
sources:
  - title: Verifiable Credentials Data Model v2.0
    publisher: W3C
    publishedAt: 2025-05-15
    accessedAt: 2026-06-25
    url: https://www.w3.org/TR/vc-data-model-2.0/
  - title: PROV-Overview
    publisher: W3C
    publishedAt: 2013-04-30
    accessedAt: 2026-06-25
    url: https://www.w3.org/TR/prov-overview/
  - title: C2PA Specifications
    publisher: Coalition for Content Provenance and Authenticity
    accessedAt: 2026-06-25
    url: https://spec.c2pa.org/specifications/specifications/2.2/index.html
citation:
  preferred: Electronic Artefacts. "Identifiants vérifiables pour les archives culturelles et
    l’identité des créateurs". Article technique, version 1.1.1, 2026.
tags:
  - Verifiable Credentials
  - Creator Identity
  - Provenance
  - Digital Préservation
  - Cultural Archives
disciplines:
  - infrastructure culturelle
  - systèmes de connaissance
  - Digital Préservation
  - Web Standards
translationOf: ea:publication:verifiable-credentials-for-cultural-archives-and-creator-identity
---

## Problème

Les systèmes créatifs et culturels doivent savoir qui a fait une œuvre, qui a signé une déclaration, quelle organisation a publié un document, quels droits s'appliquent et quelles preuves appuient une revendication. Les pages Web conventionnelles peuvent dire ces choses, mais elles sont souvent difficiles à vérifier, à réutiliser ou à transporter.

Les justificatifs vérifiables offrent un moyen d'exprimer des revendications qui peuvent être vérifiées cryptographiquement. L'occasion est importante pour l'identité des créateurs et les archives. Le danger est de traiter une revendication signée comme une vérité finale plutôt qu'un seul morceau de provenance.

## Présentation

Verifiable Credentials du W3C définit un modèle de données pour les créances faites par un émetteur au sujet d'un sujet et présentées à un vérificateur. Un titre peut représenter un permis de conduire, une affiliation, un certificat, une autorisation, une demande d'auteur ou une déclaration institutionnelle. Le modèle comprend l'émetteur, le sujet, les créances, la preuve, la validité et les métadonnées connexes.

Pour les infrastructures culturelles, l'utilisation intéressante n'est pas seulement l'identité personnelle. Les lettres de créances peuvent exprimer des revendications lisibles par machine concernant les créateurs, les oeuvres, les événements d'archives, les droits, l'adhésion à la collection, l'approbation institutionnelle ou le statut de publication.

Electronic Artefacts utilisent déjà l'identité et la provenance des entités dans les documents publics. Des justificatifs vérifiables pourraient étendre cette architecture en laissant certaines revendications devenir portables, signées et contrôlables indépendamment tout en restant intégrées dans un graphique plus large d'interprétation.

## Architecture

Une architecture de justificatifs vérifiable comprend les émetteurs, les détenteurs, les vérificateurs, les sujets de justificatifs, les réclamations, les mécanismes de preuve, le statut, les schémas, la politique de confiance, les contrôles de confidentialité et les documents graphiques qui contextualisent le justificatif. Le titre porte des revendications signées. L'archive décide de l'interprétation de ces revendications.

## Émetteurs, détenteurs et vérificateurs

Les rôles de base sont l'émetteur, le détenteur et le vérificateur. L'émetteur fait une réclamation. Le détenteur stocke et présente le titre. Le vérificateur vérifie le titre de créance et décide de faire confiance à l'émetteur pour ce contexte.

Dans les systèmes culturels, ces rôles peuvent être flexibles. Un créateur peut détenir un titre délivré par un studio. Un musée peut délivrer une attestation d'acquisition. Une plateforme d'édition peut vérifier un titre de créateur avant d'afficher l'attribution. Une archive peut vérifier un titre institutionnel avant d'importer des documents.

La confiance n'est pas automatique. Une signature valide prouve qu'un titre de créance n'a pas été altéré et a été émis par une clé. Elle ne prouve pas que l'émetteur fait autorité, est honnête ou approprié pour chaque créance.

## Réclamations et sujets

Les lettres de créances expriment des revendications sur des sujets. Un sujet peut être une personne, une organisation, un travail, un événement, un ensemble de données, un projet ou une autre entité. Cela s'harmonise avec la pensée du graphe de connaissances parce que la revendication a besoin d'une identité de sujet stable.

Par exemple, un titre de compétence peut indiquer qu'un organisme particulier a publié un dossier de projet à une date, qu'un créateur a contribué à une oeuvre ou qu'un examen des droits a été effectué. Ces revendications deviennent plus utiles lorsque les sujets ont des ID stables et des pages canoniques.

L'allégation devrait être suffisamment étroite pour être vérifiée. "Cette œuvre est authentique" est trop large. « Cet organisme a signé ce document à cette date » est plus clair.

## Identité du créateur

L'identité du créateur est plus qu'un nom d'affichage. Elle peut comprendre des pseudonymes, des collectifs, des rôles, des périodes d'activité, des œuvres, des droits, des plateformes et des références institutionnelles. Les lettres de créances peuvent aider les créateurs à porter des revendications particulières à travers les systèmes sans dépendre entièrement des profils de plateforme.

Un certificat de créateur pourrait supporter l'attribution, la vérification de portefeuille, l'accès contributeur ou les workflows de droits. Il ne devrait pas forcer l'exposition publique à l'identité légale lorsqu'une identité pseudonyme ou collective est l'identité culturelle significative.

La conception pour les créateurs consiste à appuyer la divulgation sélective, les revendications spécifiques au rôle et les mécanismes de correction. L'infrastructure d'identité peut protéger les créateurs ou les exposer trop souvent selon la mise en œuvre.

## Provenance des archives

Les archives peuvent utiliser des références pour renforcer la provenance. Un titre de créance peut attester le dépôt, l'examen, la publication, la transformation, l'apurement des droits ou l'action de préservation. Le justificatif peut être stocké aux côtés d'enregistrements du graphe et de métadonnées de fichiers.

Cela complète la pensée du W3C PROV. PROV modèle des entités, des activités et des agents. Les lettres de créance vérifiables peuvent signer certaines réclamations concernant ces entités, activités et agents. Le graphique peut ensuite relier les revendications signées aux documents, sources et interprétation visibles.

Les pouvoirs ne doivent pas remplacer la description des archives. Ils rendent certaines allégations vérifiables. Ils n'expliquent pas par eux-mêmes la signification culturelle.

## Comparaison C2PA

C2PA met l'accent sur la provenance des médias rattachés ou associés à des actifs. Les justificatifs vérifiables sont plus larges et peuvent exprimer de nombreuses sortes de revendications. Les deux approches peuvent travailler ensemble.

Un atout médiatique peut porter des lettres de créances C2PA décrivant l'origine et les modifications du niveau de fichier. Une archive culturelle peut également stocker des justificatifs vérifiables sur l'identité du créateur, l'examen des droits ou la publication institutionnelle. La page publique peut expliquer comment ces couches se rapportent.

La distinction est importante. La provenance au niveau du fichier n'est pas la même que l'identité du créateur. Un titre de créateur signé n'est pas le même que l'histoire de la transformation des médias. Une archive robuste peut modéliser les deux.

## Droits et autorisations

Les workflows de droits sont prometteurs mais sensibles. Un titre de compétence peut indiquer qu'une personne a accordé la permission d'une utilisation particulière, qu'une licence s'applique ou qu'un examen des droits a été effectué. Mais les droits sont légaux et contextuels. Un justificatif ne devrait pas les simplifier trop.

Utiliser des types précis de revendications, des périodes de validité, des notes de compétence et des références de source. Conservez l'accord sous-jacent le cas échéant. Permettre la révocation ou les mises à jour de l'état lorsqu'un titre de compétence ne s'applique plus.

L'exposition publique devrait éviter d'impliquer une autorisation plus large que le titre de compétence réellement accordé.

## Confidentialité

Les pouvoirs peuvent divulguer des renseignements. Les identifiants, les signatures, les modèles d'émetteurs et les présentations répétées peuvent permettre la corrélation. La spécification de W3C comprend des considérations de confidentialité pour la corrélation, les métadonnées et la minimisation des données basées sur les identifiants.

Les archives culturelles ont besoin de soins supplémentaires parce que l'identité peut être politiquement, socialement ou personnellement sensible. La reconnaissance publique et la protection de la vie privée ne sont pas contraires, mais elles nécessitent une conception.

Préférez les revendications minimales. Un dossier public peut devoir vérifier le rôle d'un artiste sans exposer une adresse, un nom légal ou des identifiants indépendants.

## Politique de confiance

La vérification exige une politique. Quels émetteurs font confiance aux archives? Pour quels types de réclamations? Dans quelles conditions ? Que se passe-t-il lorsqu'une clé est tournée, qu'un titre de créance expire ou qu'un émetteur est compromis?

Sans politique, la vérification devient théâtre. Un système peut afficher un contrôle vert alors que les utilisateurs ne savent pas ce qui a été effectivement vérifié. L'interface devrait indiquer ce qui a été vérifié et ce qui n'a pas été vérifié.

Pour Electronic Artefacts, la politique de confiance pourrait être graph-aware. L'organisation peut se fier aux documents de publication, à un collaborateur pour les demandes de contribution au projet et à un organisme de normalisation pour la documentation du protocole, mais ce sont des relations de confiance différentes.

## Implications pour Electronic Artefacts

Electronic Artefacts pourrait utiliser des justificatifs d'identité vérifiables pour signer des documents de publication, des déclarations de contribution du créateur, des événements de dépôt d'archives, des jalons d'examen des droits ou des énoncés de projet. Ces pouvoirs ne remplaceraient pas le centre de connaissances. Ils ajouteraient une couche de confiance portable à certaines revendications.

Les palimpsestes pourraient bénéficier de lettres de créances qui distinguent la contribution du créateur, la provenance des médias et l'état de diffusion publique. Vestiges pourrait utiliser des identifiants pour connecter les objets d'archives aux déclarations institutionnelles. VASTE pourrait valider les références dans le cadre de l'exécution contextuelle avant d'accorder l'autorisation d'accès ou de publication.

L'utilisation la plus précieuse est sélective. Toutes les relations n'ont pas besoin d'un justificatif. Les pouvoirs doivent être réservés aux réclamations pour lesquelles la portabilité, la vérification ou la confiance institutionnelle modifient le résultat.

## Mise en œuvre

Commencez par un type d'allégation à faible risque : Electronic Artefacts signe un titre de créance affirmant qu'il a publié un article de centre de connaissances public spécifique avec une URL canonique et une date. Conservez l'ID du titre dans l'enregistrement graphique et exposez une note de vérification lisible par l'homme.

Puis testez une demande de contribution pour un projet avec le consentement explicite. Définir l'identité de l'émetteur, les identifiants de sujet, le schéma de réclamation, le statut de révocation, la politique de confidentialité et le langage d'affichage avant de s'étendre.

Ne commencez pas avec de larges portefeuilles d'identité ou l'automatisation des droits légaux. Commencez par des allégations étroites et inspectables qui améliorent la provenance.

## Éléments de preuve

W3C Verifiable Identities Data Model v2.0 définit un modèle extensible pour les réclamations faites par les émetteurs au sujet de sujets et décrit les considérations de sécurité, de confidentialité, d'accessibilité et d'internationalisation. W3C PROV fournit un modèle de provenance plus large pour les entités, les activités et les agents. C2PA fournit un cadre de provenance propre aux médias pour les références de contenu.

Ces normes mettent en évidence une approche stratifiée : revendications signées, graphiques de provenance, manifestes médiatiques et contexte éditorial.

## Limites

Les justificatifs vérifiables ne résolvent pas la confiance par elles-mêmes. Une fausse réclamation peut être signée. Un titre valide peut être présenté dans un contexte trompeur. Un vérificateur peut faire confiance au mauvais émetteur. La vie privée peut être endommagée par une divulgation excessive.

La technologie est la plus forte lorsque les créances sont étroites, que les émetteurs sont connus, que les sujets ont une identité stable et que la politique de vérification est visible.

## Concepts connexes

Lire [Provenance](/fr/knowledge/concepts/provenance/), [Identité de l'entité](/fr/knowledge/concepts/entity-identity/), [Préservation numérique](/fr/knowledge/concepts/digital-preservation/) et [Données liées](/fr/knowledge/concepts/linked-data/).

## Technologies connexes

Voir [C2PA](/fr/knowledge/technologies/c2pa/), [JSON-LD](/fr/knowledge/technologies/json-ld/) et [RDF](/fr/knowledge/technologies/rdf/).

## Glossaire

Titre de créance vérifiable : objet de données signé exprimant des créances d'un émetteur sur un sujet.

Émetteur : le parti qui crée et signe un titre.

Détenteur : la partie qui stocke et présente un titre.

Vérificateur : la partie qui vérifie un titre et décide de lui faire confiance.

Divulgation sélective: ne révéler que les revendications nécessaires à une interaction spécifique.

## Références

- W3C. Modèle de données de vérification des pouvoirs v2.0. 2025.
- W3C. Aperçu de PROV. 2013.
- Coalition pour la provenance et l'authenticité du contenu. C2PA Spécifications.
