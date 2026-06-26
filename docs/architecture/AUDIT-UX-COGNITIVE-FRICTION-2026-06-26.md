# Audit UX et friction cognitive

Site audité : Electronic Artefacts  
Date : 26 juin 2026  
Posture : nouvel utilisateur exigeant, sans justification technique des éléments visibles.  
Méthode : lecture des pages publiques générées, des surfaces dynamiques rendues par les templates et des composants communs. Le navigateur Playwright partagé était verrouillé pendant l'audit ; les constats ci-dessous s'appuient donc sur le HTML généré, les templates et les blocs de rendu JavaScript.

## Synthèse critique

Le site possède une identité forte et une matière réelle. Les projets, les images, certains textes d'offre et les pages de dossier donnent une impression de studio sérieux, hybride et ambitieux.

La friction principale vient d'une confusion entre trois publics :

- un humain qui veut comprendre, décider ou contacter ;
- un lecteur expert qui accepte une documentation dense ;
- une machine ou un moteur de connaissance qui a besoin de statuts, identifiants, relations, graphes et métadonnées.

Aujourd'hui, ces trois logiques sont souvent visibles au même niveau. Le résultat est un site riche mais fréquemment auto-référencé : il expose son modèle interne avant d'avoir stabilisé l'histoire pour le visiteur.

Le plus gros risque UX n'est pas l'incompréhension totale. Le visiteur comprend qu'il y a une pratique sophistiquée. Le risque est la fatigue : trop de badges, de panneaux, de catégories, de "signals", de graphes, de métriques et de formulations abstraites forcent l'utilisateur à interpréter le système au lieu de recevoir une proposition claire.

## Informations inutiles

### 1. Métadonnées de fiche exposées comme contenu principal

- Page concernée : pages de concepts, technologies, programmes, projets générés, par exemple `/knowledge/concepts/ai-agent/`, `/programs/vaste/`, `/projects/vestiges/`.
- Élément concerné : panneau `Record metadata` avec `Entity ID`, `Publication class`, `Status`, `Maturity`, `Confidence`, `Published`, `Modified`, `Version`.
- Gravité : Critique.
- Pourquoi c'est un problème : ce panneau expose la structure éditoriale interne comme si elle avait la même valeur qu'une information de lecture.
- Impact utilisateur : le visiteur est renvoyé à une logique de base de données. Il ne comprend pas mieux le concept, le projet ou l'offre.
- Confiance : 98%.

### 2. Badges `active`, `validated`, `v1.0.0` dans les héros d'entités

- Page concernée : pages de connaissance et programmes, par exemple `/knowledge/concepts/ai-agent/`.
- Élément concerné : nuage de tags dans le hero.
- Gravité : Important.
- Pourquoi c'est un problème : ces statuts n'aident pas un nouveau visiteur à évaluer la pertinence du contenu. `validated` et `v1.0.0` ressemblent à des états de workflow interne.
- Impact utilisateur : la première impression devient technique et administrative.
- Confiance : 95%.

### 3. `Relations: 16 typed edges`

- Page concernée : `/projects/vestiges/` et autres dossiers projet.
- Élément concerné : metric rail du hero projet.
- Gravité : Critique.
- Pourquoi c'est un problème : le nombre de relations typées n'apporte aucune décision, compréhension ou émotion au visiteur. Il parle au graphe, pas à l'utilisateur.
- Impact utilisateur : bruit cognitif au-dessus de la ligne de flottaison ; donne une impression de debug sémantique.
- Confiance : 99%.

### 4. `Media: 1 asset`

- Page concernée : `/projects/vestiges/`.
- Élément concerné : metric rail du hero.
- Gravité : Important.
- Pourquoi c'est un problème : compter les assets est utile au système, pas au visiteur. La présence d'une image se voit déjà.
- Impact utilisateur : diminue la perception premium du dossier en l'administrant.
- Confiance : 97%.

