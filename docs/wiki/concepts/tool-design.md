# Tool design

**In one line:** An agent knows a tool only through its name, description, schema, results and errors, so those five things are the product, and research now shows each of them changes what the agent does.

Last reviewed: 2026-11-20

## What it is

Tool design is the work of shaping what an agent sees when it decides whether to call a tool, how to call it, and what to do with the answer. In the Model Context Protocol (MCP) a tool is a `name`, an optional `title`, a `description`, an `inputSchema`, an optional `outputSchema` and optional `annotations` ([MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)). Function calling in model APIs, WebMCP tools in the browser and command-line tools reached through a shell have the same parts under other names.

The agent has no colleague to ask and no changelog to read. Tool design therefore covers naming, the description (purpose, when not to use it, inputs, what changes on success), the input schema, the shape and size of results, the errors the agent is shown, and the declared effects of a call (read, write, delete, external reach, safe to repeat or not).

## Why it matters for agents

Controlled studies now hold the model and task fixed, change only the tool interface, and see the outcome move, echoing the agent-computer interface findings of [SWE-agent](https://arxiv.org/abs/2405.15793). Most providers cannot change the agents that call them, but they can change their tools.

Tool metadata is also a security surface. Descriptions are read by the model as instructions, so a misleading or malicious description can steer behaviour (see [security for agent surfaces](security-for-agent-surfaces.md)).

## Current state

As of 2026-11-20, the current dated MCP revision is 2026-07-28 ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). The parts that matter for tool design (specification):

- Tool names SHOULD be 1 to 128 characters, case-sensitive, limited to ASCII letters, digits, underscore, hyphen and dot, and unique within a server. Clients that aggregate several servers SHOULD disambiguate collisions, for example by prefixing a server identifier.
- Clients MUST treat annotations as untrusted unless they come from trusted servers.
- There are two kinds of error. Protocol errors (unknown tool, malformed request) are JSON-RPC errors. Tool execution errors (API failures, invalid input, business rule failures) are returned as results with `isError: true`, and clients SHOULD pass them to the model so it can correct itself.
- `structuredContent` may carry any JSON value that conforms to `outputSchema`, and `inputSchema` and `outputSchema` may now use any JSON Schema 2020-12 keyword.
- Because the 2026-07-28 revision removed protocol sessions, servers that need state across calls are advised to return explicit handles, state the retention policy in the creation tool's description, and return an execution error that says so when a handle has expired.
- Servers SHOULD return `tools/list` in a deterministic order so clients and prompt caches can reuse it.

The maintainers' [roadmap](https://modelcontextprotocol.io/development/roadmap) (last updated 2026-08-22) names a redesign of the `tools/call` result shape, because returning both `content` and `structuredContent` has produced diverging implementations. That is a stated priority, not agreed text.

