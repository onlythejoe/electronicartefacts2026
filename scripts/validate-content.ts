import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { publicationContracts } from "../src/config/publication-contracts.js";

const rootDir = path.resolve(".");
const entities = await loadContent(rootDir);
const relations = await loadRelations(rootDir);
validateGraph(entities, relations);

for (const entity of entities) {
  if (entity.type !== "publication") continue;
  const contract = publicationContracts[entity.format];
  const missing = contract.requiredHeadings.filter((heading) =>
    !entity.headings.some((value) => value.toLowerCase() === heading.toLowerCase()));
  if (missing.length) throw new Error(`${entity.id} is missing required headings: ${missing.join(", ")}`);
}

process.stdout.write(`Validated ${entities.length} entities and ${relations.length} typed relations.\n`);
