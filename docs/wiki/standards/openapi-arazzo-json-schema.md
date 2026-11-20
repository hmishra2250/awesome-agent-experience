# OpenAPI, Arazzo and JSON Schema for agents

**In one line:** the machine-checkable contracts underneath most agent tools: OpenAPI describes HTTP operations, JSON Schema describes the shape of inputs and outputs, and Arazzo describes multi-step workflows with their success and failure paths.

**Last reviewed:** 2026-11-20

## What it is

- **OpenAPI** describes an HTTP API: paths, operations, parameters, request and response bodies, security schemes and errors. Version 3.2 added, among other things, a slot for QUERY operations, an `additionalOperations` map for other HTTP methods, `itemSchema` for sequential (streamed) media types and a `kind` field on tags ([OpenAPI 3.2.1](https://spec.openapis.org/oas/v3.2.1.html), specification).
- **JSON Schema** is the vocabulary that OpenAPI's Schema Object, MCP tool `inputSchema` and `outputSchema`, WebMCP tools and most function-calling APIs use to describe arguments and results ([JSON Schema 2020-12](https://json-schema.org/draft/2020-12), specification).
- **Arazzo** describes a sequence of API calls that achieves an outcome. Steps declare `successCriteria`, and `onFailure` actions can end the workflow, `goto` another step or workflow, or `retry` within `retryAfter` and `retryLimit` bounds ([Arazzo 1.1.0](https://spec.openapis.org/arazzo/v1.1.0.html), specification). It can reference OpenAPI and AsyncAPI descriptions.
- **Overlay** defines a separate document that augments an existing OpenAPI description, which lets a team add agent-oriented descriptions without editing the source ([Overlay 1.2.0](https://spec.openapis.org/overlay/latest.html), specification).

Models rarely read these files directly. Harnesses, SDK generators and MCP server generators turn them into tool definitions, so their quality flows into every agent surface built from them.

## Why it matters for agents

An agent chooses and calls a tool from its name, description and parameter schema alone. If an OpenAPI description has vague summaries, untyped strings where an enumeration belongs, or no documented errors, every generated tool inherits those gaps. Protocols change; the contract underneath tends to outlast them. Investing in the description therefore improves an [MCP](mcp.md) server, a [WebMCP](webmcp.md) tool, an SDK and the documentation at once. See [tool design](../concepts/tool-design.md) and [CLI and API design for agents](../concepts/cli-and-api-design-for-agents.md).

Arazzo matters for a different reason: agents often fail on sequence and recovery rather than on single calls. A workflow description states which call comes first, what counts as success and what to do on a 401 or a 503.

## Current state

As of 2026-11-20, checked against the specification sites:

- **Steward.** The OpenAPI Initiative, a Linux Foundation project, publishes OpenAPI, Arazzo and Overlay at [spec.openapis.org](https://spec.openapis.org/). JSON Schema is published by the JSON Schema organisation.
- **Latest versions.** OpenAPI 3.2.1 (10 September 2026) is the latest published version, a patch release on 3.2.0 (19 September 2025); 3.1.x remains common in tooling. Arazzo 1.1.0 is dated 17 May 2026. Overlay 1.2.0 is dated 22 September 2026. The [JSON Schema specification page](https://json-schema.org/specification) names 2020-12 as the current version.
- **Neighbouring standards.** [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html) is the stable format for structured HTTP errors. The [Idempotency-Key header](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) (revision 08, 22 October 2026) and [RateLimit header fields](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/) (revision 11, expiring 24 November 2026) are still Internet-Drafts. [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html) lets a site publish a catalogue of its API descriptions.
- **Adoption evidence.** On the seven sites in Vercel and Ora's runs that shipped an `openapi.json`, agents fetched it in 21 per cent of runs ([Vercel guide](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents), vendor study). That measures retrieval, not task success. A study of 116 official MCP servers found 88.6 per cent fully or partially backed by REST APIs and 92 per cent implementing tools as bare API wrappers ([From REST to MCP](https://arxiv.org/abs/2507.16044), preprint).

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Schema shape affects selection, not only invocation (study).* Single-factor interventions across five models found parameter-schema changes produced the largest and most consistent shifts in which MCP tool was chosen, with models favouring separate top-level parameters over grouped or composite forms ([arXiv 2610.14334](https://arxiv.org/abs/2610.14334), preprint).
- *Names matter for smaller models (study).* Renaming schema components towards names familiar from pretraining improved tool-use accuracy and cut hallucinated tool names in small models ([PA-Tool, ACL 2026](https://aclanthology.org/2026.acl-long.948/), peer-reviewed).
- *Schemas fix syntax more than semantics (study).* In a small controlled pilot, JSON Schema contracts and structured validation diagnostics reduced malformed calls but not conceptually wrong ones, and task success stayed at zero in every condition ([Schema First Tool APIs](https://arxiv.org/abs/2603.13404), preprint, one model).
- *Description quality is often poor (study).* An industrial assessment of 16 production APIs with about 600 endpoints found documentation or REST smells in every analysed operation, after MCP-based agents failed at planning, selection and payload construction ([Making OpenAPI Documentation Agent-Ready](https://arxiv.org/abs/2605.14312), EASE 2026).
- *Errors are part of the contract (study).* Many MCP error messages tell a tool-only agent to run a terminal command or open a page; naming a tool to call next raised recovery in the authors' tests ([arXiv 2609.35381](https://arxiv.org/abs/2609.35381), preprint).

**Disputed or unsettled:**

- *Generate or design.* Automated generation from OpenAPI succeeded for 76 per cent of sampled tools and repair raised that to 94.2 per cent in one study ([From REST to MCP](https://arxiv.org/abs/2507.16044)), but bare one-to-one wrapping leaves agents to discover the sequence. How much hand design beats generation plus filtering is not settled.
- *Arazzo in practice.* No published study measures whether supplying an Arazzo workflow improves agent task completion.
- *Effect metadata.* Research such as [Callability Is Not Operability](https://arxiv.org/abs/2608.23628) argues interfaces should expose effects, commit state and postconditions. OpenAPI has no standard field for idempotency or reversibility; teams use extensions and descriptions.

## Practical checklist

1. Give every operation a specific `summary` and a `description` that says when to use it and how it differs from similar operations.
2. Describe every parameter, mark required fields, and use `enum`, `format`, `minimum` and `maximum` where values are closed or bounded.
3. Prefer flat, explicitly named parameters over opaque objects or free-text query strings for agent-facing operations.
4. Document every error response with an RFC 9457 problem details body that names the field at fault and the next valid action.
5. State idempotency and side effects in the description, accept an `Idempotency-Key` on unsafe writes, and say what a retry returns.
6. Return `429` with `Retry-After` and document rate limits.
7. Add examples for requests and responses, and keep them valid against the schema in CI.
8. Write Arazzo workflows for the three or four tasks agents most often attempt, including `onFailure` paths for expired credentials and rate limits.
9. Lint the description for missing descriptions, untyped fields and undocumented errors, and use an Overlay to keep agent-oriented descriptions maintainable.
10. Publish the description at a stable URL, link it from `/.well-known/api-catalog`, and evaluate generated tools with real agents before release.

## Common mistakes

- Treating a valid OpenAPI file as an agent-ready one; validity says nothing about clarity.
- Exposing hundreds of generated operations as tools without filtering or grouping. See [tool selection at scale](../concepts/tool-selection-at-scale.md).
- Error bodies that say only "400 Bad Request".
- Descriptions written for humans with a dashboard ("click Settings to find your key").
- Letting SDKs, MCP servers and docs drift from the description they were generated from.

## Sources and further reading

- [OpenAPI 3.2.1](https://spec.openapis.org/oas/v3.2.1.html), [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html), [Arazzo 1.1.0](https://spec.openapis.org/arazzo/v1.1.0.html), [Overlay 1.2.0](https://spec.openapis.org/overlay/latest.html) and [JSON Schema 2020-12](https://json-schema.org/draft/2020-12) (specifications)
- [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [Idempotency-Key draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) and [RateLimit draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/)
- [Which Metadata Matters for LLM Tool Selection in MCP?](https://arxiv.org/abs/2610.14334), [PA-Tool](https://aclanthology.org/2026.acl-long.948/), [Schema First Tool APIs](https://arxiv.org/abs/2603.13404), [From REST to MCP](https://arxiv.org/abs/2507.16044) and [Making OpenAPI Documentation Agent-Ready](https://arxiv.org/abs/2605.14312)
- The curated list sections [Protocols and machine-readable surfaces](../../../README.md#protocols-and-machine-readable-surfaces) and [Tool use, tool descriptions and MCP](../../../README.md#tool-use-tool-descriptions-and-mcp)
- Further reading (same maintainer): [Large API surfaces for agents](https://agentexperience.tech/insights/large-api-surfaces-for-agents/), [Tool descriptions](https://agentexperience.tech/insights/tool-descriptions/) and [Design for recovery](https://agentexperience.tech/insights/design-for-recovery/)

## Related pages

- [Tool design](../concepts/tool-design.md)
- [CLI and API design for agents](../concepts/cli-and-api-design-for-agents.md)
- [Tool selection at scale](../concepts/tool-selection-at-scale.md)
- [Recovery and handoffs](../concepts/recovery-and-handoffs.md)
- [MCP](mcp.md)
- [Agentic resource discovery](agentic-resource-discovery.md)
