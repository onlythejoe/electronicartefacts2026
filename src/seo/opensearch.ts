import { site } from "../config/site.js";

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const buildOpenSearchDescription = (): string => `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${escapeXml(site.name)}</ShortName>
  <LongName>${escapeXml(`${site.name} Knowledge Search`)}</LongName>
  <Description>${escapeXml("Search the Electronic Artefacts public knowledge graph.")}</Description>
  <Tags>${escapeXml(site.keywords.join(" "))}</Tags>
  <Contact>${escapeXml(site.contactEmail)}</Contact>
  <Url type="text/html" template="${escapeXml(`${site.origin}/search/?q={searchTerms}`)}" />
  <Image height="192" width="192" type="image/png">${escapeXml(`${site.origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-icon-192.png`)}</Image>
  <Developer>${escapeXml(site.name)}</Developer>
  <Attribution>${escapeXml(`${site.name} public knowledge graph`)}</Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>${escapeXml(site.language)}</Language>
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
</OpenSearchDescription>
`;
