import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { withDerivedRelations } from "../src/build/derive-relations.js";
import { isPublicEntity } from "../src/semantic/visibility.js";
import type { Entity } from "../src/schema/entities.js";
import type { EntityId } from "../src/schema/entity.js";
import type { RelationStatement } from "../src/schema/relation.js";

type Degree = { incoming: number; outgoing: number };

const rootDir = path.resolve(".");
const entities = await loadContent(rootDir);
const authoredRelations = await loadRelations(rootDir);
const relations = withDerivedRelations(entities, authoredRelations);
const publicCanonical = entities.filter((entity) => !entity.translationOf && isPublicEntity(entity));
const publicIds = new Set(publicCanonical.map((entity) => entity.id));
const publicRelations = relations.filter((relation) =>
  relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object));
const publicAuthored = authoredRelations.filter((relation) =>
  relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object));

const adjacency = new Map<EntityId, Set<EntityId>>(
  publicCanonical.map((entity) => [entity.id, new Set<EntityId>()]),
);
const degree = new Map<EntityId, Degree>(
  publicCanonical.map((entity) => [entity.id, { incoming: 0, outgoing: 0 }]),
);

for (const relation of publicRelations) {
  adjacency.get(relation.subject)?.add(relation.object);
  adjacency.get(relation.object)?.add(relation.subject);
  degree.get(relation.subject)!.outgoing += 1;
  degree.get(relation.object)!.incoming += 1;
}

const components: EntityId[][] = [];
const visited = new Set<EntityId>();
for (const entity of publicCanonical) {
  if (visited.has(entity.id)) continue;
  const component: EntityId[] = [];
  const queue: EntityId[] = [entity.id];
  visited.add(entity.id);
  while (queue.length) {
    const current = queue.shift()!;
    component.push(current);
    for (const neighbor of adjacency.get(current) || []) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
  components.push(component);
}

const relationTouches = (entity: Entity, relation: RelationStatement): boolean =>
  relation.subject === entity.id || relation.object === entity.id;
const authoredIncoming = (entity: Entity): boolean =>
  publicAuthored.some((relation) => relation.object === entity.id);
const authoredOutgoing = (entity: Entity): boolean =>
  publicAuthored.some((relation) => relation.subject === entity.id);

const issues: string[] = [];
const isolated = publicCanonical.filter((entity) => {
  const value = degree.get(entity.id)!;
  return value.incoming + value.outgoing === 0;
});
for (const entity of isolated) issues.push(`${entity.id} is isolated from the public graph`);

if (components.length !== 1) {
  const sizes = components.map((component) => component.length).sort((a, b) => b - a);
  issues.push(`public graph has ${components.length} disconnected components (${sizes.join(", ")})`);
}

for (const entity of publicCanonical.filter((candidate) => candidate.type === "program" || candidate.type === "project")) {
  if (!publicAuthored.some((relation) => relationTouches(entity, relation))) {
    issues.push(`${entity.id} has no authored public relation`);
  }
  if (!authoredIncoming(entity)) issues.push(`${entity.id} has no authored incoming public relation`);
  if (!authoredOutgoing(entity)) issues.push(`${entity.id} has no authored outgoing public relation`);
}

const weak = publicCanonical
  .map((entity) => ({ entity, ...degree.get(entity.id)! }))
  .filter(({ incoming, outgoing }) => incoming + outgoing <= 2)
  .sort((left, right) => (left.incoming + left.outgoing) - (right.incoming + right.outgoing));

const predicateCounts = Object.fromEntries(
  [...new Set(publicRelations.map((relation) => relation.predicate))]
    .sort()
    .map((predicate) => [predicate, publicRelations.filter((relation) => relation.predicate === predicate).length]),
);

process.stdout.write(`${JSON.stringify({
  summary: {
    publicCanonicalEntities: publicCanonical.length,
    authoredPublicRelations: publicAuthored.length,
    totalPublicRelations: publicRelations.length,
    components: components.length,
    isolatedEntities: isolated.length,
    weakEntities: weak.length,
    issues: issues.length,
  },
  programsAndProjects: publicCanonical
    .filter((entity) => entity.type === "program" || entity.type === "project")
    .map((entity) => ({ id: entity.id, ...degree.get(entity.id)! })),
  weakEntities: weak.map(({ entity, incoming, outgoing }) => ({ id: entity.id, type: entity.type, incoming, outgoing })),
  predicateCounts,
  issues,
}, null, 2)}\n`);

if (issues.length) process.exitCode = 1;
