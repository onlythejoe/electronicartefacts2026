import { site } from "../config/site.js";
import type { PageMetadata } from "../seo/metadata.js";
import { escapeHtml } from "./html.js";

interface LayoutInput {
  metadata: PageMetadata;
  body: string;
  header: string;
  footer: string;
  jsonLd: unknown;
  pageClass?: string;
  entryId?: string;
}

export const renderLayout = ({ metadata, body, header, footer, jsonLd, pageClass = "generated", entryId }: LayoutInput): string => `<!doctype html>
<html lang="${metadata.language || site.language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta name="robots" content="${escapeHtml(metadata.robots)}" />
    <meta name="author" content="${site.name}" />
    ${metadata.keywords.length ? `<meta name="keywords" content="${escapeHtml(metadata.keywords.join(", "))}" />` : ""}
    <meta name="theme-color" content="#000000" />
    <link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />
    ${(metadata.alternates || [
      { hreflang: metadata.language || site.language, href: metadata.canonicalUrl },
      { hreflang: "x-default", href: metadata.canonicalUrl },
    ]).map((alternate) => `<link rel="alternate" hreflang="${escapeHtml(alternate.hreflang)}" href="${escapeHtml(alternate.href)}" />`).join("\n    ")}
    ${metadata.jsonLdUrl ? `<link rel="alternate" type="application/ld+json" href="${escapeHtml(metadata.jsonLdUrl)}" />` : ""}
    <link rel="alternate" type="application/ld+json" href="/graph/catalog.jsonld" title="Public knowledge graph catalog" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site index" />
    <link rel="alternate" type="application/json" href="/agent-manifest.json" title="Agent manifest" />
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Electronic Artefacts Search" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="${escapeHtml(metadata.ogType)}" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="${escapeHtml(metadata.locale || site.locale)}" />
    <meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(metadata.image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(metadata.image)}" />
    <meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
    ${metadata.ogType === "article" && metadata.publishedAt ? `<meta property="article:published_time" content="${escapeHtml(metadata.publishedAt)}" />` : ""}
    ${metadata.ogType === "article" ? `<meta property="article:modified_time" content="${escapeHtml(metadata.modifiedAt)}" />` : ""}
    ${metadata.ogType === "article" ? metadata.keywords.slice(0, 8).map((keyword) => `<meta property="article:tag" content="${escapeHtml(keyword)}" />`).join("\n    ") : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta name="twitter:image" content="${escapeHtml(metadata.image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
    <title>${escapeHtml(metadata.title)}</title>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
    <link rel="stylesheet" href="/assets/css/app.css?v=35" />
    <script type="module" src="/assets/js/app.js?v=35"></script>
  </head>
  <body data-page="${escapeHtml(pageClass)}" data-generated-page="true"${entryId ? ` data-entry-id="${escapeHtml(entryId)}"` : ""}>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>${header}</header>
    <main id="main" class="site-main">${body}</main>
    <footer>${footer}</footer>
  </body>
</html>
`.replace(/[ \t]+$/gm, "");
