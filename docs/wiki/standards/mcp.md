# Model Context Protocol (MCP)

**In one line:** an open, date-versioned protocol through which an AI application discovers and calls tools, reads resources and fetches prompts from external servers, and the most common way products expose actions to agents today.

**Last reviewed:** 2026-11-20

## What it is

MCP defines a conversation between a client, which lives inside a host application such as a coding agent or chat assistant, and a server that exposes capabilities. Messages are JSON-RPC. A server offers three main primitives:

- **Tools:** named actions with a description, a JSON Schema for inputs and an optional output schema. The [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) calls them "model-controlled": the model reads the metadata and decides when to call them.
- **Resources:** readable data addressed by URI ([resources specification](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)).
- **Prompts:** reusable templates a user or host can select.

Local servers usually run over stdio; remote servers use Streamable HTTP, with authorisation built on OAuth ([Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)). The [architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) is the best first read.

## Why it matters for agents

For an agent, an MCP server is the product. It never sees your marketing site or your dashboard; it sees a tool name, a description, a parameter schema, a result and, when something goes wrong, an error string. Selection happens from that metadata alone, before any code runs. That makes MCP an agent experience problem rather than only an integration task: the same backend can be easy or impossible for an agent to use depending on how the surface is written. See [tool design](../concepts/tool-design.md) and [tool selection at scale](../concepts/tool-selection-at-scale.md) for the general principles.

## Current state

As of 2026-11-20, checked against the live specification pages:

- **Steward.** MCP is a hosted project of the Agentic AI Foundation (AAIF) under the Linux Foundation, which listed it among its ten projects on [22 October 2026](https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects). Technical changes go through Specification Enhancement Proposals (SEPs).
- **Latest version.** The [versioning page](https://modelcontextprotocol.io/specification/versioning) names **2026-07-28** as the current revision. Its [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) records a stateless redesign (specification):
  - the `initialize` handshake and protocol sessions (`Mcp-Session-Id`) are removed; every request carries its protocol version and client capabilities in `_meta`;
  - servers must implement `server/discover` to advertise versions, capabilities and identity;
  - mid-call input such as elicitation now uses the Multi Round-Trip Requests pattern, where the server returns an `input_required` result and the client retries;
  - Tasks moved out of core into an extension;
  - servers should return `tools/list` in a deterministic order, and list results carry `ttlMs` and `cacheScope` caching hints;
  - Roots, Sampling and Logging are deprecated, and Dynamic Client Registration is deprecated in favour of Client ID Metadata Documents;
  - a feature lifecycle policy sets a minimum twelve-month deprecation window.
- **Extensions.** The [extensions overview](https://modelcontextprotocol.io/docs/extensions/overview) defines Experimental, Beta and Stable stages (SEP-3392). Stable: OAuth Client Credentials, Enterprise-Managed Authorization and MCP Apps. Beta: Tasks (intended for core), Skills over MCP and Server Cards. Experimental repositories include draft tool annotations for action metadata and trust. Extensions are off by default and need explicit opt-in.
- **Registry.** [The MCP Registry](https://modelcontextprotocol.io/registry/about) is still labelled preview. It hosts metadata for public servers only, verifies namespaces by GitHub account or domain, delegates security scanning to package registries and aggregators, and says host applications should not consume it directly.
- **Direction.** The [roadmap](https://modelcontextprotocol.io/development/roadmap) (last updated 2026-08-22) prioritises server-initiated events, HTTP over stdio, ETag-style caching, agent identity and delegation, a redesigned tool result shape and progressive discovery of large catalogues. It states that it reflects current thinking rather than commitments.
- **Conformance.** [SDK tiers](https://modelcontextprotocol.io/community/sdk-tiers) are tied to the official [conformance suite](https://github.com/modelcontextprotocol/conformance); Tier 1 requires a 100 per cent pass rate on applicable required tests. The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the reference debugging tool.
- **Adoption evidence.** Download and server counts circulate widely, but they come from vendors or from studies that count different things. A seeded random draw of 400 npm and stdio servers from a 24,135-server registry census found that 48.8 per cent completed a handshake and that optional safety annotations were omitted for 58.8 per cent of tools ([arXiv 2609.10962](https://arxiv.org/abs/2609.10962), study). A measurement of 7,973 live remote servers found 40.55 per cent exposing tools without authentication ([arXiv 2605.22333](https://arxiv.org/abs/2605.22333), study), although it predates the 2026-07-28 registration changes.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Metadata shapes selection.* Single-factor interventions across five models found that parameter schema changes moved tool selection more consistently than name or description changes ([arXiv 2610.14334](https://arxiv.org/abs/2610.14334), study). Description quality also matters ([smell-aware evaluation, arXiv 2602.18914](https://arxiv.org/abs/2602.18914), study).
- *Errors are an interface.* The specification separates protocol errors from tool execution errors (`isError: true`) and says clients should pass the latter to the model so it can correct itself (specification). In 150 widely used servers, many error messages told a tool-only agent to run a terminal command or open a web page, and naming a server tool in the next step raised recovery in the authors' tests ([arXiv 2609.35381](https://arxiv.org/abs/2609.35381), study).
- *Approval is split and often absent.* The tools specification says there should always be a human able to deny tool calls, but leaves the mechanism to hosts. A source-code audit estimated that about 90 per cent of destructive tools in a registry sample had no server-side confirmation and that 32 of 41 popular hosts and SDKs had no approval step by default ([arXiv 2611.02527](https://arxiv.org/abs/2611.02527), study).
- *Names are not identities.* The specification warns that tool names are unique only within one server and that server names should not be used for disambiguation. A controlled study showed a second server can capture requests through colliding names, aligned descriptions and compatible schemas ([arXiv 2611.21577](https://arxiv.org/abs/2611.21577), study).
- *Annotations are hints.* Clients must treat tool annotations as untrusted unless the server is trusted (specification).

**Disputed or unsettled:**

- *MCP versus command line versus code execution.* A controlled comparison found scaffolding mattered more than the interface ([arXiv 2608.08654](https://arxiv.org/abs/2608.08654)), while other work favours terminal or code access for strong models ([arXiv 2604.00073](https://arxiv.org/abs/2604.00073), [arXiv 2611.19123](https://arxiv.org/abs/2611.19123)) and Anthropic describes [code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp) (vendor material). Results depend on model and harness.
- *Whether shipping an MCP server improves outcomes.* The listed studies compare interfaces on author-built tasks. None measures whether adding an MCP server to a real product changes customer task success compared with a good API and documentation.
- *Ecosystem size.* Server counts differ by an order of magnitude depending on what is counted. Quote a figure only with its definition.

Most of the evidence above is single-team preprints from 2026; treat it as hypotheses to replicate.

## Practical checklist

1. Target the current revision, implement `server/discover`, and run the conformance suite and the Inspector against every release.
2. Give each tool a specific, unique name and a description that says when to use it, when not to, and how it differs from its neighbours.
3. Prefer flat, explicit parameters with described fields, and publish an `outputSchema` for structured results.
4. Return failures as tool execution errors whose next step is something the agent can do through your tools: name the login tool or the exact call to repeat, not a shell command.
5. Mark read-only and destructive behaviour in tool annotations, and do not rely on those hints as your only safeguard.
6. For stateful work, return opaque handles, authorise every call against the handle, state the lifetime in the creating tool's description and return a clear expiry error.
7. Keep `tools/list` ordering deterministic and set realistic caching hints.
8. For remote servers, require authentication, register clients with Client ID Metadata Documents, validate the `iss` parameter and bind stored credentials to their issuer.
9. Keep the exposed catalogue small for each task, and measure selection with evals before adding tools.
10. If you build a host, prompt for confirmation on any tool not annotated read-only, prefix tools by server, and treat descriptions and results as untrusted input.

## Common mistakes

- Wrapping every REST endpoint one to one and leaving the agent to work out the sequence.
- Copying human-facing error text that assumes a terminal, a browser or a dashboard.
- Depending on connection or session state, which the current revision removed.
- Treating a registry listing as a security review.
- Assuming the server's annotations or elicitation will produce a confirmation prompt in every host.
- Quoting one ecosystem count, or SDK downloads, as evidence that a server helps agents.

## Sources and further reading

- [MCP specification changelog, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) and [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) (specification)
- [MCP extensions overview](https://modelcontextprotocol.io/docs/extensions/overview) and [roadmap](https://modelcontextprotocol.io/development/roadmap) (specification and project plan)
- [MCP client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) and [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) (official guidance)
- [SEP-2127: MCP Server Cards](https://modelcontextprotocol.io/seps/2127-mcp-server-cards) (proposal)
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (vendor material)
- [OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/) (beta) and [CoSAI MCP Security v2.0](https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/blob/main/whitepapers/model-context-protocol-security.md)
- The curated list sections [Tool use, tool descriptions and MCP](../../../README.md#tool-use-tool-descriptions-and-mcp) and [Security for agent-facing surfaces](../../../README.md#security-for-agent-facing-surfaces)
- Further reading (same maintainer): [Tool descriptions](https://agentexperience.tech/insights/tool-descriptions/) and [Agent tool catalogs](https://agentexperience.tech/insights/agent-tool-catalogs/)

## Related pages

- [Tool design](../concepts/tool-design.md)
- [Tool selection at scale](../concepts/tool-selection-at-scale.md)
- [Human approval and control](../concepts/human-approval-and-control.md)
- [Recovery and handoffs](../concepts/recovery-and-handoffs.md)
- [Security for agent surfaces](../concepts/security-for-agent-surfaces.md)
- [Agent auth drafts](agent-auth-drafts.md)
- [Agent Skills](agent-skills.md)
- [WebMCP](webmcp.md)
- [A2A](a2a.md)
- [Standards tracker](../standards-tracker.md)
