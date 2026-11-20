# Agent authentication and authorisation drafts (IETF and OpenID)

**In one line:** the standards bodies are mostly profiling existing OAuth, workload identity and HTTP signature standards for agents rather than inventing a new agent protocol, and only a handful of the many agent drafts have working group standing.

Last reviewed: 2026-11-20

## What it is

This page tracks the IETF and OpenID Foundation documents that matter when an agent needs to prove who it is, get a token, or carry a person's authority across services. The concepts behind them (operator identity, delegation, registration) are explained on [Agent identity and authorization](../concepts/agent-identity-and-authorization.md). Here the focus is status: which documents exist, who owns them, and how settled they are.

A useful rule of thumb: an IETF **working group document** (a name starting `draft-ietf-`) has been adopted by a group and is on a path towards an RFC; an **individual draft** (any other `draft-` name) is one or more authors' proposal and may never progress. Both expire after about six months unless revised. An **RFC** is published and stable.

## Why it matters for agents

Agents break assumptions built into human login. They often run without a browser, act for many users at once, call tools across organisational boundaries, and delegate to other agents. If a service picks an ad hoc mechanism (shared API keys, copied session cookies, a bespoke header), agents either cannot get in or get in with far more authority than the task needs. Knowing which building blocks are stable lets a team design for the standard path now and swap in the agent-specific profiles as they mature.

## Current state

Status values below come from the IETF Datatracker and the OpenID Foundation site. As of 2026-11-20:

### IETF working group documents

