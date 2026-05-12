# Output Format

## Analysis Output

```text
结论：
数据表：
关键依据：
下一步：
```

## Clue-Level Output

```text
信号观察：
证据缺口：
建议补数：
```

## Normalize Output

```text
数据覆盖：
关键限制：
建议先看：
```

When auto-run is enabled, use:

```text
数据覆盖：
关键限制：
已进入分析：
```

Data coverage header:

```text
数据项 | 目标量 | 已获取 | 来源形态 | 判断等级
```

## Decision Output

```text
阶段判断：
决策表：
主要风险：
下一步：
```

## Brief Mode

When `response_mode=brief`, put the main answer first and keep the first block within 3 lines. Tables stay optional unless the user asks for detail.
