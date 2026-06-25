import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const siteDescription = "Electronic Artefacts designs digital products, knowledge systems, cultural platforms and research-led experiences.";
const siteUpdatedAt = "2026-06-25";
const socialImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`;
const logoImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg`;
const organizationId = `${origin}/id/organization/electronic-artefacts/`;
const siteKeywords = [
  "creative technology",
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

const pages = {
  "index.html": {
    title: "Electronic Artefacts | Creative Technology Studio",
    description:
      "Electronic Artefacts designs digital products, knowledge systems, cultural platforms and research-led experiences.",
    canonical: "/",
  },
  "work.html": {
    title: "Selected Work | Electronic Artefacts",
    description:
      "Consulting, audits, SEO, branding, product design, development and R&D services by Electronic Artefacts.",
  },
  "projects.html": {
    title: "Projects | Electronic Artefacts",
    description:
      "Explore Electronic Artefacts projects across software, cultural platforms, artistic production and client systems.",
  },
  "programs.html": {
    title: "Programs, Repo Access and Runtimes | Electronic Artefacts",
    description:
      "Explore Electronic Artefacts software programs available through repository access, pilots, implementation work and licensing conversations.",
  },
  "research.html": {
    title: "Research | Electronic Artefacts",
    description:
      "Research across technology, knowledge systems, culture, governance, perception and creative production.",
  },
  "archive.html": {
    title: "Archive | Electronic Artefacts",
    description:
      "Browse releases, prototypes, documents, research logs and unfinished material preserved by Electronic Artefacts.",
  },
  "about.html": {
    title: "About the Studio | Electronic Artefacts",
    description:
      "Electronic Artefacts is an independent creative technology studio connecting research, software, design and cultural production.",
  },
  "contact.html": {
    title: "Contact | Electronic Artefacts",
    description:
      "Contact Electronic Artefacts about digital products, knowledge systems, cultural platforms and creative technology.",
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
    description: "Legal information and publisher details for the Electronic Artefacts website.",
  },
  "confidentialite.html": {
    title: "Privacy Policy | Electronic Artefacts",
    description: "Privacy and browser-storage information for the Electronic Artefacts website.",
  },
  "search.html": {
    title: "Search | Electronic Artefacts",
    description:
      "Search public Electronic Artefacts projects, programs, research, archive records and connected knowledge pages.",
    robots: "noindex,follow",
  },
  "project.html": {
    title: "Project | Electronic Artefacts",
    description: "Electronic Artefacts project overview, visual evidence and connected systems.",
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
    description: "A connected public research or knowledge record from Electronic Artefacts.",
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
  const schemaMarkup = `
    <script type="application/ld+json" data-seo-schema="webpage">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: "Electronic Artefacts",
            url: `${origin}/`,
            description: siteDescription,
            keywords: siteKeywords,
            knowsAbout,
            logo: {
              "@type": "ImageObject",
              url: logoImage,
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
            description: siteDescription,
            keywords: siteKeywords,
            dateModified: siteUpdatedAt,
            publisher: { "@id": organizationId },
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${origin}/search/?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": type === "article" ? "Article" : "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: config.title,
            headline: type === "article" ? config.title : undefined,
            description: config.description,
            image: socialImage,
            inLanguage: "en",
            isPartOf: { "@id": `${origin}/#website` },
            publisher: { "@id": organizationId },
            isAccessibleForFree: true,
          },
        ].map((node) => Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined))),
      }).replaceAll("<", "\\u003c")}
    </script>`;

  return `    <!-- SEO: generated by scripts/build-seo.mjs -->
    <meta name="description" content="${escapeHtml(config.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Electronic Artefacts" />
    <meta name="theme-color" content="#000000" />${canonicalMarkup}
    <link rel="alternate" hreflang="en" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="alternate" type="application/ld+json" href="/graph/catalog.jsonld" title="Public knowledge graph catalog" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site index" />
    <link rel="alternate" type="application/json" href="/agent-manifest.json" title="Agent manifest" />
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Electronic Artefacts Search" />
    <link rel="image_src" href="${socialImage}" />
    <meta property="og:title" content="${escapeHtml(config.title)}" />
    <meta property="og:description" content="${escapeHtml(config.description)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Electronic Artefacts" />
    <meta property="og:locale" content="en_US" />
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

  await writeFile(absolutePath, html);
}

process.stdout.write(`Updated SEO metadata for ${Object.keys(pages).length} pages.\n`);
