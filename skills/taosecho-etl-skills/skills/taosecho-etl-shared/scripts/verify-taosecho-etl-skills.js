#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const prefix = "taosecho-etl-";
const version = "2.3.0";

const expectedSkills = [
  "taosecho-etl-product",
  "taosecho-etl-normalize",
  "taosecho-etl-buy-reason",
  "taosecho-etl-usage-scene",
  "taosecho-etl-buy-concern",
  "taosecho-etl-competitor-opportunity",
  "taosecho-etl-product-definition",
  "taosecho-etl-risk-check",
  "taosecho-etl-page-trust",
  "taosecho-etl-validation-plan",
  "taosecho-etl-ops-feedback",
  "taosecho-etl-dev-decision",
  "taosecho-etl-report",
];

const analysisSkills = expectedSkills.filter((name) => ![
  "taosecho-etl-product",
  "taosecho-etl-normalize",
  "taosecho-etl-dev-decision",
  "taosecho-etl-report",
].includes(name));
const exampleSkills = [...analysisSkills, "taosecho-etl-dev-decision"];

const sharedRefs = [
  "unified-data-contract.md",
  "workflow-contract.md",
  "field-aliases.md",
  "source-quality.md",
  "evidence-rules.md",
  "routing.md",
  "output-format.md",
  "method-base.md",
  "decision-algorithm.md",
  "conflict-handling.md",
  "intake-state.md",
  "budget.md",
  "yujun-product-keywords.md",
];

const shapeRefs = [
  "structured-extraction.md",
  "tabular-extraction.md",
  "textual-extraction.md",
  "document-extraction.md",
  "spoken-extraction.md",
];

const oldNormalizeRefs = [
  "sorftime-tool-map.md",
  "csv-parsing.md",
  "text-extraction.md",
  "pdf-handling.md",
];

const sharedExamples = [
  "structured-regression.md",
  "tabular-regression.md",
  "textual-regression.md",
  "mixed-regression.md",
];

const checks = [];
const shared = path.join(root, "taosecho-etl-shared");
const sharedRefDir = path.join(shared, "references");
const normalizeRefDir = path.join(root, "taosecho-etl-normalize", "references");
const contentFiles = exists(root)
  ? walk(root).filter((file) => file.includes(`/${prefix}`) && fs.statSync(file).isFile())
  : [];
const docsContent = contentFiles
  .filter((file) => !file.endsWith("verify-taosecho-etl-skills.js"))
  .map(read)
  .join("\n");
const exampleFiles = contentFiles.filter((file) => file.includes("/examples/") && file.endsWith(".md"));
const exampleContent = exampleFiles.map(read).join("\n");
const skillFiles = expectedSkills.map((name) => path.join(root, name, "SKILL.md"));

for (const name of expectedSkills) {
  check(`${name} exists`, exists(path.join(root, name, "SKILL.md")));
}

for (const file of sharedRefs) {
  check(`shared ${file} exists`, exists(path.join(sharedRefDir, file)));
}

check("shared changelog exists", exists(path.join(shared, "CHANGELOG.md")));
check("shared migration guide exists", exists(path.join(shared, "MIGRATION.md")));
for (const release of ["2.1.0", "2.2.0", "2.2.1", "2.2.2", "2.3.0"]) {
  check(`changelog documents ${release}`, safeRead(path.join(shared, "CHANGELOG.md")).includes(`## ${release}`));
}
check("migration guide maps source.type", safeRead(path.join(shared, "MIGRATION.md")).includes("source.type") && safeRead(path.join(shared, "MIGRATION.md")).includes("structured"));

for (const name of expectedSkills) {
  const skill = safeRead(path.join(root, name, "SKILL.md"));
  check(`${name} version is ${version}`, versionOf(skill) === version);
  check(`${name} uses etl shared paths`, skill.includes("../taosecho-etl-shared/references/"));
  check(`${name} avoids host-specific question dependency`, !skill.includes("调用 AskUserQuestion") && !skill.includes("调用 request_user_input"));
  check(`${name} avoids MCP tool identifiers`, !skill.includes("mcp__sorftime__"));
}

