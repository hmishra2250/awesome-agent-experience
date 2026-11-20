# Agentic commerce

**In one line:** agents finding, choosing and paying for things on a person's behalf, where the hard design problems are what the person actually authorised, what the merchant can prove afterwards, and what happens when a payment half-succeeds.

Last reviewed: 2026-11-20

## What it is

Agentic commerce covers two different flows that are often discussed as one:

- **Delegated shopping and checkout.** An agent searches a catalogue, builds a cart and either completes the purchase or hands the final step back to the person. The merchant usually stays merchant of record. Protocols in this space include ACP, UCP and AP2.
- **Machine payments for machine resources.** An agent pays per request for an API call, a dataset or a tool result, typically by answering an HTTP 402 challenge. x402 and the Machine Payments Protocol (MPP) live here.

Both flows rest on the same three questions: who is this agent, what did the person authorise it to do, and how does every party check that the charge matches the authorisation. The protocol details are on [Agent payment protocols](../standards/agent-payment-protocols.md). This page is about the design decisions a merchant, platform or API owner has to make regardless of protocol.

## Why it matters for agents

Commerce is where agent mistakes cost money. A wrong tool call in a coding session is usually reversible; a wrong order, a duplicated charge or a payment taken for goods that were never delivered is not. Three surfaces carry most of the risk:

