# Documentation for agents

**In one line:** Documentation for agents is the text an agent holds at the moment it commits to an action, so it has to be cheap to find, loaded at the right moment, kept true as the product changes, and tested in runs rather than assumed to help.

Last reviewed: 2026-11-20

## What it is

"Our docs" covers several artefacts, and each one has a different reader and a different budget:

- **Repository instruction files** such as [AGENTS.md](https://agents.md/) and CLAUDE.md, read at the start of every coding-agent session.
- **Skills**: a `SKILL.md` file plus optional references and scripts, defined by the [Agent Skills specification](https://agentskills.io/specification) and loaded on demand.
- **Site indexes and Markdown pages**: an [llms.txt](https://llmstxt.org/) map and Markdown versions of pages, often served through [content negotiation](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/).
- **API references and tool descriptions**: OpenAPI documents, MCP tool metadata and server instructions, which a harness may pass to the model in a narrower form than a person sees.

Four concerns run across all of them.

1. **Progressive disclosure.** The agent first sees a short description and loads the full material only if it decides to. The Agent Skills model has three layers: name and description at start-up, the `SKILL.md` body when the skill is relevant, and linked files when they are needed. Anthropic's [skill authoring guide](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (vendor material) recommends keeping the body under 500 lines, keeping references one level deep and adding a table of contents to long reference files, because nested files may only be partly read.
2. **Instruction files** should hold only what an agent cannot work out for itself: exact commands, hazards, boundaries and house rules.
3. **Keeping instructions true.** Every package, path, command, tool and URL named in agent-facing text is a claim that can go stale.
4. **Measuring whether docs help** means comparing runs with and without them, and looking beyond final success.

## Why it matters for agents

An agent arrives with no memory of last quarter's migration and no colleague to ask. It reads in fragments, often from URLs it remembers or guesses, and it acts on what it reads with confidence. A missing fact costs a few extra fetches. A wrong fact gets followed.

Agents are also a large share of documentation readers, although the figure depends on who is counting. Fern reports that agents make more than half of requests to the documentation it hosts and that 93 per cent of agent requests go to Markdown ([State of Docs](https://buildwithfern.com/post/state-of-docs), November 2026, vendor material). Fern counts an agent request by route (Markdown and llms.txt), so the figure depends on that rule. Coding-session traces give a different picture. In [a study of 557 sessions and 33,097 agentic pull requests](https://arxiv.org/abs/2608.20195) (study, preprint), instruction files and working notes made up 60.5 per cent of documentation interactions, against 1.3 per cent for API references. Check your own logs (see [agent analytics and observability](agent-analytics-and-observability.md)).

## Current state

- **Instruction files are common.** A [census of 22,854 active GitHub repositories](https://arxiv.org/abs/2610.31715) (study, preprint, October 2026) found AGENTS.md or CLAUDE.md in 26.3 per cent of them and in 59.6 per cent of the most-starred. In that census, 74.0 per cent of directives gave no reason, a third carried a generator signature or shared text, and four in five were edited after creation.
- **Skill quality is uneven.** [A study of SKILL.md files](https://arxiv.org/abs/2607.01456) (study, preprint) built a smell detector from published authoring advice and found at least one smell in over 99 per cent of the real-world skills it scanned. Once introduced, smells were rarely removed.
- **Skills can now be served by MCP servers.** As of 2026-11-20 the [Skills over MCP extension](https://modelcontextprotocol.io/extensions/skills/overview) page states that SEP-2640 is Final and that SDK and host support is still being implemented. Servers list skills with content digests. Reading a `SKILL.md` through `resources/read` does not activate it: the host verifies the content and applies any approval first (specification).
- **Indexes reduce wasted fetches.** Mintlify's open [Docs URL Discovery Bench](https://github.com/mintlify/docs-url-discovery-bench) (vendor material) reports that, across 20 Mintlify-hosted sites, serving an llms.txt index removed roughly 90 per cent or more of 404s compared with raw HTML. It attributes the gain to the index rather than to Markdown.
- **Valid API specifications can still fail agents.** An [industrial case study](https://arxiv.org/abs/2605.14312) (study) found 2,450 documentation and REST smells across 600 structurally valid production endpoints.

## What the evidence supports and what is disputed

**Supported, mostly by preprints:**

- **Agents follow stale instructions.** In [When Instruction Files Go Stale](https://arxiv.org/abs/2611.09802) (study, preprint, 732 trajectories), agents followed stale guidance that was relevant to the task, sometimes even when correct information was available elsewhere. They usually recovered from the immediate failure, but none repaired the instruction file. Correcting the file eliminated operations on obsolete paths. The cost showed up in tool calls, not success rates.
- **Adherence is uneven.** [Do They Do as They Are Told?](https://arxiv.org/abs/2611.13709) (study, preprint) found that agents followed context-file instructions more often than not. The split was sharp, though: some instruction categories were followed consistently and others were never respected, and results differed by agent.
- **Skill descriptions decide activation.** The [Agent Skills guide to optimising descriptions](https://agentskills.io/skill-creation/optimizing-descriptions) (specification project guidance) says the description carries the whole burden of triggering. It suggests testing with about 20 labelled queries, split between prompts that should trigger the skill and prompts that should not.

**Disputed:**

- **Whether context files raise task success.** The [ETH evaluation of AGENTS.md](https://arxiv.org/abs/2602.11988) (study, preprint) found no general success gain and over 20 per cent added inference cost. A [two-agent ablation at REALM 2026](https://aclanthology.org/2026.realm-1.5/) (study, workshop paper) found that context strategy did not measurably move correctness, bounded the effect at 10 to 15 points or less, and traced failures to implementation skill rather than missing repository knowledge. Its authors suggest that task difficulty varies by agent, which may explain why earlier single-agent studies disagree.
- **Whether skills help.** On [WebDev-Skills-Bench](https://arxiv.org/abs/2608.23067) (study, preprint), injecting a matched skill lowered mean Pass@2 by 1.3 to 4.2 per cent and raised token cost by 72 to 394 per cent across four models. Gains appeared in only 17 to 36 per cent of skill and project pairs. Vercel's evaluation found that an always-present index in AGENTS.md outperformed on-demand skills ([vendor material](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)).
- **Whether better prose helps when code is visible.** With source present, neither compact documentation nor retrieved context beat the issue text alone in [Compact Documentation for Coding Agents](https://arxiv.org/abs/2609.31587) (study, preprint).
- **Common advice is untested.** The trace study above found no consistent behavioural support for actionability and verifiability, two properties usually called agent-friendly.

Almost all of this evidence concerns coding agents. Whether it transfers to browsing or commerce agents has not been measured.

## Practical checklist

1. Every documentation page is reachable as Markdown at a stable URL, and each page points to the site index. Check by fetching a page with `Accept: text/markdown`.
2. Each section makes sense on its own: purpose, preconditions, inputs, the shape of success, named failure modes and the nearest alternative appear without a second fetch.
3. The instruction file holds only what cannot be inferred, such as exact build and test commands, hazards and boundaries, and each rule states its reason.
4. A CI job resolves every package, path, command, flag, tool name and URL named in AGENTS.md, skills, llms.txt and server instructions, and fails the build when one does not resolve.
5. Each agent-facing file has a named owner, and it is reviewed in the same pull request that changes anything it names.
6. Each skill has a description that says when to use it and a trigger test set with both positive and negative queries.
7. Every API parameter has a type, a description and an example, and every error code states its cause and a fix the agent can carry out with the tools it has (see [tool design](tool-design.md)).
8. Documentation changes are evaluated by running the same tasks with and without them, several times each, and recording tool calls, tokens and operations on obsolete paths as well as success (see [evaluating agent experience](evaluating-agent-experience.md)).

## Common mistakes

- Treating llms.txt as a contract. [Ahrefs](https://ahrefs.com/blog/llmstxt-study) (vendor material) found that 97 per cent of published llms.txt files received no requests in May 2026.
- Assuming a skill helps because it matches the task, without a length-matched control.
- Leaving generated instruction-file boilerplate unedited, or writing rules with no reason.
- Measuring only final success, which hides the cost that stale instructions add to every session.
- Citing a vendor traffic headline as evidence that the documentation works.

## Sources and further reading

- Curated list: [Documentation for agents](../../../README.md#documentation-for-agents) and [Readiness instruments](../../../README.md#readiness-instruments).
- [Agent-Friendly Documentation Spec](https://agentdocsspec.com/) (specification with a checker; no evidence yet links its score to task success) and [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) (vendor material).
- Further reading (same maintainer): [Write agent-readable documentation](https://agentexperience.tech/insights/make-documentation-legible/) and [Keep agent instructions true](https://agentexperience.tech/insights/keep-agent-instructions-true/).

## Related pages

- [AGENTS.md](../standards/agents-md.md), [Agent Skills](../standards/agent-skills.md), [llms.txt](../standards/llms-txt.md) and [Markdown content negotiation](../standards/markdown-content-negotiation.md)
- [Context engineering](context-engineering.md)
- [Tool design](tool-design.md) and [tool selection at scale](tool-selection-at-scale.md)
- [Security for agent surfaces](security-for-agent-surfaces.md), since a skill or instruction file is also a supply-chain input
- [Readiness scoring](readiness-scoring.md)
- [Glossary](../glossary.md)
