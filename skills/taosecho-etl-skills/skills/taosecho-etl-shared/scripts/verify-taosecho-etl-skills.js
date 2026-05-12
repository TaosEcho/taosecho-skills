#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const prefix = "taosecho-etl-";
const version = "2.2.2";

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
check("changelog documents 2.1.0", safeRead(path.join(shared, "CHANGELOG.md")).includes("## 2.1.0"));
check("changelog documents 2.2.0", safeRead(path.join(shared, "CHANGELOG.md")).includes("## 2.2.0"));
check("changelog documents 2.2.1", safeRead(path.join(shared, "CHANGELOG.md")).includes("## 2.2.1"));
check("changelog documents 2.2.2", safeRead(path.join(shared, "CHANGELOG.md")).includes("## 2.2.2"));
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

const contract = safeRead(path.join(sharedRefDir, "unified-data-contract.md"));
check("contract declares schema_version 2.0", contract.includes('schema_version: "2.0"'));
check("contract includes source block", contract.includes("source:"));
check("contract uses shape source.type enum", contract.includes("structured | tabular | textual | document | spoken | mixed"));
check("contract includes user_provided block", contract.includes("user_provided:"));
check("contract includes analysis_history block", contract.includes("analysis_history:"));
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
check("normalize references contract", normalize.includes("unified-data-contract.md"));
check("normalize references field aliases", normalize.includes("field-aliases.md"));
check("normalize references source quality", normalize.includes("source-quality.md"));
check("normalize writes v2 state path", normalize.includes("tasks/YYYYMMDD-{product.id}/state.md"));
check("normalize output header is v2.1", normalize.includes("数据项 | 目标量 | 已获取 | 来源形态 | 判断等级"));
check("normalize handles user-provided data only", normalize.includes("用户已经提供的数据") && normalize.includes("外部工具或 MCP"));
check("normalize includes post-mapping platform sniffing", normalize.includes("平台嗅探") && normalize.includes("后置"));
check("normalize includes mixed source merge", normalize.includes("多源合并") && normalize.includes('source.type = "mixed"'));
check("normalize includes auto-run recommendation", normalize.includes("recommended_next.auto_run=true") && normalize.includes("目标 skill 队列"));
check("normalize treats spoken product descriptions as valid input", normalize.includes("口述产品识别") && normalize.includes("品类或产品名") && normalize.includes("价格区间"));
check("normalize marks spoken product starts clue-level", normalize.includes('source.type = "spoken"') && normalize.includes('evidence.level = "线索级"'));
check("normalize includes first-turn pressure short path", normalize.includes("施压但缺数据") && normalize.includes("最快路径：给我产品名、商品链接，或一句话描述产品"));
check("normalize defaults to compact receipt", normalize.includes("数据已接收（{判断等级}，{来源形态}）。开始分析...") && normalize.includes("默认不要展开完整数据覆盖表"));
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
for (const phrase of ["sorftime 自动拉路径", "sorftime tiktok 路径", "sorftime walmart 路径", "MCP 不可用提示", "当前会话没有检测到 sorftime MCP", "我先读取 Amazon 数据", "sorftime 已连接"]) {
  check(`normalize avoids binding phrase ${phrase}`, !normalize.includes(phrase));
}

for (const file of shapeRefs) {
  const ref = safeRead(path.join(normalizeRefDir, file));
  check(`${file} has source.type guidance`, ref.includes("source.type"));
  check(`${file} references field aliases or source quality`, ref.includes("field-aliases") || ref.includes("source-quality"));
}

