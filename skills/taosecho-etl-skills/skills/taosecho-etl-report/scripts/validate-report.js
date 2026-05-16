#!/usr/bin/env node
const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-report.js <report.md>");
  process.exit(2);
}

const text = fs.readFileSync(file, "utf8");
const errors = [];

for (const heading of ["# ", "## 1. 决策摘要", "## 2. 数据基础"]) {
  if (!text.includes(heading)) errors.push(`missing required heading: ${heading}`);
}

if (!/SAMPLE_ASIN_|产品 ID|Product ID/.test(text)) {
  errors.push("missing product identifier block");
}

if (!/证据等级|evidence\.level|判断等级/.test(text)) {
  errors.push("missing evidence level");
}

if (!/接下来做什么|下一步|动作/.test(text)) {
  errors.push("missing next action");
}

const realAsin = text.match(/\bB0[A-Z0-9]{8}\b/);
if (realAsin) {
  errors.push(`blocked real ASIN-like identifier: ${realAsin[0]}`);
}

if (errors.length) {
  console.error("report validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("report validation passed");
