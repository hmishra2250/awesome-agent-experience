# Agent2Agent protocol (A2A) and Agent Cards

**In one line:** an open protocol that lets one agent find another, read its published Agent Card, delegate a task and receive results without either side exposing its internal tools, memory or reasoning.

**Last reviewed:** 2026-11-20

## What it is

A2A is a specification for communication between independent, potentially opaque agent systems. Where [MCP](mcp.md) connects an agent to tools and data, A2A connects an agent to another agent that it treats as a black box. The [A2A specification](https://a2a-protocol.org/latest/specification/) is organised in three layers: a data model (Task, Message, Agent Card, Part, Artifact, Extension), abstract operations (send message, send streaming message, get task, list tasks, cancel task, get Agent Card) and protocol bindings for JSON-RPC, gRPC and HTTP+JSON.

The **Agent Card** is the part most relevant to agent experience. It is a JSON document describing an agent: its name and description, an ordered list of `supportedInterfaces` (the first is preferred), provider, version, capabilities such as streaming and push notifications, security schemes, and a list of skills, each with an identifier, name, description, input and output modes and examples (specification). Cards may be signed with JSON Web Signatures over a JCS-canonicalised form, and an agent can offer a more detailed extended card to authenticated clients.

## Why it matters for agents

An Agent Card plays the same role for a delegating agent that a tool description plays for a tool-calling model: it is the text a model reads to decide whether this agent is the right one for the job. A vague card has the same selection problem as a vague tool description. The [A2A Inspector](https://github.com/a2aproject/a2a-inspector) makes this explicit: its host agent describes each of your agents to a model by the name, description and skills in the card, so you can see whether your card leads a host to pick your agent.

The second concern is the handoff itself. Whatever context and authority cross the boundary between agents decide whether the receiving agent can do the work safely. See [recovery and handoffs](../concepts/recovery-and-handoffs.md) and [context engineering](../concepts/context-engineering.md).

## Current state

As of 2026-11-20, checked against the live specification, releases and project repositories:

- **Steward.** A2A was announced by Google in April 2025 and donated to the Linux Foundation. The Agentic AI Foundation listed A2A among its hosted projects on [22 October 2026](https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects).
- **Latest version.** The [releases page](https://github.com/a2aproject/A2A/releases) shows **v1.0.1** as latest (changelog dated 2026-05-26, released 28 May 2026), following v1.0.0 on 12 March 2026. Version 1.0.0 carried many breaking changes, including a separation of the application protocol from transport bindings, modernised OAuth flows (implicit and password grants removed, device code and PKCE added), a new `tasks/list` method and the move of the extended card flag into capabilities. Version 1.0.1 prefers the `application/a2a+json` media type for the HTTP binding. Clients state the version they use through the `A2A-Version` service parameter; unsupported versions return `VersionNotSupportedError` (specification).
- **Discovery.** The specification and the [Agent Discovery guide](https://a2a-protocol.org/latest/topics/agent-discovery/) describe three methods: a well-known URI at `/.well-known/agent-card.json`, curated registries, and direct configuration. The guide notes that the specification does not define a standard registry API. Wider discovery proposals that list A2A agents alongside other resources are covered in [agentic resource discovery](agentic-resource-discovery.md).
- **Conformance tooling.** The [A2A Technology Compatibility Kit](https://github.com/a2aproject/a2a-tck) tests implementations across gRPC, JSON-RPC and HTTP+JSON, grades requirements by MUST, SHOULD and MAY, and defaults its media-type check to 1.0.1. It reports some obligations, such as signed-card verification, as manual and says a full automated score does not establish full conformance. The Inspector's installation instructions reference a `v1.0.0-alpha` tag, so treat it as pre-release.
- **Adoption evidence.** Adoption figures in circulation come mainly from the project and its sponsors. This review found no independent measurement of production A2A traffic, and most published examples describe delegation inside one organisation.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Clear division of labour.* The specification frames A2A as complementary to MCP: tools and data through MCP, delegation to other agents through A2A (specification).
- *Inter-agent messages are an attack surface.* A formal analysis that extracted a state machine from the natural-language specification reported 11 protocol-level vulnerabilities exploitable by a fully compliant adversary, including context injection through unprotected context identifiers, identity loss across multi-hop delegation, and rogue agents advertising unattested capabilities ([A2ABreak, arXiv 2609.10871](https://arxiv.org/abs/2609.10871), study, preprint).
- *Fewer round trips at the start.* A handshake benchmark using official SDKs measured one round trip for A2A against three for the legacy MCP handshake, and showed that the token cost of reading a counterpart's metadata grows with the number of capabilities it advertises ([arXiv 2610.30151](https://arxiv.org/abs/2610.30151), study, emulated network).

**Disputed or unsettled:**

- *Cross-organisation delegation.* Whether agents from different companies will routinely delegate to each other, or whether A2A will mostly orchestrate agents inside one enterprise, is not yet answered by public evidence.
- *Overlap with MCP.* MCP now has a Tasks extension for long-running work, and an agent can be exposed as an MCP server. Which protocol a team should use for a given boundary is a design choice, not a settled rule (opinion).
- *Discovery.* Well-known files, catalogues, DNS-based proposals and registries all compete. None is yet the agreed default for finding agents across the open web.
- *Card trust.* Signing proves that a card has not been altered since it was signed by a key; it does not prove that the agent behaves as its card claims.

## Practical checklist

1. Publish an Agent Card at `/.well-known/agent-card.json` and validate it with the Inspector against the version you claim.
2. Write each skill's description for a model that must choose between agents: say what the agent does, what inputs it needs, what it will not do, and give examples.
3. List `supportedInterfaces` in true preference order and test every declared binding with the TCK.
4. Put sensitive endpoints and skills in an authenticated extended card rather than the public card.
5. Sign cards with JWS where clients will verify them, and document which key a client should trust.
6. Declare the protocol version, handle `VersionNotSupportedError`, and test against at least one v0.3 client if you still have older callers.
7. Decide what context and authority cross each delegation, and pass only what the receiving agent needs.
8. Treat every incoming message, artifact and card as untrusted input, and re-check authorisation for actions the remote agent requests.
9. Make task states and results checkable, so the delegating agent can confirm that work happened rather than relying on a completion message.

## Common mistakes

- Treating the Agent Card as marketing copy rather than a selection surface for models.
- Exposing internal agents, URLs or sensitive skills in a public card.
- Assuming a signed card means a trustworthy agent.
- Letting a delegated agent inherit the caller's full authority instead of a narrower scope.
- Building A2A because it is new when the boundary is really a tool call that MCP or a plain API would serve.
- Citing project press figures as independent adoption evidence.

## Sources and further reading

- [A2A Protocol specification](https://a2a-protocol.org/latest/specification/) and [Agent Discovery in A2A](https://a2a-protocol.org/latest/topics/agent-discovery/) (specification and official guide)
- [A2A releases](https://github.com/a2aproject/A2A/releases) (release notes)
- [A2A Technology Compatibility Kit](https://github.com/a2aproject/a2a-tck) and [A2A Inspector](https://github.com/a2aproject/a2a-inspector) (official tooling)
- [A2ABreak: Systematic Security Analysis of the A2A Protocol](https://arxiv.org/abs/2609.10871) (preprint)
- [The Cost of Saying Hello: handshake overhead in agent protocols](https://arxiv.org/abs/2610.30151) (preprint)
- [Agent Network Protocol specifications](https://github.com/agent-network-protocol/AgentNetworkProtocol), a DID-based alternative (community specification)
- [ai-boost/awesome-a2a](https://github.com/ai-boost/awesome-a2a) for implementation breadth (directory)
- The curated list section [Protocols and machine-readable surfaces](../../../README.md#protocols-and-machine-readable-surfaces)
- Further reading (same maintainer): [Preserve context through handoffs](https://agentexperience.tech/insights/preserve-context-through-handoffs/) and [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/)

## Related pages

- [Model Context Protocol](mcp.md)
- [Agentic resource discovery](agentic-resource-discovery.md)
- [Agent auth drafts](agent-auth-drafts.md)
- [Recovery and handoffs](../concepts/recovery-and-handoffs.md)
- [Agent identity and authorization](../concepts/agent-identity-and-authorization.md)
- [Security for agent surfaces](../concepts/security-for-agent-surfaces.md)
- [Standards tracker](../standards-tracker.md)
