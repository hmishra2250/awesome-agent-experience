# Context engineering

**In one line:** Context engineering is deciding what enters an agent's context window, when and at what cost. For a product team it becomes a narrower question: what do your tools, documents and responses put into someone else's agent, and does that help or crowd out the task?

Last reviewed: 2026-11-20

## What it is

Anthropic's [guide to context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (vendor material) treats context as a finite budget. The work is to curate everything the model sees (system prompt, tool definitions, examples, message history, retrieved data) so that the smallest set of useful tokens produces the intended behaviour. Its main techniques are just-in-time retrieval by reference (paths, queries and links instead of preloaded content), compaction of long histories, structured notes the agent keeps outside the window, and sub-agents with their own clean context.

Most of that work happens inside the harness, which a product team usually does not control. The surfaces a product team does control are:

- **The tool catalogue**: names, descriptions and schemas, which many clients load before any work starts.
- **Tool results**: their size, shape and whether they carry a handle for fetching more.
- **Documentation and instruction files**: what is always loaded and what sits behind an index (see [documentation for agents](documentation-for-agents.md)).
- **Resources and memory**: what the agent can read on demand and what persists between sessions.
- **Handoff artefacts**: summaries, tickets and notes passed between agents or from an agent to a person.

## Why it matters for agents

Long context is not free, even when it fits. Chroma's [Context Rot report](https://www.trychroma.com/research/context-rot) (study, vendor-run technical report, July 2025) found that model performance falls as input length grows, often in uneven ways, even on deliberately simple tasks. In long-horizon search, [Xia et al.](https://arxiv.org/abs/2606.29718) (study, preprint) describe premature termination: models give up or return uncertain wrong answers well before the window is full, and this happens more often as context grows.

