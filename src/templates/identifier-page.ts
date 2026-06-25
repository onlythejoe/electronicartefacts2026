import { site } from "../config/site.js";
import type { PageMetadata } from "../seo/metadata.js";
import type { Entity } from "../schema/entities.js";
import { escapeHtml } from "./html.js";

interface IdentifierPageInput {
  entity: Entity;
  metadata: PageMetadata;
  route: string;
}

const identifierDescription = (entity: Entity): string =>
  `Persistent identifier route for ${entity.title}, linking to the canonical Electronic Artefacts record.`;

export const renderIdentifierPage = ({ entity, metadata, route }: IdentifierPageInput): string => `<!doctype html>
<html lang="${metadata.language || site.language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(identifierDescription(entity))}" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />
    <link rel="alternate" type="application/ld+json" href="./index.jsonld" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(route)}" />
    <title>${escapeHtml(entity.title)} identifier | ${site.name}</title>
    <script>window.location.replace(${JSON.stringify(route)})</script>
  </head>
  <body>
    <main>
      <p>
        <a href="${escapeHtml(route)}">Open the canonical ${escapeHtml(entity.title)} record</a>
        or
        <a href="./index.jsonld">download its JSON-LD identifier data</a>.
      </p>
    </main>
  </body>
</html>`;
