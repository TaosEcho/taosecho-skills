#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const checks = [];

const rootManifest = readJson("manifest.json");
check("root manifest exists", Boolean(rootManifest));
check("root manifest has two packages", rootManifest?.packages?.length === 2);
check("root manifest lists etl package", rootManifest?.packages?.some((item) => item.id === "taosecho-etl-skills"));
check("root manifest lists harness package", rootManifest?.packages?.some((item) => item.id === "harness-setup-skill"));
check("root manifest tracks ETL 2.3.0", rootManifest?.packages?.find((item) => item.id === "taosecho-etl-skills")?.version === "2.3.0");

const packageManifests = [
  "skills/taosecho-etl-skills/manifest.json",
  "skills/harness-setup-skill/manifest.json",
];
for (const file of packageManifests) {
  const manifest = readJson(file);
  check(`${file} exists`, Boolean(manifest));
  check(`${file} has entry_skill`, Boolean(manifest?.entry_skill));
  check(`${file} has compat`, Array.isArray(manifest?.compat) && manifest.compat.includes("codex") && manifest.compat.includes("claude-code"));
}
check("ETL package manifest is 2.3.0", readJson("skills/taosecho-etl-skills/manifest.json")?.version === "2.3.0");

const adrFiles = [
  "docs/adr/0001-monorepo-skill-pack.md",
  "docs/adr/0002-taosecho-etl-normalize-first.md",
  "docs/adr/0003-host-neutral-skill-design.md",
  "docs/adr/0004-harness-state-first-setup.md",
  "docs/adr/0005-dynamic-single-step-routing.md",
];
for (const file of adrFiles) {
  const text = read(file);
  check(`${file} exists`, Boolean(text));
  check(`${file} has status/context/decision`, text.includes("## Status") && text.includes("## Context") && text.includes("## Decision"));
}

check("workflow contract exists", exists("skills/taosecho-etl-skills/skills/taosecho-etl-shared/references/workflow-contract.md"));
check("routing scenarios exist", exists("skills/taosecho-etl-skills/skills/taosecho-etl-shared/examples/workflow-routing-scenarios.json"));
check("out-of-scope exists", exists("docs/out-of-scope.md"));
check("root release checklist exists", exists("checklists/public-release-readiness.md"));
check("root sensitive checklist exists", exists("checklists/sensitive-content-review.md"));
check("root maintenance checklist exists", exists("checklists/skill-pack-maintenance.md"));

const etlChecklists = [
  "skills/taosecho-etl-skills/checklists/pressure-test-cases.md",
  "skills/taosecho-etl-skills/checklists/report-readiness.md",
  "skills/taosecho-etl-skills/checklists/source-boundary.md",
];
for (const file of etlChecklists) check(`${file} exists`, exists(file));

const harnessChecklists = [
  "skills/harness-setup-skill/checklists/setup-readiness.md",
  "skills/harness-setup-skill/checklists/closeout-readiness.md",
];
for (const file of harnessChecklists) check(`${file} exists`, exists(file));

const reportTemplates = ["brief-report.md", "standard-report.md", "full-report.md"]
  .map((file) => `skills/taosecho-etl-skills/skills/taosecho-etl-report/templates/${file}`);
for (const file of reportTemplates) {
  const text = read(file);
  check(`${file} exists`, Boolean(text));
  check(`${file} has product placeholder`, text.includes("{product.name}"));
}
check("report validator exists", exists("skills/taosecho-etl-skills/skills/taosecho-etl-report/scripts/validate-report.js"));

const reportSkill = read("skills/taosecho-etl-skills/skills/taosecho-etl-report/SKILL.md");
check("report skill references templates", reportSkill.includes("templates/brief-report.md") && reportSkill.includes("templates/standard-report.md") && reportSkill.includes("templates/full-report.md"));
check("report skill references validator", reportSkill.includes("scripts/validate-report.js"));
check("report skill references workflow contract", reportSkill.includes("workflow-contract.md"));

const ci = read(".github/workflows/verify.yml");
check("ci runs repo verifier", ci.includes("node scripts/verify-repo.js"));
check("ci runs ETL verifier", ci.includes("verify-taosecho-etl-skills.js"));

const failed = checks.filter((item) => !item.ok);
if (failed.length) {
  console.error(`repo verification failed: ${failed.length}/${checks.length}`);
  for (const item of failed) console.error(`- ${item.name}`);
  process.exit(1);
}
console.log(`repo verification passed: ${checks.length}/${checks.length}`);

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}
function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}
function read(rel) {
  const file = path.join(repo, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}
function readJson(rel) {
  const text = read(rel);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
