import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const image = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`;

const pages = [
  {
    source: "index.html",
    output: "fr/index.html",
    englishRoute: "/",
    frenchRoute: "/fr/",
    title: "Electronic Artefacts | Studio de technologies créatives",
    description: "Electronic Artefacts conçoit des produits numériques, des systèmes de connaissance, des plateformes culturelles et des expériences issues de la recherche.",
    h1: "Rendre les systèmes créatifs visibles.",
  },
  {
    source: "work.html",
    output: "fr/work.html",
    englishRoute: "/work.html",
    frenchRoute: "/fr/work.html",
    title: "Expertises et réalisations | Electronic Artefacts",
    description: "Conseil, audits, SEO, identité, conception produit, développement et recherche appliquée par Electronic Artefacts.",
    h1: "Systèmes clients et interfaces produit.",
  },
  {
    source: "projects.html",
    output: "fr/projects.html",
    englishRoute: "/projects.html",
    frenchRoute: "/fr/projects.html",
    title: "Projets | Electronic Artefacts",
    description: "Découvrez les projets Electronic Artefacts dans les domaines du logiciel, des plateformes culturelles, de la création artistique et des systèmes clients.",
    h1: "Des systèmes artistiques aux interfaces appliquées.",
  },
  {
    source: "about.html",
    output: "fr/about.html",
    englishRoute: "/about.html",
    frenchRoute: "/fr/about.html",
    title: "À propos du studio | Electronic Artefacts",
    description: "Electronic Artefacts est un studio indépendant de technologies créatives reliant recherche, logiciel, design et production culturelle.",
    h1: "Un studio avant d’être un écosystème.",
  },
  {
    source: "contact.html",
    output: "fr/contact.html",
    englishRoute: "/contact.html",
    frenchRoute: "/fr/contact.html",
    title: "Contact | Electronic Artefacts",
    description: "Contactez Electronic Artefacts pour vos produits numériques, systèmes de connaissance, plateformes culturelles et projets de technologies créatives.",
    h1: "Partir du problème, pas du format.",
  },
  {
    source: "programs.html",
    output: "fr/programs.html",
    englishRoute: "/programs.html",
    frenchRoute: "/fr/programs.html",
    title: "Programmes, dépôts et moteurs | Electronic Artefacts",
    description: "Découvrez les programmes logiciels Electronic Artefacts disponibles par revue de dépôt, pilotes, missions d’implémentation et discussions de licence.",
    h1: "Programmes pour accès au dépôt, pilotes et licences.",
  },
  {
    source: "research.html",
    output: "fr/research.html",
    englishRoute: "/research.html",
    frenchRoute: "/fr/research.html",
    title: "Recherche | Electronic Artefacts",
    description: "Recherche en technologie, systèmes de connaissance, culture, gouvernance, perception et production créative.",
    h1: "Les idées deviennent des systèmes, des méthodes et des œuvres.",
  },
  {
    source: "archive.html",
    output: "fr/archive.html",
    englishRoute: "/archive.html",
    frenchRoute: "/fr/archive.html",
    title: "Archives | Electronic Artefacts",
    description: "Parcourez les publications, prototypes, documents, journaux de recherche et matériaux inachevés préservés par Electronic Artefacts.",
    h1: "Rien d’utile ne devrait disparaître.",
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
    description: "Présentation d’un projet Electronic Artefacts, de ses preuves visuelles et de ses systèmes connectés.",
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
    description: "Une fiche publique de recherche ou de connaissance connectée à l’écosystème Electronic Artefacts.",
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

const seoBlock = (page) => {
  const canonical = `${origin}${page.frenchRoute}`;
  const english = `${origin}${page.englishRoute}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "fr",
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": `${origin}/id/organization/electronic-artefacts/` },
  }).replaceAll("<", "\\u003c");

  return `    <!-- SEO: generated by scripts/build-i18n-pages.mjs -->
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="${page.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"}" />
    <meta name="author" content="Electronic Artefacts" />
    <meta name="theme-color" content="#000000" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${english}" />
    <link rel="alternate" hreflang="fr" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${english}" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
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
  html = html
    .replace('<html lang="en">', '<html lang="fr">')
    .replace("<head>", '<head>\n    <base href="/" />')
    .replace(
      /    <!-- SEO: generated by scripts\/build-seo\.mjs -->[\s\S]*?    <!-- \/SEO -->/,
      seoBlock(page),
    )
    .replace(/(<h1 class="sr-only" data-seo-h1>)[\s\S]*?(<\/h1>)/, `$1${escapeHtml(page.h1 || page.title)}$2`)
    .replaceAll('href="./assets/', 'href="/assets/')
    .replaceAll('src="./assets/', 'src="/assets/')
    .replace('<body data-page=', '<body data-locale="fr" data-page=');

  const output = path.join(rootDir, page.output);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}

process.stdout.write(`Generated ${pages.length} French pages under /fr/.\n`);