const versions = skillFiles.map((file) => versionOf(safeRead(file))).filter(Boolean);
check("all skills share pack version", new Set(versions).size === 1 && versions[0] === version);

const workflowContract = safeRead(path.join(sharedRefDir, "workflow-contract.md"));
check("workflow contract has core invariant", workflowContract.includes("One current step, then a fresh decision"));
check("workflow contract defines canonical next action", workflowContract.includes("workflow.next_action") && workflowContract.includes("single source of truth"));
check("workflow contract defines worker result", workflowContract.includes("Worker Result Contract") && workflowContract.includes("criterion_met"));
check("workflow contract defines stop rules", workflowContract.includes("## Stop Rules") && workflowContract.includes("next_action.type=stop"));
check("workflow contract keeps legacy routing compatible", workflowContract.includes("Existing v2.2 state") && workflowContract.includes("candidate, not an obligation"));

const contract = safeRead(path.join(sharedRefDir, "unified-data-contract.md"));
check("contract declares schema_version 2.0", contract.includes('schema_version: "2.0"'));
check("contract includes source block", contract.includes("source:"));
check("contract uses shape source.type enum", contract.includes("structured | tabular | textual | document | spoken | mixed"));
check("contract includes user_provided block", contract.includes("user_provided:"));
check("contract includes workflow block", contract.includes("workflow:") && contract.includes("latest_result:"));
check("contract includes analysis_history block", contract.includes("analysis_history:"));
check("contract marks legacy route read-only", contract.includes("legacy read-only"));
check("contract includes source.type=mixed guidance", contract.includes("source.type=mixed"));
check("contract keeps platform as metadata", contract.includes("platform:") && contract.includes("Platform is metadata"));

const aliases = safeRead(path.join(sharedRefDir, "field-aliases.md"));
for (const token of ["tiktok_id", "video_id", "Rating Count", "Est. Sales", "Search Term", "Keyword", "top", "ACOS", "TACoS", "RoAS", "ad[\\s_]?spend"]) {
  check(`field aliases cover ${token}`, aliases.includes(token));
}
check("field aliases cover cost and returns", aliases.includes("user_provided.cost_structure") && aliases.includes("user_provided.returns"));

const sourceQuality = safeRead(path.join(sharedRefDir, "source-quality.md"));
for (const shape of ["structured", "tabular", "textual", "document", "spoken", "user_provided", "mixed"]) {
  check(`source quality covers ${shape}`, sourceQuality.includes(shape));
}
for (const oldSource of ["manual_csv", "manual_text", "manual_ocr", "pdf |", "| sorftime |"]) {
  check(`source quality avoids legacy row ${oldSource}`, !sourceQuality.includes(oldSource));
}
check("source quality blocks spoken strong decisions", sourceQuality.includes("spoken-only") && sourceQuality.includes("先收集结构化数据"));
check("source quality says platform is metadata", sourceQuality.includes("平台信息") && sourceQuality.includes("元数据"));

