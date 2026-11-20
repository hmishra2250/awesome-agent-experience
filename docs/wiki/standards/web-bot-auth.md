# Web Bot Auth and HTTP message signatures

**In one line:** a way for an automated client to sign each HTTP request with a key published at a URL it controls, so a site can recognise that client across requests instead of trusting a user-agent string or an IP range.

**Last reviewed:** 2026-11-20

## What it is

Web Bot Auth builds on [RFC 9421, HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html), a Standards Track RFC (February 2024) for signing selected components of an HTTP message. The IETF webbotauth working group's protocol draft, [HTTP Message Signatures for automated traffic](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/), adds three pieces (specification):

- a `Signature-Agent` request header that carries the HTTPS URL where the client publishes its keys;
- a key directory format based on JSON Web Key Sets (JWKS);
- a well-known URI, `/.well-known/http-message-signatures-directory`, at which that directory is served.

A signing client sends `Signature-Input` and `Signature` headers as defined by RFC 9421, usually covering at least the `@authority` component so a signature for one site cannot be reused on another. The verifying site or CDN fetches the directory named in `Signature-Agent`, checks the signature, and attaches its own policy to the result.

The draft is precise about what this proves. A valid signature over a resolved URL shows that a holder of a key published at that URL signed the covered message. It says nothing about who operates the client, whether it is benign or whether the request is authorised; the draft calls those origin policy. Its out-of-scope section adds that it does not authenticate human users, provide anonymous authentication, or define authorisation or delegation.

## Why it matters for agents

Sites increasingly decide what automated traffic may do at the edge, and user-agent strings are easy to copy. An agent that cannot be told apart from abusive automation meets challenges, rate limits or blocks partway through a task, often on the booking or checkout step where it matters most. A verifiable identifier lets a site admit a known agent platform while still refusing crawlers it does not want. See [agent identity and authorization](../concepts/agent-identity-and-authorization.md).

The limit is equally important. Web Bot Auth identifies the agent platform, not the person who asked it to act or what that person authorised. Delegation needs separate mechanisms such as OAuth-based flows; see [agent authorization drafts](agent-auth-drafts.md).

## Current state

As of 2026-11-20, checked against the IETF Datatracker and vendor pages:

