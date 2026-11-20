# Agent Skills (SKILL.md)

**In one line:** an open format for packaging task instructions, scripts and reference files in a folder built around a `SKILL.md` file, which an agent loads only when its short description matches the task.

**Last reviewed:** 2026-11-20

## What it is

A skill is a directory that contains, at minimum, a `SKILL.md` file. According to the [Agent Skills specification](https://agentskills.io/specification), that file starts with YAML frontmatter and is followed by free-form Markdown instructions (specification):

- `name` (required): up to 64 characters, lower-case letters, digits and hyphens, matching the directory name.
- `description` (required): up to 1,024 characters, saying what the skill does and when to use it.
- Optional `license`, `compatibility`, `metadata`, and an experimental `allowed-tools` field listing pre-approved tools.

Optional `scripts/`, `references/` and `assets/` directories hold code, longer documentation and templates.

Skills rely on **progressive disclosure**. At start-up an agent loads only each skill's name and description (the specification estimates about 100 tokens). When a task matches, it reads the full `SKILL.md`, which the specification recommends keeping under 5,000 tokens and 500 lines. Referenced files load only when needed, and references should stay one level deep from `SKILL.md`.

In short, skills teach an agent a procedure, while [MCP](mcp.md) connects it to a system. The two now meet: the official [Skills over MCP extension](https://modelcontextprotocol.io/extensions/skills/overview) lets an MCP server publish skills next to the service they describe.

## Why it matters for agents

For a product team, a skill is a way to ship "how to use us correctly" knowledge to whatever agent your users run. For the agent, the description is the whole decision: if it does not say clearly when the skill applies, the skill is never loaded, and if it is too broad, the skill loads when it should not and crowds the context. A skill description is a [tool description](../concepts/tool-design.md) in all but name, with the same [selection problems at scale](../concepts/tool-selection-at-scale.md).

## Current state

As of 2026-11-20, checked against the live specification and project pages:

- **Steward.** The format was developed by Anthropic and released as an open standard. On [22 October 2026](https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects) the Agentic AI Foundation announced Agent Skills as a hosted project contributed by Anthropic.
- **Version.** The specification at [agentskills.io](https://agentskills.io/specification) carries no version number. The `skills-ref` reference library validates frontmatter and naming.
- **MCP distribution.** In the MCP extension, SEP-2640 is marked Final and the extension stage is Beta (per the [extensions overview](https://modelcontextprotocol.io/docs/extensions/overview)). Servers list skills with a complete file manifest including SHA-256 digests and sizes. Hosts must verify content against the manifest, bind persisted approval to that exact manifest, prevent same-name skills from silently replacing each other, and treat skill content as untrusted input (specification).
- **Packaging and discovery.** The [Agent Plugins specification 1.0.0](https://agent-plugins.org/specification) packages skills together with MCP servers. A [discovery RFC from Cloudflare](https://github.com/cloudflare/agent-skills-discovery-rfc) proposes a well-known location for skills on a website; it is a proposal, not an adopted standard.
- **Adoption evidence.** The specification repository and showcase list many supporting clients, and marketplaces hold tens of thousands of skills: one security study collected 42,447 from two marketplaces ([arXiv 2601.10338](https://arxiv.org/abs/2601.10338)). Listing counts say nothing about quality or use.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Curated, focused skills can help.* Across 87 tasks and 18 model and harness configurations, curated skills raised the average pass rate from 33.9 to 50.5 per cent, and focused skills with at most three modules outperformed larger bundles ([SkillsBench, arXiv 2602.12670](https://arxiv.org/abs/2602.12670), study).
- *Matched skills can also hurt.* In a web development benchmark with length-matched controls, injecting the matching public skill lowered mean pass rates by 1.3 to 4.2 per cent and raised token cost by 72 to 394 per cent across four models, with gains in only a minority of skill and project pairs ([arXiv 2608.23067](https://arxiv.org/abs/2608.23067), study).
- *Libraries degrade through wrong selection.* Expanding a skill library caused failures largely through skill shadowing, where the wrong skill wins ([arXiv 2605.24050](https://arxiv.org/abs/2605.24050), study).
- *Most real skills break authoring guidance.* An automated detector found at least one "skill smell" in over 99 per cent of the files it examined, and smells rarely disappeared as skills evolved ([arXiv 2607.01456](https://arxiv.org/abs/2607.01456), study).
- *Skills are a supply-chain risk.* Of 31,132 marketplace skills analysed, 26.1 per cent contained at least one vulnerability pattern, and skills bundling scripts had roughly twice the odds of a vulnerability compared with instruction-only skills ([arXiv 2601.10338](https://arxiv.org/abs/2601.10338), study).

**Disputed or unsettled:**

- *Do skills improve task success?* SkillsBench and the web development benchmark point in opposite directions. The difference may come from curation, task type and controls, which suggests treating each skill as a hypothesis for a particular model and project rather than a portable asset.
- *Skills versus always-present context.* A vendor eval found an index in AGENTS.md beat an on-demand skill that was often not invoked ([Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals), vendor material). Whether that holds outside broad framework knowledge is open.
- *Discovery on the open web.* No discovery mechanism for skills published by websites has been adopted.

## Practical checklist

1. Validate frontmatter with `skills-ref` and keep `name` identical to the directory name.
2. Write the description as an instruction to the agent ("Use this skill when ..."), naming user intents and near-miss cases it does not cover, within 1,024 characters.
3. Build a trigger eval of about 20 realistic queries, half that should trigger and half near misses that should not, run each several times, and keep a held-out validation set, as the [description optimisation guide](https://agentskills.io/skill-creation/optimizing-descriptions) recommends.
4. Keep `SKILL.md` under 500 lines; move detail into reference files linked directly from it.
5. Give one job per skill, and prefer short anti-pattern rules over long worked examples where you can test both.
6. Measure task outcomes with and without the skill, with a length-matched control, on every model you support.
7. Use fully qualified tool names when a skill refers to MCP tools, as the [skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) advise (vendor material).
8. Review bundled scripts as you would any dependency, pin versions, and avoid instructions that fetch and run remote code.
9. If you serve skills over MCP, publish complete manifests with digests so hosts can bind approval to exact content.

## Common mistakes

- One-line descriptions such as "Helps with documents", which never trigger reliably.
- Very broad skills that load on unrelated tasks and add cost.
- Putting facts every session needs in a skill the agent may not load.
- Deep chains of references that agents read only partly.
- Installing third-party skills without reading the scripts they bundle.
- Assuming a skill that helped one model helps another.

## Sources and further reading

- [Agent Skills specification](https://agentskills.io/specification) and [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions) (specification and official guide)
- [Skills over MCP](https://modelcontextprotocol.io/extensions/skills/overview) (official MCP extension, Beta)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (vendor material)
- [Agent Plugins Specification 1.0.0](https://agent-plugins.org/specification) and [Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc)
- [SkillsBench](https://arxiv.org/abs/2602.12670), [Signal or Noise?](https://arxiv.org/abs/2608.23067), [From Anatomy to Smells](https://arxiv.org/abs/2607.01456) and [Agent Skills in the Wild](https://arxiv.org/abs/2601.10338) (preprints)
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) for breadth (directory, not a review)
- The curated list section [Documentation for agents](../../../README.md#documentation-for-agents)
- Further reading (same maintainer): [Make documentation legible](https://agentexperience.tech/insights/make-documentation-legible/)

## Related pages

- [AGENTS.md](agents-md.md)
- [Model Context Protocol](mcp.md)
- [Documentation for agents](../concepts/documentation-for-agents.md)
- [Context engineering](../concepts/context-engineering.md)
- [Tool selection at scale](../concepts/tool-selection-at-scale.md)
- [Security for agent surfaces](../concepts/security-for-agent-surfaces.md)
- [Standards tracker](../standards-tracker.md)
