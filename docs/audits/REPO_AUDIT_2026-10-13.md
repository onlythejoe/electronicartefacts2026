# Audit et améliorations — 13 octobre 2026

L'audit couvre le dépôt Electronic Artefacts Vitrine : génération statique,
contenus, graphe, dépendances, SEO, langues, liens locaux, accessibilité des
contrôles et rendu navigateur. Les corrections ont été construites depuis les
sources, puis poussées sur `main` dans le commit
[`50d70038`](https://github.com/onlythejoe/electronicartefacts2026/commit/50d70038ff8d039a732ea73bd9cc0e8931bb5cff).
La CI et GitHub Pages ont réussi pour ce commit ; les nouveaux fichiers sont
également vérifiés sur le domaine public.

## Corrections livrées

| Défaut confirmé | Correction et résultat |
| --- | --- |
| Huit alertes npm, dont cinq de niveau élevé et trois modérées. | Remplacement de `fast-glob` par `glob@13.0.6`, mise à jour de `markdown-it@14.3.2`, `brace-expansion@5.0.12` et `source-map-js@1.2.2`, sélection de `postcss-selector-parser@7.1.6` pour PurgeCSS. L'installation verrouillée passe `npm audit` avec zéro alerte. |
| L'accueil chargeait le runtime de toutes les anciennes pages. | Ajout d'un runtime d'accueil dédié qui réutilise les rendus existants et expose uniquement les fonctions partagées nécessaires. Les deux accueils utilisent `home.js` ; les autres pages conservent leur runtime approprié. |
| La recherche rapide des fiches projet construisait des chemins inexistants. | Par exemple, `/fr/projects/voice-capture-studio/work.html` devient `/fr/work.html`. Les résultats et libellés suivent la langue ; Entrée ouvre le premier résultat. |
| Le focus pouvait sortir de la recherche rapide pendant son ouverture. | Gestion commune des modales : arrière-plan inerte, boucle Tab/Maj+Tab, restauration du focus et des états initiaux, fermeture avant navigation. Les deux runtimes de recherche rapide sont corrigés. |
| Les fiches françaises affichaient un en-tête anglais. | Les en-têtes et pieds de page générés utilisent le dictionnaire existant dès la construction. Les liens suivent les traductions disponibles. Le lien d'évitement et le bouton de langue sont aussi traduits. |
| Le bouton principal Voice Capture Studio était blanc sur une surface presque blanche. | Texte sombre sur fond clair dans la fiche noire. Le contraste des couleurs calculées atteint **18,48:1**. Les captures du logiciel conservent leur apparence réelle. |
| Les transitions natives entre pages restaient actives avec la préférence de mouvement réduit. | Désactivation de ces transitions et de leurs animations dans la règle `prefers-reduced-motion`. La navigation reste utilisable au clavier. |
| Le générateur SEO dupliquait la configuration du studio et conservait une ancienne date de mise à jour. | Il reprend désormais origine, description, date, images, mots-clés et liens depuis `src/config/site.ts`. La mise à jour du site est datée du 13 octobre 2026 ; le test de sitemap suit cette configuration. |
| La commande de vérification testait les anciens fichiers construits et omettait SEO/langue/liens. | Construction avant tests, puis audits SEO et langue. Ajout de `audit:links`, qui contrôle aussi les images différées et les candidats `srcset`. |
| Aucun workflow de qualité du dépôt ne complétait la publication GitHub Pages. | Ajout de `Site quality` sur les push et PR : Node 24, installation verrouillée, vérifications complètes, audit npm et absence de divergence des fichiers reconstruits. |

Les alertes concernent la chaîne de génération. Le retrait de `fast-glob`
supprime sa dépendance à une version de `braces` sans correctif publié.
PurgeCSS conserve sa version compatible avec le projet et utilise le parseur
corrigé via une surcharge ciblée. Sources :
[avis braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
[avis du parseur CSS](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

## Gain mesuré sur l'accueil

| Mesure du JavaScript principal | Avant | Après | Réduction |
| --- | ---: | ---: | ---: |
| Taille brute | 758 874 octets | 571 362 octets | **24,71 %** |
| Taille gzip, même méthode | 196 192 octets | 147 303 octets | **24,92 %** |

Ces chiffres mesurent le poids du fichier. Ils ne constituent pas une mesure
de latence ou de Core Web Vitals sur le trafic réel. Le héros statique, les
cartes, l'atlas, les œuvres sélectionnées, les traductions et les comportements
partagés sont conservés. Le budget de régression du runtime d'accueil est de
600 000 octets.

## Vérifications confirmées

| Contrôle | Résultat |
| --- | --- |
| Contenus | 276 entités valides : 138 sources anglaises et 138 traductions françaises ; zéro anomalie de structure. |
| Graphe public | 138 entités canoniques, 582 relations, une composante, aucune entité isolée. |
| TypeScript | Passe. |
| Tests après construction | **77/77 passent**, aucun test ignoré. Sept tests supplémentaires couvrent les liens, les modales et le runtime d'accueil. |
| SEO | 623 pages HTML, 313 pages indexables, zéro anomalie. |
| Langues | Audit sans mélange évident EN/FR. |
| Liens et ressources locales | 623 pages HTML contrôlées, zéro chemin absent. |
| Dépendances | `npm ci`, arbre npm valide et zéro alerte d'audit. |
| Reconstruction | **2 067 fichiers comparés par SHA-256**, aucune différence après installation propre et reconstruction. Les fichiers macOS sont exclus de cette comparaison. |
| Navigateur local | 14 routes EN/FR × 2 largeurs, soit **28 contrôles** à 390 et 1 280 px : aucun débordement horizontal, section attendue vide, bouton visible sans nom, erreur JavaScript, avertissement ou réponse HTTP en échec pendant ces chargements. |

Les routes navigateur couvrent accueil, projets, contact, fiche Voice Capture
Studio, concept Graph Runtime, graphe global et recherche. Contrôles ciblés
supplémentaires : navigation rapide au clavier vers la page Expertise française,
focus contenu dans la modale, retour navigateur avec arrière-plan interactif,
sélection du mode Découpe lexicale et préférence de mouvement réduit.
Les captures et relevés détaillés restent locaux dans
`output/playwright/audit-2026-10-13/`.

## Livraison et preuve distante

- [CI Site quality réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38461712595), pour `50d70038` : installation propre, vérifications, audit des dépendances et reconstruction identique sous Node 24/Linux.
- [Publication GitHub Pages réussie](https://github.com/onlythejoe/electronicartefacts2026/actions/runs/38461711134), pour le même commit.
- [Accueil public](https://electronicartefacts.com/) : nouveau runtime et date SEO confirmés dans le HTML reçu.
- [Fiche française publique](https://electronicartefacts.com/fr/projects/voice-capture-studio/) : en-tête traduit et nouvelle version CSS confirmés.
- Les fichiers `home.js` et `project.css` servis par le domaine public ont les mêmes SHA-256 que les fichiers locaux vérifiés, respectivement 571 362 et 135 398 octets.

## Limites et état local

Le contrôle navigateur est effectué sous Chromium ; il ne constitue pas une
conformité WCAG exhaustive ni une validation de tous les appareils. Les logiciels
externes présentés sur la Vitrine ne font pas partie de cet audit.
Le nœud RED DOOR reste peu connecté, sans être isolé ; enrichir ses relations
demanderait des sources éditoriales supplémentaires.

Le dépôt GitHub est public et GitHub Pages publie actuellement sa racine. Le
chemin source `src/legacy-data/entities.js` répond publiquement en HTTP 200.
Les champs de visibilité règlent l'inclusion dans les catalogues et bundles ;
les sources et documents du dépôt restent publics. La documentation décrit
maintenant cette limite explicitement.

Node 26 local émet encore un avertissement de dépréciation du chargeur TypeScript.
La version recommandée et vérifiée en CI est Node 24. Aucun changement de
politique de confidentialité, de contenu factuel des projets ou de paramétrage
d'hébergement n'a été effectué.

Les fichiers `.DS_Store` et anciennes captures restent locaux et hors commits.
Les nouveaux résultats Playwright sont ignorés par Git. Aucun nettoyage
destructif du travail préexistant n'a été réalisé.
