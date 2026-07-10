import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const siteDescription = "Electronic Artefacts is an independent creative technology studio for complex digital products, knowledge systems, proprietary software and research-led cultural work.";
const siteUpdatedAt = "2026-07-09";
const socialImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`;
const logoImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg`;
const organizationId = `${origin}/id/organization/electronic-artefacts/`;
const siteAlternateNames = ["electronicArtefacts", "electronicartefacts.com"];
const siteKeywords = [
  "creative technology",
  "digital product strategy",
  "UX design",
  "web development",
  "knowledge graph",
  "AI agents",
  "retrieval-augmented generation",
  "linked data",
  "digital preservation",
  "cultural infrastructure",
  "software systems",
  "research publishing",
];
const knowsAbout = [
  "AI agents",
  "knowledge graphs",
  "retrieval-augmented generation",
  "linked data",
  "JSON-LD",
  "creative coding",
  "digital preservation",
  "cultural knowledge systems",
  "software architecture",
  "human-computer interaction",
  "generative AI",
  "provenance",
];
const sameAs = [
  "https://www.instagram.com/electronic.artefacts/",
  "https://github.com/onlythejoe",
  "https://soundcloud.com/electronic-artefacts",
];
const frenchRoutes = {
  "index.html": "/fr/",
  "work.html": "/fr/work.html",
  "projects.html": "/fr/projects.html",
  "about.html": "/fr/about.html",
  "contact.html": "/fr/contact.html",
  "programs.html": "/fr/programs.html",
  "research.html": "/fr/research.html",
  "archive.html": "/fr/archive.html",
  "mentions-legales.html": "/fr/mentions-legales.html",
  "confidentialite.html": "/fr/confidentialite.html",
  "search.html": "/fr/search.html",
  "project.html": "/fr/project.html",
  "project-rl.html": "/fr/project-rl.html",
  "program.html": "/fr/program.html",
  "entity.html": "/fr/entity.html",
  "artefact.html": "/fr/artefact.html",
  "collection.html": "/fr/collection.html",
  "artist.html": "/fr/artist.html",
  "channel.html": "/fr/channel.html",
  "services.html": "/fr/services.html",
  "communication.html": "/fr/communication.html",
  "agence-communication.html": "/fr/agence-communication.html",
  "development.html": "/fr/development.html",
  "agence-developpement.html": "/fr/agence-developpement.html",
  "palimpsests.html": "/fr/palimpsests.html",
  "vaste.html": "/fr/vaste.html",
};

