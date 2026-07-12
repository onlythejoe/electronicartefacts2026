---
id: ea:publication:motion-design-time-and-interface-semantics-fr
type: publication
slug:
  canonical: motion-design-time-and-interface-semantics
title: Motion design, temps et sémantique d'interface
subtitle: Article technique
abstract: "Cette synthèse française présente Motion design, temps et sémantique d'interface : mécanismes, usages, limites et liens avec le graphe public d’Electronic Artefacts."
description: "Repères pour comprendre Motion design, temps et sémantique d'interface dans un contexte de conception : concepts clés, implications pratiques, limites et références reliées au graphe Electronic Artefacts."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.0
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:motion-design
  - id: ea:technology:web-animations
  - id: ea:concept:human-computer-interaction
  - id: ea:concept:typography
claims:
  - Motion design, temps et sémantique d'interface doit être lisible comme une synthèse française
    autonome, sans phrases hybrides héritées de l'anglais.
  - Les liens avec les notions, projets et technologies du graphe facilitent la recherche, la navigation et la citation.
evidence:
  - id: ea:concept:motion-design
  - id: ea:technology:web-animations
sources:
  - title: Web Animations
    publisher: W3C
    publishedAt: 2023-06-05
    accessedAt: 2026-06-24
    url: https://www.w3.org/TR/web-animations-1/
  - title: WCAG 2 Overview
    publisher: W3C Web Accessibility Initiative
    accessedAt: 2026-06-24
    url: https://www.w3.org/WAI/standards-guidelines/wcag/
citation:
  preferred: Electronic Artefacts. "Motion design, temps et sémantique d'interface". Article
    technique, version 1.1.0, 2026.
tags:
  - Motion Design
  - Web Animations
  - conception d'interface
  - accessibilité
disciplines:
  - Motion Design
  - design
  - interaction humain-machine
  - développement web
translationOf: ea:publication:motion-design-time-and-interface-semantics
---

## Problème

Le mouvement sur le web est souvent traité comme une décoration. Les éléments s'estompent, glissent, pulsent ou tournent parce que le mouvement peut se sentir poli. Mais le mouvement décoratif peut aussi distraire, désorienter, cacher les changements d'état et gaspiller l'attention.

La vision la plus utile est que la conception de mouvement est l'interface sémantique. Il peut expliquer d'où vient quelque chose, ce qui a changé, ce qui est lié et ce que l'utilisateur peut faire ensuite. Le temps devient une partie du sens.

Electronic Artefacts a besoin de ce sujet car son site s'articule autour de la navigation des connaissances, des projets, des relations graphiques et des médias expérimentaux. Motion peut aider les lecteurs à comprendre ces structures, mais seulement si elle est conçue avec discipline.

## Présentation

La conception du mouvement utilise le temps, le mouvement, le rythme et la transition vers la communication visuelle de structure. Dans les interfaces numériques, il peut communiquer la continuité, la hiérarchie, la rétroaction et la causalité.

La question n'est pas de savoir si une interface se déplace. La question est pourquoi il bouge, combien de temps il bouge, quel état il révèle et si l'utilisateur peut encore lire et contrôler l'expérience.

## Contexte

Web Animations définit un modèle de changement de calendrier pour la présentation des pages. Les transitions CSS, les animations CSS, l'animation SVG et l'animation scénarisée participent toutes à l'environnement de mouvement plus large du web.

Les normes d'accessibilité ajoutent un autre contexte. La motion doit respecter la variation humaine. Certains utilisateurs sont sensibles au mouvement. Certains ont besoin d'une orientation prévisible. Certains naviguent avec des préférences de mouvement réduit.

## Historique

La conception du mouvement est née de titres de films, de graphiques de diffusion, d'animation, de conception d'interactions et de modèles d'interfaces logicielles. À mesure que les interfaces deviennent plus dynamiques, le mouvement passe de la production médiatique à la conception quotidienne de produits.

Sur le web, le mouvement précoce vient souvent de plugins et d'effets scénarisés. Les API du navigateur moderne ont rendu l'animation plus intégrée. Cela a facilité le déploiement, mais pas automatiquement.

## Concepts fondamentaux

Durée et délai.

Facilité : le taux de variation dans le temps.

Continuité : connexion visuelle entre les états.

Feedback: motion qui confirme l'action de l'utilisateur.

Hiérarchie : motion qui privilégie l'attention.

