import type { EntityType } from "./entity.js";
import type { RelationPredicate } from "./relation.js";

export interface PredicateDefinition {
  id: RelationPredicate;
  label: string;
  inverseLabel?: string;
  symmetric?: boolean;
  allowedSubjects: EntityType[];
  allowedObjects: EntityType[];
  requiresSource: boolean;
  group: "knowledge" | "implementation" | "production" | "structure" | "evidence" | "history";
}

const all: EntityType[] = [
  "concept", "method", "framework", "technology", "researchField", "project", "program",
  "publication", "collection", "artefact", "timeline", "artist", "organization", "tool", "dataset", "event",
];
const agents: EntityType[] = ["artist", "organization"];

const definition = (
  id: RelationPredicate,
  label: string,
  group: PredicateDefinition["group"],
  allowedSubjects = all,
  allowedObjects = all,
  requiresSource = false,
): PredicateDefinition => ({ id, label, group, allowedSubjects, allowedObjects, requiresSource });

export const predicateDefinitions: Record<RelationPredicate, PredicateDefinition> = Object.fromEntries([
  definition("defines", "Defines", "knowledge", ["publication", "framework", "researchField"], ["concept", "method", "framework"]),
  definition("refines", "Refines", "knowledge"),
  definition("contrastsWith", "Contrasts with", "knowledge"),
  definition("influencedBy", "Influenced by", "knowledge"),
  definition("tests", "Tests", "knowledge", ["publication", "project", "program"], ["concept", "method", "framework"]),
  definition("supportsClaim", "Supports claim", "evidence"),
  definition("contradictsClaim", "Contradicts claim", "evidence"),
  definition("cites", "Cites", "knowledge"),
  definition("appliesConcept", "Applies concept", "implementation", ["project", "program", "method", "publication"], ["concept"]),
  definition("usesMethod", "Uses method", "implementation", ["project", "program", "publication"], ["method"]),
  definition("implementsFramework", "Implements framework", "implementation", ["project", "program", "tool"], ["framework"]),
  definition("usesTechnology", "Uses technology", "implementation", ["project", "program", "publication", "tool"], ["technology"]),
  definition("implementedBy", "Implemented by", "implementation"),
  definition("demonstratedBy", "Demonstrated by", "evidence"),
  definition("createdBy", "Created by", "production", all, agents),
  definition("contributedBy", "Contributed by", "production", all, agents),
  definition("producedBy", "Produced by", "production", all, agents),
  definition("publishedBy", "Published by", "production", ["publication", "project", "artefact", "program"], ["organization"]),
  definition("commissionedBy", "Commissioned by", "production", ["project", "artefact", "publication"], agents, true),
  definition("maintainedBy", "Maintained by", "production", ["program", "tool", "dataset", "project"], agents),
  definition("fundedBy", "Funded by", "production", all, agents, true),
  definition("hasPart", "Has part", "structure"),
  definition("partOf", "Part of", "structure"),
  definition("memberOfCollection", "Member of collection", "structure", all, ["collection"]),
  definition("documents", "Documents", "evidence", ["publication", "artefact"], all),
  definition("documentedBy", "Documented by", "evidence"),
  definition("subjectOf", "Subject of", "structure"),
  definition("dependsOn", "Depends on", "implementation", ["project", "program", "tool"], ["program", "tool", "technology", "framework"]),
  definition("poweredBy", "Powered by", "implementation", ["project", "program", "tool"], ["program", "technology", "framework"]),
  definition("integratesWith", "Integrates with", "implementation"),
  definition("supersedes", "Supersedes", "history"),
  definition("versionOf", "Version of", "history"),
  definition("forkedFrom", "Forked from", "history"),
  definition("evidencedBy", "Evidenced by", "evidence", all, ["artefact", "publication", "dataset", "project"]),
  definition("derivedFrom", "Derived from", "history"),
  definition("usesDataset", "Uses dataset", "implementation", ["project", "program", "publication", "tool"], ["dataset"]),
  definition("generatedArtefact", "Generated artefact", "evidence", ["project", "program", "event"], ["artefact"]),
  definition("hasSource", "Has source", "evidence"),
  definition("precededBy", "Preceded by", "history"),
  definition("followedBy", "Followed by", "history"),
  definition("occurredDuring", "Occurred during", "history", ["event"], ["timeline", "project", "program"]),
  definition("resultedIn", "Resulted in", "history", ["event", "project", "program"], all),
].map((item) => [item.id, item])) as Record<RelationPredicate, PredicateDefinition>;
