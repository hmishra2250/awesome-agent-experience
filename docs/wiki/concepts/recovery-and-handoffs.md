# Recovery and handoffs

**In one line:** Agents will fail, retry and pass work on, so a surface is agent-ready when a failure tells the agent its next move, a retry cannot cause the same effect twice, and a handoff carries the job as well as the artefact.

Last reviewed: 2026-11-20

## What it is

**Recovery** is everything that happens after something goes wrong: the agent learns what failed, whether any state changed, whether trying again is safe, and what input or action would fix it. Its building blocks are structured errors, idempotent writes, status checks, explicit expiry and, where an action cannot be prevented, a way to undo or contain it.

**Handoffs** are the points where work moves between an agent and a person, between agents, or across context windows. A handoff fails in two directions: passing everything buries the signal, and passing a short summary tends to keep the facts while dropping the rules that govern them.

## Why it matters for agents

A person who sees a timeout can look at the screen and decide. An agent sees only what the surface returns. If a write timed out after committing, retrying duplicates it and giving up skips required work. In a sandbox study across nine models and three production harnesses, agents reported success in 90 per cent of the episodes in which they had duplicated an effect (study, [arXiv 2609.29095](https://arxiv.org/abs/2609.29095)). Silent failures are worse than loud ones: when production APIs returned an empty but valid response to a query they had not understood, models detected the problem in 12 per cent of cases and repaired it in none (study, [arXiv 2609.00035](https://arxiv.org/abs/2609.00035)).

## Current state

As of 2026-11-20:

- **Retry safety.** [The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) is an httpapi working group Internet-Draft at revision 08 (22 October 2026), not yet an RFC. It asks resources to answer a completed retry consistently with the original, to return `409` while the original is still in flight, `422` when a key is reused with a different payload, and `400` with [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) problem details when a required key is missing (specification, draft). [Stripe's idempotent requests](https://docs.stripe.com/api/idempotent_requests) show a production version of the same idea (vendor material).
- **Structured errors.** RFC 9457 Problem Details is a stable standard. The [RateLimit header fields](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/) are still a draft (revision 11, expiring 24 November 2026).
- **MCP.** The [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) separates protocol errors from tool execution errors (`isError: true`) and says clients should pass execution errors to the model so it can correct itself. Stateful tools should return handles, state their lifetime in the description and fail with a clear expiry error (specification). Long-running work is covered by the Tasks extension, which is at Beta stage ([extensions overview](https://modelcontextprotocol.io/docs/extensions/overview)).
- **Post-execution recovery.** Research runtimes propose undo and damage confinement for actions already taken ([GoEX, arXiv 2404.06921](https://arxiv.org/abs/2404.06921)), and BackBench tests whether agents can steer back from a harmful state in line with what people prefer ([arXiv 2604.18847](https://arxiv.org/abs/2604.18847)).

## What the evidence supports and what is disputed

Supported by evidence (almost all single-team preprints from 2026):

- **The tool contract decides when the outcome cannot be read back.** In LIMBO, frontier models rarely duplicated a write whose acknowledgement was lost when a read-back was available, but duplicated in most episodes when the request was still in flight or delivered twice. Offering an idempotency key on every write lowered the duplicate rate from 28 to 4 per cent because agents used keys when they existed, and the harness barely mattered (study, [arXiv 2609.29095](https://arxiv.org/abs/2609.29095)).
- **Error text is an instruction.** In 150 widely used MCP servers, about a third of error messages told the caller what to do next, and half of those steps depended on something the server could not see, such as running a terminal command. Naming a server tool in the step instead raised recovery on expired credentials to 84 per cent (study, [arXiv 2609.35381](https://arxiv.org/abs/2609.35381)).
- **Recovery options drive recovery.** Outcome Monitors attach a receipt naming the violated property and public recovery tools; removing the recovery-tool list removed the measured gain (study, [arXiv 2608.19303](https://arxiv.org/abs/2608.19303)).
- **Delivery changes the next action.** The same error text produced different behaviour depending on where it appeared in the conversation and whether the failed exchange was kept (study, [arXiv 2611.11581](https://arxiv.org/abs/2611.11581)).
- **Constraints belong in the schema.** Machine-checkable constraints produced honest errors, while prose-only constraints often failed silently, and moving a vocabulary into the schema removed the failure (study, [arXiv 2609.00035](https://arxiv.org/abs/2609.00035)). Schemas reduce malformed calls but not semantic misuse on their own (study, [arXiv 2603.13404](https://arxiv.org/abs/2603.13404)).
- **Callable is not the same as operable.** A valid call can still leave committed and uncommitted states indistinguishable to the agent; [Callability Is Not Operability](https://arxiv.org/abs/2608.23628) proposes explicit effect semantics, lifecycle and postcondition checks (study).

On handoffs:

- **Repeated compression loses learning.** A chain of agents each inheriting a short note learned less than one agent keeping its history, and writing each note from the full record recovered most of the loss (study, [arXiv 2611.18642](https://arxiv.org/abs/2611.18642)).
- **Summaries drop usage boundaries.** Handoff summaries kept operational facts while weakening the markers governing how they may be used; explicit constraints and an audience allowlist reduced leakage (study, [arXiv 2608.29028](https://arxiv.org/abs/2608.29028)).
- **Requirements degrade across subagents.** Signed requirement manifests with deterministic checks cut unsafe commits under attack, but injection before signing defeated them, so extraction is the trust boundary (study, preregistered, [arXiv 2611.07483](https://arxiv.org/abs/2611.07483)). Re-anchoring delegated calls to the original request reduced unauthorised actions ([arXiv 2608.07556](https://arxiv.org/abs/2608.07556)).
- **Verification is a common failure class.** The MAST taxonomy groups multi-agent failures into system design, inter-agent misalignment and task verification ([arXiv 2503.13657](https://arxiv.org/abs/2503.13657)).

Disputed or open:

- Whether error-text and delivery effects hold across models and products beyond the authors' environments.
- How much of a conversation a receiver should inherit. The evidence argues against both raw history and bare summaries, but does not settle a format.
- Whether signed or structured handoffs are worth their utility cost without an adversary; one study found losses for some models.

## Practical checklist

1. Accept an idempotency key on every write that creates, sends or moves something, and return the original result on a retry with the same key.
2. Offer a status or read-back call for every write, so an ambiguous timeout can be resolved without repeating the action.
3. Return failures as structured data (RFC 9457 or MCP `isError`) that say what failed, whether state changed, whether a retry is safe, and what would fix it.
4. Write next steps the agent can perform: name the tool or call to repeat, not a terminal command or "wait".
5. Encode allowed values in the schema rather than in prose.
6. Return a checkable confirmation of each state change, such as an identifier and the new state.
7. State handle and session lifetimes, and return explicit expiry errors.
8. Represent partial completion explicitly, listing what succeeded and what did not.
9. Make each handoff carry the original request verbatim, constraints and their status, state already changed, the authority in force, and what was verified versus assumed.
10. Write handoff notes from the full record, and check delegated results against the original requirements in code where possible.

## Common mistakes

- Returning `200` with an empty body for a query the server did not understand.
- Escalating on a retry counter rather than on a named condition.
- Error messages written for a developer at a terminal, sent to an agent that can only call tools.
- Summarising away constraints and permissions at a handoff.
- Keeping only the last attempt, so recovery looks like clean success.
- Taking an agent's "done" as evidence that the change happened.

## Sources and further reading

- Curated list: [Human control, approval and recovery](../../../README.md#human-control-approval-and-recovery) and [Tool use, tool descriptions and MCP](../../../README.md#tool-use-tool-descriptions-and-mcp).
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (vendor guidance on actionable errors).
- Further reading (same maintainer): [Design for recovery](https://agentexperience.tech/insights/design-for-recovery/), [Retries are product history](https://agentexperience.tech/insights/retries-are-product-history/) and [Preserve context through handoffs](https://agentexperience.tech/insights/preserve-context-through-handoffs/).

## Related pages

- [Tool design](tool-design.md)
- [CLI and API design for agents](cli-and-api-design-for-agents.md)
- [Context engineering](context-engineering.md)
- [Human approval and control](human-approval-and-control.md)
- [Evaluating agent experience](evaluating-agent-experience.md)
- [Agent analytics and observability](agent-analytics-and-observability.md)
- [OpenAPI, Arazzo and JSON Schema](../standards/openapi-arazzo-json-schema.md)
- [MCP](../standards/mcp.md)