| Document | Group | Latest revision | State | What it does |
| --- | --- | --- | --- | --- |
| [draft-ietf-wimse-aims](https://datatracker.ietf.org/doc/draft-ietf-wimse-aims/) | WIMSE | 01, 2 Nov 2026 | WG Document | Best practice for agent authentication and authorisation using the WIMSE architecture and the OAuth family, explicitly without defining new protocols. It replaces the individual draft-klrc-aiagent-auth (last revision 03, September 2026), which the curated list still cites. |
| [draft-ietf-webbotauth-httpsig-protocol](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/) | webbotauth | 01, 29 Oct 2026 | WG Document | Signing automated HTTP traffic with RFC 9421, a `Signature-Agent` header for key discovery, a JWKS-based key directory and a well-known URI. See [Web Bot Auth](web-bot-auth.md). |
| [draft-ietf-oauth-client-id-metadata-document](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/) (CIMD) | OAuth | 03, 2 Nov 2026 | WG Document | A client uses an HTTPS URL as its `client_id`; the URL serves the client's metadata, so no prior registration is needed. |
| [draft-ietf-oauth-identity-assertion-authz-grant](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-assertion-authz-grant/) (ID-JAG) | OAuth | 06, 31 Oct 2026 | WG Document | Uses an identity assertion from the enterprise identity provider, via RFC 8693 token exchange and the RFC 7523 JWT grant, to obtain a token for a third-party API. Informally called Cross-App Access. |
| [draft-ietf-oauth-identity-chaining](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-chaining/) | OAuth | 17, 12 Nov 2026 | In the RFC Editor queue | Preserves identity and authorisation information across trust domains by chaining token exchange and JWT grants at each boundary. |
| [draft-ietf-oauth-transaction-tokens](https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/) | OAuth | 11, 21 Aug 2026 | WG consensus, waiting for write-up | Short-lived tokens that carry user identity, workload identity and authorisation context through a call chain inside one trust domain. |

### Published RFCs these drafts build on

[RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html) (token exchange), [RFC 9421](https://www.rfc-editor.org/rfc/rfc9421.html) (HTTP message signatures), [RFC 9396](https://www.rfc-editor.org/rfc/rfc9396.html) (rich authorisation requests), [RFC 9449](https://www.rfc-editor.org/rfc/rfc9449.html) (DPoP proof of possession) and [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728.html) (protected resource metadata, which lets a resource say which authorisation server protects it).

### Individual drafts worth knowing about

- [draft-asor-wimse-agent-delegation-chain](https://datatracker.ietf.org/doc/draft-asor-wimse-agent-delegation-chain/) (revision 03, 28 October 2026) proposes an offline-verifiable chain of RFC 9068 tokens carrying RAR authority, where each hop can only narrow scope, magnitude and lifetime. It argues that the `act` claim in RFC 8693 records prior actors but does not enforce attenuation beyond one hop.
- [draft-oauth-ai-agents-on-behalf-of-user](https://datatracker.ietf.org/doc/draft-oauth-ai-agents-on-behalf-of-user/) reached revision 02 and is now expired without adoption. It is still cited in vendor posts as if current; treat it as a historical proposal.
- [draft-skyfire-oauth-kyapay-token](https://datatracker.ietf.org/doc/draft-skyfire-oauth-kyapay-token/) (revision 04, 16 November 2026) defines a JWT for agent identity and payment claims. See [Agent payment protocols](agent-payment-protocols.md).

The OAuth and WIMSE group pages list dozens more agent-related individual drafts. Few are adopted, so count adoption, not volume.

### OpenID Foundation

- **AIIM Community Group** (Artificial Intelligence Identity Management). Its outputs so far are analysis rather than specifications: the whitepaper [Identity Management for Agentic AI](https://arxiv.org/abs/2510.25819) (October 2025), and [A Protocol-Agnostic Threat Classification for Cross-Boundary AI Agent Authorization](https://openid.net/wp-content/uploads/2026/10/A-Protocol-Agnostic-Threat-Classification-for-Cross-Boundary-AI-Agent-Authorization_with-Cover.pdf) (12 October 2026). The threat paper organises risks around what has access, on what basis, what it acts on, why, and when and for how long, and maps agent lifecycle to joiner, mover and leaver processes (for example, treating a model update or a new tool as a re-authorisation event). It says it is a threat model, not a remediation guide.
- **AuthZEN Authorization API 1.0** was approved as an OpenID Final Specification on 12 January 2026 ([announcement](https://openid.net/authorization-api-1-0-final-specification-approved)). It standardises the call between a policy enforcement point and a policy decision point, which is where per-call, argument-level agent checks can be made. It is not agent specific.
- **CIBA Core 1.0** ([Client-Initiated Backchannel Authentication](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html)), a Final specification, separates the device where an action is requested from the device where the user authenticates and consents. It is often proposed for asynchronous agent approvals; it is not agent specific either.

### How MCP uses these

The MCP 2026-07-28 revision tells clients to prefer pre-registration, then CIMD, then Dynamic Client Registration (now deprecated), and requires stored credentials to be bound to the issuing authorisation server ([client registration](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration)). The [Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) extension builds on ID-JAG, and its support table notes that implementations target different draft revisions (for example revision 01 in Keycloak's guide and revision 04 in Janssen). See [MCP](mcp.md).

## What the evidence supports and what is disputed

**Supported.** The direction of travel is to profile what exists. The adopted WIMSE document says so in its abstract, MCP's registration and enterprise flows reuse OAuth working group drafts, and the OpenID threat paper favours authorisation-time controls (scope discipline, intent preservation, automated clean-up) over behavioural detection (specification and opinion).

**Disputed or open.** How a person's consent and a multi-hop delegation chain should be represented across domains (the delegation-chain draft is individual); how to identify an intermediary agent that serves many end users; whether any of the many individual agent drafts will be adopted. Implementers tracking different revisions of the same draft is a live interoperability risk, not a theoretical one.

## Practical checklist

1. For each draft you depend on, record the exact revision number and the date you checked it.
2. Prefer working group documents and RFCs over individual drafts for anything you ship.
3. If you run an authorisation server for agent clients, advertise `client_id_metadata_document_supported` and validate that the fetched `client_id` matches the URL exactly.
4. Publish RFC 9728 protected resource metadata so a client can find your authorisation server without guessing.
5. Bind stored client credentials to the issuer that granted them and re-register when it changes.
6. Issue short-lived, audience-restricted tokens per task rather than long-lived keys shared across agents.
7. Treat configuration changes to an agent (model, tools, hosting) as events that re-check its authority.
8. Log the agent's identity and the human or organisation accountable for it separately from human user activity.

## Common mistakes

- Citing an expired or replaced draft as current.
- Treating CIMD as proof that a client is trustworthy. It proves control of a URL; consent and policy still decide what the client may obtain.
- Assuming OAuth token exchange alone narrows authority across several agent hops.
- Equating operator identity (Web Bot Auth) with user delegation. A signed request says which platform sent it, not which person authorised it.

## Sources and further reading

- Curated list section: [Agent identity and authorization](../../../README.md#agent-identity-and-authorization)
- [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)
- [IETF agentproto working group documents](https://datatracker.ietf.org/group/agentproto/documents/) for adjacent agent protocol work
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/)

## Related pages

- [Agent identity and authorization](../concepts/agent-identity-and-authorization.md)
- [Web Bot Auth](web-bot-auth.md)
- [MCP](mcp.md)
- [Agent payment protocols](agent-payment-protocols.md)
- [Security for agent surfaces](../concepts/security-for-agent-surfaces.md)
- [Standards tracker](../standards-tracker.md)