### 5. `Local graph` et `typed connections`

- Page concernée : pages d'entités et projets.
- Élément concerné : panneau `Local graph`, titre `X typed connections`, texte sur le rendu interactif.
- Gravité : Critique.
- Pourquoi c'est un problème : l'élément décrit le mécanisme de représentation plutôt que l'intérêt humain des relations.
- Impact utilisateur : le visiteur doit comprendre le fonctionnement du graphe avant de savoir pourquoi ces liens comptent.
- Confiance : 98%.

### 6. Citation académique pour chaque record

- Page concernée : pages de concepts, technologies, projets.
- Élément concerné : panneau `How to cite this record`.
- Gravité : Important.
- Pourquoi c'est un problème : utile pour certains contenus de recherche, mais disproportionné pour un projet ou une entrée de navigation.
- Impact utilisateur : renforce l'impression de catalogue savant, ralentit la lecture commerciale ou artistique.
- Confiance : 88%.

### 7. Footer surchargé de liens

- Page concernée : toutes les pages.
- Élément concerné : footer avec `HOME`, `WORK`, `PROJECTS`, `PROGRAMS`, `RESEARCH`, `KNOWLEDGE`, `PUBLICATIONS`, `ARCHIVE`, `ABOUT`, `CONTACT`, `SEARCH`, `LEGAL`, `PRIVACY`, `VASTE`.
- Gravité : Important.
- Pourquoi c'est un problème : le footer répète presque toute l'architecture sans hiérarchie ni intention.
- Impact utilisateur : en fin de page, le visiteur reçoit un annuaire au lieu d'un prochain pas évident.
- Confiance : 92%.

## AI Slop

### 8. `Definitions, evidence and graph context.`

- Page concernée : pages d'entités générées.
- Élément concerné : section `EDITORIAL SIGNALS`.
- Gravité : Critique.
- Pourquoi c'est un problème : le titre semble logique mais froid. Il nomme des catégories abstraites sans dire pourquoi elles comptent.
- Impact utilisateur : sensation de contenu généré pour remplir un template éditorial.
- Confiance : 96%.

### 9. `This section exposes the structured editorial fields behind the record...`

- Page concernée : pages d'entités générées.
- Élément concerné : lede de `EDITORIAL SIGNALS`.
- Gravité : Critique.
- Pourquoi c'est un problème : la phrase avoue que la section expose le back-office éditorial. Elle mentionne explicitement les crawlers et systèmes de retrieval.
- Impact utilisateur : rupture immédiate de la narration humaine.
- Confiance : 99%.

### 10. Titres de cartes qui paraphrasent leur catégorie

- Page concernée : pages concept/programme.
- Élément concerné : `Definition scope / What this concept includes`, `Boundaries / What this concept excludes`, `Program mandate / What the program is responsible for`.
- Gravité : Important.
- Pourquoi c'est un problème : chaque carte utilise deux lignes pour dire presque la même chose.
- Impact utilisateur : densité artificielle, impression de remplissage.
- Confiance : 94%.

### 11. Formules génériques de type `One connected practice`

- Page concernée : `/work.html`.
- Élément concerné : `One connected practice, from first question to final surface.`
- Gravité : Mineur.
- Pourquoi c'est un problème : la phrase sonne bien mais reste abstraite. Elle ne dit pas encore ce que le visiteur obtient.
- Impact utilisateur : ralentit la compréhension de l'offre.
- Confiance : 82%.

### 12. `Start from your real question`

- Page concernée : accueil.
- Élément concerné : section `FEATURED PATHS`.
- Gravité : Mineur.
- Pourquoi c'est un problème : formulation générique et légèrement artificielle. Elle donne une posture UX sans ajouter de contenu concret.
- Impact utilisateur : ajoute une couche de guidage qui peut sembler fabriquée.
- Confiance : 80%.

### 13. `Nothing useful should disappear`

