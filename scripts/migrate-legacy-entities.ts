import path from "node:path";
import { loadContent } from "../src/build/load-content.js";

const entities = await loadContent(path.resolve("."));
process.stdout.write(`Pilot migration contains ${entities.length} typed entities. Legacy data remains available for non-pilot records.\n`);