const product = safeRead(path.join(root, "taosecho-etl-product", "SKILL.md"));
check("product routes missing data to normalize", product.includes("taosecho-etl-normalize"));
check("product includes any-form startup", product.includes("任意形态数据") || product.includes("任一种数据形态"));
check("product includes user-friendly data forms", ["ASIN", "商品链接", "产品名", "20 条以上评论", "竞品表格", "Listing 文案", "运营记录"].every((token) => product.includes(token)));
check("product keeps host-neutral prompt", product.includes("host-neutral") && product.includes("纯文本问询"));
check("product includes fastest start path", product.includes("最快启动方式") && product.includes("ASIN（商品页链接里的 10 位编号）") && product.includes("商品链接或产品名"));
check("product includes clear-goal auto-run", product.includes("完整数据") && product.includes("自动推进规则"));
check("product tracks brief mode", product.includes("response_mode=brief"));
check("product tracks impatient state", product.includes("interaction_state=impatient"));
check("product explains ASIN and fallback start paths", product.includes("ASIN（商品页链接里的 10 位编号）") && product.includes("不知道 ASIN 也可以开始"));
check("product treats spoken product descriptions as valid input", product.includes("口述产品描述") && product.includes("默认按线索级处理"));
check("product includes first-turn pressure path", product.includes("pressure_without_data") && product.includes("施压空启动"));
for (const phrase of ["sorftime 已连接", "我先读取 Amazon 数据", "当前会话没有检测到 sorftime MCP", "sorftime MCP、Helium10"]) {
  check(`product avoids binding phrase ${phrase}`, !product.includes(phrase));
}

const routing = safeRead(path.join(sharedRefDir, "routing.md"));
check("routing includes auto-run rules", routing.includes("## Auto-Run Rules") && routing.includes("without asking for confirmation"));
check("routing includes empty-start rules", routing.includes("## Empty-Start Rules") && routing.includes("ASIN（商品页链接里的 10 位编号）") && routing.includes("一句话产品描述"));
check("routing includes multi-turn state", routing.includes("## Multi-Turn State") && routing.includes("interaction_state=impatient"));
check("routing includes first-turn pressure rules", routing.includes("## First-Turn Pressure Rules") && routing.includes("absolute conclusion"));
check("routing includes spoken product start", routing.includes("## Spoken Product Start") && routing.includes("source.type=spoken"));

const intakeState = safeRead(path.join(sharedRefDir, "intake-state.md"));
check("intake-state documents recommended_next", intakeState.includes("recommended_next:") && intakeState.includes("auto_run"));
check("intake-state documents spoken product starts", intakeState.includes("For spoken product starts") && intakeState.includes("type: spoken"));

const outputFormat = safeRead(path.join(sharedRefDir, "output-format.md"));
check("output-format includes brief mode", outputFormat.includes("## Brief Mode") && outputFormat.includes("response_mode=brief"));
check("output-format includes compact normalize receipt", outputFormat.includes("数据已接收（{判断等级}，{来源形态}）。开始分析..."));

for (const name of analysisSkills) {
  const skill = safeRead(path.join(root, name, "SKILL.md"));
  check(`${name} reads state.md`, skill.includes("读取 state.md"));
  check(`${name} returns to normalize`, skill.includes("返回 `taosecho-etl-normalize`"));
  check(`${name} includes field degradation`, skill.includes("## 字段降级"));
  check(`${name} avoids direct sorftime tool names`, !skill.includes("sorftime 自动") && !skill.includes("mcp__sorftime__"));
}

const decision = safeRead(path.join(root, "taosecho-etl-dev-decision", "SKILL.md"));
check("decision reads state.md", decision.includes("读取 state.md"));
check("decision includes clue-level restriction", decision.includes("evidence.level=线索级") && decision.includes("禁止输出“继续推进”"));
check("decision includes spoken restriction", decision.includes("source.type=spoken") && decision.includes("先收集结构化数据"));
check("decision avoids MCP dependency", !decision.includes("mcp__sorftime__"));

