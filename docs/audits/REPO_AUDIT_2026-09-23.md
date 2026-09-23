# Audit du dépôt — 23 septembre 2026

## Périmètre et preuve

Audit du dépôt statique et de sa génération : contrats et contenus typés, cohérence du graphe, rendu statique, indexation et métadonnées, bilinguisme, bundles navigateur, tests, dépendances et rendu local de Voice Capture Studio (EN/FR). Les métriques ci-dessous viennent du checkout local et n’attestent pas le déploiement public ni la CI distante.

## Résultats confirmés

- 276 entités validées : 138 sources anglaises et 138 traductions françaises. Les audits structure et langue ne relèvent aucun problème.
- Le graphe public compte 138 entités canoniques et 582 relations typées dans une composante, sans entité isolée ni erreur de validation. `ea:organization:red-door` est le seul nœud faible (1 relation entrante, 1 sortante), sans être isolé.
- L’audit SEO couvre 623 pages HTML et 313 pages indexables, sans anomalie après correction du contrôle `lastmod`.
- TypeScript, les 70 tests et la construction statique passent. Aucun test n’est ignoré. Le bundle d’accueil fait 178 017 octets, sous le seuil de 180 000.
- `npm audit --audit-level=high` rapporte zéro vulnérabilité. Le rendu Playwright local à 390 px n’a aucun débordement horizontal; le défilement masque l’en-tête selon l’état prévu. Console navigateur : zéro erreur et zéro avertissement observés.

## Défauts corrigés

1. **Présentation Voice Capture encore claire.** La fiche éditoriale utilisait des surfaces blanc chaud malgré la consigne de la rendre noire. Le thème noir est maintenant appliqué à la fiche et à son expérience intégrée, avec texte, contrôles, états actifs et focus lisibles. Les captures du logiciel restent claires, puisqu’elles montrent l’interface réelle du produit.
2. **CSS du dossier projet surdimensionné et comportement d’en-tête incomplet.** Les styles de métriques réservés aux dossiers gonflaient inutilement le bundle d’accueil. La purge sépare maintenant ces règles; elle préserve aussi `is-header-hidden`, classe ajoutée au runtime mais auparavant privée de sa règle CSS dans le bundle projet. La page mobile masque maintenant son en-tête pendant le défilement, comme l’attend le runtime.
3. **Contrôle de fraîcheur SEO trompeur.** L’auditeur cherchait une date du 9 juillet dans tout le sitemap, sans borner la recherche à l’entrée d’accueil. Il pouvait donc passer grâce à la date d’une autre URL et diverger de `site.updatedAt`. Il compare maintenant le `lastmod` du bloc d’accueil à la configuration canonique.
4. **Test de fumée Vestiges ignoré à cause d’une ancienne route.** Il cherchait `/fr/projects/vestiges/`, alors que la fiche publiée est `/fr/projects/v6/`. Le chemin de fixture suit la route canonique actuelle; le test s’exécute et passe.

## Limites et suites possibles

- Le graphe est valide et connecté, mais la faible connectivité de l’entité RED DOOR mérite une décision éditoriale si davantage de découvrabilité publique est voulue.
- L’audit couvre le rendu local; il ne vérifie ni le site en production, ni les exécutions CI distantes, ni une conformité WCAG complète.
- Les commandes Node émettent un avertissement de dépréciation `module.register()` via le runtime TypeScript; il n’empêche ni tests ni build.

## État du checkout

Le travail préexistant a été préservé : `.DS_Store` était déjà modifié et `.playwright-cli/` contenait déjà des fichiers non suivis. La capture mobile de preuve est [voice capture mobile](../../output/playwright/electronic-artefacts-vcs-mobile-black-2026-09-23.png). Aucune livraison ou publication externe n’a été effectuée.