Length is not the only cost. In a library that grew to 202 skills, [Skill Shadowing](https://arxiv.org/abs/2605.24050) (study, preprint) attributes most of the loss to choosing the wrong skill rather than to context overhead. A crowded catalogue hurts mainly by making choices harder (see [tool selection at scale](tool-selection-at-scale.md)).

The intermediate data a tool returns also counts. Anthropic's [code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp) (vendor material) names two sources of waste: definitions loaded up front, and results passed back through the model on every step. Its worked example falls from 150,000 tokens to 2,000 when the agent loads only the definitions it needs and filters data in code. That figure belongs to Anthropic's scenario, not to workloads in general.

## Current state

The protocol layer now has mechanisms that a surface owner can use directly.

- **Cache-friendly tool lists.** As of 2026-11-20 the [MCP 2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) says servers should return `tools/list` in a deterministic order to support client caching and prompt cache hits. List and read results carry required `ttlMs` and `cacheScope` fields, and list endpoints no longer vary per connection (specification).
- **Deferred loading.** OpenAI's [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) and Anthropic's [tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) let tools stay out of the window until a search returns them, although the two vendors differ in what the model sees beforehand (vendor material).
- **Code mode.** A preregistered study, [Beyond Plain MCP](https://arxiv.org/abs/2611.19123) (study, preprint, open-weight agents only), found that code mode cut token use by 70 to 90 per cent compared with plain MCP. Declaring return shapes in the code stubs swung success by up to 39.5 points for weaker agents, a larger effect than adding a router.
- **Stable action spaces.** The [Manus essay](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) (vendor material, July 2025) treats KV-cache hit rate as a core production metric. It recommends masking tools rather than removing them mid-task, using the file system as external memory and leaving failed actions visible so that the model can adapt.
- **Memory as a surface.** Anthropic's [memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) (vendor material) is client-side and file-shaped. The model requests file operations under a `/memories` prefix and the application decides where they are stored, which makes path restriction the integrator's job.

## What the evidence supports and what is disputed

**Supported, with caveats:**

- **Bounded tool output saves tokens.** Several vendors and the preregistered study above find that keeping intermediate data out of the model and loading only the definitions needed reduces tokens. The size of the saving depends on the workload.
- **Context techniques interact with agent behaviour.** [Same Context, Different Agents](https://arxiv.org/abs/2610.20959) (study, preprint, 1,514 tasks, seven models) found that semantic layers, orchestration and compaction each help the agents whose behaviour they match and can hurt careful "investigator" agents. In that study a semantic layer stopped investigators from looking at the data, orchestration made them overconfident at a cost of 5 points, and compaction made them repeat steps. A summary layer you publish is not neutral.
- **Repeated summarising loses information.** [Agents Cannot Hand Over What They Have Not Yet Understood](https://arxiv.org/abs/2611.18642) (study, preprint) found that a chain of agents passing short notes learned less than one agent keeping its history, with most of the loss coming from repeated compression. Writing each note from the full record recovered 70 to 82 per cent of that loss.
- **Summaries drop usage boundaries.** [Facts Without Rules](https://arxiv.org/abs/2608.29028) (study, preprint) found that handoff summaries keep operational facts and lose the markers that limit how those facts may be used. Vague constraints leaked far more often than explicit ones, and explicit constraints kept leakage under 15 per cent across the three models tested.

**Disputed:**

- **Always present or on demand.** Vercel's [AGENTS.md evaluation](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) (vendor material) favours a small always-present index. The skill benchmarks on the [documentation page](documentation-for-agents.md) show injected material can lower pass rates. Neither settles where the line falls for a given product.
- **Interface choice.** Plain MCP, code mode and bash access each have supporting studies, and results depend heavily on the harness and the model (see [CLI and API design for agents](cli-and-api-design-for-agents.md)).
- **What "context rot" explains.** It is real on controlled tasks, but in catalogue studies selection errors outweigh length effects. Treat it as one cause among several.

None of the preprints above tests a production tool surface directly.

## Practical checklist

1. Measure what your catalogue costs as loaded (names, descriptions and schemas) and what a typical result costs, in tokens, for each tool.
2. Return bounded results by default: pagination, filters, selected fields and a handle or URL for fetching more, rather than whole records.
3. Keep the tool list stable and deterministically ordered within a session. On MCP 2026-07-28, set `ttlMs` and `cacheScope` deliberately.
4. For large catalogues, provide namespaces or a search tool so that clients can defer loading.
5. Publish output schemas or return-shape documentation, so that agents writing code against your tools know what comes back.
6. Put the few facts an agent must never miss in the always-loaded layer, and put large reference material behind an index.
7. Express usage limits (audience, expiry, purpose) as explicit structured fields that can survive summarisation, not as prose caveats.
8. Keep error text short and actionable, and name the tool that resolves the problem (see [recovery and handoffs](recovery-and-handoffs.md)).
9. Test one realistic long task with compaction or a handoff in the loop, and check which of your facts and constraints survive it.

## Common mistakes

- Returning a full object graph or page of HTML when the agent needed three fields.
- Adding or removing tools mid-session, which invalidates caches and can confuse the model.
- Assuming a large context window makes catalogue size irrelevant.
- Publishing a summary layer and assuming it can only help.
- Writing data-handling limits as soft prose that a summariser will drop.
- Treating vendor token-saving figures as a forecast for your own workload.

## Sources and further reading

- Curated list: [Context, memory and handoffs](../../../README.md#context-memory-and-handoffs), [Tool use, tool descriptions and MCP](../../../README.md#tool-use-tool-descriptions-and-mcp) and [Documentation for agents](../../../README.md#documentation-for-agents).
- [Model Context Protocol resources specification](https://modelcontextprotocol.io/specification/2026-07-28/server/resources) (specification).
- [Toollery](https://arxiv.org/abs/2609.22218) (study, preprint) on keeping selection bounded in very large catalogues.
- Further reading (same maintainer): [Preserve context through handoffs](https://agentexperience.tech/insights/preserve-context-through-handoffs/) and [Agent tool catalogues need a pruning strategy](https://agentexperience.tech/insights/agent-tool-catalogs/).

## Related pages

- [Documentation for agents](documentation-for-agents.md)
- [Tool design](tool-design.md) and [tool selection at scale](tool-selection-at-scale.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [MCP](../standards/mcp.md) and [Agent Skills](../standards/agent-skills.md)
- [Agent analytics and observability](agent-analytics-and-observability.md), for recording what context a run actually received
- [Glossary](../glossary.md)
