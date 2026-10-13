# Audit et améliorations — seconde passe du 13 octobre 2026

Cette seconde passe complète le [premier rapport](REPO_AUDIT_2026-10-13.md).
Elle part du commit `ec1f2858` et vérifie les interactions, les parcours au clavier,
la recherche canonique et les comportements en cas d'échec. Les corrections sont
poussées sur `main` dans
[`325bd624`](https://github.com/onlythejoe/electronicartefacts2026/commit/325bd624d40b26b104fccdef4a8f8856fd0a0205).

## Défauts confirmés et corrections

| Défaut | Correction livrée |
| --- | --- |
| Les quatre panneaux du dossier projet restaient visibles. PurgeCSS supprimait la règle utilisant la classe ajoutée au chargement, `is-tabbed`. | Conservation explicite de cette classe, masquage des panneaux inactifs avec `hidden`, règle CSS associée et contrôleur commun d'onglets. Un seul panneau est visible après activation. Flèches, Début et Fin déplacent la sélection et le focus. |
| Les onglets informatifs Voice Capture Studio dépendaient de la présence du canvas décoratif. | Le contrôleur d'onglets fonctionne aussi sans contexte de dessin. Chaque panneau est associé à son onglet et peut recevoir le focus. Les quatre sections du dossier restent lisibles sans JavaScript. |
| Le menu de langue des pages éditoriales perdait requête et ancre, et offrait moins de commandes clavier que celui des autres pages. Échap pouvait laisser le focus dans une option masquée. | Gestion commune : focus à l'ouverture, navigation par flèches, Début/Fin, fermeture par Tab ou Échap et retour au déclencheur. La navigation préserve l'état courant de l'URL et reste sur l'origine de la prévisualisation locale. Les options indisponibles sont signalées. |
| L'agrandissement des images se déclenchait uniquement par clic sur l'image et ne gérait pas le focus ni Échap. | Bouton natif autour de chaque image, nom accessible localisé, dialogue nommé, arrière-plan inerte, boucle de focus et restauration du bouton déclencheur. Échap ferme le dialogue. Ouvrir la recherche rapide ferme l'image et rétablit correctement les états de l'arrière-plan. |
| La recherche canonique `/search/` mélangeait les deux langues du corpus, et sa normalisation ne supprimait pas les diacritiques. | Filtrage selon la langue de la page, normalisation des accents, ligatures et apostrophes dans un module TypeScript partagé avec les tests. Les résultats sont annoncés et la saisie met à jour `q` dans l'URL sans perdre les autres paramètres ni l'ancre. |
| Une réponse HTTP en échec ou des données de recherche invalides pouvaient laisser l'interface sans reprise. | État de chargement, contrôle de la réponse et des données, message d'erreur visible et bouton de reprise. La requête est conservée et le focus revient au champ après une reprise réussie. |

Les sources, templates et générateurs ont été corrigés, puis les fichiers statiques
ont été reconstruits. Les versions des ressources ont été incrémentées pour que
les pages chargent les nouveaux runtimes et styles.

Les interactions suivent les principes des modèles W3C APG pour
[les onglets](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/),
[les menus à bouton](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) et
[les dialogues modaux](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
Cela ne constitue pas une certification WCAG exhaustive.

## Vérifications

| Contrôle | Résultat confirmé |
| --- | --- |
| Vérification complète | `npm run check` passe : validation, audits contenus/graphe, TypeScript, construction, tests, SEO, langues et liens. |
| Tests | **88/88 passent**, aucun ignoré. Onze tests supplémentaires couvrent les onglets, le menu de langue, la normalisation et le filtrage de recherche, ainsi que le remplacement d'une modale. |
| Corpus | 276 entités valides, 138 dans chaque langue ; graphe public de 138 entités et 582 relations, une composante, aucune entité isolée. |
| Pages | 623 pages HTML inspectées, 313 indexables ; aucun problème signalé par les audits SEO, langues et chemins locaux. |
| Références HTML | Contrôle complémentaire des identifiants et références `aria-controls`, `aria-labelledby`, `aria-describedby` et `for` : zéro anomalie sur 623 pages. |
| Dépendances | `npm audit --audit-level=moderate` : zéro alerte. |
| Reconstruction | **2 071 fichiers comparés par SHA-256**, aucune différence après une nouvelle construction ; fichiers macOS et artefacts de navigateur exclus. |
| Navigateur | 14 routes EN/FR × 2 largeurs, soit **28 contrôles** à 390 et 1 280 px : aucun débordement horizontal, section attendue vide, bouton visible sans nom, erreur JavaScript, avertissement ou réponse HTTP en échec lors des chargements normaux. |
| Mouvement réduit | Préférence respectée sur l'accueil : aucune carte marquée comme animée et aucun débordement horizontal. |

Contrôles ciblés dans Chromium : changement de langue au clavier avec conservation
de la requête et de l'ancre, sélection du panneau Preuves avec Fin, ouverture et
fermeture de l'image avec restauration du focus, puis remplacement du dialogue
image par la recherche rapide. Le contrôle visuel à 390 px confirme la bonne
présentation de l'image agrandie ; le bouton d'ouverture conserve exactement les
dimensions de l'image dans la page.

Les cas **SIMULATED** sont explicitement séparés des chargements normaux : contexte
canvas absent, réponse de recherche HTTP 503 et JSON invalide. Les onglets restent
utilisables sans canvas. Les deux erreurs de recherche affichent une reprise et
reviennent à 30 résultats anglais pour `VASTE` après le second chargement, sans
exception JavaScript non traitée. Un contexte navigateur avec JavaScript désactivé
confirme la lecture des quatre panneaux du dossier.

Les relevés, scripts et captures restent locaux dans
`output/playwright/audit-2026-10-13-pass2/`, ignoré par Git.

## Poids des ressources

| Ressource | Taille brute |
| --- | ---: |
| Runtime accueil | 572 776 octets, sous le budget de 600 000 |
| Runtime projet | 98 145 octets |
| Runtime éditorial | 25 799 octets |
| Module de classement de recherche | 815 octets |
| CSS accueil | 178 344 octets |
| CSS projet | 135 746 octets |

Le runtime d'accueil gagne 1 414 octets par rapport à la première passe, pour les
contrôles communs supplémentaires. Le gain principal de la première passe reste
conservé. Ces tailles ne sont pas des mesures de latence sur le trafic public.

## Livraison distante

- [CI Site quality réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38467699891) pour `325bd624` : installation verrouillée et vérifications du projet sous Node 24, audit npm et reconstruction sans divergence.
- [Publication GitHub Pages réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38467700148) pour le même commit.
- [Accueil public](https://electronicartefacts.com/), [fiche Voice Capture Studio française](https://electronicartefacts.com/fr/projects/voice-capture-studio/), [concept Graph Runtime](https://electronicartefacts.com/knowledge/concepts/graph-runtime/) et [recherche canonique](https://electronicartefacts.com/search/) : HTTP 200 et versions actuelles des runtimes confirmées dans les réponses HTML.
- Les six ressources vérifiées sur le domaine public ont exactement les mêmes SHA-256 que les fichiers locaux : `home.js`, `project.js`, `editorial.js`, `search/scoring.js`, `search/client.js` et `project.css`. Le relevé détaillé est conservé dans `output/playwright/audit-2026-10-13-pass2/public-delivery.json`.

## Périmètre et état local

Les essais navigateur sont réalisés sous Chromium avec deux largeurs de fenêtre ;
ils ne valident pas tous les navigateurs, appareils ou technologies d'assistance.
Les logiciels externes présentés par les projets ne font pas partie de l'audit.
Le contenu factuel, les relations éditoriales et la politique d'hébergement restent
ceux du dépôt audité.

Le dépôt et sa publication à la racine sont publics, comme documenté dans le
premier rapport. Les fichiers `.DS_Store` et anciennes captures préexistantes sont
préservés et exclus des commits. Aucun nettoyage destructif n'a été effectué.
Node 26 local émet un avertissement de dépréciation du chargeur TypeScript ; la
version recommandée du projet est Node 24.
