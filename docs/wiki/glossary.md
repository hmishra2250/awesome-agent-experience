# Glossary

In one line: short, sourced definitions of the terms that recur across agent experience (AX) work, with a pointer to the wiki page that covers each one in depth.

Last reviewed: 2026-11-20

## How to use this page

Terms are listed alphabetically. Each entry gives a plain definition in one to three sentences, then links to the concept or standard page where one exists and to a primary source. Where a term names a standard, its status is not repeated here: check the [standards tracker](standards-tracker.md), which records status and version as of a date. Where usage is contested, the entry says so. Tags such as (specification), (study), (vendor material) and (opinion) mark the kind of source behind a claim.

Jump to: [A](#a) · [C](#c) · [D](#d) · [E](#e) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [R](#r) · [S](#s) · [T](#t) · [W](#w)

## A

### A2A (Agent2Agent protocol)

A protocol for one agent application to discover another, send it tasks and receive results without either side exposing its internals. It complements MCP, which connects an agent to tools rather than to other agents (specification). See [A2A](standards/a2a.md) and the [A2A specification](https://a2a-protocol.org/latest/specification/).

### Accessibility tree

The structured representation of a page (roles, names, states) that browsers expose to assistive technology, and which many browser agents read instead of, or alongside, screenshots. Clean semantics and labels therefore help agents as well as screen-reader users. See [Agent-ready websites](concepts/agent-ready-websites.md) and [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/).

### ACI (agent-computer interface)

The commands, observations and feedback an agent works through, by analogy with the human-computer interface. The SWE-agent paper showed that the same model performs very differently depending on how this interface is designed (study). See [Tool design](concepts/tool-design.md) and [SWE-agent](https://arxiv.org/abs/2405.15793).

### Adaptive attack evaluation

Testing a defence against an attacker who knows the defence and optimises against it, rather than against a fixed set of injected prompts. Work such as [The Attacker Moves Second](https://arxiv.org/abs/2510.09023) argues that static benchmarks overstate robustness, so near-zero attack success figures on a fixed suite should be read cautiously (study). See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

### Agent analytics

Measuring which agents visit a surface, what they fetch, which routes they use and what they do next. Visit counts are not outcomes: a fetched file is not evidence that a task succeeded. See [Agent analytics and observability](concepts/agent-analytics-and-observability.md).

### Agent Card

A JSON document in which an A2A agent describes its identity, skills, endpoints and authentication requirements, conventionally published at `/.well-known/agent-card.json` (specification). See [A2A](standards/a2a.md) and [Agent Discovery in A2A](https://a2a-protocol.org/latest/topics/agent-discovery/).

### Agent experience (AX)

The quality of a product, API, documentation set or website as experienced by an AI agent acting for a person: whether the agent can discover, understand, safely use and recover the workflow. The term was popularised in an opinion essay, [Introducing AX](https://biilmann.blog/articles/introducing-ax/), and it is unrelated to call-centre or real-estate "agent experience". See [Agent experience](concepts/agent-experience.md).

### Agent identity

Knowing which agent is calling, who operates it and on whose behalf it acts. The first two are increasingly solved with signed requests and registered clients; representing the person and their consent across domains is still open. See [Agent identity and authorization](concepts/agent-identity-and-authorization.md).

### Agent-ready website

A site an agent can find, read, act on and verify without guessing: content present in the served HTML, a usable accessibility tree, stable controls, decision-critical facts stated on the page and errors that say what to do next. See [Agent-ready websites](concepts/agent-ready-websites.md).

### AGENTS.md

A plain Markdown file in a code repository that tells coding agents how to build, test and work in that codebase. It has no required fields; the nearest file to the edited code applies (specification). See [AGENTS.md](standards/agents-md.md) and [agents.md](https://agents.md/).

### Agent Skills (SKILL.md)

A packaging format in which a folder holds a `SKILL.md` file (a name, a description and instructions) plus optional scripts and resources that an agent loads when the skill is relevant. Controlled studies disagree on whether skills improve task success (study). See [Agent Skills](standards/agent-skills.md) and the [Agent Skills specification](https://agentskills.io/specification).

### AI usage preferences (aipref)

An IETF working group effort to define a vocabulary for how content may be used by automated systems (for example search or training) and a way to attach those preferences to content through HTTP and robots.txt. Both documents are still drafts (specification). See [Content signals and AI preferences](standards/content-signals-and-ai-preferences.md) and [draft-ietf-aipref-vocab](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/).

### api-catalog

A well-known URI (`/.well-known/api-catalog`) and link relation, defined in [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html), through which a publisher lists its APIs so that clients, including agents, can find them without guessing paths (specification). See [Agentic resource discovery](standards/agentic-resource-discovery.md).

### Approval binding

The property that the operation a person approved is exactly the operation that executes, with the same arguments, target and scope. Research on [consent integrity](https://arxiv.org/abs/2606.02668) and [Loopjacking](https://arxiv.org/abs/2609.21081) reproduced cases where the two diverged (study). See [Human approval and control](concepts/human-approval-and-control.md).

### Approval fatigue

The decline in attention when people are asked to confirm too many agent actions, so that approval becomes a reflex rather than a decision. Anthropic reports that users accepted 93 per cent of manual permission prompts before it introduced classifier review ([vendor material](https://www.anthropic.com/research/claude-code-auto-mode)). See [Human approval and control](concepts/human-approval-and-control.md).

### Approval laundering

A pattern in which an approved tool call causes further effects, through other tools or systems, that the person never reviewed. See [Agent Approval Laundering](https://arxiv.org/abs/2609.28586) (study) and [Human approval and control](concepts/human-approval-and-control.md).

### Arazzo

An OpenAPI Initiative specification for describing multi-step API workflows (sequences of calls, with inputs, outputs and success criteria), useful when an agent must chain operations in a specific order (specification). See [OpenAPI, Arazzo and JSON Schema](standards/openapi-arazzo-json-schema.md).

### ARD (Agentic Resource Discovery)

A proposal for a site to publish a manifest at `/.well-known/ard.json` listing its agent-usable resources (MCP servers, A2A agents, APIs and more) so that agents and registries can find them (specification, proposal status). See [Agentic resource discovery](standards/agentic-resource-discovery.md).

## C

### Claim flow (agent-first onboarding)

A pattern in which an agent creates a working resource, such as a deployment or a database, before any human account exists, and a person later claims it. Examples include [Vercel Claim Deployments](https://vercel.com/docs/deployments/claim-deployments) and [Claimable Neon](https://neon.com/docs/reference/claimable-neon) (vendor material). See [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md).

### Client ID Metadata Document (CIMD)

An OAuth draft in which a client's identifier is an HTTPS URL that serves its metadata, so an authorisation server can learn about a client without prior registration. The MCP 2026-07-28 revision prefers it over Dynamic Client Registration. CIMD proves control of a URL, not that the client is trustworthy. See [Agent authorization drafts](standards/agent-auth-drafts.md) and [draft-ietf-oauth-client-id-metadata-document](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/).

### Code mode

Letting an agent write and run code against an API or SDK instead of calling each tool through a separate model turn, which can reduce tokens spent on intermediate results ([vendor material](https://www.anthropic.com/research/code-execution-with-mcp)). Whether code mode, plain MCP or a terminal works best is still disputed and depends heavily on model and harness ([study](https://arxiv.org/abs/2611.19123)). See [Tool selection at scale](concepts/tool-selection-at-scale.md).

### Compaction

Summarising or pruning an agent's accumulated context so that a long task fits in the window. Compaction can drop constraints the agent still needs, and repeated compression loses more than a single pass ([study](https://arxiv.org/abs/2611.18642)). See [Context engineering](concepts/context-engineering.md).

### Confused deputy

A privileged component being tricked into using its authority for someone who should not have it. For agents, this happens when a broadly scoped agent or MCP server acts on a request, or on injected content, that the requesting person could not perform themselves. Authority should be the intersection of what the agent, the person and the task allow. See [Agent identity and authorization](concepts/agent-identity-and-authorization.md) and [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices).

### Content negotiation

The HTTP mechanism by which a client states which representations it accepts (for example `Accept: text/markdown`) and the server returns the best match with a `Vary: Accept` header. For agents it means one URL can serve HTML to browsers and Markdown to agents. Only some agents send the header, so check your own logs ([vendor material](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/)). See [Markdown content negotiation](standards/markdown-content-negotiation.md).

### Content Signals

A robots.txt extension and `Content-Signal` header, published by Cloudflare, that states preferences for three uses of content: `search`, `ai-input` and `ai-train`. It expresses a preference and does not enforce it. See [Content signals and AI preferences](standards/content-signals-and-ai-preferences.md) and [contentsignals.org](https://contentsignals.org/).

### Context engineering

Deciding what enters an agent's context window, in what order and at what cost, so that the agent has what it needs and little else ([vendor material](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). AX can be read as context engineering done from the outside, by the owner of the surface. See [Context engineering](concepts/context-engineering.md).

### Context rot

The observed decline in model performance as input length grows, even on tasks well within the stated context limit ([vendor research](https://www.trychroma.com/research/context-rot)). It is one reason to keep tool catalogues, documents and tool results short. See [Context engineering](concepts/context-engineering.md).

## D

### Dark patterns (for agents)

Interface designs that push a user towards choices against their interest; agents can be manipulated by them as people are. Benchmarks such as [DECEPTICON](https://arxiv.org/abs/2512.22894) and [SusBench](https://arxiv.org/abs/2510.11035) measure this (study). See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

### Declared versus verified completion

The gap between an agent reporting that a task is done and the required change actually existing in the system. Benchmarks that check backend state or interface events, such as [WebPageBench](https://arxiv.org/abs/2609.35026) and [BreakingWeb](https://arxiv.org/abs/2609.35814), report large gaps (study). Surfaces that return checkable confirmations help close it. See [Evaluating agent experience](concepts/evaluating-agent-experience.md).

### Delegation chain

The sequence of hops through which authority passes from a person to an agent and on to sub-agents or tools. A sound chain lets authority only narrow at each hop; research finds that user authority and requirements degrade across sub-agent chains ([MasDrift](https://arxiv.org/abs/2608.07556), study). See [Agent identity and authorization](concepts/agent-identity-and-authorization.md).

### Dynamic Client Registration (DCR)

The OAuth mechanism ([RFC 7591](https://www.rfc-editor.org/rfc/rfc7591.html)) by which a client registers itself with an authorisation server at run time. The MCP 2026-07-28 revision deprecates it as the client registration mechanism in favour of Client ID Metadata Documents ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). See [Agent authorization drafts](standards/agent-auth-drafts.md).

## E

### Elicitation

An MCP feature through which a server asks the user, via the client, for information during a request. The 2026-07-28 revision defines a form mode (structured data with an optional schema) and a URL mode (sending the user to an external page for sensitive steps such as sign-in) and leaves the interface to clients ([specification](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)). See [MCP](standards/mcp.md) and [Human approval and control](concepts/human-approval-and-control.md).

### Enterprise-Managed Authorization (ID-JAG)

An MCP authorisation extension that lets an organisation's identity provider grant an agent access to MCP servers through an Identity Assertion JWT Authorization Grant, instead of each user consenting server by server ([extension](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)). Implementations target different draft revisions. See [Agent authorization drafts](standards/agent-auth-drafts.md).

### Error recovery (actionable errors)

Designing failure responses so that an agent can tell what went wrong and what to do next: a machine-readable error type, the offending field, whether a retry is safe and which tool or step to use instead. Error text written for human developers can mislead tool-only agents ([study](https://arxiv.org/abs/2609.35381)). See [Recovery and handoffs](concepts/recovery-and-handoffs.md).

## G

### GEO (generative engine optimisation)

Shaping content so that AI answer engines retrieve and cite it. It overlaps with AX but asks a different question: whether a source is cited, not whether an agent can complete a task on a product. The term comes from [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735). See [GEO and AI search](concepts/geo-and-ai-search.md).

## H

### Handoff

Passing a task between an agent and a person, or between agents, with enough state and reasoning for the receiver to continue. Handoff summaries can drop the boundaries on how data may be used ([study](https://arxiv.org/abs/2608.29028)). See [Recovery and handoffs](concepts/recovery-and-handoffs.md).

### Harness (scaffold)

The code around a model that supplies tools, prompts, memory, retries and limits during an agent run. Harness and infrastructure choices can move benchmark scores as much as the model does ([study](https://arxiv.org/abs/2609.20804); [vendor material](https://www.anthropic.com/research/infrastructure-noise)). See [Evaluating agent experience](concepts/evaluating-agent-experience.md).

### Human-in-the-loop (HITL)

A deliberate pause before a consequential or irreversible action, in which a person decides with the relevant evidence in front of them. More checkpoints are not automatically safer: timing and attention matter ([study](https://arxiv.org/abs/2510.05307)). See [Human approval and control](concepts/human-approval-and-control.md).

## I

### Idempotency key

A client-generated value sent with a write request so that a retry with the same key returns the original result instead of repeating the side effect. Stripe documents the pattern ([vendor material](https://docs.stripe.com/api/idempotent_requests)) and an IETF draft standardises the `Idempotency-Key` header ([specification, draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)). See [Recovery and handoffs](concepts/recovery-and-handoffs.md).

### Indirect prompt injection

Instructions hidden in content an agent reads (a web page, an email, a tool result, another agent's message) that the agent then follows as if they came from its user ([study](https://arxiv.org/abs/2302.12173)). Architectural controls that limit what an agent can do with untrusted data, such as the design in [Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813), are the better-supported defence. See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

## L

### llms.txt

A Markdown file at a site's root that summarises the site and links to its most useful pages, preferably to Markdown versions of them ([specification, community proposal](https://llmstxt.org/)). Measurement shows many published files are never requested and many do not follow the format ([Ahrefs](https://ahrefs.com/blog/llmstxt-study); [Common Crawl](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive)). See [llms.txt](standards/llms-txt.md).

## M

### Markdown twin

A Markdown version of an HTML page served at a predictable path (such as `page.md`) or through content negotiation. llms.txt v2 recommends advertising it with `rel="alternate" type="text/markdown"` ([specification](https://llmstxt.org/)). See [Markdown content negotiation](standards/markdown-content-negotiation.md) and [Documentation for agents](concepts/documentation-for-agents.md).

### MCP (Model Context Protocol)

An open protocol through which an agent host discovers and calls tools, reads resources and uses prompts exposed by external servers, with JSON Schema describing each tool's inputs. The 2026-07-28 revision removed protocol sessions and the initialisation handshake ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). See [MCP](standards/mcp.md).

### MCP Apps

An MCP extension that lets a server display interactive interface elements, such as forms or charts, inside a conversation in a supporting client ([repository](https://github.com/modelcontextprotocol/ext-apps)). See [MCP](standards/mcp.md).

### MCP extension

An optional, separately versioned addition to MCP that moves through Experimental, Beta and Stable stages, or is promoted into the core specification ([overview](https://modelcontextprotocol.io/docs/extensions/overview)). Clients and servers negotiate which extensions they support. See [MCP](standards/mcp.md).

### MCP Registry

The official, community-run directory of publicly available MCP servers, which other registries can build on. It describes itself as in preview, with possible breaking changes before general availability ([about](https://modelcontextprotocol.io/registry/about)). See [MCP](standards/mcp.md).

### Multi round-trip requests (MRTR)

The MCP 2026-07-28 pattern for getting input during a call: instead of the server sending its own request to the client, it returns an `input_required` result, and the client retries the original request with the answers and an opaque `requestState` ([specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr)). See [MCP](standards/mcp.md).

## N

### NLWeb

An open project, started at Microsoft, that gives a website a natural-language query endpoint returning Schema.org-shaped JSON and that can also be exposed as an MCP server. Its own repository describes the code as proof-of-concept ([repository](https://github.com/nlweb-ai/NLWeb)). See [NLWeb](standards/nlweb.md).

### Non-interactive mode

A CLI or installer behaviour that never blocks on a prompt, accepts all choices as flags or environment variables, and emits structured output, so that an agent can run it unattended. See [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md) and [How Vercel ships for agents](https://2027.dev/blog/how-vercel-ships-for-agents) (vendor material).

## O

### On-behalf-of (delegated) access

An agent acting with authority derived from a specific person, as distinct from acting with its own service identity. A widely cited OAuth draft for this, draft-oauth-ai-agents-on-behalf-of-user, has expired without adoption, so treat it as a historical proposal ([Datatracker](https://datatracker.ietf.org/doc/draft-oauth-ai-agents-on-behalf-of-user/)). See [Agent authorization drafts](standards/agent-auth-drafts.md).

### OpenAPI

The specification for describing HTTP APIs (operations, parameters, authentication and responses) in a machine-readable document. Agents rarely read it directly; harnesses and generators turn it into tool definitions, SDKs and MCP servers. See [OpenAPI, Arazzo and JSON Schema](standards/openapi-arazzo-json-schema.md).

## P

### pass@k and pass^k

Two ways to report repeated trials: pass@k is the chance that at least one of k attempts succeeds, while pass^k (introduced in [τ-bench](https://arxiv.org/abs/2406.12045)) is the chance that all k attempts succeed. pass^k is the better guide to whether a workflow is reliable enough to ship. See [Evaluating agent experience](concepts/evaluating-agent-experience.md).

### Problem details

A standard JSON format for HTTP API errors with a type URI, title, status, detail and extension fields ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html)). It gives agents a consistent, machine-readable place to find the cause of a failure and the next step. See [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md).

### Progressive disclosure

Showing an agent a short description first and loading full instructions or tools only when it chooses them, as Agent Skills do with their name and description ([guidance](https://agentskills.io/skill-creation/optimizing-descriptions)). The failure mode is that the agent never chooses to load the material. See [Context engineering](concepts/context-engineering.md) and [Tool selection at scale](concepts/tool-selection-at-scale.md).

### Protected Resource Metadata

An OAuth document ([RFC 9728](https://www.rfc-editor.org/rfc/rfc9728.html)) in which a resource server, such as a remote MCP server, tells clients which authorisation servers and scopes it accepts, so that clients can discover how to obtain a token. See [Agent identity and authorization](concepts/agent-identity-and-authorization.md).

## R

### Readiness score

A checklist-based score from a scanner that inspects a website, documentation set, code repository or tool catalogue for agent-relevant signals. None of the instruments in the curated list has published evidence that a higher score predicts agent task success, and scanners disagree with each other. See [Readiness scoring](concepts/readiness-scoring.md) and the [Readiness instruments](../../README.md#readiness-instruments) section.

### Residual authority replay

Reusing consent or credentials granted for one context after that context has changed, for example in a long-lived agent whose task or user has moved on ([study](https://arxiv.org/abs/2609.33910)). See [Human approval and control](concepts/human-approval-and-control.md).

### Rug pull

A tool or server changing its description or behaviour after a user or administrator has approved it, so that what was reviewed is no longer what runs. Pinning versions and re-reviewing on change are the usual mitigations. See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

## S

### Scoped payment credential

A payment token that carries its own limits, such as amount, currency, merchant and expiry, so that an agent can complete a purchase without holding a reusable card. Stripe's [shared payment tokens](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) are an example (vendor material). See [Agentic commerce](concepts/agentic-commerce.md) and [Agent payment protocols](standards/agent-payment-protocols.md).

### Server Card

An MCP extension (from SEP-2127) that lets a client fetch a server's metadata over HTTP before connecting to it, for discovery and vetting ([SEP-2127](https://modelcontextprotocol.io/seps/2127-mcp-server-cards)). See [Agentic resource discovery](standards/agentic-resource-discovery.md).

### Skill shadowing

The decline in performance when a growing library of skills or tools contains near-duplicates, so that the wrong one is chosen ([study](https://arxiv.org/abs/2605.24050)). See [Tool selection at scale](concepts/tool-selection-at-scale.md).

### Stateless MCP

Shorthand for the MCP 2026-07-28 design in which every request carries its protocol version and client capabilities, with no initialisation handshake and no `Mcp-Session-Id` header. Servers that need state across calls pass explicit handles as tool arguments ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). See [MCP](standards/mcp.md).

## T

### Tool annotations

Optional hints on an MCP tool, such as `readOnlyHint`, `destructiveHint`, `idempotentHint` and `openWorldHint`, that describe its behaviour to clients. The specification says clients must treat them as untrusted unless the server is trusted, and hosts often do not enforce them ([specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools); [study](https://arxiv.org/abs/2611.02527)). See [Tool design](concepts/tool-design.md).

### Tool description

The name, description and parameter schema an agent reads when deciding whether and how to call a tool. Wording, naming and schema shape all measurably affect selection ([study](https://arxiv.org/abs/2610.14334); [study](https://aclanthology.org/2025.emnlp-main.1060/)). See [Tool design](concepts/tool-design.md).

### Tool poisoning

Placing malicious instructions in tool metadata (descriptions, schemas or results) so that an agent follows them. Benchmarks such as [MCPTox](https://arxiv.org/abs/2508.14925) measure it on real servers (study), and related variants include rug pulls and shadowing. See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

### Tool search

Retrieving a small set of relevant tools from a large catalogue at run time instead of loading every definition into context. OpenAI and Anthropic both document built-in tool search ([OpenAI](https://developers.openai.com/api/docs/guides/tools-tool-search); [Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)). See [Tool selection at scale](concepts/tool-selection-at-scale.md).

### Tool shadowing

A malicious or careless tool whose description changes how an agent uses a different, trusted tool, or a tool registered under a name that collides with another provider's. Tool names are not identities, so a second server can capture requests meant for the first ([study](https://arxiv.org/abs/2611.21577)). See [Security for agent surfaces](concepts/security-for-agent-surfaces.md).

## W

### Web Bot Auth

A mechanism in which automated clients sign their HTTP requests with [RFC 9421](https://www.rfc-editor.org/rfc/rfc9421.html) message signatures and publish their keys, so that sites can verify which operator sent a request. It proves the operator, not which person asked or what they authorised. See [Web Bot Auth](standards/web-bot-auth.md) and [draft-ietf-webbotauth-httpsig-protocol](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/).

### WebMCP

A W3C Community Group draft through which a web page registers tools in the browser (each with a JSON Schema) that an agent in that browser can discover and call, as an addition to the human interface rather than a replacement ([draft](https://webmachinelearning.github.io/webmcp/)). See [WebMCP](standards/webmcp.md).

## Related pages

- [Standards tracker](standards-tracker.md) for status and versions
- [Getting started](getting-started.md) and [Learning path](learning-path.md)
- [Wiki home](README.md)
- The curated list: [Awesome Agent Experience](../../README.md)

Further reading (same maintainer): [AX versus UX, DX and GEO](https://agentexperience.tech/insights/ax-vs-ux-dx-geo/) and [Meanings of agent experience](https://agentexperience.tech/insights/meanings-of-agent-experience/).