- Page concernée : `/archive.html`.
- Élément concerné : hero archive.
- Gravité : Mineur.
- Pourquoi c'est un problème : la formule est mémorable, mais l'archive accumule ensuite des notions abstraites (`Context`, `Lineage`, `Evidence`, `Reuse`) sans exemple immédiat.
- Impact utilisateur : promesse forte mais un peu sloganisée.
- Confiance : 76%.

## Redondances

### 14. Les mêmes destinations reviennent dans header, footer, cross-navigation et cartes

- Page concernée : toutes les pages.
- Élément concerné : navigation principale, footer, `cross-navigation`, cartes d'orientation.
- Gravité : Critique.
- Pourquoi c'est un problème : le site réexplique constamment sa carte au lieu de faire avancer la lecture.
- Impact utilisateur : impression de tourner dans le même système de catégories.
- Confiance : 96%.

### 15. Projets classés plusieurs fois sous des angles différents

- Page concernée : `/projects.html`, `/work.html`, accueil.
- Élément concerné : groupes `Art Translation`, `Knowledge Platforms`, `Applied Surfaces`, puis catalogues `Internal Projects`, `External Works`, `External Partnerships`.
- Gravité : Important.
- Pourquoi c'est un problème : les regroupements se recoupent sans expliquer quelle lecture est prioritaire.
- Impact utilisateur : le visiteur doit apprendre la taxonomie du site avant de choisir un projet.
- Confiance : 91%.

### 16. Les tags répètent le titre et le contexte

- Page concernée : `/projects/vestiges/`, pages concepts.
- Élément concerné : chips `Vestiges`, `VASTE`, `Knowledge Graph`, `Cultural Infrastructure`, puis contenu qui dit déjà la même chose.
- Gravité : Important.
- Pourquoi c'est un problème : accumulation de mots-clés SEO visibles.
- Impact utilisateur : bruit visuel ; les tags ne filtrent pas une décision claire.
- Confiance : 93%.

### 17. Le hero projet et la section `Project intelligence` répètent la même promesse

- Page concernée : `/projects/vestiges/`.
- Élément concerné : lede du hero puis carte `Brief`.
- Gravité : Important.
- Pourquoi c'est un problème : les deux blocs disent que Vestiges organise et active du savoir vivant, avec des nuances mais peu de progression narrative.
- Impact utilisateur : le rythme ralentit au début du dossier.
- Confiance : 88%.

## Frictions cognitives

### 18. Header trop large pour un premier choix

- Page concernée : toutes les pages.
- Élément concerné : `HOME`, `WORK`, `PROJECTS`, `PROGRAMS`, `RESEARCH`, `KNOWLEDGE`, `ARCHIVE`, `ABOUT`, `CONTACT`.
- Gravité : Critique.
- Pourquoi c'est un problème : neuf entrées principales au même niveau demandent un effort d'orientation immédiat.
- Impact utilisateur : un nouveau visiteur ne sait pas quelle différence faire entre `Work`, `Projects`, `Programs`, `Research`, `Knowledge` et `Archive`.
- Confiance : 97%.

### 19. `Programs` n'est pas un terme naturel pour l'offre

- Page concernée : header, `/programs.html`, pages VASTE/ORETH.
- Élément concerné : libellé `PROGRAMS`.
- Gravité : Important.
- Pourquoi c'est un problème : pour un visiteur, `program` peut signifier logiciel, initiative, agenda ou programme de recherche.
- Impact utilisateur : hésitation avant clic ; l'utilisateur ne sait pas s'il va voir des produits, des logiciels ou une stratégie interne.
- Confiance : 90%.

### 20. `Knowledge` et `Research` se concurrencent

- Page concernée : header, `/research.html`, `/knowledge/`.
- Élément concerné : deux entrées proches.
- Gravité : Important.
- Pourquoi c'est un problème : les deux promettent de la pensée, des concepts et des liens. La distinction est interne.
- Impact utilisateur : choix artificiel ; risque d'exploration dispersée.
- Confiance : 91%.

