# CLI and API design for agents

**In one line:** Agents already drive command-line tools and HTTP APIs, so those surfaces need to run without a human at the keyboard, speak structured output, fail with errors an agent can act on, and make retries safe.

Last reviewed: 2026-11-20

## What it is

Many agents reach a product not through a purpose-built agent protocol but through the interfaces developers already use: a CLI called from a shell, an SDK, or an HTTP API, sometimes wrapped as MCP tools. Designing these for agents means removing the assumptions that a person is watching, can answer a prompt, can read a coloured table, or will notice a silent failure.

The recurring concerns are non-interactive operation (every prompt has a flag, and missing input fails fast), machine-readable output, truthful exit and status codes, structured errors that name a next step, idempotent writes, bounded responses (pagination, filtering, limits), and discoverable help (`--help`, OpenAPI, Arazzo).

## Why it matters for agents

A person can recover from an interactive picker, a spinner or a vague error. An agent often cannot. Mistral describes a terminal picker that showed an agent raw ANSI escape codes and locked it out of a command entirely until a flag was added ([Spaces](https://mistral.ai/news/spaces), vendor material). The same pattern appears at the API layer: when an error tells an agent to run a terminal command it does not have, or a prose-only constraint returns an empty success, the agent proceeds on a false picture ([arXiv 2609.35381](https://arxiv.org/abs/2609.35381); [SilentProbe](https://arxiv.org/abs/2609.00035)).

Retries are the sharpest case. Agents retry when a write times out, and without a contract that makes the retry safe, the second attempt may charge, post or deploy twice.

## Current state

**Vendor practice (vendor material).** Retrofitting existing CLIs is common. Mistral treats "every prompt as a flag in disguise", uses `-y` as a contract that nothing will block on standard input and that the command will fail loudly if it cannot proceed, returns plugin registries as JSON, and generates a `context.json` and an `AGENTS.md` on `init` ([Spaces](https://mistral.ai/news/spaces)). Nx describes structured output, idempotent commands and informative errors as goals ([Nx](https://nx.dev/blog/making-nx-agent-ready)). The [AXI](https://github.com/kunchenguid/axi) repository proposes ten CLI principles, including definitive empty states and next-step hints. A case study describes non-interactive defaults when an agent is detected ([How Vercel ships for agents](https://2027.dev/blog/how-vercel-ships-for-agents)). Pinecone and Stainless treat errors as guidance and machine-readable descriptions as part of the contract ([Pinecone](https://www.pinecone.io/blog/designing-agent-friendly-apis/); [Stainless](https://www.stainless.com/blog/steps-toward-great-agent-experience-every-api-provider-can-take-today/)).

**HTTP standards (specification).** As of 2026-11-20:

- [RFC 9457 Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) (July 2023, obsoletes RFC 7807) is a published standard for machine-readable error bodies.
- [RateLimit header fields](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/) is an httpapi working group Internet-Draft at revision 11 (23 May 2026), due to expire on 24 November 2026 unless revised. It is not an RFC.
- [The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) is an active httpapi working group Internet-Draft at revision 08 (22 October 2026). It is not an RFC.
- [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) describes operations, and [Arazzo 1.1.0](https://spec.openapis.org/arazzo/v1.1.0.html) describes multi-step workflows with success criteria and failure actions.

Stripe's [idempotent requests](https://docs.stripe.com/api/idempotent_requests) documentation is a widely copied concrete contract: client-generated keys up to 255 characters, saved results replayed for retries, a parameter comparison that rejects reuse with different input, and pruning of v1 keys after at least 24 hours (vendor material).

**Wrapping APIs as MCP (study).** Of 116 official MCP servers, 88.6% were fully or partially backed by REST and 92% implemented tools as bare API wrappers, exposing a median 19% of available operations; filtering and regrouping cut the median tool count per API by a third ([From REST to MCP](https://arxiv.org/abs/2507.16044)).

## What the evidence supports and what is disputed

**Idempotency belongs in the contract (study).** Across 25,930 episodes, when a read-back could reveal what happened the model decided the outcome, but when it could not (a request still in flight or delivered twice) the contract explained most of the variance. Offering an idempotency key on every write lowered the duplicate rate from 28% to 4%, and agents reported success in 90% of the episodes in which they had duplicated an effect ([arXiv 2609.29095](https://arxiv.org/abs/2609.29095), single-author preprint).

**Errors should name an action the caller can take (study).** Naming a server tool or the exact call to repeat in an error raised recovery sharply in tool-only agents ([arXiv 2609.35381](https://arxiv.org/abs/2609.35381)). Receipts that listed recovery tools after a silent failure improved completion, and removing the recovery-tool list removed the gain ([Outcome Monitors](https://arxiv.org/abs/2608.19303)). How an error is delivered also changes the next action, independent of its text ([arXiv 2611.11581](https://arxiv.org/abs/2611.11581)).

**API access over clicking (study).** An API-first agent finished tasks faster and with less user workload than UI actuation on one application ([AXIS](https://arxiv.org/abs/2409.17140)).

**Disputed: CLI, MCP or code?**

- A coding agent with only a terminal and a filesystem matched or outperformed more complex MCP and web-agent architectures at a fraction of the cost on the authors' enterprise tasks ([Terminal Agents Suffice](https://arxiv.org/abs/2604.00073), study).
- Code mode with typed return shapes beat plain MCP in a preregistered study with open-weight agents ([arXiv 2611.19123](https://arxiv.org/abs/2611.19123)), and calling typed functions from code matched or beat JSON tool calls for 11 of 14 models on BFCL v4 ([The Bitter Lesson of Tool Calling](https://arxiv.org/abs/2608.06370)).
- On the other side, one controlled comparison found the agent scaffolding moved cost far more than the choice between MCP and CLI ([arXiv 2608.08654](https://arxiv.org/abs/2608.08654)), and tool architecture changed behaviour with capability held constant ([arXiv 2608.11386](https://arxiv.org/abs/2608.11386)).
- A reasonable reading (opinion): the protocol matters less than whether the surface is non-interactive, structured, honest about outcomes and safe to retry. MCP adds per-connection credential scoping and works in hosts without a shell; a CLI suits agents that already have one. Many vendors ship both from one specification.

**Disputed: detect the agent or design one surface?** Some vendors switch behaviour when an agent is detected; others argue that good defaults for agents are good defaults for people. No controlled comparison was found.

## Practical checklist

1. Run every command with standard input closed. Nothing hangs, and missing input exits non-zero with a message naming the flag.
2. Every interactive choice has a flag or configuration equivalent, and `-y` or `--yes` never silently picks a destructive default.
3. A `--json` (or equivalent) mode returns a stable schema, results go to standard output and diagnostics to standard error.
4. Exit codes and HTTP status codes are truthful: a cancelled or partial operation never exits 0 or returns 200 with an empty body.
5. Error bodies follow RFC 9457 or an equally stable shape, with a type, a human-readable detail and a next step the caller can perform.
6. Every non-idempotent write accepts an idempotency key, rejects reuse with different parameters, and documents how long keys are kept.
7. List operations paginate with a cursor and a default limit, and say when results were truncated.
8. Rate limits are signalled in headers or the error body with when to retry and which call to repeat.
9. `--help` and the OpenAPI description are complete enough that an agent can choose the right operation without guessing, and multi-step flows are described in Arazzo or in documentation.
10. Each write can be read back, so an agent can check whether an effect happened before retrying.

## Common mistakes

- Spinners, progress bars and colour codes in output that an agent must parse.
- Confirmation prompts that exit 0 when refused.
- Errors that say "contact support" or "run `login`" to a caller that cannot.
- Wrapping every endpoint as an MCP tool and calling the result agent-ready.
- Treating draft headers (RateLimit, Idempotency-Key) as settled standards rather than drafts that may still change.

## Sources and further reading

- Curated list: [Tool design guides](../../../README.md#tool-design-guides), [Protocols and machine-readable surfaces](../../../README.md#protocols-and-machine-readable-surfaces) and [Human control, approval and recovery](../../../README.md#human-control-approval-and-recovery).
- Start with [Spaces](https://mistral.ai/news/spaces) (vendor material), [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) (specification) and [Where Does Exactly-Once Live?](https://arxiv.org/abs/2609.29095) (study, preprint).
- Further reading (same maintainer): [How to expose a 3,000-operation API to agents](https://agentexperience.tech/insights/large-api-surfaces-for-agents/), [Design for recovery](https://agentexperience.tech/insights/design-for-recovery/) and [Retries are product history](https://agentexperience.tech/insights/retries-are-product-history/).

## Related pages

- [Tool design](tool-design.md)
- [Tool selection at scale](tool-selection-at-scale.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [Human approval and control](human-approval-and-control.md)
- [Agent identity and authorization](agent-identity-and-authorization.md)
- [OpenAPI, Arazzo and JSON Schema](../standards/openapi-arazzo-json-schema.md)
- [MCP](../standards/mcp.md)
- [AGENTS.md](../standards/agents-md.md)
