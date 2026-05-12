# Harness Engineering

Reference version: 0.5.3

Use this reference when the user asks what a harness is, what Harness Engineering means, why setup comes before execution, or how this skill relates to normal planning.

## Definition

Harness Engineering is the design of the operating frame that lets an AI task run reliably across time, tools, verification, recovery, and handoff.

It treats the model as one component inside a task system. The harness supplies the surrounding machinery:

- context supply: what to read, load, summarize, or defer
- tool scope: which tools are available and how results are used
- task state: where phase, decisions, risks, and next actions live
- verification gates: how progress is proven with evidence
- recovery path: how the task resumes after interruption or failure
- handoff protocol: what another agent or user needs to continue safely

## Boundary

Harness Setup creates the frame. The executing agent runs the task inside that frame.

A plan lists intended steps. A harness also defines the operating state, evidence gates, resume path, authority files, failure actions, and closeout rule.

The setup phase should stop after Phase 0: state file created or updated, activation decision recorded, verification gates written, and next action made explicit.

## Depth

- Lightweight: clear task, low risk, one verification path.
- Standard: multi-step task, multiple files or tools, meaningful user-facing output.
- Production: autonomous or high-risk workflow with lifecycle, permissions, evaluator, and recovery requirements.

Choose the smallest depth that gives the task enough continuity, verification, and recovery.

## Standard Explanation

When asked to explain this skill, answer in this shape:

```text
Harness Setup builds the operating frame for a task before execution starts. It records context, state, tools, verification gates, recovery, and handoff so the work can continue reliably across long runs or multiple agents. Setup ends after the frame is ready; the executing agent then performs the actual task inside that frame.
```