### 21. `Inspect graph`

- Page concernée : `/projects/vestiges/`.
- Élément concerné : bouton secondaire dans le hero.
- Gravité : Important.
- Pourquoi c'est un problème : le CTA demande à l'utilisateur de vouloir inspecter un graphe. C'est un besoin interne ou expert, rarement un besoin visiteur.
- Impact utilisateur : le bouton consomme un emplacement d'action qui pourrait servir à comprendre le projet ou contacter.
- Confiance : 95%.

### 22. `DA`, `Dev`, `Graph`, `Thesis`

- Page concernée : navigation interne des dossiers projets.
- Élément concerné : `project-dossier-nav`.
- Gravité : Important.
- Pourquoi c'est un problème : mélange abréviation française (`DA`), vocabulaire technique (`Dev`, `Graph`) et vocabulaire académique (`Thesis`).
- Impact utilisateur : navigation fragmentée ; demande de décoder la structure du dossier.
- Confiance : 93%.

### 23. Page de recherche sur-explique comment chercher

- Page concernée : `/search.html`.
- Élément concerné : trois cartes `Search by subject`, `Search by name`, `Narrow the field`.
- Gravité : Important.
- Pourquoi c'est un problème : une page de recherche doit d'abord laisser chercher. Les cartes expliquent une action évidente.
- Impact utilisateur : la recherche commence après une couche pédagogique inutile.
- Confiance : 90%.

### 24. Filtres de recherche trop nombreux

- Page concernée : `/search.html`.
- Élément concerné : tous les statuts et types d'entité exposés comme chips.
- Gravité : Important.
- Pourquoi c'est un problème : `researchLog`, `researchField`, `worldbuilding`, `channel`, `artefact`, etc. sont des types internes pour beaucoup de visiteurs.
- Impact utilisateur : l'utilisateur doit connaître le modèle de contenu avant de filtrer.
- Confiance : 94%.

## Vocabulaire

### 25. `Record`

- Page concernée : pages d'entités.
- Élément concerné : `record metadata`, `this record`, `references declared for this record`.
- Gravité : Critique.
- Pourquoi c'est un problème : `record` positionne la page comme une fiche de base de données, pas comme une lecture.
- Impact utilisateur : distance émotionnelle et administrative.
- Formulation plus naturelle : `page`, `article`, `fiche de référence` uniquement si nécessaire.
- Confiance : 98%.

### 26. `Editorial signals`

- Page concernée : pages d'entités.
- Élément concerné : titre de section.
- Gravité : Critique.
- Pourquoi c'est un problème : expression interne et ambiguë. Un visiteur ne sait pas ce qu'est un signal éditorial.
- Impact utilisateur : arrêt mental.
- Formulation plus naturelle : `À retenir`, `Ce que cela recouvre`, `Repères`.
- Confiance : 97%.

### 27. `Typed connections`

- Page concernée : pages de graphe.
- Élément concerné : titres `typed connections`.
- Gravité : Critique.
- Pourquoi c'est un problème : jargon de modèle relationnel.
- Impact utilisateur : donne l'impression que la page parle à un ingénieur ou à un crawler.
- Formulation plus naturelle : `liens importants`, `projets et notions associés`, `relations utiles`.
- Confiance : 99%.

### 28. `Runtime signal`

- Page concernée : `/programs/vaste/`.
- Élément concerné : section animation VASTE.
- Gravité : Important.
- Pourquoi c'est un problème : spectaculaire mais flou. Le visiteur ne sait pas si c'est une démonstration, une métaphore ou une donnée réelle.
- Impact utilisateur : possible confusion entre preuve et décor.
- Formulation plus naturelle : `Comment VASTE organise l'information`, `Architecture en mouvement`.
- Confiance : 87%.

