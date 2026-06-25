import { site } from "../config/site.js";
import { identifierPath, routeForEntity } from "../config/routes.js";
import { isIndexableEntity } from "../semantic/visibility.js";
import type { Entity } from "../schema/entities.js";

const typeOrder = [
  "organization",
  "program",
  "project",
  "researchField",
  "publication",
  "concept",
  "technology",
  "method",
  "framework",
  "collection",
  "artefact",
  "timeline",
  "artist",
  "tool",
  "dataset",
  "event",
] as const;

const absoluteUrl = (route: string): string =>
  route.startsWith("https://") ? route : `${site.origin}${route}`;

const textFromHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const trim = (value: string, length = 220): string => {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length - 3).replace(/\s+\S*$/, "")}...`;
};

const markdownText = (value: string): string =>
  value
    .replace(/[\r\n]+/g, " ")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\s+/g, " ")
    .trim();

const labelForType = (type: Entity["type"]): string =>
  type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

const summaryFor = (entity: Entity, length = 220): string =>
  trim(entity.definition || entity.description || entity.abstract || textFromHtml(entity.bodyHtml), length);

const keywordList = (entity: Entity): string[] =>
  [entity.title, ...(entity.alternateNames || []), ...(entity.tags || []), ...(entity.disciplines || [])]
    .map((value) => value.trim())
    .filter((value, index, values) => value && values.indexOf(value) === index);

const publicRecords = (entities: Entity[]): Entity[] =>
  entities
    .filter(isIndexableEntity)
    .sort((a, b) => {
      const typeDelta = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
      return typeDelta || a.title.localeCompare(b.title);
    });

const featuredRecords = (records: Entity[], limit: number): Entity[] => {
  const priority = new Set([
    "ea:organization:electronic-artefacts",
    "ea:program:vaste",
    "ea:project:vestiges",
    "ea:concept:ai-agent",
    "ea:concept:retrieval-augmented-generation",
    "ea:concept:knowledge-graph",
    "ea:technology:model-context-protocol",
    "ea:publication:ai-agents-vs-ai-workflows",
    "ea:publication:retrieval-augmented-generation-and-knowledge-systems",
  ]);
  return records
    .slice()
    .sort((a, b) => {
      const priorityDelta = Number(priority.has(b.id)) - Number(priority.has(a.id));
      const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      const typeDelta = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
      return priorityDelta || featuredDelta || typeDelta || a.title.localeCompare(b.title);
    })
    .slice(0, limit);
};

const maxModifiedAt = (records: Entity[]): string =>
  records.reduce((latest, entity) => entity.version.modifiedAt > latest ? entity.version.modifiedAt : latest, "1970-01-01");

const recordLink = (entity: Entity): string => {
  const route = routeForEntity(entity);
  const title = markdownText(entity.title);
  return `- [${title}](${absoluteUrl(route)}): ${markdownText(summaryFor(entity, 180))}`;
};

export const buildLlmsTxt = (entities: Entity[]): string => {
  const records = publicRecords(entities);
  const featured = featuredRecords(records, 18);
  return `# ${site.name}

> ${site.description} The public site is a static knowledge graph with canonical HTML pages, stable entity identifiers, JSON-LD, search documents and graph exports.

Use canonical HTML URLs for human-facing citations. Use identifier routes under /id/ and JSON-LD alternates for entity-level retrieval. The public graph is in English and is safe to crawl for search, retrieval and citation when robots.txt allows it.

## Primary Entry Points

- [Home](${site.origin}/): Studio overview and main navigation.
- [Knowledge](${site.origin}/knowledge/): Canonical knowledge graph hub.
- [Concepts](${site.origin}/knowledge/concepts/): Definitions for core concepts.
- [Technologies](${site.origin}/knowledge/technologies/): Technical standards, platforms and protocols.
- [Publications](${site.origin}/publications/): Research notes and technical articles.
- [Projects](${site.origin}/projects.html): Selected work and case studies.
- [Programs](${site.origin}/programs.html): Software programs and runtime systems.
- [Search](${site.origin}/search/?q=knowledge%20graph): Public site search endpoint with q parameter.
- [Contact](${site.origin}/contact.html): Contact route for collaboration and inquiry.

## Machine-Readable Resources

- [Sitemap](${site.origin}/sitemap.xml): Indexable public URLs.
- [Agent manifest](${site.origin}/agent-manifest.json): Structured map of public records and retrieval resources.
- [Full LLM index](${site.origin}/llms-full.txt): Complete public record list with summaries and identifier links.
- [OpenSearch](${site.origin}/opensearch.xml): Search description for /search/?q={searchTerms}.
- [Knowledge graph catalog JSON-LD](${site.origin}/graph/catalog.jsonld): DataCatalog/Dataset description of the public graph.
- [Search documents](${site.origin}/search/documents.json): Public retrieval corpus used by site search.
- [Public catalog](${site.origin}/generated/public/catalog.json): Public entities, routes and relations.
- [Graph entities](${site.origin}/graph/entities.json): Public entity catalog export.
- [Graph relations](${site.origin}/graph/relations.json): Public relation export.