1. **The catalogue.** If price, stock, total cost or return terms are missing or ambiguous, the agent cannot decide whether an offer meets the person's constraints. A merchant-side pilot benchmark found that no buyer mandate could be confirmed as met at four large merchants because a total or a refund term was left undetermined, and that 105 of 555 merchant home pages (18.9 per cent) were unreadable to both declared automated profiles it tested (study, [arXiv 2610.17378](https://arxiv.org/abs/2610.17378)). OpenAI's [product feed schema](https://developers.openai.com/commerce/specs/file-upload/products) shows what an explicit contract looks like: stable item and group identifiers, an `availability` value that must be stated (with `unknown` only when stock really is unknown), and a rule that an omitted shipping price means unknown, not free (vendor material).
2. **The consent moment.** Someone has to approve a spend. The design choice is whether the person confirms exact final values (human present) or sets constraints in advance and lets the agent act (human not present). Mastercard's [Verifiable Intent](https://github.com/agent-intent/verifiable-intent) draft names these Immediate and Autonomous modes, and AP2 distinguishes open mandates (constraints) from closed mandates (a finalised checkout) ([AP2](https://ap2-protocol.org/)) (specification).
3. **Recovery.** Payments fail in partial ways: declined cards, expired challenges, settlements that land after a timeout. An agent that cannot tell "declined, choose another card" from "charged, do not retry" will either give up or pay twice.

## Current state

As of 2026-11-20, every major protocol is pre-1.0, in draft or in preview. ACP describes itself as beta, AP2 is at v0.2, UCP publishes dated versions, MPP's core is an individual IETF Internet-Draft and Verifiable Intent is Draft v0.1 (see [Agent payment protocols](../standards/agent-payment-protocols.md) for dates and stewards).

Some vendor practice has nonetheless converged:

- **Scoped, single-use credentials.** Stripe's [shared payment tokens](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) (public preview) carry a currency, maximum amount and expiry, can be resolved only once, and emit a deactivation event when consumed, expired or revoked (vendor material).
- **Human-facing payment entry where determinism matters.** Google's [UCP native checkout guide](https://developers.google.com/merchant/ucp/guides/overview/native-checkout) (last updated 2026-11-03) has the agent build the cart and then hand control to a Google interface where the person enters payment and fulfilment details; the guide says the agent is not involved in that step (vendor material).
- **Server-side approval for agent keys.** Stripe returns an `approval_required` error when an agent-tagged key attempts an action covered by an approval rule, files an approval request, and reports the outcome through webhooks; unapproved requests expire after 14 days ([Stripe developer blog, 21 October 2026](https://stripe.dev/blog/your-ai-agent-can-move-money-in-stripe)) (vendor material).
- **Signed agent identity at the merchant edge.** Visa's [Trusted Agent Protocol](https://github.com/visa/trusted-agent-protocol) uses RFC 9421 message signatures bound to the merchant domain and operation, the same building block as [Web Bot Auth](../standards/web-bot-auth.md).

## What the evidence supports and what is disputed

**Supported.** A cluster of security preprints from May to September 2026 converges on one point: signing the final mandate is not enough. An analysis of AP2 v0.2 notes that the signed mandates protect transaction data only after signing, while the A2A messages and MCP tool calls that shape the transaction beforehand sit outside that protection; it catalogues 48 threats, eight rated High in at least one deployment architecture (study, [arXiv 2608.23858](https://arxiv.org/abs/2608.23858)). A Tamarin formal analysis of x402, MPP, ACP and AP2 reports 40 previously undocumented consistency findings and distils 18 shared principles, most about missing bindings between authorisation, settlement and fulfilment (study, [arXiv 2609.00060](https://arxiv.org/abs/2609.00060)). An x402 analysis identifies cross-resource substitution, duplicate-settlement races, allowance overdraft and denial of settlement (study, [arXiv 2605.30998](https://arxiv.org/abs/2605.30998)). All three are preprints and two rely on author-built testbeds.

**Supported, with caution.** Agent purchasing behaviour is unstable. ACES finds position biases that vary by provider and model version, persist in text-only interfaces, and shift when models are updated; agents penalise "sponsored" tags and reward platform endorsements (study, [arXiv 2508.02630](https://arxiv.org/abs/2508.02630)). A follow-up finds that naming a platform rather than the consumer as the agent's principal weakens the penalty on sponsored listings, and that stricter disclosure wording does not remove the effect (study, [arXiv 2609.17989](https://arxiv.org/abs/2609.17989)). One controlled before-and-after study on a single prototype shop reports large gains in agent task success from an agent-ready redesign (study, [arXiv 2607.12056](https://arxiv.org/abs/2607.12056)).

**Disputed or unproven.** Whether autonomous checkout or human-completed handoff will dominate; how the overlapping protocols will interoperate (no cross-protocol conformance testing is documented); and whether any merchant readiness score predicts purchase outcomes. Market-size forecasts are forecasts, not evidence of current volume (opinion).

## Practical checklist

1. Every purchasable item has a stable identifier, an explicit availability value and a price with an ISO currency code, and variants are separate rows sharing a group identifier.
2. Total cost (tax, shipping, fees), return or cancellation terms and delivery date can be determined from machine-readable data before payment, not only on a final page.
3. You have decided, per flow, whether the person confirms exact final values or pre-authorises constraints, and the interface states which mode is in use.
4. Payment credentials passed through agents are scoped to merchant, amount, currency and expiry, and are single use unless recurrence is explicit.
5. Every write that moves money accepts an idempotency key ([IETF draft-ietf-httpapi-idempotency-key-header](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/), still a draft; [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)).
6. Payment declines return a structured, typed error that says whether retrying with another instrument is possible; UCP's guide asks for structured error payloads rather than bare 4xx codes for declines.
7. A request that has already been paid returns a final response that tells an automatic client not to pay again (MPP uses 403 for this case, see [mpp.dev](https://mpp.dev/protocol)).
8. Approval outcomes (approved, rejected, expired, succeeded, failed) reach the agent by webhook or polling, so it can resume or report rather than guess.
9. Sponsored and promoted placements are labelled in the structured data the agent reads, not only visually.
10. Agent-initiated orders are logged with the agent identity, the mandate or approval reference and the final charged amount, so a dispute can be reconstructed.

## Common mistakes

- Choosing a protocol before the catalogue is complete and current. No protocol fixes a missing return policy.
- Treating a signed mandate as proof that the person wanted the item. It proves what was signed, not that the context shaping it was honest.
- Returning the same error for "declined" and "charged but timed out", which invites duplicate payment.
- Blocking all automated traffic at offer pages, then wondering why agents cannot buy.
- Letting an agent self-approve, or approving a summary the agent wrote rather than the action that will execute (see [Human approval and control](human-approval-and-control.md)).

## Sources and further reading

- Curated list section: [Agentic commerce and payments](../../../README.md#agentic-commerce-and-payments)
- [Agent Payments Protocol (AP2)](https://ap2-protocol.org/), [Universal Commerce Protocol](https://ucp.dev/), [Agentic Commerce Protocol](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol), [x402](https://github.com/x402-foundation/x402)
- [How Stripe is designing Checkout for AI agents](https://stripe.dev/blog/how-stripe-is-designing-checkout-for-ai-agents) (vendor material)
- Further reading (same maintainer): [Approval is a workflow](https://agentexperience.tech/insights/approval-is-a-workflow/), [Retries are product history](https://agentexperience.tech/insights/retries-are-product-history/), [Design for recovery](https://agentexperience.tech/insights/design-for-recovery/)

## Related pages

- [Agent payment protocols](../standards/agent-payment-protocols.md)
- [Agent identity and authorization](agent-identity-and-authorization.md)
- [Human approval and control](human-approval-and-control.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [Agent-ready websites](agent-ready-websites.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
