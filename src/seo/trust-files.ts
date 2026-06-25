import { site } from "../config/site.js";

export const buildHumansTxt = (): string => `/* TEAM */
Site: ${site.name}
Contact: ${site.contactEmail}
Location: France
Language: English

/* SITE */
Canonical: ${site.origin}/
Description: ${site.description}
Knowledge graph: ${site.origin}/knowledge/
Agent index: ${site.origin}/llms.txt
Agent manifest: ${site.origin}/agent-manifest.json
Public catalog: ${site.origin}/graph/catalog.jsonld
Search: ${site.origin}/search/?q=knowledge%20graph
Last updated: ${site.updatedAt}

/* TOPICS */
${site.knowsAbout.map((topic) => `- ${topic}`).join("\n")}
`;

export const buildSecurityTxt = (): string => `Contact: mailto:${site.contactEmail}
Expires: 2027-06-25T00:00:00Z
Preferred-Languages: en, fr
Canonical: ${site.origin}/.well-known/security.txt
Canonical: ${site.origin}/security.txt
`;
