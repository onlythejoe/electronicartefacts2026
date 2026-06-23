import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const socialImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`;
const logoImage = `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg`;

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
      "Explore digital products, knowledge platforms, creative technology and public systems designed by Electronic Artefacts.",
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
    title: "Palimpsests by ORETH | Electronic Artefacts",
    description:
      "Explore Palimpsests, a conceptual album by ORETH structured in five acts around memory, inheritance and transmission.",
    type: "article",
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
    description: "Search public Electronic Artefacts projects, programs, research and archive records.",
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
    description: "A public artefact preserved in the Electronic Artefacts archive.",
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
    description: "Artist profile and connected work within Electronic Artefacts.",
    robots: "noindex,follow",
    dynamic: true,
  },
  "channel.html": {
    title: "Channel | Electronic Artefacts",
    description: "A public channel connected to the Electronic Artefacts ecosystem.",
    robots: "noindex,follow",
    dynamic: true,
  },
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const seoMarkup = (file, config) => {
  const canonical = config.dynamic ? "" : `${origin}${config.canonical || `/${file}`}`;
  const type = config.type || "website";
  const robots = config.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const canonicalMarkup = canonical ? `\n    <link rel="canonical" href="${canonical}" />` : "";
  const websiteSchema =
    file === "index.html"
      ? `
    <script type="application/ld+json" data-seo-schema="website">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${origin}/#organization`,
            name: "Electronic Artefacts",
            url: `${origin}/`,
            logo: {
              "@type": "ImageObject",
              url: logoImage,
              width: 1024,
              height: 1024,
            },
            image: socialImage,
            email: "electronic.artefacts@gmail.com",
            sameAs: [
              "https://www.instagram.com/electronic.artefacts/",
              "https://github.com/onlythejoe",
              "https://soundcloud.com/electronic-artefacts",
            ],
          },
          {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            url: `${origin}/`,
            name: "Electronic Artefacts",
            description: config.description,
            publisher: { "@id": `${origin}/#organization` },
            inLanguage: "en",
          },
        ],
      })}
    </script>`
      : "";

  return `    <!-- SEO: generated by scripts/build-seo.mjs -->
    <meta name="description" content="${escapeHtml(config.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Electronic Artefacts" />
    <meta name="theme-color" content="#000000" />${canonicalMarkup}
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
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
    <title>${escapeHtml(config.title)}</title>${websiteSchema}
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

const context = vm.createContext({ window: {} });
for (const source of ["assets/js/data/entities.js", "assets/js/data/collections.js"]) {
  vm.runInContext(await readFile(path.join(rootDir, source), "utf8"), context, { filename: source });
}

const entities = context.window.EA_ENTITIES || {};
const collections = context.window.EA_COLLECTIONS || [];
const isPublic = (item) => !["internal", "restricted"].includes(item?.visibility);
const urls = new Set([
  "/",
  "/work.html",
  "/projects.html",
  "/programs.html",
  "/research.html",
  "/archive.html",
  "/about.html",
  "/contact.html",
  "/palimpsests.html",
]);
const add = (pathname, id) => urls.add(`${pathname}?id=${encodeURIComponent(id)}`);

for (const item of entities.projects || []) {
  if (!isPublic(item) || item.id === "palimpsests") continue;
  add("/project.html", item.id);
}
for (const item of entities.programs || []) if (isPublic(item)) add("/program.html", item.id);
for (const item of entities.artists || []) if (isPublic(item)) add("/artist.html", item.id);
for (const item of entities.channels || []) if (isPublic(item)) add("/channel.html", item.id);
for (const item of [...(entities.artefacts || []), ...(entities.researchLogs || [])]) {
  if (isPublic(item)) add("/artefact.html", item.id);
}
for (const item of [...(entities.researchFields || []), ...(entities.worldbuilding || [])]) {
  if (isPublic(item)) add("/entity.html", item.id);
}
for (const item of collections) if (isPublic(item)) add("/collection.html", item.id);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .sort()
  .map((url) => `  <url><loc>${origin}${url.replaceAll("&", "&amp;")}</loc></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(path.join(rootDir, "sitemap.xml"), sitemap);

process.stdout.write(`Updated SEO metadata for ${Object.keys(pages).length} pages and generated ${urls.size} sitemap URLs.\n`);
