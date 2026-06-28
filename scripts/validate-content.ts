import path from "node:path";
import { access } from "node:fs/promises";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { publicationContracts } from "../src/config/publication-contracts.js";

const rootDir = path.resolve(".");
const frenchPublicationHeadings: Record<string, string[]> = {
  Definition: ["Définition"],
  Scope: ["Périmètre"],
  Applications: ["Applications"],
  Limitations: ["Limites"],
  References: ["Références"],
  Purpose: ["Objectif"],
  Inputs: ["Entrées"],
  Procedure: ["Procédure"],
  Outputs: ["Résultats"],
  Examples: ["Exemples"],
  Question: ["Question"],
  Context: ["Contexte"],
  Observation: ["Observation"],
  Interpretation: ["Interprétation"],
  Problem: ["Problème"],
  Architecture: ["Architecture"],
  Implementation: ["Mise en œuvre"],
  Evidence: ["Éléments de preuve"],
  Abstract: ["Résumé"],
  Thesis: ["Thèse"],
  Argument: ["Argument"],
  Conclusion: ["Conclusion"],
  Constraints: ["Contraintes"],
  Approach: ["Approche"],
  Outcome: ["Résultat"],
  "System boundary": ["Frontière du système"],
  Usage: ["Usage"],
  Version: ["Version"],
  "Change history": ["Historique des modifications"],
  Description: ["Description"],
  Provenance: ["Provenance"],
  Significance: ["Importance"],
  Rights: ["Droits"],
  Work: ["Œuvre"],
  "Constituent artefacts": ["Artefacts constitutifs"],
  Credits: ["Crédits"],
};
const entities = await loadContent(rootDir);
const relations = await loadRelations(rootDir);
validateGraph(entities, relations);

const localMediaPath = (src: string): string | null => {
  if (src.startsWith("/")) return path.join(rootDir, src.slice(1));
  if (src.startsWith("./")) return path.resolve(rootDir, src);
  return null;
};

for (const entity of entities) {
  for (const media of entity.media || []) {
    const mediaPath = localMediaPath(media.src);
    if (!mediaPath) continue;
    if (!mediaPath.startsWith(rootDir + path.sep)) {
      throw new Error(`${entity.id} media ${media.id} escapes the repository root: ${media.src}`);
    }
    try {
      await access(mediaPath);
    } catch {
      throw new Error(`${entity.id} media ${media.id} points to a missing file: ${media.src}`);
    }
  }

  if (entity.type !== "publication") continue;
  const contract = publicationContracts[entity.format];
  const missing = contract.requiredHeadings.filter((heading) =>
    !entity.headings.some((value) => {
      const allowed = entity.locale === "fr" ? [heading, ...(frenchPublicationHeadings[heading] || [])] : [heading];
      return allowed.some((candidate) => value.toLowerCase() === candidate.toLowerCase());
    }));
  if (missing.length) throw new Error(`${entity.id} is missing required headings: ${missing.join(", ")}`);
}

process.stdout.write(`Validated ${entities.length} entities and ${relations.length} typed relations.\n`);