## Canonical Records

${featured.map(recordLink).join("\n")}

## Optional

- [Legal notice](${site.origin}/mentions-legales.html)
- [Privacy policy](${site.origin}/confidentialite.html)
- [Archive collections](${site.origin}/archive/collections/)
- [Humans.txt](${site.origin}/humans.txt)
- [Security.txt](${site.origin}/.well-known/security.txt)

Last curated source update: ${maxModifiedAt(records)}
`;
};

export const buildLlmsFullTxt = (entities: Entity[]): string => {
  const records = publicRecords(entities);
  const sections = typeOrder
    .map((type) => {
      const items = records.filter((entity) => entity.type === type);
      if (!items.length) return "";
      const links = items.map((entity) => {
        const route = routeForEntity(entity);
        const identifier = identifierPath(entity);
        const keywords = keywordList(entity).slice(0, 8).join(", ");
        return [
          `- [${markdownText(entity.title)}](${absoluteUrl(route)}): ${markdownText(summaryFor(entity, 260))}`,
          `  - Entity ID: ${entity.id}`,
          `  - Identifier: ${absoluteUrl(identifier)}`,
          `  - JSON-LD: ${absoluteUrl(`${identifier}index.jsonld`)}`,
          `  - Modified: ${entity.version.modifiedAt}`,
          keywords ? `  - Keywords: ${markdownText(keywords)}` : "",
        ].filter(Boolean).join("\n");
      }).join("\n");
      return `## ${labelForType(type)}\n\n${links}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `# ${site.name} Full Agent Index

> Complete public canonical record list for retrieval agents, AI search systems and citation workflows.

This file is generated from typed public records. Prefer each record's canonical HTML URL for user-facing links, its /id/ route for stable entity identity, and the linked JSON-LD file for structured extraction.

## Retrieval Notes

- Site language: ${site.language}
- Canonical origin: ${site.origin}
- Search endpoint: ${site.origin}/search/?q={search_term_string}
- Public records: ${records.length}
- Last curated source update: ${maxModifiedAt(records)}

${sections}
`;
};

export const buildAgentManifest = (entities: Entity[]) => {
  const records = publicRecords(entities);
  const countsByType = records.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {});

  return {
    schemaVersion: "1.0.0",
    name: site.name,
    url: `${site.origin}/`,
    description: site.description,
    language: site.language,
    publisher: {
      id: `${site.origin}/id/organization/electronic-artefacts/`,
      name: site.name,
      email: site.contactEmail,
      sameAs: [...site.sameAs],
    },
    retrievalPolicy: {
      preferredCitationUrl: "canonical",
      preferredStructuredData: "jsonLd",
      searchEndpoint: `${site.origin}/search/?q={search_term_string}`,
      llmsTxt: `${site.origin}/llms.txt`,
      llmsFullTxt: `${site.origin}/llms-full.txt`,
      opensearch: `${site.origin}/opensearch.xml`,
      knowledgeGraphCatalog: `${site.origin}/graph/catalog.jsonld`,
      robotsTxt: `${site.origin}/robots.txt`,
      humansTxt: `${site.origin}/humans.txt`,
      securityTxt: `${site.origin}/.well-known/security.txt`,
    },
    resources: [
      { title: "Sitemap", url: `${site.origin}/sitemap.xml`, format: "application/xml" },
      { title: "OpenSearch description", url: `${site.origin}/opensearch.xml`, format: "application/opensearchdescription+xml" },
      { title: "Knowledge graph catalog JSON-LD", url: `${site.origin}/graph/catalog.jsonld`, format: "application/ld+json" },
      { title: "Public search documents", url: `${site.origin}/search/documents.json`, format: "application/json" },
      { title: "Public catalog", url: `${site.origin}/generated/public/catalog.json`, format: "application/json" },
      { title: "Graph entities", url: `${site.origin}/graph/entities.json`, format: "application/json" },
      { title: "Graph relations", url: `${site.origin}/graph/relations.json`, format: "application/json" },
      { title: "Humans.txt", url: `${site.origin}/humans.txt`, format: "text/plain" },
      { title: "Security.txt", url: `${site.origin}/.well-known/security.txt`, format: "text/plain" },
    ],
    countsByType,
    lastModified: maxModifiedAt(records),
    records: records.map((entity) => {
      const route = routeForEntity(entity);
      const identifier = identifierPath(entity);
      return {
        id: entity.id,
        locale: entity.locale,
        translationKey: entity.translationKey,
        translationOf: entity.translationOf,
        type: entity.type,
        title: entity.title,
        summary: summaryFor(entity),
        url: absoluteUrl(route),
        route,
        identifier: absoluteUrl(identifier),
        jsonLd: absoluteUrl(`${identifier}index.jsonld`),
        tags: keywordList(entity),
        status: entity.status,
        confidence: entity.confidence,
        publishedAt: entity.version.publishedAt,
        modifiedAt: entity.version.modifiedAt,
      };
    }),
  };
};
