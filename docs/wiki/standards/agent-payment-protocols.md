# Agent payment protocols: AP2, ACP, UCP, x402, MPP and card-network layers

**In one line:** several overlapping, pre-1.0 protocols that solve different layers of an agent purchase (checkout, proof of user intent, per-request payment and agent identity at the merchant), none of which is yet a finished standard.

Last reviewed: 2026-11-20

## What it is

"Agent payments" is not one protocol. It is a stack of separate layers, and most confusion comes from comparing protocols that sit at different layers:

| Layer | Question it answers | Main examples |
| --- | --- | --- |
| Checkout | How does an agent build a cart and place an order with a merchant? | ACP, UCP |
| User intent and mandates | What exactly did the person authorise, and can every party verify it? | AP2 mandates, Mastercard Verifiable Intent |
| Per-request payment | How does a client pay for a single HTTP resource? | x402, MPP |
| Agent identity at the merchant | Is this a recognised agent acting for a real user? | Visa Trusted Agent Protocol, Web Bot Auth |
| Credential | What payment credential does the merchant actually receive? | Scoped tokens such as Stripe shared payment tokens, network agentic tokens |

A real deployment usually combines several of these. UCP, for example, lists AP2 among its built-in options, and AP2 is offered as an extension to A2A and UCP.

## Why it matters for agents

For the agent, each layer is a place where it can be stopped or misled. A checkout protocol decides what state the agent can read back (placed, pending or failed). A mandate format decides whether a merchant can tell a legitimate delegated purchase from an injected one. A per-request payment scheme decides whether a retry after a timeout is safe or pays twice. The design concerns behind this page are covered in [Agentic commerce](../concepts/agentic-commerce.md).

## Current state

All statements below were checked against the live project pages. As of 2026-11-20:

**ACP, Agentic Commerce Protocol.** Steward: maintained by OpenAI and Stripe. Status: the repository says the specification is in beta. Versioning is date based; the latest dated release in the repository is 2026-04-17 (cart, feed, orders, authentication and MCP), after earlier releases on 2025-09-29, 2025-12-12, 2026-01-16 and 2026-01-30, with further work in an unreleased folder. It ships OpenAPI and JSON Schema files per version. ([repository](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)) (specification).

