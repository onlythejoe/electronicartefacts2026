import path from "node:path";
import { auditPublicLinks } from "../src/build/audit-links.js";

const report = await auditPublicLinks(path.resolve("."));
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.issues.length) process.exitCode = 1;