Mouvement réduit : préférence de l'utilisateur pour moins de mouvement.

## Architecture

Un système de mouvement nécessite des jetons, des règles et des contextes. Les jetons définissent les durées et les courbes d'assouplissement. Les règles définissent les changements d'état qui se produisent et non pas. Les contextes définissent quand le mouvement est approprié : navigation, ouverture, fermeture, chargement, erreur, succès, focus ou mise à jour des données.

Le système ne devrait pas compter sur une seule animation partout. Une page de connaissance, un héros de projet et une interaction graphique ont des besoins de mouvement différents.

## Mise en œuvre

La mise en œuvre devrait commencer par l'état. Quels changements d'état nécessitent une explication visuelle? Une ouverture de panneau, un nœud graphe en expansion, un résultat de recherche apparaissant et une transition de route ont tous une sémantique différente.

Alors définissez le timing. La rétroaction rapide peut être inférieure à 150 millisecondes. Les transitions plus importantes peuvent nécessiter plus de temps, mais ne devraient pas bloquer la lecture. Motion doit être désactivée ou simplifiée lorsque l'utilisateur demande un mouvement réduit.

Web Animations, transitions CSS et animations CSS doivent être utilisées avec des changements de classes sémantiques et une gestion d'état prévisible.

## Applications pratiques

Motion peut aider un lecteur à comprendre l'expansion du graphique, le filtrage des cartes, les transitions de route, l'état de lecture audio, la comparaison des séquences d'images et l'exploration des archives.

Il peut également soutenir la narration. Une page Palimpsests peut utiliser des transitions en couches pour exprimer les résidus. Une visualisation ORETH pourrait utiliser un mouvement basé sur le temps pour révéler l'analyse audio.

## Outils

Les outils utiles incluent les transitions CSS, les animations CSS, l'API Web Animations, requêteAnimation Frame, requêtes de médias à mouvement réduit, outils de performance du navigateur, inspecteurs de la chronologie et tests d'accessibilité.

## Éléments de preuve

La spécification W3C Web Animations définit un modèle pour la synchronisation et le calendrier des changements de présentation. L'accessibilité en tant qu'exigence de contenu Web, et non une amélioration facultative, est un cadre d'orientation du WCAG.

Electronic Artefacts peuvent combiner les deux : le mouvement doit être techniquement stable et centré sur l'homme.

## Méthode éditoriale

Lors de la documentation de la motion, décrivez ce que signifie la motion. Ça révèle la hiérarchie ? Connecter deux états ? Afficher le processus temporel ? Confirmer l'interaction ? Si la réponse n'est pas claire, la motion peut ne pas être nécessaire.

Les exemples de mouvements devraient inclure des valeurs de timing, un comportement à mobilité réduite et une justification.

## Erreurs courantes

La première erreur est d'utiliser le mouvement pour masquer les interfaces lentes. Les problèmes de performance devraient être corrigés et non pas animés.

La deuxième erreur est d'animer tout. Le mouvement constant réduit le sens.

La troisième erreur est d'ignorer le texte. La motion ne devrait pas compliquer la lecture.

## Incidences des Electronic Artefacts

Electronic Artefacts peuvent développer un langage de mouvement silencieux mais expressif pour l'exploration du savoir. Le site devrait utiliser le mouvement pour soutenir la compréhension, et non pour imiter les interfaces marketing.

C'est important pour le contenu de longue durée. Une bibliothèque de recherche devrait se sentir vivante sans que le lecteur se batte contre la page.

## Rôle du graphe de connaissances

Motion peut exprimer la structure graphique lorsqu'elle est utilisée avec soin. Un noeud peut s'étendre de sa source, un article connexe peut apparaître comme une suite, un ensemble filtré peut se contracter sans perdre l'orientation, et une transition de route peut préserver le sens du lieu d'un lecteur.

Le graphique ne doit pas être animé pour le spectacle. La motion devrait clarifier la relation. Si une publication documente un concept, la transition peut se sentir directe et stable. Si une collection rassemble plusieurs articles, l'interface peut révéler le regroupement sans transformer la page en une performance.

## Critères d'évaluation

La motion doit être évaluée par la clarté sémantique, l'accessibilité, le rendement et la retenue. Le mouvement communique-t-il l'état ? Cela aide - t - il le lecteur à prédire ce qui a changé? Respecte-t-il les réglages de réduction des mouvements? Est-ce qu'il évite le changement de disposition? Préserve-t-il la lisibilité du texte?