**AP2, Agent Payments Protocol.** Steward: started by Google; the site states that further standardisation will continue within the FIDO Alliance Agentic Authentication Technical and Payments Technical Working Groups. Latest version: v0.2.0 (GitHub release dated 28 April 2026). It defines Checkout Mandates and Payment Mandates as verifiable digital credentials, each with an open stage (constraints for autonomous execution) and a closed stage (a finalised checkout), and covers both human-present and human-not-present flows ([ap2-protocol.org](https://ap2-protocol.org/)) (specification).

**UCP, Universal Commerce Protocol.** Steward: a co-developed open specification whose site lists Google, Shopify, major retailers, travel and food-delivery companies among its developers. Latest version: GitHub release v2026-08-25. Transports are REST and JSON-RPC, with AP2, A2A and MCP support described as built in, and capabilities for catalogue, cart, identity linking, checkout and order management ([ucp.dev](https://ucp.dev/)). Google's implementation guide defines a checkout status lifecycle (`incomplete`, `ready_for_payment`, `ready_for_complete`, `completed`, `canceled`, and `error` from UCP 2026-04-08), points to a conformance test suite, and currently hands payment entry to a Google interface rather than the agent ([native checkout overview](https://developers.google.com/merchant/ucp/guides/overview/native-checkout), updated 2026-11-03) (specification and vendor material).

**x402.** Steward: the x402 Foundation organisation on GitHub. The repository holds version 1 and version 2 specification documents, payment schemes named `exact`, `upto` and `batch-settlement`, and SDKs including an MCP package. It describes itself as network and currency agnostic but states it will not deprioritise on-chain payments in favour of fiat ([repository](https://github.com/x402-foundation/x402)) (specification).

**MPP, Machine Payments Protocol.** Core document: [draft-httpauth-payment-01](https://datatracker.ietf.org/doc/draft-httpauth-payment/), "The Payment HTTP Authentication Scheme", an individual IETF Internet-Draft posted 9 September 2026 (not adopted by a working group; expires March 2027). It extends HTTP authentication: the server answers 402 with `WWW-Authenticate: Payment`, the client retries with `Authorization: Payment`, and success can carry a `Payment-Receipt` header. Payment methods are registered separately, so the core is rail agnostic. The developer site documents RFC 9457 problem details for retryable failures, a 403 response when a credential has already been consumed so that an automatic client does not pay again, and an optional digest that binds a challenge to the request body ([mpp.dev](https://mpp.dev/protocol)) (specification).

**Card-network trust layers.** Mastercard's [Verifiable Intent](https://github.com/agent-intent/verifiable-intent) is Draft v0.1: a layered SD-JWT delegation chain from credential provider to user to agent, with Immediate (user confirms final values) and Autonomous (user sets constraints) modes; transport, key provisioning and dispute resolution are out of scope. Visa's [Trusted Agent Protocol](https://github.com/visa/trusted-agent-protocol) is a sample implementation using RFC 9421 signatures with timestamps, a session identifier and key identifier, bound to the merchant domain and operation, plus an agent key registry; no version number is published. Stripe's [shared payment tokens](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) (public preview) note that Stripe may use network programmes such as Mastercard Agent Pay, Visa Intelligent Commerce and American Express ACE Kit behind the token (vendor material).

**Also watch.** [draft-skyfire-oauth-kyapay-token](https://datatracker.ietf.org/doc/draft-skyfire-oauth-kyapay-token/) (revision 04, 16 November 2026) defines a JWT carrying agent identity and payment claims; it is an individual draft with no working group standing.

**Adoption evidence.** Partner and transaction figures for these protocols come from their sponsors. One security preprint states in its abstract that x402 has driven 130 million all-time transactions ([arXiv 2605.30998](https://arxiv.org/abs/2605.30998)); that is a count of transactions, not an audited measure of commercial volume. Independent, audited figures for agent purchase volume were not found.

## What the evidence supports and what is disputed

**Supported (study).** Independent analysis consistently finds that the weak point is the binding between what was authorised, what was charged and what was delivered. A formal Tamarin analysis across x402, MPP, ACP and AP2 reports 86 verification cases and 40 previously undocumented consistency findings ([arXiv 2609.00060](https://arxiv.org/abs/2609.00060)). An AP2 v0.2 analysis shows that inputs shaping a transaction before signing (A2A messages, MCP tool calls) are outside mandate protection ([arXiv 2608.23858](https://arxiv.org/abs/2608.23858)). An x402 study reports duplicate-settlement races and cross-resource substitution against official SDKs ([arXiv 2605.30998](https://arxiv.org/abs/2605.30998)). These are preprints, and the AP2 work used an author-built testbed because no complete public deployment was available.

**Supported (vendor practice).** Credentials that agents carry are scoped: amount, currency, expiry and single resolution in Stripe's tokens; per-layer lifetimes from minutes to days in Verifiable Intent.

**Disputed.** Whether x402 and MPP will converge or coexist (mpp.dev publishes its own comparison, which is not neutral); whether autonomous agent checkout or human-completed handoff becomes the norm; and whether cross-protocol mappings claimed by trust layers hold up without shared conformance tests (opinion).

## Practical checklist

1. Write down which layer each protocol you are considering occupies before comparing them.
2. Pin the exact version (date or tag) you implement and record it in your integration code and logs.
3. Read back order or session state after every write, using the protocol's status values, rather than inferring success from an HTTP 200.
4. Bind each payment challenge or mandate to the specific request, cart or resource it covers (for example MPP's body digest), and reject reuse.
5. Return a final, non-retryable response when a credential has already been consumed.
6. Use typed problem details for payment failures so an agent can distinguish "try another instrument" from "stop".
7. Accept idempotency keys on every money-moving write.
8. Run any conformance suite the protocol publishes (UCP lists one) and keep the results with your release notes.
9. Treat partner counts and transaction totals in launch material as sponsor claims until independently measured.

## Common mistakes

- Comparing ACP with x402 as if they were alternatives; one is checkout, the other per-request payment.
- Citing AP2, UCP or ACP as "the standard". As of 2026-11-20 none is a ratified standard, and MPP's IETF document is an individual draft.
- Assuming a signature proves user intent. It proves who signed, not whether the context shaping the request was honest.
- Building for one agent surface and calling it protocol support. Implementing ACP does not by itself list a merchant on any AI shopping surface.

## Sources and further reading

- Curated list section: [Agentic commerce and payments](../../../README.md#agentic-commerce-and-payments)
- [RFC 9421: HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) and [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [Get In, Decide, Prove: a merchant-side readiness benchmark](https://arxiv.org/abs/2610.17378) (pilot, preprint)
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/)

## Related pages

- [Agentic commerce](../concepts/agentic-commerce.md)
- [Agent authentication and authorisation drafts](agent-auth-drafts.md)
- [Web Bot Auth](web-bot-auth.md)
- [A2A](a2a.md) and [MCP](mcp.md)
- [Standards tracker](../standards-tracker.md)