- **Steward.** The IETF Web Bot Auth working group (active). Its protocol document is a working group draft, [draft-ietf-webbotauth-httpsig-protocol-01](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/), dated 29 October 2026, intended for the Standards Track, with authors from Cloudflare and Google. It is not an RFC. The earlier individual directory and architecture drafts are marked Replaced in the Datatracker.
- **Related individual drafts.** [Anonymous Bot Authentication](https://datatracker.ietf.org/doc/draft-rescorla-anonymous-webbotauth/) (revision 01, July 2026) and PACE, [Capability Management for Agents](https://datatracker.ietf.org/doc/draft-meunier-webbotauth-capacity-management/) (revision 00, 15 November 2026), explore rate limiting and budgets without a stable per-client identifier. Neither is adopted.
- **Cloudflare.** Cloudflare's [Web Bot Auth documentation](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/) uses it as a verification method for verified bots and agents, with Ed25519 keys, a signed directory response and registration through its dashboard (vendor documentation). The page still cites the earlier individual draft revisions.
- **Google.** Google [signs a subset of Google-Agent requests](https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth) experimentally with the identity `https://agent.bot.goog`, and says not every Google user agent or request is signed. It advises sites to keep IP, reverse DNS and user-agent checks alongside signatures (page last updated 13 October 2026). Its [Allow Google-Agent traffic](https://developers.google.com/crawling/docs/crawlers-fetchers/allow-google-agent) page (last updated 17 November 2026) lists the headers and rule-ordering checks.
- **Commerce.** Shopify's [WebMCP tool reference](https://shopify.dev/docs/api/web-mcp) asks browser agents to sign requests with Web Bot Auth. Card-network trust layers use the same RFC 9421 building block; see [agentic commerce](../concepts/agentic-commerce.md).
- **W3C boundary.** The [draft Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html) leaves HTTP-level authentication of automated clients to the IETF group and plans to coordinate on how that identity relates to identity exposed to web pages.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *The mechanism is standards-based (specification).* RFC 9421 is published, and the protocol draft is a working group document with two implementers documenting deployments. The wire format can still change.
- *Behavioural bot defences do not separate agents cleanly (study).* [Broken Gates](https://arxiv.org/abs/2607.18659) (preprint, revised November 2026) evaluated solver services and LLM browser agents against widely deployed defences and found that browser and account state, more than the model, decided whether agents passed, and that a reconstructed browser environment transferred across agents. That supports moving from inferred to declared identity.
- *Self-declared identity is unreliable (study).* A controlled test of ten AI assistants found some used generic user agents that made attribution hard ([arXiv 2607.14447](https://arxiv.org/abs/2607.14447), preprint).

**Disputed or unsettled:**

- *Who stands behind the URL.* The draft deliberately does not say how trust in a `Signature-Agent` URL is earned or shared between sites. In practice CDNs maintain their own registries, which concentrates the decision.
- *Intermediary agents.* One platform signature may cover many end users. How a site should rate-limit or hold one user accountable behind a shared signature is the subject of the PACE and anonymous authentication drafts, not of the core protocol.
- *Effect on access.* No public study measures how much legitimate agent traffic is admitted or blocked because it is or is not signed.

## Practical checklist

For agent operators:

1. Generate a dedicated Ed25519 key for signing, separate from any other use, and publish it in a JWKS directory at the well-known path over HTTPS.
2. Sign every request, covering at least `@authority`, with short `created` and `expires` windows and a nonce if your verifiers need replay protection.
3. Rotate keys by publishing the new key alongside the old one before removing it, keeping the same directory URL.
4. Keep a stable, honest user-agent string as well; most sites still rely on it.

For site owners:

5. Check whether your CDN or WAF verifies Web Bot Auth, and log the verified `Signature-Agent` URL rather than the claimed one.
6. Never attach policy to an unverified `Signature-Agent` value; the draft says it is only a claim until the key verifies.
7. Order rules so verified agents are evaluated before broad data-centre, ASN or AI-category blocks, and cover in-journey calls (search, cart, API endpoints), as Google's page advises.
8. Make sure proxies and load balancers pass `Signature`, `Signature-Input` and `Signature-Agent` through unchanged.
9. Keep IP and reverse DNS fallbacks, because not all requests from a signing operator are signed.
10. Decide separately what a signed agent may do on behalf of a user; a signature is not consent.

## Common mistakes

- Treating a valid signature as proof that the request is authorised or that a particular person asked for it.
- Allowlisting a `Signature-Agent` URL without fetching its directory.
- Relying only on signatures during the experimental phase and turning away the unsigned share of a known agent's traffic.
- Citing vendor pages that reference superseded individual drafts as the current specification.
- Stripping signature headers at a reverse proxy, then wondering why verification fails.

## Sources and further reading

- [RFC 9421: HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) (standard)
- [HTTP Message Signatures for automated traffic](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/) (working group Internet-Draft)
- [Cloudflare Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/), [Google Web Bot Auth (experimental)](https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth) and [Allow Google-Agent traffic](https://developers.google.com/crawling/docs/crawlers-fetchers/allow-google-agent) (vendor documentation)
- [Broken Gates](https://arxiv.org/abs/2607.18659) (preprint)
- [terms.txt](https://arxiv.org/abs/2609.11152) (preprint proposing consent and payment terms built on Web Bot Auth; not adopted)
- The curated list section [Agent identity and authorization](../../../README.md#agent-identity-and-authorization)
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/)

## Related pages

- [Agent identity and authorization](../concepts/agent-identity-and-authorization.md)
- [Agent authorization drafts](agent-auth-drafts.md)
- [Content signals and AI preferences](content-signals-and-ai-preferences.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Agent analytics and observability](../concepts/agent-analytics-and-observability.md)
- [Agent payment protocols](agent-payment-protocols.md)
- [Standards tracker](../standards-tracker.md)