const normalize = safeRead(path.join(root, "taosecho-etl-normalize", "SKILL.md"));
check("normalize references workflow contract", normalize.includes("workflow-contract.md"));
check("normalize references data rules", ["unified-data-contract.md", "field-aliases.md", "source-quality.md"].every((token) => normalize.includes(token)));
check("normalize writes v2 state path", normalize.includes("tasks/YYYYMMDD-{product.id}/state.md"));
check("normalize keeps fixed coverage header", normalize.includes("数据项 | 目标量 | 已获取 | 来源形态 | 判断等级"));
check("normalize handles user-provided data only", normalize.includes("用户已经提供") && normalize.includes("不主动调用外部工具或 MCP"));
check("normalize includes post-mapping platform sniffing", normalize.includes("平台嗅探") && normalize.includes("后置"));
check("normalize includes mixed source merge", normalize.includes("多源合并") && normalize.includes('source.type = "mixed"'));
check("normalize writes latest result", normalize.includes("workflow.latest_result") && normalize.includes("criterion_met"));
check("normalize suggests at most one action", normalize.includes("至多一个 next skill") && normalize.includes("入口重新检查"));
check("normalize treats spoken descriptions as valid", normalize.includes("口述产品识别") && normalize.includes("价格区间"));
check("normalize marks spoken clue-level", normalize.includes('source.type = "spoken"') && normalize.includes('evidence.level = "线索级"'));
check("normalize includes pressure short path", normalize.includes("施压但缺数据") && normalize.includes("最快路径：给我产品名、商品链接，或一句话描述产品"));
check("normalize defaults to compact receipt", normalize.includes("数据已接收（{判断等级}，{来源形态}）。开始分析..."));
for (const shape of ["structured", "tabular", "textual", "document", "spoken"]) {
  check(`normalize includes shape ${shape}`, normalize.includes(`${shape}：`) || normalize.includes(`${shape}:`));
}
for (const file of shapeRefs) {
  check(`normalize reference ${file} exists`, exists(path.join(normalizeRefDir, file)));
  check(`normalize references ${file}`, normalize.includes(`references/${file}`));
}
for (const file of oldNormalizeRefs) {
  check(`legacy normalize reference ${file} absent`, !exists(path.join(normalizeRefDir, file)));
  check(`normalize does not reference ${file}`, !normalize.includes(file));
}

const product = safeRead(path.join(root, "taosecho-etl-product", "SKILL.md"));
check("product references workflow contract", product.includes("workflow-contract.md"));
check("product is the single router", product.includes("单一入口与路由器"));
check("product reads latest user context first", product.includes("用户当前消息") && product.includes("已有信息直接复用"));
check("product uses one current action", product.includes("每次只写一个 `workflow.next_action`") && product.includes("达到完成条件后再重新路由"));
check("product stores large outcomes", product.includes("workflow.requested_outcome") && product.includes("不展开为固定长队列"));
check("product includes completion criteria", product.includes("## 完成条件") && product.includes("workflow.status=satisfied"));
check("product includes friendly data paths", ["ASIN", "商品链接", "产品名", "20 条以上评论", "竞品表格", "Listing 文案", "运营记录"].every((token) => product.includes(token)));
check("product keeps host-neutral prompt", product.includes("host-neutral") && product.includes("纯文本问询"));
check("product tracks brief and impatient state", product.includes("workflow.response_mode=brief") && product.includes("workflow.interaction_state=impatient"));

const routing = safeRead(path.join(sharedRefDir, "routing.md"));
check("routing has dynamic precedence", routing.includes("## Routing Precedence") && routing.includes("每次只写一个"));
check("routing has outcome guidance", routing.includes("## Outcome Guidance") && routing.includes("大目标只存为 outcome"));
check("routing has signal map", routing.includes("## Result Signal Map") && routing.includes("decision_ready"));
check("routing has tie-breaker not queue", routing.includes("Default Exploration Tie-Breaker") && routing.includes("不是必须完成的链条"));
check("routing includes auto-continue recheck", routing.includes("## Auto-Continue Rules") && routing.includes("第二跳前重新检查"));
check("routing includes empty and pressure starts", routing.includes("## Empty-Start Rules") && routing.includes("## First-Turn Pressure Rules"));
check("routing includes spoken start", routing.includes("## Spoken Product Start") && routing.includes("source.type=spoken"));
check("routing has no fixed queue heading", !routing.includes("Recommended queues") && !routing.includes("自动队列"));

const intakeState = safeRead(path.join(sharedRefDir, "intake-state.md"));
check("intake-state documents canonical workflow", intakeState.includes("## Canonical Workflow Block") && intakeState.includes("workflow:"));
check("intake-state documents read order", intakeState.includes("## Read Order") && intakeState.includes("旧队列不能覆盖新用户意图"));
check("intake-state documents transitions", intakeState.includes("## State Transitions") && intakeState.includes("waiting_for_input"));
check("intake-state documents legacy compatibility", intakeState.includes("## Compatibility") && intakeState.includes("新写入不生成多项 queue"));
check("intake-state documents spoken starts", intakeState.includes("## Spoken Product Start") && intakeState.includes("type: spoken"));