### 29. `EA.RUNTIME / 128.4 GB/s`

- Page concernée : `/programs/vaste/`.
- Élément concerné : HUD de l'animation.
- Gravité : Critique.
- Pourquoi c'est un problème : ressemble à une métrique technique réelle sans contexte. Si décoratif, cela brouille la confiance.
- Impact utilisateur : impression de simulation ou de faux dashboard.
- Formulation plus naturelle : supprimer ou remplacer par des états narratifs non quantifiés.
- Confiance : 93%.

### 30. `Addressable outputs`

- Page concernée : dossiers projets.
- Élément concerné : section outputs.
- Gravité : Important.
- Pourquoi c'est un problème : `addressable` est un mot de système, pas de visiteur.
- Impact utilisateur : rend les livrables moins concrets.
- Formulation plus naturelle : `Livrables`, `Ce que le projet produit`, `Surfaces publiques`.
- Confiance : 92%.

## Hiérarchie visuelle

### 31. Trop de cartes au même niveau

- Page concernée : `/work.html`, `/projects.html`, pages projets.
- Élément concerné : grilles de services, offres, catalogues, pathways, modes, intelligence, outputs.
- Gravité : Critique.
- Pourquoi c'est un problème : les cartes ont souvent des styles et poids similaires, même quand certaines sont secondaires.
- Impact utilisateur : tout semble important ; rien ne devient prioritaire.
- Confiance : 94%.

### 32. Les métriques décoratives ont trop de présence

- Page concernée : accueil, research, archive, projets.
- Élément concerné : stats `03 current spotlights`, `LIVE public surfaces`, `04 memory classes`, `∞ reuse potential`.
- Gravité : Important.
- Pourquoi c'est un problème : plusieurs chiffres ne correspondent pas à une preuve utile.
- Impact utilisateur : pollution visuelle et suspicion de chiffres décoratifs.
- Confiance : 91%.

### 33. Les chips concurrencent les paragraphes

- Page concernée : accueil, archive, projets, pages concepts.
- Élément concerné : nuages de tags et chips.
- Gravité : Important.
- Pourquoi c'est un problème : les chips attirent l'oeil mais répètent des catégories abstraites.
- Impact utilisateur : lecture hachée, surcharge de micro-signaux.
- Confiance : 95%.

### 34. Les sections `hero` sont trop nombreuses

- Page concernée : pages générées et pages landing.
- Élément concerné : usage répété de `zone-card hero`.
- Gravité : Important.
- Pourquoi c'est un problème : quand beaucoup de sections ont le traitement visuel d'un hero, la hiérarchie disparaît.
- Impact utilisateur : chaque bloc réclame une attention maximale.
- Confiance : 89%.

## Narration

### 35. Les pages de connaissance commencent bien puis basculent en fiche système

- Page concernée : `/knowledge/concepts/ai-agent/`.
- Élément concerné : définition lisible suivie de `Editorial signals`, metadata, citation, relation groups, graph.
- Gravité : Critique.
- Pourquoi c'est un problème : l'utilisateur vient comprendre un concept ; la page se transforme en record sémantique.
- Impact utilisateur : perte du fil pédagogique.
- Confiance : 98%.

### 36. Les pages projet n'avancent pas toujours du problème vers la preuve

- Page concernée : `/projects/vestiges/`.
- Élément concerné : hero, métriques, tags, `Project intelligence`, moodboard, dev, marketing, graph, thesis.
- Gravité : Important.
- Pourquoi c'est un problème : la page expose les dimensions du projet, mais l'ordre ressemble davantage à un dossier généré qu'à une histoire utilisateur.
- Impact utilisateur : on sait que le projet est riche, mais on peine à retenir une progression simple : problème, solution, preuve, prochaine action.
- Confiance : 90%.

### 37. L'accueil multiplie les chemins avant d'ancrer la promesse

