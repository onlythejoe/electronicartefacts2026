import type { PublicationFormat } from "../schema/entities.js";

export const publicationContracts: Record<PublicationFormat, { requiredHeadings: string[] }> = {
  conceptPage: { requiredHeadings: ["Definition", "Scope", "Applications", "Limitations", "References"] },
  methodPage: { requiredHeadings: ["Purpose", "Inputs", "Procedure", "Outputs", "Limitations", "Examples"] },
  researchNote: { requiredHeadings: ["Question", "Context", "Observation", "Interpretation", "Limitations", "References"] },
  technicalArticle: { requiredHeadings: ["Problem", "Architecture", "Implementation", "Evidence", "Limitations", "References"] },
  essay: { requiredHeadings: ["Abstract", "Thesis", "Argument", "Conclusion", "References"] },
  caseStudy: { requiredHeadings: ["Context", "Constraints", "Approach", "Implementation", "Outcome", "Evidence"] },
  documentation: { requiredHeadings: ["Scope", "System boundary", "Usage", "Version", "Change history"] },
  archiveRecord: { requiredHeadings: ["Description", "Provenance", "Context", "Significance", "Rights"] },
  experimentalPublication: { requiredHeadings: ["Context", "Work", "Constituent artefacts", "Credits", "Rights"] },
};
