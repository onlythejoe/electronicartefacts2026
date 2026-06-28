import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { parse } from "yaml";

const rootDir = path.resolve(".");
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const allowedEnglishFragments = [
  "Electronic Artefacts",
  "Electronic Artifact",
  "EA Light Framework",
  "Model Context Protocol",
  "Content Credentials",
  "Redis Streams",
  "Web Audio API",
  "Web Neural Network API",
  "JSON-LD",
  "RDF",
  "OWL",
  "SKOS",
  "IIIF",
  "C2PA",
  "MCP",
  "WebGL",
  "OpenTelemetry",
  "CloudEvents",
  "WebNN",
  "Llama.cpp",
  "Logo",
  "p5.js",
  "WCAG",
];

const franglaisPatterns = [
  /\bThis\b/i,
  /\bThat\b/i,
  /\bThese\b/i,
  /\bThose\b/i,
  /\bA canonical\b/i,
  /\bA practical\b/i,
  /\bexplains?\b/i,
  /\brather than\b/i,
  /\bsoftware system\b/i,
  /\bknowledge graph\b/i,
  /\bpublic knowledge\b/i,
  /\bsource-grounded\b/i,
  /\bsearch intent\b/i,
  /\blong-term\b/i,
  /\bdans which\b/i,
  /\bcomme an?\b/i,
  /\bde the\b/i,
  /\buse de\b/i,
  /\bfor the\b/i,
  /\bwith\b/i,
  /\bwithout\b/i,
  /\bTypographey\b/i,
  /\bUtilisery\b/i,
  /\bgraphee\b/i,
];

const frenchPatterns = [
  /\bfrançais(?:e|es)?\b/i,
  /\baccueil\b/i,
  /\bpartager\b/i,
  /\baimer\b/i,
  /\bmétadonnées\b/i,
  /\bdonnées\b/i,
  /\bconnaissance\b/i,
  /\brecherche\b/i,
  /\bprojets?\b/i,
  /\bsystèmes?\b/i,
  /\bmodèles?\b/i,
];

const stripAllowed = (text) => {
  let output = text;
  for (const fragment of allowedEnglishFragments) output = output.replaceAll(fragment, "");
  return output;
};

const walkText = (value, visitor, pathParts = []) => {
  if (typeof value === "string") {
    visitor(value, pathParts);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkText(item, visitor, [...pathParts, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (["id", "url", "href", "src", "doi", "locator", "officialUrl", "publisher", "author"].includes(key)) continue;
      if (pathParts.includes("sources") || pathParts.includes("bibliography")) continue;
      walkText(child, visitor, [...pathParts, key]);
    }
  }
};

const auditFrenchMarkdown = async () => {
  const issues = [];
  const files = await fg("content/fr/**/*.md", { cwd: rootDir, absolute: true });
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const match = frontmatterPattern.exec(source);
    if (!match) continue;
    const data = parse(match[1] || "") || {};
    const body = source.slice(match[0].length);
    walkText(data, (text, pathParts) => {
      const cleaned = stripAllowed(text);
      for (const pattern of franglaisPatterns) {
        if (pattern.test(cleaned)) issues.push({ file, where: pathParts.join("."), text });
      }
    });
    for (const [index, line] of body.split(/\r?\n/).entries()) {
      const cleaned = stripAllowed(line);
      if (franglaisPatterns.some((pattern) => pattern.test(cleaned))) {
        issues.push({ file, where: `body:${index + 1}`, text: line.trim() });
      }
    }
  }
  return issues;
};

const auditEnglishMarkdown = async () => {
  const issues = [];
  const files = await fg("content/**/*.md", {
    cwd: rootDir,
    absolute: true,
    ignore: ["content/fr/**", "content/relations/**"],
  });
  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const [index, line] of source.split(/\r?\n/).entries()) {
      if (/^\s*(- id:|id:|url:|href:|src:|translationOf:)/.test(line)) continue;
      if (frenchPatterns.some((pattern) => pattern.test(line))) {
        issues.push({ file, where: `line:${index + 1}`, text: line.trim() });
      }
    }
  }
  return issues;
};

const frIssues = await auditFrenchMarkdown();
const enIssues = await auditEnglishMarkdown();
const issues = [...frIssues.map((issue) => ({ locale: "fr", ...issue })), ...enIssues.map((issue) => ({ locale: "en", ...issue }))];

if (issues.length) {
  for (const issue of issues.slice(0, 80)) {
    const rel = path.relative(rootDir, issue.file);
    process.stdout.write(`[${issue.locale}] ${rel} ${issue.where}: ${issue.text}\n`);
  }
  if (issues.length > 80) process.stdout.write(`...and ${issues.length - 80} more issues\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Language audit passed: no obvious EN/FR mixing found.\n");
}
