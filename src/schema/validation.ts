import { z } from "zod";
import { predicateDefinitions } from "./predicates.js";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const entityType = z.enum([
  "concept", "method", "framework", "technology", "researchField", "project", "program",
  "publication", "collection", "artefact", "timeline", "artist", "organization", "tool", "dataset", "event",
]);
const entityId = z.string().regex(/^ea:(concept|method|framework|technology|researchField|project|program|publication|collection|artefact|timeline|artist|organization|tool|dataset|event):[a-z0-9][a-z0-9-]*$/);
const agentId = z.string().regex(/^ea:(artist|organization):[a-z0-9][a-z0-9-]*$/);
const ref = z.object({ id: entityId, label: z.string().optional() });
const agentRef = z.object({ id: agentId, label: z.string().optional(), role: z.string().optional() });
const mediaSrc = z.string().min(1).refine((value) => {
  if (/[\s"'<>]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("/../");
  if (value.startsWith("./")) return !value.includes("/../");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Media src must be a safe local path or HTTPS URL");
const sourceRef = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().url().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  publishedAt: isoDate.optional(),
  accessedAt: isoDate.optional(),
  locator: z.string().optional(),
});

const baseShape = {
  id: entityId,
  type: entityType,
  translationKey: z.string().regex(/^[a-z0-9][a-z0-9:-]*$/).optional(),
  translationOf: entityId.optional(),
  slug: z.object({
    canonical: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    aliases: z.array(z.string()).optional(),
  }),
  title: z.string().min(1),
  alternateNames: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  definition: z.string().optional(),
  abstract: z.string().min(40),
  description: z.string().optional(),
  locale: z.enum(["en", "fr"]).default("en"),
  visibility: z.enum(["public", "archive", "internal", "restricted"]),
  publicationClass: z.enum(["canonical", "published", "supporting", "internal"]),
  status: z.enum(["concept", "research", "experimental", "prototype", "development", "production", "released", "active", "archived", "deprecated"]),
  maturity: z.enum(["concept", "research", "prototype", "experimental", "development", "production", "released", "archived", "deprecated"]),
  confidence: z.enum(["speculative", "observed", "validated", "published", "canonical"]),
  version: z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    createdAt: isoDate,
    publishedAt: isoDate.optional(),
    modifiedAt: isoDate,
    reviewedAt: isoDate.optional(),
    supersedes: entityId.optional(),
    changeSummary: z.string().optional(),
  }),
  authors: z.array(agentRef).min(1),
  contributors: z.array(agentRef).optional(),
  publisher: z.string().regex(/^ea:organization:[a-z0-9][a-z0-9-]*$/),
  tags: z.array(z.string()).optional(),
  disciplines: z.array(z.string()).optional(),
  media: z.array(z.object({
    id: z.string(),
    type: z.enum(["image", "audio", "video", "document"]),
    src: mediaSrc,
    alt: z.string().optional(),
    caption: z.string().optional(),
    credit: z.string().optional(),
    rights: z.string().optional(),
  })).optional(),
  sources: z.array(sourceRef).optional(),
  rights: z.string().optional(),
  license: z.string().optional(),
  featured: z.boolean().optional(),
};

