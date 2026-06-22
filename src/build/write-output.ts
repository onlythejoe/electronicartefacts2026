import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const routeToFile = (rootDir: string, route: string): string =>
  path.join(rootDir, route.replace(/^\/|\/$/g, ""), "index.html");

export const writeText = async (file: string, value: string): Promise<void> => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, value, "utf8");
};

export const writeJson = async (file: string, value: unknown): Promise<void> =>
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
