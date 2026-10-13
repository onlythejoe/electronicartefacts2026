# Audit et améliorations — troisième passe, 14 octobre 2026

Cette passe, commencée le 13 octobre et finalisée le 14, complète le
[rapport de seconde passe](REPO_AUDIT_2026-10-13_PASS_2.md). Elle part de `86bc45c5`
et approfondit le graphe interactif, les préférences de confidentialité, les menus
contextuels et les navigations internes EN/FR. Les corrections sont poussées sur
`main` dans
[`8950ea43`](https://github.com/onlythejoe/electronicartefacts2026/commit/8950ea4383a24de853d512c52d589b5e5f7ad952), complété par
[`5611455c`](https://github.com/onlythejoe/electronicartefacts2026/commit/5611455c4032308b7d130e92f72f9a6d8e28d6f2)
pour le rendu français des pages légales.

## Corrections livrées

| Défaut confirmé | Résultat |
| --- | --- |
| Douze liens à fragment visaient une section absente : neuf dans les dossiers VASTE EN/FR, trois dans la démonstration du composant Liquid Bubble Field. | Ajout d'alias stables aux sections VASTE, en conservant les identifiants de titres déjà publiés. Les liens de démonstration atteignent désormais les sections réelles de Palimpsests et VASTE. Les quatorze liens de navigation VASTE ont été ouverts dans Chromium. |
| L'audit des liens vérifiait les fichiers, mais ignorait les fragments. | `audit:links` contrôle maintenant les identifiants des pages cibles, les ancres nommées et les fragments encodés. Il distingue les directives de sélection de texte et ignore les exemples dans les scripts/commentaires. Les attributs `data-…-id` ne sont pas pris pour des identifiants HTML. |
| Le déplacement d'un point du graphe utilisait les dimensions du conteneur sans inverser le zoom et la translation. La translation mélangeait pixels écran et unités SVG. | Conversion du pointeur par la matrice SVG inverse, conservation du point de prise, conversion des déplacements de la carte en unités SVG et origine de zoom stable. Le clic droit ne déplace plus les points ; une annulation de glissement ne bloque plus la sélection suivante. |
| Le bouton de fermeture de sélection du graphe se masquait en conservant le focus. Certains raccourcis de zoom du navigateur étaient capturés. | Retour du focus au filtre actif après effacement et conservation des raccourcis utilisant les touches modificatrices. |
| Le menu contextuel restait ouvert en sortant avec Tab et pouvait perdre le focus après une action ou un redimensionnement. Il interceptait aussi les interactions dans une modale dont son propre menu était inerte. | Fermeture avec Tab en laissant poursuivre l'ordre natif, retour du focus après action/Échap/redimensionnement, éléments de menu hors de l'ordre de tabulation normal et conservation du menu natif dans les modales. |
| Les préférences Cookies s'ouvraient sans placer le focus sur les choix et leur lien français menait à la politique anglaise. | Focus sur Refuser à l'ouverture explicite, fermeture par Échap et restauration du déclencheur. Le bandeau initial conserve son comportement sans prise de focus. Le lien de confidentialité suit la langue. |
| Après acceptation puis refus, une nouvelle acceptation ne rétablissait pas le signal de stockage Analytics. Les dates de consentement invalides pouvaient rester acceptées. | Le cycle accord/refus/réaccord met à jour les signaux sans réinjecter le tag. Le refus active aussi le blocage `ga-disable-…`. Les consentements expirés, datés dans le futur ou sans horodatage numérique valide sont rejetés. |
| Les anciennes pages françaises résolvaient leur lien d'évitement `#main` contre leur URL de base `/`, ce qui pouvait ouvrir l'accueil. | Leur lien statique vise désormais le bon document français. Le runtime critique déplace le focus vers le contenu de la page courante, conserve sa requête et place l'ancre `#main`. Le parcours Contact français a été vérifié avec deux paramètres d'URL. |
| Les corps HTML de confidentialité et mentions légales restaient anglais sous une page marquée française. Le remplacement prévu ne reconnaissait plus la balise `main` enrichie pour le clavier. | Le générateur accepte les attributs du contenu principal, utilise les traductions déjà présentes dans ses templates et conserve le focus du lien d'évitement. Les deux pages ont été vérifiées directement dans Chromium. |
| Les trois choix de projection VASTE annonçaient des onglets sans panneaux associés. | Boutons natifs bascule regroupés, état `aria-pressed` actualisé et activation par Tab/Espace vérifiée jusqu'à Assisted Boot. La projection reste explicitement une illustration locale. |

Les sources et générateurs ont été corrigés avant reconstruction. Les versions
publiques des ressources concernées ont été incrémentées ; la date globale du
site passe au 14 octobre 2026. Les dates et affirmations des fiches éditoriales
restent celles de leurs sources. Le README précise le contrôle des fragments et
l'exposition publique des sources et documents dans l'hébergement actuel.

La conversion géométrique utilise la matrice décrite par la
[spécification SVG](https://svgwg.org/svg2-draft/types.html#__svg__SVGGraphicsElement__getScreenCTM).
Le contrôle du menu s'appuie sur le
[modèle de menu W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
Le blocage Analytics utilise la propriété documentée par
[Google](https://developers.google.com/tag-platform/security/guides/privacy).

## Validation

| Contrôle | Résultat confirmé |
| --- | --- |
| Vérification complète | `npm run check` passe : validation, contenus, graphe, TypeScript, construction, tests, SEO, langues et liens. |
| Tests | **98/98 passent**, aucun ignoré ; dix tests supplémentaires couvrent les nouveaux défauts. |
| Corpus et graphe | 276 entités valides, 138 par langue ; 138 entités canoniques publiques, 582 relations, une composante et aucun isolé. |
| Surface statique | 623 pages HTML, 313 indexables ; zéro anomalie signalée par SEO, langues ou liens locaux. |
| Fragments | **2 377 références inspectées**, douze défauts avant correction, zéro après correction. |
| Dépendances | Audit npm : zéro alerte. |
| Reconstruction | **2 074 fichiers comparés par SHA-256**, aucune différence après reconstruction ; fichiers macOS et résultats navigateur exclus. |
| Chargements navigateur | 22 routes EN/FR × 2 largeurs, soit **44 contrôles** à 390 et 1 280 px : aucun débordement horizontal, section attendue vide, bouton visible sans nom, erreur JavaScript, avertissement ou réponse HTTP en échec. |
| Mouvement réduit | Préférence respectée sur l'accueil ; aucune carte marquée comme animée et aucun débordement horizontal. |

Les routes navigateur comprennent accueil, projets, contact, Voice Capture Studio,
Graph Runtime, graphe global, recherche, VASTE, Palimpsests, confidentialité et mentions légales,
dans les deux langues. Le graphe et les préférences françaises ont également été
inspectés visuellement à 390 px.

Avant correction, dans un scénario de zoom, un déplacement de souris de
`(+12, +8)` pixels déplaçait le point d'environ +13,8 pixels horizontalement et −14,7 pixels verticalement.
Après correction, à **390 et 1 280 px**, un déplacement demandé de `(+24, +12)`
est reproduit à moins d'un pixel près avec un zoom de 1,3. La translation de la
carte demandée de `(+18, +10)` donne exactement ce déplacement écran dans les deux
cas. Le clic droit conserve la position et l'effacement revient à un filtre
visible. Tab ferme le menu contextuel et poursuit la navigation au clavier.

Le cycle Analytics est vérifié avec un **fournisseur SIMULATED** : le script Google
est remplacé par un script neutre dans le navigateur de test. Les états locaux,
le blocage et les signaux successifs accord/refus/réaccord sont contrôlés, sans
alimenter la mesure d'audience réelle. Cette preuve porte sur l'implémentation
locale, pas sur les données reçues par Google en production. L'événement de menu
contextuel dans la modale image est aussi simulé et laisse l'action native
possible tout en conservant l'arrière-plan inerte.

Les preuves, scripts et captures restent dans
`output/playwright/audit-2026-10-13-pass3/`, ignoré par Git. Les runtimes restent
sous leurs budgets : accueil **572 932 octets**, graphe **217 151 octets**, projet
**98 302 octets**. Ces tailles ne mesurent pas la latence du trafic réel.

## Livraison distante

- [CI Site quality réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38476585195) pour `5611455c` : installation verrouillée, vérifications et audit npm sous Node 24, reconstruction sans divergence.
- [Publication GitHub Pages réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38476584881), pour le même commit.
- [Accueil](https://electronicartefacts.com/), [graphe français](https://electronicartefacts.com/fr/graph.html), [VASTE français](https://electronicartefacts.com/fr/programs/vaste/), [Contact français](https://electronicartefacts.com/fr/contact.html), [confidentialité française](https://electronicartefacts.com/fr/confidentialite.html) et [mentions légales françaises](https://electronicartefacts.com/fr/mentions-legales.html) : HTTP 200 et versions, lien d'évitement ou titres français actuels confirmés dans le HTML reçu.
- Les six ressources publiques vérifiées sont identiques par SHA-256 aux fichiers locaux : `home.js`, `graph.js`, `analytics.js`, `flow.js`, `vaste-demo.js` et `graph.css`. Le relevé est conservé dans `output/playwright/audit-2026-10-13-pass3/public-delivery.json`.

## Limites et état local

Le contrôle navigateur couvre Chromium à deux largeurs de fenêtre ; il ne vaut
pas validation exhaustive de tous les appareils ou technologies d'assistance.
Les applications externes présentées par la Vitrine restent hors de ce périmètre.
La démonstration VASTE ne constitue pas une preuve du runtime logiciel externe.

Les fichiers `.DS_Store` et anciennes captures préexistantes ont été préservés
et exclus des commits. Aucun nettoyage destructif ni changement du paramétrage
d'hébergement n'a été effectué. Node 24 reste la version recommandée et utilisée
en CI ; le chargeur TypeScript émet encore une dépréciation sous Node 26 local.