const base = z.object(baseShape);
const concept = base.extend({
  type: z.literal("concept"),
  definition: z.string().min(20),
  scope: z.array(z.string()).min(1),
  exclusions: z.array(z.string()).optional(),
  claims: z.array(z.string()).optional(),
});
const researchField = base.extend({
  type: z.literal("researchField"),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string().min(10),
    status: z.enum(["open", "active", "answered", "retired"]),
  })).min(1),
  scope: z.array(z.string()).min(1),
  findings: z.array(z.string()).optional(),
  openQuestions: z.array(z.string()).optional(),
  bibliography: z.array(sourceRef).optional(),
});
const program = base.extend({
  type: z.literal("program"),
  mandate: z.string().min(20),
  domain: z.string().min(1),
  capabilities: z.array(z.string()).min(1),
  architecture: z.array(z.string()).optional(),
  lifecycle: z.array(z.string()).min(1),
  maintainers: z.array(agentRef).min(1),
  officialUrl: z.string().url().optional(),
});
const method = base.extend({
  type: z.literal("method"),
  purpose: z.string().min(20),
  useWhen: z.array(z.string()).min(1),
  inputs: z.array(z.string()).min(1),
  steps: z.array(z.object({
    order: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().min(10),
  })).min(1),
  outputs: z.array(z.string()).min(1),
  limitations: z.array(z.string()).min(1),
});
const framework = base.extend({
  type: z.literal("framework"),
  principles: z.array(z.string()).min(1),
  components: z.array(ref),
  limitations: z.array(z.string()).min(1),
});
const technology = base.extend({
  type: z.literal("technology"),
  category: z.enum(["language", "library", "protocol", "database", "platform", "approach"]),
  roleInEcosystem: z.string().min(20),
  officialUrl: z.string().url().optional(),
  versions: z.array(z.string()).optional(),
});
const project = base.extend({
  type: z.literal("project"),
  category: z.enum(["internal", "client", "cultural", "research", "collaboration"]),
  brief: z.string().min(20),
  context: z.string().min(20),
  stakeholders: z.array(ref),
  constraints: z.array(z.string()).optional(),
  approach: z.array(z.string()).min(1),
  outputs: z.array(ref),
  outcomes: z.array(z.string()).optional(),
  evidence: z.array(ref),
  credits: z.array(agentRef).min(1),
  visualLanguage: z.array(z.string()).optional(),
  textures: z.array(z.string()).optional(),
  symbols: z.array(z.string()).optional(),
  developmentFocus: z.array(z.string()).optional(),
  marketingFocus: z.array(z.string()).optional(),
  socialLinks: z.array(z.object({
    label: z.string().min(1),
    href: z.string().url(),
  })).optional(),
});
const publication = base.extend({
  type: z.literal("publication"),
  format: z.enum(["conceptPage", "methodPage", "researchNote", "technicalArticle", "essay", "caseStudy", "documentation", "archiveRecord", "experimentalPublication"]),
  subjects: z.array(ref).min(1),
  claims: z.array(z.string()).optional(),
  evidence: z.array(ref).optional(),
  citation: z.object({ preferred: z.string().min(20), doi: z.string().optional() }),
});
const organization = base.extend({
  type: z.literal("organization"),
  organizationType: z.enum(["studio", "label", "institution", "company", "collective", "client", "publisher"]),
});
const collection = base.extend({
  type: z.literal("collection"),
  thesis: z.string().min(20),
  curator: z.array(agentRef).min(1),
  explicitMembers: z.array(ref).min(1),
  selectionNote: z.string().min(20),
});
const tool = base.extend({
  type: z.literal("tool"),
  purpose: z.string().min(20),
  users: z.array(z.string()).min(1),
  inputs: z.array(z.string()).min(1),
  outputs: z.array(z.string()).min(1),
});
const dataset = base.extend({
  type: z.literal("dataset"),
  methodology: z.string().min(20),
  formats: z.array(z.string()).min(1),
  limitations: z.array(z.string()).min(1),
});
const event = base.extend({
  type: z.literal("event"),
  eventType: z.enum(["creation", "publication", "release", "milestone", "exhibition", "decision"]),
  startDate: isoDate,
  endDate: isoDate.optional(),
  participants: z.array(ref),
  result: z.array(ref).optional(),
});

export const entityFrontmatterSchema = z.discriminatedUnion("type", [
  concept, method, framework, technology, researchField, program, project, publication,
  collection, organization, tool, dataset, event,
]);

export const relationSchema = z.object({
  id: z.string().regex(/^ear:[a-z0-9][a-z0-9-]*$/),
  subject: entityId,
  predicate: z.string().refine((value) => value in predicateDefinitions, "Unknown relation predicate"),
  object: entityId,
  statement: z.string().min(20),
  confidence: z.enum(["speculative", "observed", "validated", "published", "canonical"]),
  sources: z.array(sourceRef).optional(),
  validFrom: isoDate.optional(),
  validTo: isoDate.optional(),
  createdAt: isoDate,
  reviewedAt: isoDate.optional(),
  visibility: z.enum(["public", "internal"]),
});

export type ParsedEntityFrontmatter = z.infer<typeof entityFrontmatterSchema>;
