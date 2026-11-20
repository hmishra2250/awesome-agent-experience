# Evaluating agent experience

**In one line:** to find out whether agents can really complete tasks through your product, run real tasks several times, grade the end state rather than the agent's own report, and record everything about the setup that could move the score.

Last reviewed: 2026-11-20

## What it is

Evaluating AX means measuring whether an agent can discover, understand, use and recover through *your* surfaces: your docs, API, CLI, MCP server, website or checkout. This is different from model evaluation. Public benchmarks hold the environment fixed and vary the model; a product AX evaluation holds a set of agents fixed and varies your surface, before and after a change.

The basic vocabulary, as used in practitioner guides such as Anthropic's [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), is: a **task** (instruction plus success criteria), a **trial** (one run of it), a **grader** (code, model or human), a **transcript** (the full trajectory) and a **harness** (the code that runs the agent and environment). Two reliability measures recur: **pass@k**, the chance that at least one of k trials succeeds (can it be done at all?), and **pass^k**, the chance that all k succeed (can it be relied on every time?). Vercel's November 2026 [essay on agent evals](https://vercel.com/blog/agent-evals) illustrates the difference with a worked example in which an agent scores 99 per cent pass@5 but 8 per cent pass^5 on the same task (vendor material).

## Why it matters for agents

Agents fail in ways that ordinary monitoring does not show. A request can succeed at the HTTP level while the outcome is wrong (an order placed for the wrong item), and an agent can report that it finished when it did not. Without repeated, outcome-graded runs, a team cannot tell whether a docs rewrite, a new tool description or a schema change helped, hurt or did nothing. Readiness scanners do not fill this gap: none of those in the curated list has published evidence that its score predicts task success (see [Readiness scoring](readiness-scoring.md)).

## Current state

As of 2026-11-20 the literature has moved from "which model scores highest" to "what is this score measuring".

**The set-up moves results as much as the model.** Anthropic reports that resource enforcement alone produced a 6 percentage point gap on Terminal-Bench 2.0 between its most and least resourced configurations, with the same model and harness ([Infrastructure noise in agentic coding evals](https://www.anthropic.com/research/infrastructure-noise), February 2026) (vendor material). A component-level study across four models finds that planning, action space and context management each change results, with planning acting as an accuracy aid for weaker models and a cost saver for stronger ones ([arXiv 2609.20804](https://arxiv.org/abs/2609.20804)) (study). A position paper argues that harness choice often outweighs model choice and proposes a harness disclosure standard ([arXiv 2605.23950](https://arxiv.org/abs/2605.23950)) (opinion).

**Single runs are noisy.** Across 60,000 SWE-Bench Verified trajectories, single-run pass@1 estimates varied by 2.2 to 6.0 points depending on which run was chosen, even at temperature zero ([On Randomness in Agentic Evals, arXiv 2602.07150](https://arxiv.org/abs/2602.07150)) (study). The curated list's validity audit reports an 18.9 point spread from repeating one benchmark's own set-up 23 times ([arXiv 2607.02577](https://arxiv.org/abs/2607.02577)).

**Declared completion is not verified completion.** WebPageBench verifies tasks from the interface's own event log and reports a gap of up to 41 points between what agents declare finished and what the log confirms ([arXiv 2609.35026](https://arxiv.org/abs/2609.35026)). BreakingWeb scores on backend state and attributes 75 per cent of agent failures to "belief failures", where the agent declares success although the required change was never made ([arXiv 2609.35814](https://arxiv.org/abs/2609.35814)). Both use self-hosted sites.

**Reliability is reported beyond one number.** A twelve-metric profile over consistency, robustness, predictability and safety (accepted at ICML 2026) finds that recent capability gains brought only small reliability improvements ([arXiv 2602.16666](https://arxiv.org/abs/2602.16666)). The Holistic Agent Leaderboard paper ties scaffold, cost and log inspection together and surfaced behaviours such as agents searching for the benchmark instead of solving the task ([arXiv 2510.11977](https://arxiv.org/abs/2510.11977)).

**Product-owned tooling exists, mostly vendor-run.** [Harbor](https://github.com/harbor-framework/harbor) (from the Terminal-Bench authors) runs arbitrary agents in containers and lets teams package their own tasks. Microsoft's [Scope](https://github.com/microsoft/scope) is a research-preview platform for evaluating how agents use a product against reusable criteria, paired with the [AX Practitioner Playbook](https://microsoft.github.io/agent-experience/playbook/). The [MCP conformance framework](https://github.com/modelcontextprotocol/conformance) tests protocol behaviour per specification revision, which is a different question from task success.

**Security evaluation has its own bar.** [AgentDojo](https://arxiv.org/abs/2406.13352) (97 tasks, 629 security test cases) is a shared baseline for prompt injection. [The Attacker Moves Second](https://arxiv.org/abs/2510.09023) bypassed 12 published defences, most of which had reported near-zero attack success, which makes adaptive attacks the expected test (study).

## What the evidence supports and what is disputed

**Supported.** Multiple trials per task, outcome-based grading against real state, and full disclosure of harness, resources and versions. These recommendations appear independently in academic audits, a peer-reviewed reliability paper and vendor method essays.

**LLM judges: useful, with limits.** Online-Mind2Web reports that its LLM judge reached about 85 per cent agreement with human judgement ([arXiv 2504.01382](https://arxiv.org/abs/2504.01382)). A NeurIPS 2026 workshop paper shows that a judge which sees only the request and final reply can appear to detect silent faults it cannot see; the same model asked to check each step flagged every injected fault of those types and none of 100 clean runs on its testbed ([trajectory-judge, arXiv 2609.00038](https://arxiv.org/abs/2609.00038)) (study, single synthetic testbed). Agent-as-a-Judge proposes giving the judge agentic access to intermediate steps ([arXiv 2410.10934](https://arxiv.org/abs/2410.10934)). The practical reading: prefer deterministic state checks, use judges for criteria that cannot be checked in code, give them the trajectory, and calibrate them against human labels.

**Disputed.** How far results on synthetic or self-hosted sites transfer to production front ends; whether static scans of skills, docs or sites predict live task lift; and how much trajectory-level LLM grading can be trusted without per-task calibration.

## Building your own task suite

1. **Start from workflows, not features.** Pick five to fifteen tasks real users delegate to agents, written the way they would phrase them, including constraints (budget, deadline, permissions).
2. **Write success as checkable end state.** "An order exists with item X, total under Y, pickup before Z" beats "the agent says it ordered". Add pass, fail and skip conditions for anything a judge must decide, as in Microsoft's [Building AX evals that actually work](https://developer.microsoft.com/blog/building-ax-evals-that-actually-work/).
3. **Choose a tier.** Vercel's pyramid separates deterministic tests (no model call), one-turn evals (does the agent pick the right command?) and end-to-end evals (does the whole task succeed?). Use the cheapest tier that can catch the failure.
4. **Fix the agents and record their versions.** Use a small panel of the agents your users actually use, with model, harness, tool set and resource limits pinned.
5. **Run each task several times** and report pass@k, pass^k, cost and steps, plus the worst run.
6. **Classify failures**: could not find, misread, chose the wrong tool, could not act, could not recover, reported falsely.
7. **Change one thing and rerun.** Keep the suite as a regression gate in CI.

## Practical checklist

1. Every reported score names the task set version, agent, model, harness, resource limits and date.
2. Each task runs at least several times; single-run numbers are labelled as such.
3. Success is graded on backend or interface state wherever possible.
4. Any LLM judge sees the trajectory, has written criteria, and has been checked against a sample of human labels.
5. Your surface returns explicit, checkable confirmations of state changes, so both agents and graders can verify them.
6. Transcripts are stored and sampled for review, not only scores.
7. Security claims are tested with adaptive attacks, not only a fixed set of injection strings.
8. Protocol conformance (for example MCP) is tested separately from task success.

## Common mistakes

- Quoting a public leaderboard number without its harness, version or spread.
- Treating an agent's "done" as success.
- Comparing before and after runs that used different models, harnesses or container limits.
- Using a readiness score as a proxy for task success.
- Running evaluations once at launch and never again as models change.

## Sources and further reading

- Curated list section: [Evaluation](../../../README.md#evaluation), including benchmarks (WebArena, τ-bench, τ²-Bench, OSWorld, MCP-Atlas), tooling (Inspect Evals, METR Task Standard, Langfuse) and validity work ([Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825), [Protocol Validity](https://arxiv.org/abs/2607.22368), [Double Measurement Confound](https://arxiv.org/abs/2609.09218))
- Further reading (same maintainer): [Evaluating agent workflows](https://agentexperience.tech/insights/evaluating-agent-workflows/), [Build a reliable agent evaluation loop](https://agentexperience.tech/insights/build-a-reliable-agent-evaluation-loop/), [Measure agent experience](https://agentexperience.tech/insights/measure-agent-experience/)

## Related pages

- [Readiness scoring](readiness-scoring.md)
- [Agent analytics and observability](agent-analytics-and-observability.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [Tool design](tool-design.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Learning path](../learning-path.md)
