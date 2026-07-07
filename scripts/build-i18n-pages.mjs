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
    description: "Informations légales et coordonnées de l’éditeur du site Electronic Artefacts.",
  },
  {
    source: "confidentialite.html",
    output: "fr/confidentialite.html",
    englishRoute: "/confidentialite.html",
    frenchRoute: "/fr/confidentialite.html",
    title: "Politique de confidentialité | Electronic Artefacts",
    description: "Informations sur la confidentialité et le stockage local utilisés par le site Electronic Artefacts.",
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
    <link rel="alternate" type="application/ld+json" href="/graph/catalog.jsonld" title="Public knowledge graph catalog" />
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

  const output = path.join(rootDir, page.output);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}

process.stdout.write(`Generated ${pages.length} French pages under /fr/.\n`);
