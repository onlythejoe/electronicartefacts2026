import type {
  AgentRef,
  BaseEntity,
  EntityRef,
  IsoDate,
  SourceRef,
} from "./entity.js";

export interface ConceptEntity extends BaseEntity {
  type: "concept";
  definition: string;
  scope: string[];
  exclusions?: string[];
  claims?: string[];
}

export interface MethodEntity extends BaseEntity {
  type: "method";
  purpose: string;
  useWhen: string[];
  inputs: string[];
  steps: Array<{ order: number; title: string; description: string }>;
  outputs: string[];
  limitations: string[];
}

export interface FrameworkEntity extends BaseEntity {
  type: "framework";
  principles: string[];
  components: EntityRef[];
  limitations: string[];
}

export interface TechnologyEntity extends BaseEntity {
  type: "technology";
  category: "language" | "library" | "protocol" | "database" | "platform" | "approach";
  roleInEcosystem: string;
  officialUrl?: string;
  versions?: string[];
}

export interface ResearchFieldEntity extends BaseEntity {
  type: "researchField";
  questions: Array<{ id: string; question: string; status: "open" | "active" | "answered" | "retired" }>;
  scope: string[];
  findings?: string[];
  openQuestions?: string[];
  bibliography?: SourceRef[];
}

export type ResearchExperimentStatus =
  | "planned"
  | "active"
  | "observed"
  | "paused"
  | "complete";

export interface ResearchQuestionExperiment {
  id: string;
  title: string;
  status: ResearchExperimentStatus;
  summary: string;
  relatedEntities?: EntityRef[];
  result?: string;
}

export interface ResearchQuestionTimelineEvent {
  date: IsoDate;
  title: string;
  summary: string;
  relatedEntities?: EntityRef[];
}

export interface ResearchQuestionEntity extends BaseEntity {
  type: "researchQuestion";
  started: IsoDate;
  updated: IsoDate;
  priority: number;
  homepage?: boolean;
  observation: string;
  problem?: string;
  hypothesis: string;
  currentUnderstanding?: string;
  experiments?: ResearchQuestionExperiment[];
  result?: string;
  nextSteps?: string[];
  relatedProjects?: EntityRef[];
  relatedSoftware?: EntityRef[];
  relatedArticles?: EntityRef[];
  relatedCollections?: EntityRef[];
  relatedConcepts?: EntityRef[];
  relatedTechnologies?: EntityRef[];
  relatedRepositories?: SourceRef[];
  timeline?: ResearchQuestionTimelineEvent[];
}

export interface ProjectEntity extends BaseEntity {
  type: "project";
  category: "internal" | "client" | "cultural" | "research" | "collaboration";
  brief: string;
  context: string;
  stakeholders: EntityRef[];
  constraints?: string[];
  approach: string[];
  outputs: EntityRef[];
  outcomes?: string[];
  evidence: EntityRef[];
  credits: AgentRef[];
  visualLanguage?: string[];
  textures?: string[];
  symbols?: string[];
  developmentFocus?: string[];
  marketingFocus?: string[];
  socialLinks?: Array<{ label: string; href: string }>;
}

export interface ProgramEntity extends BaseEntity {
  type: "program";
  mandate: string;
  domain: string;
  capabilities: string[];
  architecture?: string[];
  lifecycle: string[];
  maintainers: AgentRef[];
  officialUrl?: string;
}

export type PublicationFormat =
  | "conceptPage"
  | "methodPage"
  | "researchNote"
  | "technicalArticle"
  | "essay"
  | "caseStudy"
  | "documentation"
  | "archiveRecord"
  | "experimentalPublication";

export interface PublicationEntity extends BaseEntity {
  type: "publication";
  format: PublicationFormat;
  subjects: EntityRef[];
  claims?: string[];
  evidence?: EntityRef[];
  citation: { preferred: string; doi?: string };
}

export interface CollectionEntity extends BaseEntity {
  type: "collection";
  thesis: string;
  curator: AgentRef[];
  explicitMembers: EntityRef[];
  selectionNote: string;
}

export interface ArtefactEntity extends BaseEntity {
  type: "artefact";
  artefactType: "audio" | "visual" | "document" | "prototype" | "code" | "record";
  createdAt?: IsoDate;
  provenance: string;
  sourceProject?: EntityRef;
  format?: string;
  preservationStatus: "active" | "stable" | "at-risk" | "lost" | "superseded";
  significance: string;
}

export interface TimelineEntity extends BaseEntity {
  type: "timeline";
  subject: EntityRef;
  events: EntityRef[];
  editorialScope: string;
}

export interface ArtistEntity extends BaseEntity {
  type: "artist";
  biography: string;
  roles: string[];
}

export interface OrganizationEntity extends BaseEntity {
  type: "organization";
  organizationType: "studio" | "label" | "institution" | "company" | "collective" | "client" | "publisher";
}

export interface ToolEntity extends BaseEntity {
  type: "tool";
  purpose: string;
  users: string[];
  inputs: string[];
  outputs: string[];
}

export interface DatasetEntity extends BaseEntity {
  type: "dataset";
  methodology: string;
  formats: string[];
  limitations: string[];
}

export interface EventEntity extends BaseEntity {
  type: "event";
  eventType: "creation" | "publication" | "release" | "milestone" | "exhibition" | "decision";
  startDate: IsoDate;
  endDate?: IsoDate;
  participants: EntityRef[];
  result?: EntityRef[];
}

export type Entity =
  | ConceptEntity
  | MethodEntity
  | FrameworkEntity
  | TechnologyEntity
  | ResearchFieldEntity
  | ResearchQuestionEntity
  | ProjectEntity
  | ProgramEntity
  | PublicationEntity
  | CollectionEntity
  | ArtefactEntity
  | TimelineEntity
  | ArtistEntity
  | OrganizationEntity
  | ToolEntity
  | DatasetEntity
  | EventEntity;