Ecosystem quality is uneven. A seeded random draw of 400 npm and stdio servers from the registry found that only 48.8% completed a handshake, and among those that ran, 58.8% of tools omitted optional safety annotations ([arXiv 2609.10962](https://arxiv.org/abs/2609.10962), study).

## What the evidence supports and what is disputed

**Descriptions shift selection (study).** Editing descriptions gave some tools over ten times more usage than the originals on GPT-4.1 and Qwen2.5-7B, with trends compared across 17 models ([Faghih et al., EMNLP 2025](https://aclanthology.org/2025.emnlp-main.1060/)). Models also show provider preferences that small wording changes can move ([BiasBusters](https://arxiv.org/abs/2510.00307)). A smell-aware study of 10,831 MCP servers showed that injecting or fixing description smells changes which tool is chosen ([arXiv 2602.18914](https://arxiv.org/abs/2602.18914)).

**Schemas shift selection too, not only invocation (study).** Changing one metadata factor at a time across five models, parameter-schema changes produced the largest and most consistent selection shifts, and models tended to favour separate top-level parameters over grouped ones ([arXiv 2610.14334](https://arxiv.org/abs/2610.14334)). Renaming schema components towards names a small model already knows cut schema-misalignment errors by 80% on two benchmarks ([PA-Tool, ACL 2026](https://aclanthology.org/2026.acl-long.948/)). A controlled pilot found JSON Schema contracts reduced malformed calls but not conceptually wrong ones ([Schema First](https://arxiv.org/abs/2603.13404)).

**Errors are instructions (study).** In 150 widely used MCP servers, 949 of 3,001 error messages told the caller what to do next, often by asking for a terminal command, a configuration change or a web page that a tool-only agent cannot use. Naming a server tool in the step instead (a login tool, or the exact call to repeat) raised recovery to 84% on expired credentials and 88% on rate limits in the authors' tests ([arXiv 2609.35381](https://arxiv.org/abs/2609.35381)). Constraints written only in prose can turn a misunderstood query into an empty success that the agent rarely notices ([SilentProbe](https://arxiv.org/abs/2609.00035)).

**Valid calls are not enough (study).** A call can succeed and still leave the agent unable to tell whether an effect committed. The Agent-First Tooling framework names the missing parts: effect semantics, execution lifecycle, machine-readable results and postcondition checks ([arXiv 2608.23628](https://arxiv.org/abs/2608.23628)).

**Providers can improve tools from traces (study).** Rewriting descriptions and, where allowed, implementations from historical agent runs improved task completion on τ²-bench and lowered cost or tool error rates on three production MCP servers, without changing the agents ([AT-AT](https://arxiv.org/abs/2610.34679)). Related methods refine documentation from failed traces ([DOCSCHISEL](https://arxiv.org/abs/2608.10037)) or learn to rewrite descriptions without them ([arXiv 2602.20426](https://arxiv.org/abs/2602.20426)).

**Vendor practice (vendor material).** Anthropic recommends namespacing by service and resource, returning meaningful names instead of opaque identifiers, sensible defaults for pagination and truncation, and a `response_format` option, reporting one tool's output falling from 206 to 72 tokens ([Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)).

**Disputed or unsettled.**

- *Longer is not automatically better.* Augmenting descriptions in 103 servers raised median task success by 5.85 points but increased execution steps by 67.46% and regressed performance in 16.67% of cases ([arXiv 2602.14878](https://arxiv.org/abs/2602.14878), study). DOCSCHISEL also finds that no single documentation format generalises across models and tasks.
- *Which factor matters most* depends on the model and the request, and most of the work above is single-team preprints from 2026. Treat the figures as results to replicate on your own tools, not as constants.

## Practical checklist

1. Each tool name is unique, uses only the characters the MCP specification recommends, and names the job rather than the endpoint.
2. Each description states purpose, when not to use the tool, the nearest neighbouring tool by name, required inputs, side effects and what is returned.
3. Closed sets are `enum` values in the schema, and `additionalProperties` is `false` where extra fields would be ignored.
4. Parameters are flat and plainly named unless grouping is needed, and you have checked selection with the schema you actually ship.
5. Every write or delete has its effect stated in the description and enforced in the server, whatever its annotations say.
6. Execution errors use `isError: true`, say what was wrong, and name a tool or call the agent can use next. No step requires a terminal, a browser or a configuration file unless the caller is known to have one.
7. Large results have pagination, filtering or truncation with defaults, and truncated output says how to get the rest.
8. Tools that create state return an explicit handle, state its lifetime in the description, and return a clear error on expiry.
9. Descriptions live in version control, each fixed selection or recovery failure gets a regression case, and changes are checked with [MCP Inspector](https://github.com/modelcontextprotocol/inspector) or your own harness.

## Common mistakes

- One uncurated tool per REST endpoint, inheriting every gap in the API specification.
- Developer-facing error text ("run `login`", "wait before retrying") reaching an agent that can only call tools.
- Relying on `readOnlyHint` or `destructiveHint` as a safety control.
- Returning an empty success when a constraint was silently violated.
- Promotional descriptions ("always use this tool first"), which resemble the edits measured by Faghih et al.
- Changing a description without re-running a selection test.

## Sources and further reading

- Curated list: [Tool use, tool descriptions and MCP](../../../README.md#tool-use-tool-descriptions-and-mcp), especially [Tool design guides](../../../README.md#tool-design-guides) and [Research on tool use and selection](../../../README.md#research-on-tool-use-and-selection).
- Start with the [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) (specification) and [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (vendor material), then the studies cited above. The EMNLP and ACL papers are peer reviewed; the arXiv papers are preprints.
- Further reading (same maintainer): [Write tool descriptions an agent can act on](https://agentexperience.tech/insights/tool-descriptions/) and [Agent tool catalogues need a pruning strategy](https://agentexperience.tech/insights/agent-tool-catalogs/).

## Related pages

- [Tool selection at scale](tool-selection-at-scale.md)
- [CLI and API design for agents](cli-and-api-design-for-agents.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Evaluating agent experience](evaluating-agent-experience.md)
- [MCP](../standards/mcp.md) and [WebMCP](../standards/webmcp.md)
- [OpenAPI, Arazzo and JSON Schema](../standards/openapi-arazzo-json-schema.md)