for (const name of exampleSkills) {
  check(`${name} has structured example`, exists(path.join(root, name, "examples", "structured-output.md")));
  check(`${name} has tabular example`, exists(path.join(root, name, "examples", "tabular-output.md")));
  check(`${name} has textual example`, exists(path.join(root, name, "examples", "textual-output.md")));
  check(`${name} removed protoarc sorftime example filename`, !exists(path.join(root, name, "examples", "protoarc-xk04-sorftime-output.md")));
  check(`${name} removed manual csv example filename`, !exists(path.join(root, name, "examples", "manual-csv-output.md")));
  check(`${name} removed manual text example filename`, !exists(path.join(root, name, "examples", "manual-text-output.md")));
  check(`${name} structured header matches fixed header`, exampleHeaderMatches(name, "structured-output.md"));
  check(`${name} tabular header matches fixed header`, exampleHeaderMatches(name, "tabular-output.md"));
  check(`${name} textual example uses clue format`, clueExampleFormat(name));
  check(`${name} structured example has real rows`, realRows(path.join(root, name, "examples", "structured-output.md")) >= 2);
}

const structuredFirstRows = exampleSkills.map((name) => firstDataRow(path.join(root, name, "examples", "structured-output.md"))).filter(Boolean);
check("structured example first rows are skill-specific", new Set(structuredFirstRows).size === structuredFirstRows.length);
check("examples avoid v2.0 placeholder data row", !docsContent.includes("便携输入 | 蓝牙连接 | Review 30 条 | 移动办公 | 判断级"));

for (const file of sharedExamples) {
  check(`shared example ${file} exists`, exists(path.join(shared, "examples", file)));
}
for (const file of ["real-asin-regression.md", "manual-csv-regression.md", "manual-text-regression.md", "mixed-source-regression.md"]) {
  check(`legacy shared example ${file} absent`, !exists(path.join(shared, "examples", file)));
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
  "ProtoArc",
  "XK04",
  "B0D9PT9884",
  "折叠键盘",
  "便携支架",
  "portable laptop stand",
  "foldable keyboard",
  "travel keyboard",
  "蓝牙",
  "铰链",
  "配对失败",
  "iPad",
  "iPhone",
  "咖啡店",
  "酒店",
  "机场",
  "电脑包",
  "13 寸笔记本",
];
check("no sensitive product details", sensitiveTerms.every((term) => !docsContent.includes(term)));

const decisionStructured = safeRead(path.join(root, "taosecho-etl-dev-decision", "examples", "structured-output.md"));
check("dev-decision structured scores are 0-2", decisionScoresAreValid(decisionStructured));
check("dev-decision structured actions are valid", decisionActionsAreValid(decisionStructured));
check("dev-decision structured has total score", decisionStructured.includes("总分"));

const reportDir = path.join(root, "taosecho-etl-report");
const reportRefs = [
  "decision-summary.md",
  "report-templates.md",
  "format-detection.md",
  "chapter-templates.md",
];
const reportExamples = [
  "brief-output.md",
  "standard-output.md",
  "full-output.md",
  "trigger-tests.md",
];
check("report skill exists", exists(reportDir));
check("report SKILL.md exists", exists(path.join(reportDir, "SKILL.md")));
const reportSkillContent = safeRead(path.join(reportDir, "SKILL.md"));
check("report version is 2.2.2", versionOf(reportSkillContent) === "2.2.2");
for (const ref of reportRefs) {
  check(`report ${ref} exists`, exists(path.join(reportDir, "references", ref)));
}
for (const ex of reportExamples) {
  check(`report ${ex} exists`, exists(path.join(reportDir, "examples", ex)));
}
check("report states Markdown as guaranteed output", reportSkillContent.includes("默认输出 Markdown") && reportSkillContent.includes("tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md"));
check("report reads state.md only", reportSkillContent.includes("只读取 state.md") && reportSkillContent.includes("analysis_history"));
check("report uses host-neutral question flow", reportSkillContent.includes("host-neutral 自然语言"));
check("report does not hard-depend on make-pdf", !/必须.*make-pdf|requires.*make-pdf|depends on make-pdf/.test(reportSkillContent));
check("report does not hard-depend on docx", !/必须.*\bdocx\b|requires.*\bdocx\b/.test(reportSkillContent));
check("report does not hard-depend on markdown-to-html", !/必须.*markdown-to-html|requires.*markdown-to-html/.test(reportSkillContent));
check("report does not auto-fetch data", !/主动.*调|主动.*拉取|automatically.*fetch/.test(reportSkillContent));

