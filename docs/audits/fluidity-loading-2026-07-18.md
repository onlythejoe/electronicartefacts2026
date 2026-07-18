# Audit de fluidité et de chargement — 18 juillet 2026

## Résultat exécutif

Le premier HTML est déjà robuste : les pages canoniques livrent leur contenu, leur navigation et leur pied de page sans attendre JavaScript. La rupture de fluidité venait surtout d'un décalage artificiel entre la page visible et la page interactive : le runtime principal ne commençait à charger que 1,5 seconde après `load`, puis plusieurs comportements critiques attendaient encore une période d'inactivité.

La passe du 18 juillet supprime ce temps mort perceptible. Une couche critique de 2,2 Ko minifiés prend désormais en charge la continuité de navigation immédiatement, tandis que le runtime riche démarre au premier temps mort du navigateur avec une borne de 700 ms.

## Mesures de référence

Mesures prises en local avec Chromium/Playwright sur la page française de l'artefact Voice Capture Studio. Elles servent à comparer l'ordre d'apparition et l'état d'interactivité, pas à simuler une latence réseau de production.

| Signal | Avant | Après |
| --- | --- | --- |
| État de la page vers 0,7–0,9 s | HTML visible, runtime non prêt | runtime prêt |
| Navigation liée | absente | active |
| Préchargement sur intention | absent | actif |
| Progression et ambiance | absentes | actives |
| Erreurs console au chargement direct | 0 | 0 |
| Runtime critique | aucun | 2 221 octets minifiés |

Poids statiques non compressés après reconstruction :

- CSS global : 348 876 octets ;
- CSS accueil : 64 246 octets ;
- CSS projet : 102 740 octets ;
- runtime courant : 636 634 octets ;
- runtime graph/recherche : 991 735 octets.

Le principal budget restant n'est donc plus la couche de fluidité, mais le runtime et le CSS génériques encore livrés à trop de routes.

## Changements livrés

### Continuité immédiate

- nouveau runtime `flow.js`, chargé en `defer` sur toutes les pages ;
- signal lumineux de 2 px à l'arrivée et au départ, sans bloquer la lecture ;
- transition de sortie courte de 105 ms pour matérialiser l'intention sans ralentir la navigation ;
- remise à zéro compatible avec le back/forward cache via `pageshow`.

### Anticipation de la navigation

- préchargement des documents internes au survol confirmé, au focus ou au toucher ;
- délai de 65 ms au survol pour éviter les téléchargements accidentels ;
- limite de huit destinations par page ;
- désactivation automatique si `Save-Data` est actif ou sur une connexion 2G.

### Apparition progressive

- arrivée séquencée des quatre premiers blocs, avec un décalage de 54 ms ;
- rendu différé des cartes profondes via `content-visibility: auto` ;
- conservation des révélations à l'intersection déjà en place pour le contenu sous la ligne de flottaison ;
- désactivation complète des mouvements additionnels avec `prefers-reduced-motion`.

### Démarrage du runtime riche

- suppression du lancement fixe à `load + 1 500 ms` ;
- démarrage via `requestIdleCallback`, borné à 700 ms ;
- repli à 180 ms sur les navigateurs sans API d'inactivité ;
- versions de cache renouvelées pour le CSS et les bundles JavaScript.

## Lecture UX

L'animation est utilisée comme un guide d'attention, pas comme un écran d'attente. Le contenu essentiel reste dans le HTML, donc aucun squelette ne remplace artificiellement une information déjà disponible. Le mouvement signale trois choses seulement : la page arrive, l'intention de navigation a été comprise, et les blocs prioritaires se stabilisent dans un ordre lisible.

Cette discipline évite deux travers : retarder volontairement l'accès au contenu pour « jouer » une animation, ou multiplier des mouvements concurrents qui augmentent la charge cognitive et le coût de composition.

## Plan de continuation

### Priorité 0 — réduire les octets par route

1. Produire un runtime éditorial dédié aux pages canoniques. Ces pages n'ont pas besoin de la majorité du renderer historique contenu dans `app.js`.
2. Générer une feuille CSS éditoriale dédiée aux artefacts, publications, concepts et technologies, sur le modèle des bundles `home.css` et `project.css`.
3. Charger `app-full.js` uniquement au moment où le graphe ou la recherche avancée devient réellement interactif.

Objectif recommandé : moins de 120 Ko de JavaScript non compressé sur une fiche canonique et moins de 140 Ko de CSS non compressé.

### Priorité 1 — mesurer la sensation en production

1. Ajouter des marques `performance.mark` pour HTML visible, runtime critique, page interactive et navigation anticipée.
2. Collecter, avec consentement, LCP, CLS, INP, longues tâches et temps de navigation interne par famille de route.
3. Tester sur Safari iPhone, Android moyen de gamme et réseau 4G contraint ; le serveur local ne révèle ni la latence CDN ni le coût de décompression réel.
4. Définir des budgets CI par route et faire échouer la construction en cas de dérive durable.

### Priorité 2 — approfondir l'anticipation

1. Évaluer les Speculation Rules pour pré-rendre uniquement les destinations à forte confiance sur connexion rapide.
2. Utiliser la topologie du graphe pour choisir une ou deux relations probables à réchauffer pendant l'inactivité, sans télécharger tout le voisinage.
3. Mettre en cache les documents statiques versionnés pour les revisites, avec une stratégie qui ne masque jamais une nouvelle publication derrière un cache obsolète.

## Critères de réussite pour la prochaine passe

- aucune page visuellement présente mais non réactive pendant plus de 500 ms ;
- aucun mouvement qui retarde le contenu ou bloque une interaction ;
- aucune animation automatique en mode mouvement réduit ;
- budgets CSS/JS respectés par famille de route ;
- navigation interne chaude perçue comme instantanée sur les pages de projet, d'artefact et de connaissance ;
- zéro régression console et zéro déplacement de mise en page provoqué par les révélations.
