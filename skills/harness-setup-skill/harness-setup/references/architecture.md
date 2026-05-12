# Production Agent Harness Architecture

Reference version: 0.5.3

Use for agent runtimes, long-running autonomous tasks, multi-tool workflows, or production-grade harness design.

## Core Mental Model

An agent is the behavior users experience. The harness is the machinery that produces that behavior.

Treat the model as one component inside a larger operating system. The harness supplies context, tools, memory, state, permissions, verification, and recovery.

## Component Checklist

| Component | Harness Question |
|---|---|
| Orchestration loop | How does the task cycle assemble input, call the model, execute actions, package results, and terminate? |
| Tools | Which tools are visible now, how are arguments validated, where do permissions apply, and how are results formatted? |
| Memory | Which state is short-term, long-term, user-specific, project-specific, or raw transcript evidence? |
| Context management | What is loaded eagerly, loaded on demand, summarized, masked, or delegated? |
| Prompt construction | What instruction hierarchy controls the model input? |
| Output parsing | What structured formats, schemas, or tool-call protocols are expected? |
| State management | Where do checkpoints, phase state, progress files, and resume data live? |
| Error handling | Which failures get retried, returned to the model, escalated to the user, or logged for repair? |
| Guardrails and safety | What permissions, tripwires, approvals, and destructive-action controls exist? |
| Verification loops | Which tests, linters, screenshots, metrics, citations, or evaluator passes prove progress? |
| Handoff and subagents | What can be delegated, what state crosses boundaries, and how is ownership preserved? |
| Lifecycle management | How does the harness start, pause, resume, reset context, compact state, and close out? |

## Loop Shape

```text
assemble input
-> model inference
-> classify output
-> validate and execute tool calls
-> package results
-> update state and context
-> verify or continue
-> terminate, hand off, or recover
```

Termination conditions should be explicit:

- final answer or artifact produced
- phase exit gate passed
- max turns or budget reached
- verification failed
- guardrail triggered
- user approval needed
- context reset required

## Seven Design Decisions

| Decision | Practical Choice |
|---|---|
| Single vs multi-agent | Maximize one agent first; split when tool overload, domain separation, or evaluation independence requires it. |
| ReAct vs plan-execute | Use ReAct for flexible exploration; use plan-execute for known multi-step workflows. |
| Context strategy | Pick compaction, note-taking, lazy retrieval, observation masking, delegation, or reset. |
| Verification strategy | Pair deterministic checks with semantic review when quality risk is high. |
| Permission model | Choose permissive, approval-based, or restrictive controls based on blast radius. |
| Tool scope | Expose the smallest useful tool set for the current phase. |
| Harness thickness | Add structure where models fail repeatedly; remove structure when the model reliably internalizes the behavior. |

## Scaffolding Principle

Build scaffolding that helps the current model perform the task, and design it so future stronger models can use less of it.

A good harness improves with a stronger model while keeping harness complexity stable or lower.

## State File Additions

For production or long-running harnesses, include these sections in the Harness state file:

```markdown
## Loop Contract

## Tool Scope

## Memory Policy

## Context Policy

## Error Policy

## Permission Policy

## Verification Policy

## Lifecycle
```