const pages = {
  "index.html": {
    title: "Electronic Artefacts | Creative Technology & Design Studio",
    description:
      "Independent creative technology studio building digital products, knowledge systems, proprietary software and cultural work.",
    canonical: "/",
    h1: "Complex digital systems, made clear.",
  },
  "work.html": {
    title: "Product Strategy, Design & Engineering | Electronic Artefacts",
    description:
      "Strategy, UX, interface design, engineering and recovery for complex digital products, platforms and knowledge systems.",
    h1: "Strategy, design and engineering for complex digital products.",
  },
  "projects.html": {
    title: "Projects | Electronic Artefacts",
    description:
      "Explore Electronic Artefacts projects across proprietary platforms, cultural work, client products and knowledge systems.",
    h1: "Projects where research takes form.",
  },
  "programs.html": {
    title: "Proprietary Systems and Programs | Electronic Artefacts",
    description:
      "Evaluate Electronic Artefacts proprietary software programs through repository review, focused pilots, implementation partnerships and licensing.",
    h1: "Proprietary systems for ambitious technical partners.",
  },
  "research.html": {
    title: "Research | Electronic Artefacts",
    description:
      "Research on technology, knowledge systems and culture translated into prototypes, publications and working software.",
    h1: "Research that becomes systems, methods and works.",
  },
  "archive.html": {
    title: "Archive | Electronic Artefacts",
    description:
      "Browse releases, prototypes, documents and research traces connected to the decisions and systems that produced them.",
    h1: "Archive of releases, prototypes and research traces.",
  },
  "about.html": {
    title: "About the Studio | Electronic Artefacts",
    description:
      "Learn how Electronic Artefacts combines client commissions, proprietary technology and research-led cultural publishing.",
    h1: "One studio. Three ways of building.",
  },
  "contact.html": {
    title: "Contact | Electronic Artefacts",
    description:
      "Discuss a digital product, system recovery, proprietary technology partnership or cultural project with Electronic Artefacts.",
    h1: "Start with the problem. We’ll find the right form.",
  },
  "palimpsests.html": {
    title: "Palimpsests Redirect | Electronic Artefacts",
    description:
      "Legacy Palimpsests address redirecting to the canonical Electronic Artefacts project record.",
    canonical: "/projects/palimpsests/",
    robots: "noindex,follow",
  },
  "mentions-legales.html": {
    title: "Legal Notice | Electronic Artefacts",
    description: "Legal information, publisher details, third-party services and technical credits for the Electronic Artefacts website.",
  },
  "confidentialite.html": {
    title: "Privacy Policy | Electronic Artefacts",
    description: "Privacy, cookies, Google Analytics consent and browser-storage information for the Electronic Artefacts website.",
  },
  "search.html": {
    title: "Search | Electronic Artefacts",
    description:
      "Search public Electronic Artefacts projects, programs, research, archive records and connected knowledge pages.",
    robots: "noindex,follow",
  },
  "project.html": {
    title: "Project | Electronic Artefacts",
    description: "Electronic Artefacts project overview with visual evidence, delivery context and connected systems.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "project-rl.html": {
    title: "Project Dossier | Electronic Artefacts",
    description: "Extended Electronic Artefacts project documentation and technical context.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "program.html": {
    title: "Program | Electronic Artefacts",
    description: "Electronic Artefacts program profile with status, lineage and system context.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "entity.html": {
    title: "Knowledge Record | Electronic Artefacts",
    description: "A public Electronic Artefacts knowledge record with definition, sources, metadata and graph context.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "artefact.html": {
    title: "Artefact | Electronic Artefacts",
    description:
      "A public artefact preserved in the Electronic Artefacts archive, with provenance, context and connected knowledge-graph references.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "collection.html": {
    title: "Collection | Electronic Artefacts",
    description: "A curated collection of connected Electronic Artefacts projects and research.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "artist.html": {
    title: "Artist | Electronic Artefacts",
    description:
      "Artist profile, connected works, cultural context and archive relationships within the Electronic Artefacts ecosystem.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "channel.html": {
    title: "Channel | Electronic Artefacts",
    description:
      "A public channel connected to the Electronic Artefacts ecosystem, including related works, programs and archive references.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "services.html": {
    title: "Services Redirect | Electronic Artefacts",
    description: "Legacy services address redirecting to the Electronic Artefacts selected work overview.",
    canonical: "/work.html",
    robots: "noindex,follow",
  },
  "communication.html": {
    title: "Communication Redirect | Electronic Artefacts",
    description: "Legacy communication address redirecting to the Electronic Artefacts selected work overview.",
    canonical: "/work.html",
    robots: "noindex,follow",
  },
  "agence-communication.html": {
    title: "Agency Communication Redirect | Electronic Artefacts",
    description: "Legacy communication agency address redirecting to the Electronic Artefacts selected work overview.",
    canonical: "/work.html",
    robots: "noindex,follow",
  },
  "development.html": {
    title: "Development Redirect | Electronic Artefacts",
    description: "Legacy development address redirecting to the Electronic Artefacts research and systems overview.",
    canonical: "/research.html",
    robots: "noindex,follow",
  },
  "agence-developpement.html": {
    title: "Development Agency Redirect | Electronic Artefacts",
    description: "Legacy development agency address redirecting to the Electronic Artefacts research and systems overview.",
    canonical: "/research.html",
    robots: "noindex,follow",
  },
  "vaste.html": {
    title: "VASTE Redirect | Electronic Artefacts",
    description: "Legacy Electronic Artefacts address redirecting visitors to the dedicated VASTE program website.",
    canonical: "https://www.vaste.space/",
    robots: "noindex,follow",
  },
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const seoMarkup = (file, config) => {
  const canonicalPath = config.dynamic ? `/${file}` : config.canonical || `/${file}`;
  const canonical = canonicalPath.startsWith("https://") ? canonicalPath : `${origin}${canonicalPath}`;
  const type = config.type || "website";
  const robots = config.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const canonicalMarkup = `\n    <link rel="canonical" href="${canonical}" />`;
  const frenchAlternate = frenchRoutes[file] ? `${origin}${frenchRoutes[file]}` : null;
  const hasBreadcrumb = canonical !== `${origin}/` && canonical.startsWith(origin) && !robots.includes("noindex");
  const breadcrumbId = `${canonical}#breadcrumb`;
  const breadcrumbName = config.title.split("|")[0].trim();
  const schemaGraph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Electronic Artefacts",
      alternateName: siteAlternateNames,
      url: `${origin}/`,
      description: siteDescription,
      keywords: siteKeywords,
      knowsAbout,
      logo: {
        "@type": "ImageObject",
        url: logoImage,
        contentUrl: logoImage,
        width: 1024,
        height: 1024,
      },
      image: socialImage,
      email: "electronic.artefacts@gmail.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "electronic.artefacts@gmail.com",
          contactType: "inquiries",
          availableLanguage: ["en", "fr"],
        },
      ],
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "Electronic Artefacts",
      alternateName: siteAlternateNames,
      description: siteDescription,
      keywords: siteKeywords,
      dateModified: siteUpdatedAt,
      publisher: { "@id": organizationId },
      inLanguage: "en",
    },
    {
      "@type": type === "article" ? "Article" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: config.title,
      headline: type === "article" ? config.title : undefined,
      description: config.description,
      image: socialImage,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: socialImage,
        contentUrl: socialImage,
        width: 1200,
        height: 630,
      },
      thumbnailUrl: socialImage,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
      publisher: { "@id": organizationId },
      breadcrumb: hasBreadcrumb ? { "@id": breadcrumbId } : undefined,
      isAccessibleForFree: true,
    },
  ];
  if (hasBreadcrumb) {
    schemaGraph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: breadcrumbName, item: canonical },
      ],
    });
  }
  const schemaMarkup = `
    <script type="application/ld+json" data-seo-schema="webpage">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemaGraph.map((node) => Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined))),
      }).replaceAll("<", "\\u003c")}
    </script>`;
  const homepagePreload = file === "index.html"
    ? '    <link rel="preload" as="image" href="/assets/media/projects/vestiges/logo-vestiges.png" fetchpriority="high" />\n'
    : "";

  return `    <!-- SEO: generated by scripts/build-seo.mjs -->
    <meta name="description" content="${escapeHtml(config.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Electronic Artefacts" />
    <meta name="application-name" content="Electronic Artefacts" />
    <meta name="apple-mobile-web-app-title" content="Electronic Artefacts" />
    <meta name="theme-color" content="#000000" />${canonicalMarkup}
    <link rel="alternate" hreflang="en" href="${canonical}" />${frenchAlternate ? `\n    <link rel="alternate" hreflang="fr" href="${frenchAlternate}" />` : ""}
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
${homepagePreload}    <link rel="alternate" type="application/ld+json" href="/graph/catalog.jsonld" title="Public knowledge graph catalog" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site index" />
    <link rel="alternate" type="application/json" href="/agent-manifest.json" title="Agent manifest" />
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Electronic Artefacts Search" />
    <link rel="image_src" href="${socialImage}" />
    <meta property="og:title" content="${escapeHtml(config.title)}" />
    <meta property="og:description" content="${escapeHtml(config.description)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Electronic Artefacts" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="fr_FR" />
    ${canonical ? `<meta property="og:url" content="${canonical}" />` : ""}
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:secure_url" content="${socialImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Electronic Artefacts creative technology studio" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(config.title)}" />
    <meta name="twitter:description" content="${escapeHtml(config.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="Electronic Artefacts creative technology studio" />
    <title>${escapeHtml(config.title)}</title>${schemaMarkup}
    <!-- /SEO -->`.replace(/[ \t]+$/gm, "");
};

