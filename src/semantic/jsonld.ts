import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import { identifierUrl } from "./identifiers.js";
import type { Entity, PublicationEntity } from "../schema/entities.js";
import type { AgentRef, EntityRef, SourceRef } from "../schema/entity.js";

const identifierForRef = (id: string): string => {
  const [, rawType, slug] = id.split(":");
  const type = rawType === "researchField" ? "research-field" : rawType;
  return `${site.origin}/id/${type}/${slug}/`;
};

const schemaType = (entity: Entity): string => {
  if (entity.type === "concept" || entity.type === "researchField" || entity.type === "technology") return "DefinedTerm";
  if (entity.type === "program") return "SoftwareApplication";
  if (entity.type === "organization") return "Organization";
  if (entity.type === "publication") {
    const format = (entity as PublicationEntity).format;
    if (format === "technicalArticle") return "TechArticle";
    if (format === "researchNote") return "ScholarlyArticle";
    return "Article";
  }
  return "CreativeWork";
};

const sectionName = (entity: Entity): string => {
  if (entity.type === "concept" || entity.type === "technology" || entity.type === "method" || entity.type === "framework") return "Knowledge";
  if (entity.type === "researchField") return "Research";
  if (entity.type === "publication") return "Publications";
  if (entity.type === "project") return "Projects";
  if (entity.type === "program") return "Programs";
  if (entity.type === "organization") return "Organizations";
  return "Archive";
};

const sectionUrl = (entity: Entity): string => {
  if (entity.type === "concept") return `${site.origin}/knowledge/concepts/`;
  if (entity.type === "technology") return `${site.origin}/knowledge/technologies/`;
  if (entity.type === "method") return `${site.origin}/knowledge/methods/`;
  if (entity.type === "framework") return `${site.origin}/knowledge/frameworks/`;
  if (entity.type === "researchField") return `${site.origin}/research/`;
  if (entity.type === "publication") return `${site.origin}/publications/`;
  if (entity.type === "project") return `${site.origin}/projects.html`;
  if (entity.type === "program") return `${site.origin}/programs.html`;
  if (entity.type === "organization") return `${site.origin}/organizations/`;
  return `${site.origin}/archive/`;
};

const htmlText = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const wordCount = (entity: Entity): number =>
  htmlText(entity.bodyHtml).split(/\s+/).filter(Boolean).length;

const unique = (items: Array<string | undefined>): string[] =>
  items
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim())
    .filter((value, index, values) => values.indexOf(value) === index);

const compact = (value: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => {
    if (item === undefined || item === null) return false;
    if (Array.isArray(item) && !item.length) return false;
    return true;
  }));

const imageObjectFor = (entity: Entity) => {
  const image = entity.media?.find((item) => item.type === "image");
  const url = image ? `${site.origin}${image.src}` : `${site.origin}${site.socialImage}`;
  return {
    "@type": "ImageObject",
    url,
    caption: image?.caption,
    description: image?.alt || image?.caption || entity.title,
  };
};

const authorNodes = (authors: AgentRef[] = []): Array<Record<string, unknown>> =>
  authors.map((author) => ({
    "@id": identifierForRef(author.id),
    name: author.label,
    roleName: author.role,
  }));

const refsToIds = (refs: EntityRef[] = []): Array<Record<string, string>> =>
  refs.map((ref) => ({ "@id": identifierForRef(ref.id) }));

const citationsFor = (sources: SourceRef[] = []): Array<Record<string, unknown>> =>
  sources.map((source) => compact({
    "@type": "CreativeWork",
    name: source.title,
    url: source.url,
    author: source.author,
    publisher: source.publisher,
    datePublished: source.publishedAt,
  }));

