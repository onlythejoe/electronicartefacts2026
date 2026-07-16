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

export const renderLayout = ({ metadata, body, header, footer, jsonLd, pageClass = "generated", entryId }: LayoutInput): string => {
  const styles = pageClass === "project"
    ? `<link rel="stylesheet" href="/assets/css/project.css?v=1" />
    <link rel="preload" as="style" href="/assets/css/app.css?v=87" fetchpriority="low" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="/assets/css/app.css?v=87" /></noscript>`
    : `<link rel="stylesheet" href="/assets/css/app.css?v=87" />`;
  const heroPreload = entryId === "palimpsests"
    ? `<link rel="preload" as="image" href="/assets/media/projects/oreth/ORETH-hero-800.webp" imagesrcset="/assets/media/projects/oreth/ORETH-hero-800.webp 800w, /assets/media/projects/oreth/ORETH-hero-1200.webp 1200w" imagesizes="(max-width: 48rem) 100vw, 48vw" fetchpriority="high" />`
    : "";

  return `<!doctype html>
<html lang="${metadata.language || site.language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="dark" />
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta name="robots" content="${escapeHtml(metadata.robots)}" />
    <meta name="author" content="${site.name}" />
    <meta name="application-name" content="${site.name}" />
    <meta name="apple-mobile-web-app-title" content="${site.name}" />
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
    <link rel="apple-touch-icon" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="${escapeHtml(metadata.ogType)}" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="${escapeHtml(metadata.locale || site.locale)}" />
    <meta property="og:locale:alternate" content="${(metadata.locale || site.locale) === "fr_FR" ? "en_US" : "fr_FR"}" />
    <meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(metadata.image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(metadata.image)}" />
    ${metadata.imageType ? `<meta property="og:image:type" content="${escapeHtml(metadata.imageType)}" />` : ""}
    ${metadata.imageWidth ? `<meta property="og:image:width" content="${metadata.imageWidth}" />` : ""}
    ${metadata.imageHeight ? `<meta property="og:image:height" content="${metadata.imageHeight}" />` : ""}
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
    <script>if(/Safari/i.test(navigator.userAgent)&&!/(Chrome|Chromium|CriOS|Edg|OPR|FxiOS)/i.test(navigator.userAgent)){document.documentElement.classList.add("is-safari");}</script>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
    ${heroPreload}
    ${styles}
    <!-- PERFORMANCE_RUNTIME_START -->
    <script type="module">window.addEventListener("load", () => window.setTimeout(() => import("/assets/js/app.js?v=71"), 1500), { once: true });</script>
    <!-- PERFORMANCE_RUNTIME_END -->
  </head>
  <body data-page="${escapeHtml(pageClass)}" data-generated-page="true"${entryId ? ` data-entry-id="${escapeHtml(entryId)}"` : ""}>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>${header}</header>
    <main id="main" class="site-main" tabindex="-1">${body}</main>
    <footer>${footer}</footer>
  </body>
</html>
`.replace(/[ \t]+$/gm, "");
};
