# Agent identity and authorisation

**In one line:** Knowing which agent is calling, who operates it, on whose behalf it acts and what it may do for this task, and checking all four at every boundary rather than once at sign-in.

Last reviewed: 2026-11-20

## What it is

Agent identity and authorisation answers four separate questions that are often collapsed into one.

- **Operator identity:** which platform or service is sending this request. On the web this is moving from user-agent strings and IP ranges to signed requests.
- **Client registration:** how a piece of agent software becomes known to an authorisation server it has never met before.
- **Delegation:** which person or organisation authorised the work, and with what scope and duration.
- **Per-action authorisation:** whether this specific call, on this resource, is within what the agent, the delegating person and the task jointly allow.

The classic failure is the **confused deputy**: a program that holds broad authority is steered, by a less privileged requester or by injected content, into using that authority on their behalf. Agents are unusually exposed to it because they hold ambient credentials and take instructions from text they did not write. The W3C TAG's draft finding on agentic browsing describes a browsing agent as a confused deputy for exactly this reason (opinion, [TAG Draft Finding](https://w3ctag.github.io/agentic-browsing-finding/), 27 October 2026).

## Why it matters for agents

Without a verifiable identity, a site can only guess whether traffic is a legitimate agent, a scraper or an attacker. The Broken Gates study found that behavioural bot defences mostly test the browser and account state an agent presents, and that a reconstructed browser environment let previously rejected agents pass (study, [arXiv 2607.18659](https://arxiv.org/abs/2607.18659)). Behavioural scoring neither stops determined automation nor gives a well-behaved agent a reliable way in.

Without bounded delegation, an agent that can act at all tends to be able to act too broadly. The OpenID Foundation's cross-boundary threat classification names scope reinterpretation at trust boundaries as the main threat, and argues that treating an agent as though it were a human user is the common root of the failures it lists (opinion, [OpenID Foundation AIIM, 12 October 2026](https://openid.net/wp-content/uploads/2026/10/A-Protocol-Agnostic-Threat-Classification-for-Cross-Boundary-AI-Agent-Authorization_with-Cover.pdf)).

## Current state

As of 2026-11-20:

- **Signed operator identity.** The IETF webbotauth working group has adopted [HTTP Message Signatures for automated traffic](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/) (revision 01, 29 October 2026, Internet-Draft). It builds on [RFC 9421](https://www.rfc-editor.org/rfc/rfc9421.html) and defines a `Signature-Agent` header, a JWKS key directory and a well-known URI. [Cloudflare documents verification](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/), and [Google signs a subset of Google-Agent requests](https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth) experimentally while advising sites to keep IP, reverse DNS and user-agent checks. See [Web Bot Auth](../standards/web-bot-auth.md).
- **MCP client registration.** The 2026-07-28 MCP revision sets a priority order: pre-registration, then [Client ID Metadata Documents](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration) (CIMD), then Dynamic Client Registration, which is now deprecated (specification). The underlying [CIMD draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/) is an OAuth working group document at revision 03 (2 November 2026).
- **Token binding in MCP.** Servers must validate that tokens were issued for them as the audience, clients must send the `resource` parameter from RFC 8707 and must not send tokens issued by any other authorisation server, and servers advertise their authorisation server through [RFC 9728 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728.html) (specification, [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)).
- **Enterprise delegation.** [Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) is a Stable MCP extension. It uses the [Identity Assertion JWT Authorization Grant](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-assertion-authz-grant/) (ID-JAG, revision 06, 31 October 2026, still a draft), obtained by [RFC 8693 token exchange](https://www.rfc-editor.org/rfc/rfc8693.html). Its support table notes that implementations target different draft revisions.
- **Cross-domain chaining.** [OAuth Identity and Authorization Chaining Across Domains](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-chaining/) (revision 17) is in the RFC Editor queue.
- **Agent-specific profiles.** The individual draft `draft-klrc-aiagent-auth` has been replaced by the WIMSE working group document [AI Identity Management System](https://datatracker.ietf.org/doc/draft-ietf-wimse-aims/) (revision 01, 2 November 2026), which applies existing WIMSE and OAuth standards rather than defining a new protocol. The often-cited on-behalf-of draft (`draft-oauth-ai-agents-on-behalf-of-user`) expired at revision 02 and should be treated as a historical proposal. See [Agent auth drafts](../standards/agent-auth-drafts.md).
- **Vendor object models.** Microsoft's [Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/key-concepts) separates agent identities from user accounts and service principals, with credentials held by a blueprint and enforced sponsorship, and [Google Cloud](https://docs.cloud.google.com/iam/docs/agent-identity-overview) gives agents their own attested identity (vendor material).
- **Principles and guidance.** CoSAI's [Agentic Identity and Access Management](https://www.coalitionforsecureai.org/wp-content/uploads/2026/04/agentic-identity-and-access-control.pdf) (v1.0, 20 March 2026) asks for agents as first-class identities, zero standing privilege, agent rights kept separate from on-behalf-of rights, and enforcement at every hop. The [NIST NCCoE project](https://pages.nist.gov/nccoe-ai-identity/) received over 600 comments, mostly favouring existing standards, and plans an SP 1800 practice guide.

## What the evidence supports and what is disputed

Supported by evidence:

- **Remote MCP authentication is often weak.** A measurement of 7,973 live remote MCP servers found 40.55 per cent exposing tools without authentication, and every one of 119 tested OAuth deployments had at least one flaw (study, [arXiv 2605.22333](https://arxiv.org/abs/2605.22333)). That study predates the deprecation of dynamic registration. A separate dynamic audit found 91.8 per cent of 414 audited servers lacked OAuth (study, [arXiv 2608.00150](https://arxiv.org/abs/2608.00150)).
- **Proxy servers break consent.** MCP servers that wrap an existing API with one static client ID, without binding OAuth state and consent to the user's session, allowed one-click account takeover in disclosed cases (vendor material, [Obsidian Security](https://obsidiansecurity.com/blog/when-mcp-meets-oauth-common-pitfalls-leading-to-one-click-account-takeover)). The MCP [security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) now describe this confused deputy pattern and the token passthrough anti-pattern (specification).
- **Authority drifts across delegation.** In MasDrift, re-anchoring every pending call to the original user request reduced unauthorised actions in every configuration tested at a small completion cost (study, [arXiv 2608.07556](https://arxiv.org/abs/2608.07556)). A2ABreak reports credential harvesting through multi-hop identity loss at the A2A specification level (study, [arXiv 2609.10871](https://arxiv.org/abs/2609.10871)).

Disputed or open:

- **Attenuation along the chain.** NCCoE commenters favour credentials that narrow at each hop, yet in MasDrift carrying an attenuated policy down the chain blocked required work and cost up to 36.3 points of completion. Both are plausible designs; neither has field evidence.
- **Whose identity.** Current mechanisms mostly stop at the operator. The TAG finding says agent identity delegation is not a settled concept, and an intermediary agent serving many users is hard to tell apart from any one of them.
- **Registration is not trust.** A CIMD shows that a client controls the URL hosting its metadata. It does not say the client is safe, so consent and policy still decide what it can obtain (opinion).

## Practical checklist

1. Publish Protected Resource Metadata for each API or MCP server and reject any token whose audience is not that server.
2. Never forward a client's token to a downstream API; obtain a separate token for the downstream call.
3. Support CIMD for clients without a prior relationship, validate redirect URIs against the fetched document, and keep dynamic registration only for backwards compatibility.
4. In proxy servers, require per-client consent, bind single-use, short-lived `state` to the user's session, and set consent cookies only after approval.
5. Give each agent its own identity, separate from human accounts, with a named human owner.
6. Request minimal scopes and return `403` with `insufficient_scope` and the required scope so clients can step up deliberately.
7. Check each tool call at the tool boundary against the intersection of agent, user and task authority, in code rather than in the prompt.
8. Log operator, agent instance, delegating user and granted scope on every action, separately from human actions.
9. Make delegated credentials expire with the task and revoke child credentials when a parent agent is revoked.
10. Verify Web Bot Auth signatures where your edge supports them, but keep existing verification as a fallback while signing is partial.

## Common mistakes

- Running an agent under a person's own account or a shared service account, so its actions cannot be separated or revoked.
- Treating a valid signature or a successful registration as permission to act.
- Granting tenant-wide scopes to autonomous agents because the needed scope is hard to predict ([WorkOS](https://workos.com/blog/agents-need-authorization-not-just-authentication), vendor material).
- Citing expired or individual drafts as if they were adopted standards.
- Relying on behavioural bot scores to decide which agents are legitimate.

## Sources and further reading

- Curated list: [Agent identity and authorization](../../../README.md#agent-identity-and-authorization) and [Security for agent-facing surfaces](../../../README.md#security-for-agent-facing-surfaces).
- [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization) (specification tutorial).
- [Identity Management for Agentic AI](https://arxiv.org/abs/2510.25819) (OpenID Foundation whitepaper, 2025).
- Further reading (same maintainer): [Let agents start before sign-up](https://agentexperience.tech/insights/let-agents-start-before-sign-up/) and [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/).

## Related pages

- [Web Bot Auth](../standards/web-bot-auth.md)
- [Agent auth drafts](../standards/agent-auth-drafts.md)
- [MCP](../standards/mcp.md)
- [A2A](../standards/a2a.md)
- [Human approval and control](human-approval-and-control.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Agentic commerce](agentic-commerce.md)
- [Standards tracker](../standards-tracker.md)
