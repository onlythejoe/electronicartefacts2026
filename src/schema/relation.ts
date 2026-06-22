import type { Confidence, EntityId, IsoDate, SourceRef } from "./entity.js";

export type RelationPredicate =
  | "defines"
  | "refines"
  | "contrastsWith"
  | "influencedBy"
  | "tests"
  | "supportsClaim"
  | "contradictsClaim"
  | "cites"
  | "appliesConcept"
  | "usesMethod"
  | "implementsFramework"
  | "usesTechnology"
  | "implementedBy"
  | "demonstratedBy"
  | "createdBy"
  | "contributedBy"
  | "producedBy"
  | "publishedBy"
  | "commissionedBy"
  | "maintainedBy"
  | "fundedBy"
  | "hasPart"
  | "partOf"
  | "memberOfCollection"
  | "documents"
  | "documentedBy"
  | "subjectOf"
  | "dependsOn"
  | "poweredBy"
  | "integratesWith"
  | "supersedes"
  | "versionOf"
  | "forkedFrom"
  | "evidencedBy"
  | "derivedFrom"
  | "usesDataset"
  | "generatedArtefact"
  | "hasSource"
  | "precededBy"
  | "followedBy"
  | "occurredDuring"
  | "resultedIn";

export interface RelationStatement {
  id: `ear:${string}`;
  subject: EntityId;
  predicate: RelationPredicate;
  object: EntityId;
  statement: string;
  confidence: Confidence;
  sources?: SourceRef[];
  validFrom?: IsoDate;
  validTo?: IsoDate;
  createdAt: IsoDate;
  reviewedAt?: IsoDate;
  visibility: "public" | "internal";
}
