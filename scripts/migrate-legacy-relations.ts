import path from "node:path";
import { loadRelations } from "../src/build/load-relations.js";

const relations = await loadRelations(path.resolve("."));
process.stdout.write(`Pilot migration contains ${relations.length} normalized relations. Legacy relatedTo edges remain deferred for manual classification.\n`);