const decisionSummaryContent = safeRead(path.join(reportDir, "references", "decision-summary.md"));
check("decision-summary has required blocks", ["基本信息", "阶段判断", "六维评分", "接下来做什么", "不能忽视的风险"].every((token) => decisionSummaryContent.includes(token)));
check("decision-summary forbids vague words", ["建议", "也许", "可能", "应该"].every((token) => decisionSummaryContent.includes(token)));
check("decision-summary requires data points", decisionSummaryContent.includes("数据点") && decisionSummaryContent.includes("Review N 条"));

const templatesContent = safeRead(path.join(reportDir, "references", "report-templates.md"));
check("report templates include brief mode", templatesContent.includes("brief 模式"));
check("report templates include standard mode", templatesContent.includes("standard 模式"));
check("report templates include full mode", templatesContent.includes("full 模式"));

const formatDetectionContent = safeRead(path.join(reportDir, "references", "format-detection.md"));
check("format detection keeps conversions optional", formatDetectionContent.includes("探测") && formatDetectionContent.includes("询问用户"));
check("format detection names markdown output", formatDetectionContent.includes("Markdown：`{mode}-report-{YYYYMMDD}.md`"));

const chapterTemplatesContent = safeRead(path.join(reportDir, "references", "chapter-templates.md"));
check("chapter templates map all analysis chapters", ["buy-reason", "usage-scene", "buy-concern", "competitor-opportunity", "product-definition", "risk-check", "validation-plan", "page-trust", "ops-feedback", "dev-decision"].every((token) => chapterTemplatesContent.includes(token)));
check("chapter templates include unfinished placeholder", chapterTemplatesContent.includes("该项分析未完成") && chapterTemplatesContent.includes("建议数据"));

const reportContentAll = exists(reportDir)
  ? walk(reportDir).filter((file) => file.endsWith(".md")).map(read).join("\n")
  : "";
check("report content has no sensitive product details", sensitiveTerms.every((term) => !reportContentAll.includes(term)));
check("report examples use placeholders", reportContentAll.includes("SAMPLE_ASIN_") && reportContentAll.includes("Sample Product"));
const briefExample = safeRead(path.join(reportDir, "examples", "brief-output.md"));
check("brief example has 0-2 integer scores", /\|\s*[012]\s*\|/.test(briefExample));
check("brief example includes valid action words", /推进|补证据|暂缓/.test(briefExample));
check("brief example has decision summary blocks", ["基本信息", "阶段判断", "接下来做什么", "不能忽视的风险"].every((token) => briefExample.includes(token)));

for (const file of contentFiles.filter((file) => file.endsWith(".md"))) {
  const text = read(file);
  const rel = path.relative(root, file);
  check(`${rel} has no stale v2.0 source types`, !/(manual_csv|manual_text|manual_ocr|source\.type:\s*sorftime|source\.type\s*=\s*"sorftime")/.test(text));
}

check("no v1 taosecho shared paths in etl content", !docsContent.includes("../taosecho-shared/references/"));
check("no v1 data-intake reference in etl content", !docsContent.includes("taosecho-data-intake"));
check("no stale portable stand examples", !docsContent.includes("portable laptop stand") && !docsContent.includes("便携支架"));

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

function versionOf(text) {
  const match = text.match(/^version:\s*(.+)$/m);
  return match ? match[1].trim() : "";
}

function fixedHeader(text) {
  const idx = text.indexOf("## 固定表头");
  if (idx < 0) return "";
  const after = text.slice(idx);
  const match = after.match(/```text\s*\n([^\n]+)\n```/);
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
  const actual = firstMarkdownHeader(read(outputFile));
  return normalizeHeader(actual) === normalizeHeader(expected);
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
  const file = path.join(root, name, "examples", "textual-output.md");
  const text = safeRead(file);
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
