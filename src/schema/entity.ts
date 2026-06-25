export type IsoDate = `${number}-${number}-${number}`;
export type Locale = "en" | "fr";

export type EntityType =
  | "concept"
  | "method"
  | "framework"
  | "technology"
  | "researchField"
  | "project"
  | "program"
  | "publication"
  | "collection"
  | "artefact"
  | "timeline"
  | "artist"
  | "organization"
  | "tool"
  | "dataset"
  | "event";

export type EntityId = `ea:${EntityType}:${string}`;
export type Visibility = "public" | "archive" | "internal" | "restricted";
export type PublicationClass = "canonical" | "published" | "supporting" | "internal";
export type LifecycleStatus =
  | "concept"
  | "research"
  | "experimental"
  | "prototype"
  | "development"
  | "production"
  | "released"
  | "active"
  | "archived"
  | "deprecated";
export type Maturity =
  | "concept"
  | "research"
  | "prototype"
  | "experimental"
  | "development"
  | "production"
  | "released"
  | "archived"
  | "deprecated";
export type Confidence = "speculative" | "observed" | "validated" | "published" | "canonical";

export interface EntityRef {
  id: EntityId;
  label?: string;
}

export interface AgentRef extends EntityRef {
  id: `ea:artist:${string}` | `ea:organization:${string}`;
  role?: string;
}

export interface SourceRef {
  id?: string;
  title: string;
  url?: string;
  author?: string;
  publisher?: string;
  publishedAt?: IsoDate;
  accessedAt?: IsoDate;
  locator?: string;
}

export interface MediaRef {
  id: string;
  type: "image" | "audio" | "video" | "document";
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  rights?: string;
}

export interface VersionInfo {
  version: string;
  createdAt: IsoDate;
  publishedAt?: IsoDate;
  modifiedAt: IsoDate;
  reviewedAt?: IsoDate;
  supersedes?: EntityId;
  changeSummary?: string;
}

export interface SlugSet {
  canonical: string;
  aliases?: string[];
}

export interface EntityHeading {
  level: 2 | 3;
  title: string;
  id: string;
}

export interface BaseEntity {
  id: EntityId;
  type: EntityType;
  translationKey?: string;
  translationOf?: EntityId;
  slug: SlugSet;
  title: string;
  alternateNames?: string[];
  subtitle?: string;
  definition?: string;
  abstract: string;
  description?: string;
  bodyHtml: string;
  headings: string[];
  headingItems: EntityHeading[];
  locale: Locale;
  visibility: Visibility;
  publicationClass: PublicationClass;
  status: LifecycleStatus;
  maturity: Maturity;
  confidence: Confidence;
  version: VersionInfo;
  authors: AgentRef[];
  contributors?: AgentRef[];
  publisher: `ea:organization:${string}`;
  tags?: string[];
  disciplines?: string[];
  media?: MediaRef[];
  sources?: SourceRef[];
  rights?: string;
  license?: string;
  featured?: boolean;
}
