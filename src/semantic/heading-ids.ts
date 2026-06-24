import type { EntityHeading } from "../schema/entity.js";

const headingPattern = /^(#{2,3})\s+(.+)$/gm;

export const slugifyHeading = (value: string): string => {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
};

export const headingItemsFromMarkdown = (body: string): EntityHeading[] => {
  const counts = new Map<string, number>();

  return [...body.matchAll(headingPattern)].map((match) => {
    const title = match[2].trim();
    const baseId = slugifyHeading(title);
    const count = counts.get(baseId) || 0;
    counts.set(baseId, count + 1);

    return {
      level: match[1].length as 2 | 3,
      title,
      id: count ? `${baseId}-${count + 1}` : baseId,
    };
  });
};
