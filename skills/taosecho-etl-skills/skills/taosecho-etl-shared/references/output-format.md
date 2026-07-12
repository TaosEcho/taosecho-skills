# Output Format

## Analysis Output

```text
结论：
数据表：
关键依据：
未解决：
当前下一步：
```

`当前下一步` 至多一个动作。它是 worker 候选；入口复核后写入 `workflow.next_action`。

## Clue-Level Output

```text
信号观察：
证据缺口：
建议补数：
当前下一步：
```

## Normalize Output

默认回执：

```text
数据已接收（{判断等级}，{来源形态}）。开始分析...
```

需要展开时：

```text
数据覆盖：
关键限制：
当前下一步：
```

数据覆盖表头：

```text
数据项 | 目标量 | 已获取 | 来源形态 | 判断等级
```

## Decision Output

```text
阶段判断：
决策表：
主要风险：
证据缺口：
当前下一步：
```

## Worker State Writeback

每个 worker 同时写回：

```yaml
workflow:
  latest_result:
    skill: "{skill}"
    level: "{判断等级}"
    key_findings: ["{关键发现}"]
    signals: ["{稳定信号}"]
    unresolved: ["{未解决项}"]
    evidence_refs: ["{state.md 字段或分析记录}"]
    suggested_next: "{至多一个候选 skill}" # 可为空
    completion:
      criterion_met: true | false
      note: "{完成或阻塞说明}"
```

并向 `analysis_history.completed_skills` 追加一条审计记录。worker 不写多项队列。

## Completion Failure

完成条件未满足时：

- `criterion_met=false`；
- `unresolved` 写明阻塞项；
- 用户输出说明证据边界；
- 当前下一步选择补数、验证或停止，不伪造完整结论。

## Brief Mode

当 `workflow.response_mode=brief` 时，前 3 行先给主结论、证据等级和当前动作。表格仅在用户要求或结论需要时展开。