export const organizationNode = {
  "@type": "Organization",
  "@id": `${site.origin}/id/organization/electronic-artefacts/`,
  name: site.name,
  alternateName: [...site.alternateNames],
  url: `${site.origin}/`,
  description: site.description,
  keywords: [...site.keywords],
  knowsAbout: [...site.knowsAbout],
  logo: {
    "@type": "ImageObject",
    url: `${site.origin}${site.logoImage}`,
    contentUrl: `${site.origin}${site.logoImage}`,
    width: 1024,
    height: 1024,
  },
  image: `${site.origin}${site.socialImage}`,
  email: site.contactEmail,
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: site.contactEmail,
      contactType: "inquiries",
      availableLanguage: ["en", "fr"],
    },
  ],
  sameAs: [...site.sameAs],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": `${site.origin}/#website`,
  url: `${site.origin}/`,
  name: site.name,
  alternateName: [...site.alternateNames],
  description: site.description,
  keywords: [...site.keywords],
  dateModified: site.updatedAt,
  publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
  inLanguage: site.language,
};

export const jsonLdFor = (entity: Entity) => {
  const url = `${site.origin}${routeForEntity(entity)}`;
  const keywords = unique([...(entity.tags || []), ...(entity.disciplines || [])]);
  const words = wordCount(entity);
  const primary: Record<string, unknown> = compact({
    "@type": schemaType(entity),
    "@id": identifierUrl(entity),
    identifier: entity.id,
    name: entity.title,
    headline: entity.type === "publication" ? entity.title : undefined,
    alternateName: entity.alternateNames,
    abstract: entity.abstract,
    description: entity.abstract,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    image: imageObjectFor(entity),
    author: authorNodes(entity.authors),
    creator: authorNodes(entity.authors),
    keywords,
    inLanguage: entity.locale,
    dateCreated: entity.version.createdAt,
    datePublished: entity.version.publishedAt,
    dateModified: entity.version.modifiedAt,
    publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
    copyrightHolder: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
    license: entity.license,
    isAccessibleForFree: true,
    wordCount: words,
    citation: citationsFor(entity.sources),
  });
  if (entity.definition) primary.description = entity.definition;
  if (entity.type === "concept") {
    primary.inDefinedTermSet = `${site.origin}/knowledge/concepts/`;
    primary.termCode = entity.slug.canonical;
  }
  if (entity.type === "technology") {
    primary.inDefinedTermSet = `${site.origin}/knowledge/technologies/`;
    primary.termCode = entity.slug.canonical;
    primary.sameAs = [entity.officialUrl].filter(Boolean);
  }
  if (entity.type === "program" && entity.officialUrl) {
    primary.sameAs = [entity.officialUrl];
    primary.applicationCategory = entity.domain;
  }
  if (entity.type === "publication") {
    primary.citation = [entity.citation.preferred, ...citationsFor(entity.sources)];
    primary.about = refsToIds(entity.subjects);
    primary.mentions = refsToIds(entity.evidence || []);
    primary.articleSection = unique([...(entity.disciplines || []), ...(entity.tags || [])]).slice(0, 6);
    primary.timeRequired = `PT${Math.max(1, Math.ceil(words / 220))}M`;
    const citedSources = citationsFor(entity.sources);
    if (citedSources.length) primary.isBasedOn = citedSources;
  }
  if (entity.type === "project" && entity.socialLinks?.length) {
    primary.sameAs = entity.socialLinks.map((link) => link.href);
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: entity.title,
        description: entity.description || entity.abstract,
        inLanguage: entity.locale,
        datePublished: entity.version.publishedAt,
        dateModified: entity.version.modifiedAt,
        primaryImageOfPage: imageObjectFor(entity),
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": identifierUrl(entity) },
        isPartOf: { "@id": `${site.origin}/#website` },
        publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
        isAccessibleForFree: true,
      },
      primary,
      organizationNode,
      websiteNode,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Electronic Artefacts", item: `${site.origin}/` },
          { "@type": "ListItem", position: 2, name: sectionName(entity), item: sectionUrl(entity) },
          { "@type": "ListItem", position: 3, name: entity.title, item: url },
        ],
      },
    ],
  };
};