const injectSeoH1 = (html, config) => {
  if (!config.h1) return html;
  const h1 = `      <h1 class="sr-only" data-seo-h1>${escapeHtml(config.h1)}</h1>\n`;
  const withoutExisting = html.replace(/\s*<h1 class="sr-only" data-seo-h1>[\s\S]*?<\/h1>\s*/g, "\n");
  if (/<h1\b/i.test(withoutExisting)) return withoutExisting;
  return withoutExisting.replace(/(<main\b[^>]*>\s*)/, `$1\n${h1}`);
};

for (const [file, config] of Object.entries(pages)) {
  const absolutePath = path.join(rootDir, file);
  let html = await readFile(absolutePath, "utf8");
  const block = seoMarkup(file, config);

  if (html.includes("<!-- SEO: generated by scripts/build-seo.mjs -->")) {
    html = html.replace(
      /    <!-- SEO: generated by scripts\/build-seo\.mjs -->[\s\S]*?    <!-- \/SEO -->/,
      block,
    );
  } else {
    html = html
      .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "")
      .replace(/\s*<meta\s+name="robots"[^>]*\/>/, "")
      .replace(/\s*<link\s+rel="canonical"[^>]*\/>/, "")
      .replace(/\s*<title>[\s\S]*?<\/title>/, "")
      .replace(/(\s*<meta\s+name="color-scheme"[^>]*\/>)/, `$1\n${block}`);
  }

  html = injectSeoH1(html, config);
  html = html.replace(/assets\/js\/app\.js\?v=\d+/, "assets/js/app.js?v=47");

  await writeFile(absolutePath, html);
}

process.stdout.write(`Updated SEO metadata for ${Object.keys(pages).length} pages.\n`);
