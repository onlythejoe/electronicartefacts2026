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
<html lang="${site.language}">
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
    ${metadata.jsonLdUrl ? `<link rel="alternate" type="application/ld+json" href="${escapeHtml(metadata.jsonLdUrl)}" />` : ""}
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="${escapeHtml(metadata.ogType)}" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="${site.locale}" />
    <meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(metadata.image)}" />
    <meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
    ${metadata.ogType === "article" && metadata.publishedAt ? `<meta property="article:published_time" content="${escapeHtml(metadata.publishedAt)}" />` : ""}
    ${metadata.ogType === "article" ? `<meta property="article:modified_time" content="${escapeHtml(metadata.modifiedAt)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta name="twitter:image" content="${escapeHtml(metadata.image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt)}" />
    <title>${escapeHtml(metadata.title)}</title>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
    <link rel="stylesheet" href="/assets/css/app.css?v=29" />
    <script type="module" src="/assets/js/app.js?v=29"></script>
  </head>
  <body data-page="${escapeHtml(pageClass)}" data-generated-page="true"${entryId ? ` data-entry-id="${escapeHtml(entryId)}"` : ""}>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>${header}</header>
    <main id="main" class="site-main">${body}</main>
    <footer>${footer}</footer>
  </body>
</html>
`;