const outputFormat = safeRead(path.join(sharedRefDir, "output-format.md"));
check("output-format includes brief mode", outputFormat.includes("## Brief Mode") && outputFormat.includes("workflow.response_mode=brief"));
check("output-format includes compact receipt", outputFormat.includes("数据已接收（{判断等级}，{来源形态}）。开始分析..."));
check("output-format includes worker writeback", outputFormat.includes("## Worker State Writeback") && outputFormat.includes("criterion_met"));
check("output-format limits next action", outputFormat.includes("至多一个动作") && outputFormat.includes("worker 不写多项队列"));

for (const name of analysisSkills) {
  const skill = safeRead(path.join(root, name, "SKILL.md"));
  check(`${name} reads state.md`, skill.includes("读取 state.md"));
  check(`${name} returns to normalize`, skill.includes("taosecho-etl-normalize") || skill.includes("返回 normalize"));
  check(`${name} references workflow contract`, skill.includes("workflow-contract.md"));
  check(`${name} includes field degradation`, skill.includes("## 字段降级"));
  check(`${name} has a completion criterion`, skill.includes("## 完成条件") && skill.includes("workflow.latest_result.completion"));
  check(`${name} emits routable result`, skill.includes("suggested_next") && skill.includes("completed_skills"));
  check(`${name} avoids direct sorftime tools`, !skill.includes("sorftime 自动") && !skill.includes("mcp__sorftime__"));
}

const decision = safeRead(path.join(root, "taosecho-etl-dev-decision", "SKILL.md"));
check("decision reads workflow and history", decision.includes("workflow.latest_result") && decision.includes("analysis_history"));
check("decision references workflow contract", decision.includes("workflow-contract.md"));
check("decision has completion criterion", decision.includes("## 完成条件") && decision.includes("decision_ready"));
check("decision includes clue-level restriction", decision.includes("evidence.level=线索级") && decision.includes("补证据"));
check("decision includes spoken restriction", decision.includes("source.type=spoken") && decision.includes("先收集结构化数据"));

for (const name of exampleSkills) {
  check(`${name} has structured example`, exists(path.join(root, name, "examples", "structured-output.md")));
  check(`${name} has tabular example`, exists(path.join(root, name, "examples", "tabular-output.md")));
  check(`${name} has textual example`, exists(path.join(root, name, "examples", "textual-output.md")));
  check(`${name} structured header matches`, exampleHeaderMatches(name, "structured-output.md"));
  check(`${name} tabular header matches`, exampleHeaderMatches(name, "tabular-output.md"));
  check(`${name} textual example uses clue format`, clueExampleFormat(name));
  check(`${name} structured example has real rows`, realRows(path.join(root, name, "examples", "structured-output.md")) >= 2);
}

const structuredFirstRows = exampleSkills.map((name) => firstDataRow(path.join(root, name, "examples", "structured-output.md"))).filter(Boolean);
check("structured example first rows are skill-specific", new Set(structuredFirstRows).size === structuredFirstRows.length);
for (const file of sharedExamples) {
  check(`shared example ${file} exists`, exists(path.join(shared, "examples", file)));
}
check("examples include mixed source", docsContent.includes("source.type=mixed"));
check("examples include structured source", docsContent.includes("source.type: structured") || docsContent.includes('source.type = "structured"'));
check("examples include tabular source", docsContent.includes("source.type: tabular") || docsContent.includes('source.type = "tabular"'));
check("examples include textual source", docsContent.includes("source.type: textual") || docsContent.includes('source.type = "textual"'));
check("examples use SAMPLE placeholder ASINs", exampleContent.includes("SAMPLE_ASIN_"));
check("examples use Sample Product naming", exampleContent.includes("Sample Product"));
check("no real ASIN format in example content", !/B0[A-Z0-9]{8}/.test(exampleContent));

const realBrands = ["ProtoArc", "Logitech", "Anker", "Belkin", "Microsoft", "Apple", "Samsers", "iClever", "Nillkin"];
check("no real brand names in examples", realBrands.every((brand) => !exampleContent.includes(brand)));
const sensitiveTerms = [
  "ProtoArc", "XK04", "B0D9PT9884", "折叠键盘", "便携支架", "portable laptop stand",
  "foldable keyboard", "travel keyboard", "蓝牙", "铰链", "配对失败", "iPad", "iPhone",
  "咖啡店", "酒店", "机场", "电脑包", "13 寸笔记本",
];
check("no sensitive product details", sensitiveTerms.every((term) => !docsContent.includes(term)));