- Page concernée : `/index.html`.
- Élément concerné : hero, featured paths, VASTE banner, featured work, research, cross-navigation.
- Gravité : Important.
- Pourquoi c'est un problème : l'accueil dit très vite "voici plusieurs façons de lire le site" alors que le visiteur veut d'abord savoir ce qu'est Electronic Artefacts.
- Impact utilisateur : sentiment de richesse, puis dispersion.
- Confiance : 87%.

### 38. `Cross-navigation` casse les fins de page

- Page concernée : la plupart des pages.
- Élément concerné : section de navigation transversale.
- Gravité : Important.
- Pourquoi c'est un problème : elle relance l'utilisateur vers l'écosystème entier au lieu de conclure la page par l'action la plus pertinente.
- Impact utilisateur : les fins de page deviennent moins décisionnelles.
- Confiance : 90%.

## Densité

### 39. Page Work : offre trop exhaustive

- Page concernée : `/work.html`.
- Élément concerné : capacités interactives, services, engagements, qualification, taxonomy, catalog.
- Gravité : Critique.
- Pourquoi c'est un problème : tout est défendable séparément, mais l'ensemble donne plus d'information que nécessaire pour contacter ou évaluer l'offre.
- Impact utilisateur : un prospect doit trier lui-même ce qui est vendu, prouvé, interne ou culturel.
- Confiance : 93%.

### 40. Page Projects : trop de systèmes de lecture

- Page concernée : `/projects.html`.
- Élément concerné : pathways, page lens, output modes, index rail, grouped projects.
- Gravité : Critique.
- Pourquoi c'est un problème : la page explique plusieurs fois comment lire les projets.
- Impact utilisateur : la structure devient le sujet.
- Confiance : 94%.

### 41. Page Archive : la métaphore de mémoire ajoute de la densité

- Page concernée : `/archive.html`.
- Élément concerné : `memory classes`, `connected eras`, `reuse potential`, `Fragments remain addressable`.
- Gravité : Important.
- Pourquoi c'est un problème : l'archive pourrait être utile si elle montrait vite les objets. Elle commence par conceptualiser l'archive.
- Impact utilisateur : effort avant accès au contenu.
- Confiance : 86%.

### 42. Pages concept : plusieurs niveaux de résumé avant le corps

- Page concernée : `/knowledge/concepts/ai-agent/`.
- Élément concerné : définition hero, abstract, editorial cards, puis article.
- Gravité : Important.
- Pourquoi c'est un problème : la page résume avant d'expliquer, puis re-résume dans les cartes.
- Impact utilisateur : impression de préambule long pour un contenu court.
- Confiance : 95%.

## Cohérence

### 43. Mélange anglais/français dans certains libellés de navigation

- Page concernée : dossiers projets.
- Élément concerné : `DA`, `Dev`, `Marketing`, `Graph`, `Thesis`.
- Gravité : Mineur.
- Pourquoi c'est un problème : l'abréviation `DA` est culturelle/française alors que le reste est anglais.
- Impact utilisateur : micro-friction et baisse de finition perçue.
- Confiance : 89%.

### 44. Certaines pages sont commerciales, d'autres académiques, sans transition

- Page concernée : `/work.html`, `/programs/vaste/`, `/knowledge/concepts/*`.
- Élément concerné : passage entre offre, runtime propriétaire, citations et graphes.
- Gravité : Critique.
- Pourquoi c'est un problème : le ton change de vente à documentation interne à publication de recherche.
- Impact utilisateur : incertitude sur la nature de l'organisation.
- Confiance : 92%.

### 45. Les identifiants publics `/id/...` brouillent la surface humaine

- Page concernée : routes `/id/...` et `/fr/id/...`.
- Élément concerné : pages HTML d'identifiants sémantiques.
- Gravité : Important.
- Pourquoi c'est un problème : même si elles sont utiles au graphe, elles ressemblent à des pages visibles et indexables pour humains.
- Impact utilisateur : risque d'atterrir sur une surface qui confirme l'impression "machine-first".
- Confiance : 88%.

