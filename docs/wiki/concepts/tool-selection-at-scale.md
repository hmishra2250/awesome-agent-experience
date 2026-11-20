# Tool selection at scale

**In one line:** As an agent gains access to hundreds or thousands of tools, the main risk shifts from a crowded context to picking the wrong neighbour, missing one tool of a needed set, or being steered by metadata someone else wrote.

Last reviewed: 2026-11-20

## What it is

Tool selection at scale is the problem of letting an agent choose well when the catalogue is large: many MCP servers connected to one host, an enterprise gateway in front of thousands of operations, or a skill library that keeps growing. The common responses are:

- **Keep the catalogue small** by retiring unused tools and merging near-duplicates.
- **Namespace** tools by service and resource so neighbours are easy to tell apart.
- **Retrieve** a candidate set per step instead of loading every definition (often called tool search or progressive discovery).
- **Filter by state**, exposing only tools whose preconditions currently hold.
- **Route through a gateway** that searches, authorises and runs tools behind one or two meta-tools.
- **Use code mode**, where the agent writes a short program against typed stubs and only the final output returns to the model.

Two failure modes share the word "shadowing". *Skill shadowing* is an accuracy problem: a plausible but wrong skill or tool is chosen over the right one ([arXiv 2605.24050](https://arxiv.org/abs/2605.24050)). *Tool shadowing* is a security problem: a fake or duplicate tool intercepts calls meant for another, which OWASP lists under tool poisoning ([OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/), beta).

## Why it matters for agents

Every tool definition the agent sees competes for context and for attention. A provider cannot assume its tool will be seen alone: in a real host it sits beside tools from other servers with similar names. Whether the agent reaches your tool can depend on retrieval, ordering and gateway policy that you do not control, which makes distinct names and descriptions a condition of being found at all.

## Current state

As of 2026-11-20, guidance has converged on deferring definitions, with differences in detail.

- **MCP client guidance (specification documentation).** The [client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) page recommends switching to progressive discovery once definitions pass a threshold (it suggests 1% to 5% of the context window), describes keyword, embedding, subagent and hybrid search, and lays out a catalogue, inspect and execute pattern. It warns that adding or removing definitions mid-conversation can invalidate prompt caches, and it recommends that sandboxed code still pass every call through the host's approval policy.
- **MCP specification.** Tool names are unique only within a server, the server `name` SHOULD NOT be relied on for disambiguation, and aggregating clients SHOULD prefix or otherwise disambiguate ([tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)). The 2026-07-28 revision added deterministic `tools/list` ordering and cache hints (`ttlMs`, `cacheScope`) on list results ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). Server-side progressive discovery is a roadmap priority, not yet specified ([roadmap](https://modelcontextprotocol.io/development/roadmap)).
- **Vendor tool search (vendor material).** [OpenAI tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) and the [Anthropic tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) both defer definitions, but they differ in what the model sees before it searches.
- **Gateways and code mode (vendor material).** Anthropic describes presenting MCP servers as a file tree of code APIs, loaded on demand, and notes that this needs a sandbox with resource limits and monitoring ([Code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp)). One enterprise experience report replaces more than 2,000 schemas with a search meta-tool and an execute meta-tool ([arXiv 2608.23992](https://arxiv.org/abs/2608.23992)).

## What the evidence supports and what is disputed

**Wrong selection, more than context overhead (study).** Scaling a library to 202 skills lowered pass rates, and the authors attribute the loss to wrong-skill selection rather than to the extra context ([Skill Shadowing](https://arxiv.org/abs/2605.24050)). On real BFCL failures, one attention study found the model usually attended most to the correct tool and still chose wrongly, and prompt-side repairs such as reordering recovered at most 23% of those failures ([Looking Is Not Picking](https://arxiv.org/abs/2606.16364), preprint). Its effective fixes need model internals, which most providers do not have.

**Filtering and retrieval help (study).** Exposing only tools whose preconditions hold cut token cost by roughly 90% without hurting success on a 100-tool benchmark ([ToolChoiceConfusion](https://arxiv.org/abs/2606.06284)). Intent-query indexing kept online selection bounded over tens of thousands of capabilities ([Toollery](https://arxiv.org/abs/2609.22218)). Enriching sparse documentation improved retrieval ([arXiv 2510.22670](https://arxiv.org/abs/2510.22670)).

**Retrieve the whole set, not one tool (study).** For multi-tool requests, the measure that matters is whether every required tool is in the top k. On AppWorld, tasks with a complete retrieved set succeeded 21 of 21 times and incomplete ones 2 of 39, and retriever rankings on single-tool queries reversed on multi-tool ones ([arXiv 2610.41905](https://arxiv.org/abs/2610.41905), single-author preprint).

**Code mode and routers (study).** A preregistered study with up to 1,958 distractor tools found code mode cut tokens by 70% to 90% compared with plain MCP and raised success. Declaring return shapes in the stubs swung success by up to 39.5 points for weaker agents. Adding a router in front of code mode was not confirmed to help ([arXiv 2611.19123](https://arxiv.org/abs/2611.19123)). These are three open-weight agents in the authors' harness.

**Granularity is a design variable (study).** How finely functionality is split into tools changed results enough that a small model at a good granularity beat a larger one at a poor one ([MCP-GRANITE](https://arxiv.org/abs/2609.24161), small local models).

**Bias and position (study).** Description edits can multiply a tool's share of usage ([Faghih et al., EMNLP 2025](https://aclanthology.org/2025.emnlp-main.1060/)), models show provider preferences ([BiasBusters](https://arxiv.org/abs/2510.00307)), and both schema design and tool ordering affected which equivalent tool was picked ([arXiv 2610.14334](https://arxiv.org/abs/2610.14334)).

**Metadata is not identity (study).** Because tool metadata is not bound to a verified provider, a second server advertising a colliding name, a task-aligned description and a compatible schema could capture requests meant for a legitimate provider across five clients ([arXiv 2611.21577](https://arxiv.org/abs/2611.21577)). In MCPTox, poisoned metadata succeeded widely and more capable models were often more susceptible ([arXiv 2508.14925](https://arxiv.org/abs/2508.14925)).

**Disputed or unsettled.**

- *Context cost or selection?* Vendor guidance frames large toolsets mainly as a token problem; the shadowing results frame them as a choice problem. Both can be true, and the fixes differ.
- *Do benchmarks look like real catalogues?* A registry sample found no cross-author near-duplicate descriptions in real MCP tools, against 16.7% near-duplication in BFCL v4 ([arXiv 2609.10962](https://arxiv.org/abs/2609.10962)). Selection difficulty in benchmarks may not match production.
- Almost all of this is 2026 preprint work on author-built harnesses.

## Practical checklist

1. Count the definitions your agent sees per step and their token cost, not only the total catalogue size.
2. For each pair of similar tools, write the boundary in one sentence and put it in both descriptions.
3. Prefix tool names by service and resource, and test prefix against suffix on your own models.
4. If definitions exceed a few per cent of the context window, defer them behind search and keep the deferred set stable within a conversation.
5. Evaluate retrieval with multi-tool tasks and report whether the complete required set was retrieved.
6. Give code-mode stubs typed return shapes from `outputSchema`, and route every sandboxed call through the same approval policy as a direct call.
7. In a host or gateway, bind each tool to a verified server identity and refuse silent name collisions.
8. Re-run selection tests whenever a server is added, a description changes or the model changes.

## Common mistakes

- Generating one tool per API operation and relying on retrieval to hide the overlap.
- Measuring retrieval with single-tool recall when real tasks need several tools.
- Treating a router as free accuracy without measuring it against a simpler baseline.
- Disambiguating by server display name, which the MCP specification says is not unique.
- Writing descriptions that promote the tool ("best", "always use first") instead of distinguishing it.

## Sources and further reading

- Curated list: [Research on tool use and selection](../../../README.md#research-on-tool-use-and-selection), [Model Context Protocol](../../../README.md#model-context-protocol) and [Security for agent-facing surfaces](../../../README.md#security-for-agent-facing-surfaces).
- [MCP client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) (specification documentation)
- [More Skills, Worse Agents? Skill Shadowing](https://arxiv.org/abs/2605.24050) (study, preprint)
- [Beyond Plain MCP: decision models and code mode](https://arxiv.org/abs/2611.19123) (study, preregistered preprint)
- [When Tool Names Are Not Identities](https://arxiv.org/abs/2611.21577) (study, preprint)
- [Code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp) (vendor material)
- Further reading (same maintainer): [Agent tool catalogues need a pruning strategy](https://agentexperience.tech/insights/agent-tool-catalogs/) and [How to expose a 3,000-operation API to agents](https://agentexperience.tech/insights/large-api-surfaces-for-agents/).

## Related pages

- [Tool design](tool-design.md)
- [CLI and API design for agents](cli-and-api-design-for-agents.md)
- [Context engineering](context-engineering.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Agent Skills](../standards/agent-skills.md)
- [MCP](../standards/mcp.md)
- [Agentic resource discovery](../standards/agentic-resource-discovery.md)