const decisionStructured = safeRead(path.join(root, "taosecho-etl-dev-decision", "examples", "structured-output.md"));
check("dev-decision scores are 0-2", decisionScoresAreValid(decisionStructured));
check("dev-decision actions are valid", decisionActionsAreValid(decisionStructured));
check("dev-decision has total score", decisionStructured.includes("总分"));

const reportDir = path.join(root, "taosecho-etl-report");
const reportRefs = ["decision-summary.md", "report-templates.md", "format-detection.md", "chapter-templates.md"];
const reportExamples = ["brief-output.md", "standard-output.md", "full-output.md", "trigger-tests.md"];
check("report skill exists", exists(reportDir));
const reportSkill = safeRead(path.join(reportDir, "SKILL.md"));
check("report version matches pack", versionOf(reportSkill) === version);
check("report references workflow contract", reportSkill.includes("workflow-contract.md"));
check("report has completion criterion", reportSkill.includes("## 完成条件") && reportSkill.includes("report_ready"));
for (const ref of reportRefs) check(`report ${ref} exists`, exists(path.join(reportDir, "references", ref)));
for (const ex of reportExamples) check(`report ${ex} exists`, exists(path.join(reportDir, "examples", ex)));
check("report guarantees Markdown", reportSkill.includes("Markdown 是保证输出") && reportSkill.includes("tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md"));
check("report consumes state only", reportSkill.includes("只消费 state.md") && reportSkill.includes("analysis_history"));
check("report does not auto-fetch", !/主动.*调|主动.*拉取|automatically.*fetch/.test(reportSkill));

const reportContentAll = exists(reportDir) ? walk(reportDir).filter((file) => file.endsWith(".md")).map(read).join("\n") : "";
check("report content has no sensitive details", sensitiveTerms.every((term) => !reportContentAll.includes(term)));
check("report examples use placeholders", reportContentAll.includes("SAMPLE_ASIN_") && reportContentAll.includes("Sample Product"));

const scenarioFile = path.join(shared, "examples", "workflow-routing-scenarios.json");
const scenarios = readJson(scenarioFile);
check("workflow scenarios file exists and parses", Array.isArray(scenarios));
check("workflow scenarios cover at least ten branches", Array.isArray(scenarios) && scenarios.length >= 10);
const scenarioIds = new Set(Array.isArray(scenarios) ? scenarios.map((item) => item.id) : []);
for (const id of [
  "new-raw-data-enters-normalize",
  "absolute-decision-without-object-asks-once",
  "explicit-buy-reason-routes-directly",
  "clue-level-decision-stops-at-validation",
  "decision-ready-routes-to-stage-decision",
  "goal-switch-overrides-legacy-queue",
  "bounded-request-satisfied-stops",
]) {
  check(`workflow scenario covers ${id}`, scenarioIds.has(id));
}
const routingCorpus = [workflowContract, routing, intakeState, product, normalize].join("\n");
for (const scenario of Array.isArray(scenarios) ? scenarios : []) {
  check(`scenario ${scenario.id} has one expected action`, scenario.expected_action && !Array.isArray(scenario.expected_action));
  check(`scenario ${scenario.id} has valid action type`, ["skill", "ask", "stop"].includes(scenario.expected_action?.type));
  check(`scenario ${scenario.id} target is valid`, scenario.expected_action?.type !== "skill" || expectedSkills.includes(scenario.expected_action.target));
  check(`scenario ${scenario.id} required tokens are documented`, Array.isArray(scenario.required_tokens) && scenario.required_tokens.every((token) => routingCorpus.includes(token)));
}

const fixedChainLines = [workflowContract, routing, product, normalize]
  .join("\n")
  .split(/\r?\n/)
  .filter((line) => (line.match(/taosecho-etl-[a-z-*]+/g) || []).length > 2);