## Architecture de contenu

### 46. La distinction `Work` / `Projects` / `Programs` / `Research` / `Knowledge` / `Archive` est trop fine

- Page concernée : navigation globale.
- Élément concerné : architecture primaire.
- Gravité : Critique.
- Pourquoi c'est un problème : ces catégories sont cohérentes côté système, mais trop proches côté humain.
- Impact utilisateur : choix paralysant ; exploration non linéaire subie.
- Confiance : 97%.

### 47. Le site demande au visiteur de choisir une ontologie

- Page concernée : accueil, projects, search, pages d'entités.
- Élément concerné : types, statuts, relations, graphes, filtres, classifications.
- Gravité : Critique.
- Pourquoi c'est un problème : l'ontologie devrait soutenir l'expérience, pas devenir l'interface principale.
- Impact utilisateur : l'utilisateur doit comprendre le classement avant de comprendre la valeur.
- Confiance : 98%.

### 48. Les pages machines et les pages humaines ne sont pas assez séparées

- Page concernée : knowledge graph, `/id`, metadata panels, JSON-LD links rendus indirectement visibles par les formulations.
- Élément concerné : vocabulaire `record`, `crawler`, `retrieval systems`, `typed connections`.
- Gravité : Critique.
- Pourquoi c'est un problème : le contenu technique déborde dans la couche humaine.
- Impact utilisateur : perte de confiance narrative ; impression de site conçu pour être indexé avant d'être lu.
- Confiance : 99%.

### 49. Les pages de détail manquent de conclusion humaine

- Page concernée : concepts, projets, programmes.
- Élément concerné : fins de pages dominées par metadata, citation, relations, graphes ou navigation.
- Gravité : Important.
- Pourquoi c'est un problème : après lecture, l'utilisateur devrait savoir quoi faire ensuite. Ici, il reçoit souvent plus de structure.
- Impact utilisateur : baisse de conversion et de mémorisation.
- Confiance : 91%.

### 50. La richesse du site masque les priorités business

- Page concernée : accueil, work, programs, contact.
- Élément concerné : coexistence offre client, laboratoire, runtime propriétaire, art, archive, knowledge hub.
- Gravité : Critique.
- Pourquoi c'est un problème : toutes les dimensions sont intéressantes, mais aucune n'est durablement priorisée pour un visiteur qui découvre.
- Impact utilisateur : admiration sans décision.
- Confiance : 94%.

## Priorités de diagnostic

1. Séparer nettement la couche humaine de la couche machine : metadata, IDs, graphes, crawlers, records et versions ne doivent pas dominer les pages destinées aux visiteurs.
2. Réduire l'architecture primaire : trop d'entrées principales exposent l'organisation interne.
3. Supprimer ou reléguer les métriques décoratives : `typed edges`, `asset`, `GB/s`, `memory classes`, `current spotlights`.
4. Remplacer le vocabulaire système par des mots d'usage : projet, preuve, livrable, idée, méthode, relation utile, repère.
5. Faire progresser les pages selon une narration humaine : ce que c'est, pourquoi ça compte, preuve, prochaine action.

## Conclusion

Electronic Artefacts n'a pas un problème de manque de contenu. Le site a un problème d'excès de structures visibles.

La matière est suffisamment forte pour être plus simple. Les éléments les plus faibles sont ceux qui expliquent le fonctionnement du système, comptent ses relations, exposent ses statuts ou justifient son architecture éditoriale. Les éléments les plus forts sont ceux qui montrent un projet, une image, une décision, une offre ou une idée claire.

La question à appliquer à chaque bloc est stricte : si l'élément n'aide pas un humain à comprendre, décider, ressentir ou agir, il doit disparaître de la surface principale ou être déplacé vers une couche secondaire.