Les meilleurs systèmes de mouvement sont silencieux. Ils apparaissent lorsque les changements d'état ont besoin d'explication et disparaissent lorsque la lecture nécessite du calme.

## Norme éditoriale

La documentation sur les mouvements devrait consigner le calendrier, l'assouplissement, le déclenchement, les éléments touchés et le recul. Un motif de motion sans justification écrite devient difficile à maintenir. Les futurs contributeurs peuvent le copier comme décoration sans en comprendre le but.

Pour Electronic Artefacts, les motifs de mouvement doivent être attachés aux rôles d'interface : expansion des graphiques, filtrage de recherche, transition de route, lecture des médias, superposition des archives ou révélation de projet.

## Voie de lecture

Motion design est un sujet de recherche important car de nombreux lecteurs recherchent des techniques d'animation. Le centre de connaissances devrait capter cet intérêt, puis déplacer le lecteur vers la conception sémantique. La question devrait passer de « Comment animer cela ? » à « Quel est l'état de cette motion ? »

Ce chemin relie l'implémentation à HCI. Une transition peut soutenir l'orientation. Un recul réduit peut favoriser l'accessibilité. Un jeton de timing peut soutenir la cohérence. Une expansion graphique peut rendre la relation visible. L'article devrait donc envoyer des lecteurs vers [Interaction informatique humaine](/fr/knowledge/concepts/human-computer-interaction/), [Typographie](/fr/knowledge/concepts/typography/) et [Animations Web](/fr/knowledge/technologies/web-animations/).

## Angle de conservation

La motion est difficile à préserver parce qu'elle vit dans le temps. Une capture d'écran statique ne peut pas montrer le rythme, l'assouplissement ou l'interaction. Lorsqu'un motif de mouvement est important, conservez une description, une référence de code, des valeurs de chronométrage et, si possible, une courte capture. Cela permet aux futurs lecteurs de distinguer une décision de conception d'un artefact d'animation accidentel.

Pour un site de recherche, ce n'est pas secondaire. Motion peut faire partie de la façon dont un lecteur comprend les couches d'archives, l'état audio ou l'expansion graphique. Si ce comportement disparaît, une partie de l'argument interface disparaît avec lui. La documentation maintient la conception temporelle disponible pour l'entretien futur et la critique.

Cette documentation aide également les futurs contributeurs à éviter les incohérences accidentelles. Ils peuvent réutiliser un motif de mouvement parce que son rôle est connu, pas parce qu'il s'est avéré bon dans une version antérieure.

Cela préserve l'intention de conception.

## Travaux futurs

Les futures entrées devraient couvrir les jetons de mouvement, les transitions graphiques, la conception à mouvement réduit, l'animation par défilement, la typographie cinétique et le mouvement audio-réactif.

## Concepts connexes

Lire [Conception de mouvement](/fr/knowledge/concepts/motion-design/), [Animations Web](/fr/knowledge/technologies/web-animations/), [Interaction informatique humaine](/fr/knowledge/concepts/human-computer-interaction/) et [Typographie](/fr/knowledge/concepts/typography/).

## Lecture suggérée

Commencez par Web Animations et ressources WCAG, puis étudiez les interfaces où le mouvement clarifie l'état au lieu de le décorer.

## Articles connexes

Continuer avec [Typographie, systèmes de lecture et interfaces numériques](/fr/publications/typography-reading-systems-and-digital-interfaces/) et [Interaction informatique humaine pour outils créatifs](/fr/publications/human-computer-interaction-for-creative-tools/).

## Glossaire

Facilité : courbe de vitesse pour l'animation.

Changement d'état: passage d'une condition d'interface à une autre.

Mouvement réduit : préférence de l'utilisateur pour limiter le mouvement.

Chronologie : structure temporelle d'une animation.

## Limites

La conception du mouvement n'est pas universellement bénéfique. Certains utilisateurs préfèrent ou nécessitent moins de mouvement. Certains contenus ont besoin de stabilité.

Un système de mouvement responsable est restreint, sémantique et facultatif, le cas échéant.

## Références

- W3C. Animations Web.
- W3C WAI. WCAG 2 Aperçu.
- Electronic Artefacts. Motion Design, HCI et Typographie.
