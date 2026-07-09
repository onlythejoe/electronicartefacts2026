import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const image = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`;
const logo = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg`;

const pages = [
  {
    source: "index.html",
    output: "fr/index.html",
    englishRoute: "/",
    frenchRoute: "/fr/",
    title: "Electronic Artefacts | Studio de technologies créatives",
    description: "Studio indépendant de technologies créatives pour produits numériques, systèmes de connaissance, logiciels et projets culturels.",
    h1: "Rendre les systèmes numériques complexes lisibles.",
  },
  {
    source: "work.html",
    output: "fr/work.html",
    englishRoute: "/work.html",
    frenchRoute: "/fr/work.html",
    title: "Stratégie produit, design & ingénierie | Electronic Artefacts",
    description: "Stratégie, UX, design d’interface, ingénierie et reprise de produits numériques, plateformes et systèmes de connaissance complexes.",
    h1: "Stratégie, design et ingénierie pour des produits numériques complexes.",
  },
  {
    source: "projects.html",
    output: "fr/projects.html",
    englishRoute: "/projects.html",
    frenchRoute: "/fr/projects.html",
    title: "Projets | Electronic Artefacts",
    description: "Découvrez les plateformes propriétaires, créations culturelles, produits clients et systèmes de connaissance réalisés par Electronic Artefacts.",
    h1: "Des projets où la recherche prend forme.",
  },
  {
    source: "about.html",
    output: "fr/about.html",
    englishRoute: "/about.html",
    frenchRoute: "/fr/about.html",
    title: "À propos du studio | Electronic Artefacts",
    description: "Découvrez comment Electronic Artefacts réunit missions clients, technologies propriétaires et édition culturelle issue de la recherche.",
    h1: "Un studio. Trois façons de construire.",
  },
  {
    source: "contact.html",
    output: "fr/contact.html",
    englishRoute: "/contact.html",
    frenchRoute: "/fr/contact.html",
    title: "Contact | Electronic Artefacts",
    description: "Échangez avec Electronic Artefacts sur un produit numérique, une reprise de système, un partenariat technologique ou un projet culturel.",
    h1: "Commencez par le problème. Nous trouverons la forme juste.",
  },
  {
    source: "programs.html",
    output: "fr/programs.html",
    englishRoute: "/programs.html",
    frenchRoute: "/fr/programs.html",
    title: "Systèmes propriétaires et programmes | Electronic Artefacts",
    description: "Évaluez les programmes logiciels propriétaires d’Electronic Artefacts par revue de dépôt, pilote ciblé, partenariat d’implémentation ou licence.",
    h1: "Des systèmes propriétaires pour des partenaires techniques ambitieux.",
  },
  {
    source: "research.html",
    output: "fr/research.html",
    englishRoute: "/research.html",
    frenchRoute: "/fr/research.html",
    title: "Recherche | Electronic Artefacts",
    description: "Recherche sur la technologie, les systèmes de connaissance et la culture, traduite en prototypes, publications et logiciels opérationnels.",
    h1: "Une recherche qui prend la forme de systèmes, de méthodes et d’œuvres.",
  },
  {
    source: "archive.html",
    output: "fr/archive.html",
    englishRoute: "/archive.html",
    frenchRoute: "/fr/archive.html",
    title: "Archives | Electronic Artefacts",
    description: "Parcourez les publications, prototypes, documents et traces de recherche reliés aux décisions et aux systèmes qui les ont produits.",
    h1: "Archives de publications, prototypes et traces de recherche.",
  },
  {
    source: "mentions-legales.html",
    output: "fr/mentions-legales.html",
    englishRoute: "/mentions-legales.html",
    frenchRoute: "/fr/mentions-legales.html",
    title: "Mentions légales | Electronic Artefacts",
    description: "Informations légales, services tiers et crédits techniques du site Electronic Artefacts.",
  },
  {
    source: "confidentialite.html",
    output: "fr/confidentialite.html",
    englishRoute: "/confidentialite.html",
    frenchRoute: "/fr/confidentialite.html",
    title: "Politique de confidentialité | Electronic Artefacts",
    description: "Informations sur la confidentialité, les cookies, Google Analytics et le stockage local du site Electronic Artefacts.",
  },
  {
    source: "search.html",
    output: "fr/search.html",
    englishRoute: "/search.html",
    frenchRoute: "/fr/search.html",
    title: "Recherche | Electronic Artefacts",
    description: "Recherchez dans les projets, programmes, publications, archives et fiches de connaissance publiques d’Electronic Artefacts.",
    robots: "noindex,follow",
  },
  {
    source: "project.html",
    output: "fr/project.html",
    englishRoute: "/project.html",
    frenchRoute: "/fr/project.html",
    title: "Projet | Electronic Artefacts",
    description: "Présentation d’un projet Electronic Artefacts avec preuves visuelles, contexte de réalisation et systèmes connectés.",
    robots: "noindex,follow",
  },
  {
    source: "project-rl.html",
    output: "fr/project-rl.html",
    englishRoute: "/project-rl.html",
    frenchRoute: "/fr/project-rl.html",
    title: "Dossier de projet | Electronic Artefacts",
    description: "Documentation étendue et contexte technique d’un projet Electronic Artefacts.",
    robots: "noindex,follow",
  },
  {
    source: "program.html",
    output: "fr/program.html",
    englishRoute: "/program.html",
    frenchRoute: "/fr/program.html",
    title: "Programme | Electronic Artefacts",
    description: "Fiche d’un programme Electronic Artefacts avec état, héritage et contexte système.",
    robots: "noindex,follow",
  },
  {
    source: "entity.html",
    output: "fr/entity.html",
    englishRoute: "/entity.html",
    frenchRoute: "/fr/entity.html",
    title: "Fiche de connaissance | Electronic Artefacts",
    description: "Une fiche publique de connaissance Electronic Artefacts avec définition, sources, métadonnées et contexte de graphe.",
    robots: "noindex,follow",
  },
  {
    source: "artefact.html",
    output: "fr/artefact.html",
    englishRoute: "/artefact.html",
    frenchRoute: "/fr/artefact.html",
    title: "Artefact | Electronic Artefacts",
    description: "Un artefact public préservé dans les archives Electronic Artefacts avec sa provenance et ses relations.",
    robots: "noindex,follow",
  },
  {
    source: "collection.html",
    output: "fr/collection.html",
    englishRoute: "/collection.html",
    frenchRoute: "/fr/collection.html",
    title: "Collection | Electronic Artefacts",
    description: "Une collection éditoriale de projets et recherches connectés d’Electronic Artefacts.",
    robots: "noindex,follow",
  },
  {
    source: "artist.html",
    output: "fr/artist.html",
    englishRoute: "/artist.html",
    frenchRoute: "/fr/artist.html",
    title: "Artiste | Electronic Artefacts",
    description: "Profil d’artiste, œuvres connectées et contexte culturel dans l’écosystème Electronic Artefacts.",
    robots: "noindex,follow",
  },
  {
    source: "channel.html",
    output: "fr/channel.html",
    englishRoute: "/channel.html",
    frenchRoute: "/fr/channel.html",
    title: "Canal | Electronic Artefacts",
    description: "Un canal public relié aux projets, programmes et archives d’Electronic Artefacts.",
    robots: "noindex,follow",
  },
  ...[
    ["services.html", "Services", "Ancienne adresse des services redirigée vers les expertises Electronic Artefacts."],
    ["communication.html", "Communication", "Ancienne adresse de communication redirigée vers les expertises Electronic Artefacts."],
    ["agence-communication.html", "Agence de communication", "Ancienne adresse d’agence redirigée vers les expertises Electronic Artefacts."],
    ["development.html", "Développement", "Ancienne adresse de développement redirigée vers la recherche et les systèmes Electronic Artefacts."],
    ["agence-developpement.html", "Agence de développement", "Ancienne adresse d’agence de développement redirigée vers la recherche Electronic Artefacts."],
    ["palimpsests.html", "Palimpsests", "Ancienne adresse redirigée vers la fiche canonique française du projet Palimpsests."],
    ["vaste.html", "VASTE", "Ancienne adresse Electronic Artefacts redirigée vers le site officiel du programme VASTE."],
  ].map(([source, title, description]) => ({
    source,
    output: `fr/${source}`,
    englishRoute: `/${source}`,
    frenchRoute: `/fr/${source}`,
    title: `${title} | Electronic Artefacts`,
    description,
    robots: "noindex,follow",
  })),
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const frenchHomeShell = `      <h1 class="sr-only" data-seo-h1>Complex digital systems, made clear.</h1>
      <section data-render="home-hero"></section>
      <section data-render="home-vaste-banner"></section>
      <section data-render="home-featured-paths"></section>
      <section data-render="home-featured-work"></section>
      <section data-render="home-featured-research"></section>
      <section data-render="cross-navigation"></section>`;

const frenchOrganizationMicrodata = `    <!-- ENTITY MICRODATA START -->
    <meta itemprop="name" content="Electronic Artefacts" />
    <meta itemprop="alternateName" content="electronicArtefacts" />
    <meta itemprop="description" content="Electronic Artefacts est un studio indépendant de technologies créatives qui conçoit des produits numériques, des systèmes de connaissance, des logiciels propriétaires et des projets culturels." />
    <link itemprop="url" href="https://electronicartefacts.com/fr/" />
    <link itemprop="logo" href="https://electronicartefacts.com/assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg" />
    <link itemprop="sameAs" href="https://www.instagram.com/electronic.artefacts/" />
    <link itemprop="sameAs" href="https://github.com/onlythejoe" />
    <link itemprop="sameAs" href="https://soundcloud.com/electronic-artefacts" />
    <!-- ENTITY MICRODATA END -->`;

const frenchCreativeWorkMicrodata = `      <!-- CREATIVEWORK MICRODATA START -->
      <meta itemprop="name" content="Electronic Artefacts | Studio de technologies créatives" />
      <meta itemprop="description" content="Studio indépendant de technologies créatives pour produits numériques, systèmes de connaissance, logiciels et projets culturels." />
      <link itemprop="url" href="https://electronicartefacts.com/fr/" />
      <meta itemprop="inLanguage" content="fr" />
      <!-- CREATIVEWORK MICRODATA END -->`;

const frenchPrivacyMain = `<main id="main" class="site-main">
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">CONFIDENTIALITÉ</p>
          <h1 class="display-title">Gestion des données du site.</h1>
          <p class="lede">
            Electronic Artefacts utilise une mesure d'audience fondée sur le consentement. Google Analytics 4 n'est chargé qu'après votre
            consentement explicite, et le refus n'a aucun effet sur l'accès au site.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Données de contact</p>
            <h2 class="card__title">Uniquement si vous écrivez</h2>
            <p class="card__copy">
              Si vous contactez le studio par e-mail ou via une plateforme externe, les informations transmises servent à
              répondre à votre demande et à suivre l'échange.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Préférences locales</p>
            <h2 class="card__title">Stockées dans votre navigateur</h2>
            <p class="card__copy">
              Le site mémorise certaines préférences d'interface et votre choix relatif à l'analytics dans localStorage. Ce
              choix est conservé jusqu'à six mois avant une nouvelle demande.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Services externes</p>
            <h2 class="card__title">Plateformes tierces</h2>
            <p class="card__copy">
              Instagram, GitHub, SoundCloud et VASTE sont des services externes avec leurs propres règles de confidentialité.
              Les ouvrir vous fait quitter le site Electronic Artefacts.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Fournisseurs techniques</p>
            <h2 class="card__title">GitHub Pages, IONOS et Google</h2>
            <p class="card__copy">
              Le site est hébergé sur GitHub Pages et le nom de domaine est géré via IONOS. Si vous acceptez l'analytics,
              Google LLC traite des données de mesure d'audience via Google Analytics 4.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Mesure d'audience</p>
            <h2 class="card__title">Consentement avant Google Analytics</h2>
            <p class="card__copy">
              Avant consentement, le site ne charge pas le script Google Analytics et n'envoie pas d'événement analytics à
              Google. Après consentement, le site peut mesurer les pages consultées, les référents, des informations larges
              sur l'appareil ou le navigateur, l'activité de session et les interactions avec le site public.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Événements d'interaction</p>
            <h2 class="card__title">Navigation, recherche et activité de graphe</h2>
            <p class="card__copy">
              Si l'analytics est accepté, le site peut envoyer des événements liés aux clics internes et externes, aux
              téléchargements, aux liens d'intention de contact, aux changements de langue, aux termes de recherche interne,
              aux filtres, aux onglets, aux sélections de nœuds de graphe, aux sections vues, aux seuils de scroll, aux
              seuils de temps actif, aux likes et aux actions de partage. Les adresses e-mail et numéros de téléphone
              évidents saisis dans les champs de recherche sont masqués avant l'envoi.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Minimisation</p>
            <h2 class="card__title">Pas de profils personnels volontaires</h2>
            <p class="card__copy">
              L'implémentation n'envoie pas volontairement à Google Analytics de noms, adresses e-mail, numéros de téléphone,
              contenus de messages, identifiants de compte, données utilisateur publicitaires ou signaux de personnalisation
              publicitaire.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Conservation</p>
            <h2 class="card__title">Limitée au besoin</h2>
            <p class="card__copy">
              Les échanges par e-mail sont conservés le temps nécessaire pour répondre et suivre la demande, puis archivés ou
              supprimés selon le fonctionnement du studio.
            </p>
          </article>
        </div>
      </section>

      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">COOKIES ET TRACEURS</p>
          <h2>Les cookies analytics demandent votre consentement</h2>
          <p class="lede">
            Les cookies Google Analytics sont optionnels. Vous pouvez les accepter ou les refuser depuis le bandeau avec le
            même niveau d'effort, puis rouvrir ce choix depuis le pied de page.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Google Analytics 4</p>
            <h2 class="card__title">_ga et _ga_&lt;container-id&gt;</h2>
            <p class="card__copy">
              Si l'analytics est accepté, GA4 peut déposer des cookies comme <code>_ga</code> et
              <code>_ga_&lt;container-id&gt;</code>. Google les décrit comme des cookies de distinction des utilisateurs et
              de maintien de l'état de session, avec une durée par défaut pouvant aller jusqu'à deux ans.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Consent Mode</p>
            <h2 class="card__title">Le stockage publicitaire reste refusé</h2>
            <p class="card__copy">
              L'implémentation transmet des signaux de consentement Google avec le stockage analytics accordé uniquement
              après opt-in. Le stockage publicitaire, les données utilisateur publicitaires et la personnalisation
              publicitaire restent refusés.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Transferts et fournisseur</p>
            <h2 class="card__title">Google peut traiter les données hors UE</h2>
            <p class="card__copy">
              Google Analytics peut impliquer des transferts ou accès par des entités Google situées hors de l'Espace
              économique européen. C'est pourquoi l'analytics est optionnel et fondé sur le consentement.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Modifier votre choix</p>
            <h2 class="card__title">Retirer le consentement</h2>
            <p class="card__copy">
              Utilisez le contrôle de préférences cookies dans le pied de page pour refuser l'analytics après acceptation.
              Le site envoie alors un signal de refus et supprime les cookies Google Analytics accessibles localement.
            </p>
            <div class="link-row">
              <button class="tag footer-consent-button" type="button" data-analytics-preferences>Préférences cookies</button>
            </div>
          </article>
        </div>
      </section>

      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">DROITS</p>
          <h2>Accès, correction et suppression</h2>
          <p class="lede">
            Pour consulter, corriger ou supprimer des informations que vous avez transmises au studio, utilisez l'adresse de
            contact ci-dessous.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Contact</p>
            <h2 class="card__title">electronic.artefacts@gmail.com</h2>
            <p class="card__copy">Adresse à utiliser pour les demandes liées à la confidentialité et aux données.</p>
            <div class="link-row">
              <a class="tag" href="mailto:electronic.artefacts@gmail.com">Envoyer un e-mail</a>
            </div>
          </article>

          <article class="panel">
            <p class="card__meta">Périmètre</p>
            <h2 class="card__title">Ce site uniquement</h2>
            <p class="card__copy">
              Cette politique concerne le site public Electronic Artefacts et ne couvre pas les plateformes tierces liées
              depuis celui-ci.
            </p>
          </article>
        </div>
      </section>
    </main>`;

const frenchLegalMain = `<main id="main" class="site-main">
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">MENTIONS LÉGALES</p>
          <h1 class="display-title">Éditeur et informations d'hébergement.</h1>
          <p class="lede">
            Informations légales et techniques relatives au site Electronic Artefacts.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Nom de publication</p>
            <h2 class="card__title">Electronic Artefacts</h2>
            <p class="card__copy">Nom public du studio utilisé sur le site et les canaux sociaux.</p>
          </article>

          <article class="panel">
            <p class="card__meta">Contact</p>
            <h2 class="card__title">electronic.artefacts@gmail.com</h2>
            <p class="card__copy">Adresse de contact pour les demandes éditoriales, commerciales et liées aux droits.</p>
            <div class="link-row">
              <a class="tag" href="mailto:electronic.artefacts@gmail.com">Envoyer un e-mail</a>
            </div>
          </article>

          <article class="panel">
            <p class="card__meta">Éditeur</p>
            <h2 class="card__title">Studio indépendant</h2>
            <p class="card__copy">
              Electronic Artefacts est présenté sous son nom public de studio. Les demandes formelles peuvent être adressées
              à l'adresse indiquée sur cette page.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Hébergement</p>
            <h2 class="card__title">GitHub Pages</h2>
            <p class="card__copy">
              Le site est hébergé sur GitHub Pages, service d'hébergement fourni par GitHub, Inc.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Nom de domaine</p>
            <h2 class="card__title">IONOS</h2>
            <p class="card__copy">
              Le nom de domaine utilisé par le site est enregistré et géré via IONOS.
            </p>
          </article>
        </div>
      </section>

      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PROPRIÉTÉ INTELLECTUELLE</p>
          <h2>Propriété des contenus et réutilisation</h2>
          <p class="lede">
            Les textes, visuels, codes, sons et éléments d'identité publiés sur ce site appartiennent à Electronic Artefacts
            ou aux ayants droit crédités.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Copyright</p>
            <h2 class="card__title">Contenus protégés</h2>
            <p class="card__copy">
              Aucun élément du site ne doit être repris, copié ou redistribué sans autorisation lorsqu'il n'est pas
              explicitement placé sous une autre licence.
            </p>
          </article>

          <article class="panel">
            <p class="card__meta">Ressources tierces</p>
            <h2 class="card__title">Créditées lorsque possible</h2>
            <p class="card__copy">
              Les médias ou références externes restent soumis à leur licence ou à leurs conditions d'origine.
            </p>
          </article>
        </div>
      </section>

      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">SERVICES TIERS</p>
          <h2>Hébergement, domaine, analytics et crédits</h2>
          <p class="lede">
            Le site public est publié par Electronic Artefacts et s'appuie sur un nombre limité de prestataires techniques.
          </p>
        </div>

        <div class="card-grid card-grid--two">
          <article class="panel">
            <p class="card__meta">Mesure d'audience</p>
            <h2 class="card__title">Google Analytics 4</h2>
            <p class="card__copy">
              Google Analytics est utilisé uniquement après consentement cookies pour mesurer le trafic public, les parcours
              de navigation et les événements d'interaction utiles à l'amélioration du site. Les détails relatifs aux
              cookies, au retrait du consentement et au traitement des données sont indiqués dans la politique de
              confidentialité.
            </p>
            <div class="link-row">
              <a class="tag" href="/fr/confidentialite.html">Politique de confidentialité</a>
            </div>
          </article>

          <article class="panel">
            <p class="card__meta">Crédits techniques</p>
            <h2 class="card__title">Plateforme statique de connaissance</h2>
            <p class="card__copy">
              Le site est généré depuis les contenus, templates, données de graphe et ressources publiques d'Electronic
              Artefacts. L'hébergement est assuré par GitHub Pages et le domaine est géré via IONOS.
            </p>
          </article>
        </div>
      </section>

      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">CONTACT POUR DEMANDES LÉGALES</p>
          <h2>Questions et demandes formelles</h2>
          <p class="lede">
            Pour toute demande légale, éditoriale ou liée aux droits concernant le site, contactez Electronic Artefacts par
            e-mail.
          </p>
        </div>

        <div class="panel panel--soft">
          <p class="card__copy">electronic.artefacts@gmail.com</p>
        </div>
      </section>
    </main>`;

const seoBlock = (page) => {
  const canonical = `${origin}${page.frenchRoute}`;
  const english = `${origin}${page.englishRoute}`;
  const robots = page.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const organizationId = `${origin}/id/organization/electronic-artefacts/`;
  const hasBreadcrumb = page.frenchRoute !== "/fr/" && !robots.includes("noindex");
  const breadcrumbId = `${canonical}#breadcrumb`;
  const schemaGraph = [{
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "fr",
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": organizationId },
    breadcrumb: hasBreadcrumb ? { "@id": breadcrumbId } : undefined,
  }];
  if (["index.html", "about.html", "contact.html"].includes(page.source)) {
    schemaGraph.unshift({
      "@type": "Organization",
      "@id": organizationId,
      name: "Electronic Artefacts",
      alternateName: ["electronicArtefacts", "electronicartefacts.com"],
      url: `${origin}/`,
      description: "Studio indépendant de technologies créatives pour produits numériques, systèmes de connaissance, logiciels et projets culturels.",
      logo: { "@type": "ImageObject", url: logo, contentUrl: logo, width: 1024, height: 1024 },
      email: "electronic.artefacts@gmail.com",
      sameAs: [
        "https://www.instagram.com/electronic.artefacts/",
        "https://github.com/onlythejoe",
        "https://soundcloud.com/electronic-artefacts",
      ],
    });
  }
  if (hasBreadcrumb) {
    schemaGraph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${origin}/fr/` },
        { "@type": "ListItem", position: 2, name: page.title.split("|")[0].trim(), item: canonical },
      ],
    });
  }
  const cleanSchemaGraph = schemaGraph.map((node) => Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined)));
  const jsonLd = JSON.stringify(cleanSchemaGraph.length === 1
    ? { "@context": "https://schema.org", ...cleanSchemaGraph[0] }
    : { "@context": "https://schema.org", "@graph": cleanSchemaGraph })
    .replaceAll("<", "\\u003c");
  const homepagePreload = page.source === "index.html"
    ? '    <link rel="preload" as="image" href="/assets/media/projects/vestiges/logo-vestiges.png" fetchpriority="high" />\n'
    : "";

  return `    <!-- SEO: generated by scripts/build-i18n-pages.mjs -->
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Electronic Artefacts" />
    <meta name="application-name" content="Electronic Artefacts" />
    <meta name="apple-mobile-web-app-title" content="Electronic Artefacts" />
    <meta name="theme-color" content="#000000" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${english}" />
    <link rel="alternate" hreflang="fr" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${english}" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
${homepagePreload}    <link rel="alternate" type="application/ld+json" href="/graph/catalog.jsonld" title="Public knowledge graph catalog" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site index" />
    <link rel="alternate" type="application/json" href="/agent-manifest.json" title="Agent manifest" />
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Electronic Artefacts Search" />
    <link rel="image_src" href="${image}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Electronic Artefacts" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Electronic Artefacts, studio de technologies créatives" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="Electronic Artefacts, studio de technologies créatives" />
    <title>${escapeHtml(page.title)}</title>
    <script type="application/ld+json" data-seo-schema="webpage">${jsonLd}</script>
    <!-- /SEO -->`;
};

for (const page of pages) {
  let html = await readFile(path.join(rootDir, page.source), "utf8");
  if (page.source === "index.html") {
    html = html.replace(
      /      <!-- HOME STATIC FALLBACK START -->[\s\S]*?      <!-- HOME STATIC FALLBACK END -->/,
      frenchHomeShell,
    )
      .replace(
        /    <!-- ENTITY MICRODATA START -->[\s\S]*?    <!-- ENTITY MICRODATA END -->/,
        frenchOrganizationMicrodata,
      )
      .replace(
        /      <!-- CREATIVEWORK MICRODATA START -->[\s\S]*?      <!-- CREATIVEWORK MICRODATA END -->/,
        frenchCreativeWorkMicrodata,
      )
      .replace(
        'itemid="https://electronicartefacts.com/#webpage"',
        'itemid="https://electronicartefacts.com/fr/#webpage"',
      );
  }
  html = html
    .replace('<html lang="en">', '<html lang="fr">')
    .replace("<head>", '<head>\n    <base href="/" />')
    .replace(
      /    <!-- SEO: generated by scripts\/build-seo\.mjs -->[\s\S]*?    <!-- \/SEO -->/,
      seoBlock(page),
    )
    .replace(/(<h1 class="sr-only" data-seo-h1>)[\s\S]*?(<\/h1>)/, `$1${escapeHtml(page.h1 || page.title)}$2`)
    .replaceAll("Go to Work", "Aller aux expertises")
    .replaceAll("Go to Research", "Aller à la recherche")
    .replaceAll("Open VASTE", "Ouvrir VASTE")
    .replaceAll("LEGACY ROUTE", "ANCIENNE ADRESSE")
    .replaceAll("Palimpsests has moved.", "Palimpsests a changé d’adresse.")
    .replaceAll("This address now resolves to the canonical Electronic Artefacts project record.", "Cette adresse renvoie désormais vers la fiche projet canonique d’Electronic Artefacts.")
    .replaceAll(">Continue<", ">Continuer<")
    .replaceAll('href="./assets/', 'href="/assets/')
    .replaceAll('src="./assets/', 'src="/assets/')
    .replace('<body data-page=', '<body data-locale="fr" data-page=');

  if (page.source === "confidentialite.html") {
    html = html.replace(/    <main id="main" class="site-main">[\s\S]*?    <\/main>/, frenchPrivacyMain);
  }
  if (page.source === "mentions-legales.html") {
    html = html.replace(/    <main id="main" class="site-main">[\s\S]*?    <\/main>/, frenchLegalMain);
  }

  const output = path.join(rootDir, page.output);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}

process.stdout.write(`Generated ${pages.length} French pages under /fr/.\n`);