check("canonical routing docs contain no fixed multi-skill chain", fixedChainLines.length === 0);
check("canonical routing docs avoid queue language", !routingCorpus.includes("Recommended queues") && !routingCorpus.includes("自动队列") && !routingCorpus.includes("目标 skill 队列"));

for (const file of contentFiles.filter((file) => file.endsWith(".md"))) {
  const text = read(file);
  const rel = path.relative(root, file);
  check(`${rel} has no stale source types`, !/(manual_csv|manual_text|manual_ocr|source\.type:\s*sorftime|source\.type\s*=\s*"sorftime")/.test(text));
}
check("no v1 shared paths", !docsContent.includes("../taosecho-shared/references/"));
check("no v1 data-intake reference", !docsContent.includes("taosecho-data-intake"));

const failed = checks.filter((item) => !item.ok);
if (failed.length) {
  console.error(`taosecho etl skill verification failed: ${failed.length}/${checks.length}`);
  for (const item of failed) console.error(`- ${item.name}`);
  process.exit(1);
}
console.log(`taosecho etl skill verification passed: ${checks.length}/${checks.length}`);

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}
function exists(file) {
  return fs.existsSync(file);
}
function read(file) {
  return fs.readFileSync(file, "utf8");
}
function safeRead(file) {
  return exists(file) ? read(file) : "";
}
function readJson(file) {
  if (!exists(file)) return null;
  try {
    return JSON.parse(read(file));
  } catch {
    return null;
  }
}
function versionOf(text) {
  const match = text.match(/^version:\s*(.+)$/m);
  return match ? match[1].trim() : "";
}
function fixedHeader(text) {
  const idx = text.indexOf("## 固定表头");
  if (idx < 0) return "";
  const match = text.slice(idx).match(/```text\s*\n([^\n]+)\n```/);
  return match ? match[1].trim() : "";
}
function markdownRows(text) {
  return text.split(/\r?\n/).filter((line) => line.trim().startsWith("|") && line.includes("|"));
}
function firstMarkdownHeader(text) {
  const line = markdownRows(text)[0];
  return line ? line.trim().replace(/^\|/, "").replace(/\|$/, "").trim() : "";
}
function normalizeHeader(header) {
  return header.split("|").map((part) => part.trim()).join("|");
}
function exampleHeaderMatches(name, file) {
  const expected = fixedHeader(safeRead(path.join(root, name, "SKILL.md")));
  if (!expected) return true;
  const outputFile = path.join(root, name, "examples", file);
  if (!exists(outputFile)) return false;
  return normalizeHeader(firstMarkdownHeader(read(outputFile))) === normalizeHeader(expected);
}
function realRows(file) {
  if (!exists(file)) return 0;
  return markdownRows(read(file)).filter((line) => !/^\|\s*-/.test(line) && !line.includes("---") && !line.includes("占位") && !line.includes("示例字段")).slice(1).length;
}
function firstDataRow(file) {
  if (!exists(file)) return "";
  const rows = markdownRows(read(file)).filter((line) => !/^\|\s*-/.test(line) && !line.includes("---"));
  return rows[1] ? rows[1].trim() : "";
}
function clueExampleFormat(name) {
  const text = safeRead(path.join(root, name, "examples", "textual-output.md"));
  return text.includes("信号观察") && text.includes("证据缺口") && text.includes("建议补数") && !text.includes("| --- | --- |");
}
function decisionScoresAreValid(text) {
  const rows = markdownRows(text).filter((line) => !line.includes("---"));
  if (rows.length < 2) return false;
  return rows.slice(1).every((line) => {
    const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
    return /^[0-2]$/.test(parts[2] || "");
  });
}
function decisionActionsAreValid(text) {
  const rows = markdownRows(text).filter((line) => !line.includes("---"));
  if (rows.length < 2) return false;
  return rows.slice(1).every((line) => {
    const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
    return ["推进", "补证据", "暂缓"].includes(parts[4] || "");
  });
}
function walk(dir) {
  const output = [];
  if (!exists(dir)) return output;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) output.push(...walk(full));
    else output.push(full);
  }
  return output;
}
