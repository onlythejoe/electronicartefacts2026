import MiniSearch from "minisearch";
import type { SearchDocument } from "./documents.js";

export const buildSearchIndex = (documents: SearchDocument[]) => {
  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ["title", "alternateNames", "definition", "abstract", "headings", "questions", "tags", "relationLabels", "body"],
    storeFields: ["id", "route", "type", "format", "title", "definition", "abstract", "status", "confidence", "modifiedAt"],
    searchOptions: {
      boost: {
        title: 12,
        alternateNames: 9,
        definition: 8,
        questions: 7,
        headings: 5,
        abstract: 4,
        tags: 3,
        relationLabels: 2,
        body: 1,
      },
      prefix: true,
      fuzzy: 0.15,
    },
  });
  miniSearch.addAll(documents);
  return miniSearch.toJSON();
};
