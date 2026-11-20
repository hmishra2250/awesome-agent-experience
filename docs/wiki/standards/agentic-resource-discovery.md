# Agentic Resource Discovery (ARD) and other discovery files

**In one line:** the files, records and registries that tell an agent which agents, MCP servers, APIs and skills a domain offers and how to reach them, before any call is made.

**Last reviewed:** 2026-11-20

## What it is

Discovery answers "what exists here, and how do I connect?" It does not grant access or describe every tool in detail; each mechanism hands off to the resource's own protocol. The main families are:

- **Catalogue files at well-known paths.**
  - [ARD](https://agenticresourcediscovery.org/spec/) defines a JSON-LD catalogue at `/.well-known/ard.json` listing a publisher's agentic resources (MCP servers, A2A agents, skills and others), plus a search API that federated registries expose (`POST /search`, with optional explore and list operations). An ARD entry is expected to carry `representativeQueries` so registries can match it to requests; an entry without them is still a valid catalogue entry but is not discoverable through ARD (specification, proposal).
  - [AI Catalog](https://ai-catalog.io/spec/) is the data model ARD builds on, now a v0.9 release candidate for v1.0 developed by members of the A2A and MCP communities under Linux Foundation governance.
  - [A2A Agent Cards](https://a2a-protocol.org/latest/topics/agent-discovery/) are served at `/.well-known/agent-card.json`; the A2A guide also describes curated registries and direct configuration.
  - [MCP Server Cards](https://modelcontextprotocol.io/seps/2127-mcp-server-cards) describe a remote MCP server's transports and protocol versions before connection. SEP-2127 is Final as an Extensions Track SEP, and the wire format lives in an experimental extension repository.
  - [RFC 9727 api-catalog](https://www.rfc-editor.org/rfc/rfc9727.html) defines `/.well-known/api-catalog` and a link relation that return a linkset of a publisher's APIs (Standards Track, June 2025).
  - [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728.html) protected resource metadata tells a client which authorisation server protects a resource.
- **Index files for content.** [llms.txt](llms-txt.md) lists key pages rather than callable resources.
- **DNS.** [DNS for AI Discovery (DNS-AID)](https://datatracker.ietf.org/doc/draft-mozleywilliams-dawn-dnsaid/) proposes publishing agents with SVCB records, optionally with DNS-SD labels, DNSSEC and DANE, covering the known-agent and known-organisation cases.
- **Registries.** Searchable services that crawl catalogues, such as ARD registries or the [MCP Registry](mcp.md), which is still labelled preview.

## Why it matters for agents

An agent cannot use a capability it does not know exists, and loading every tool description into context does not scale. The ARD specification makes this argument itself: selection has to move into search, with a small set of candidates returned for each request. That links discovery directly to [tool selection at scale](../concepts/tool-selection-at-scale.md). For a site owner, a discovery file is also a public claim: if it lists a server that does not work, agents waste turns and may give up.

## Current state

As of 2026-11-20, checked against the live specification pages and the Datatracker:

- **ARD.** [Version v0.91](https://agenticresourcediscovery.org/spec/), status Proposal, dated 26 August 2026, listing three authors (Junjie Bu of Google, R.V. Guha and Shaun Smith of Hugging Face). Consumers must fetch `/.well-known/ard.json` and honour a `rel="ard"` link, and may also read the predecessor path `/.well-known/ai-catalog.json`. The specification notes that several media types it uses, such as those for MCP server cards and A2A agent cards, are de facto and not yet registered with IANA.
- **AI Catalog.** v0.9, a release candidate for v1.0; the specification says changes before v1.0 may require implementations to update.
- **IETF DAWN.** The Discovery of Agents With Names working group charter was approved on 22 October 2026. Its scope is initial discovery of the minimum public information about AI resources on local networks, within organisations and between cooperating parties, building on DNS and mDNS. Open-ended search, ranking, capability catalogues and identity management are out of scope for its first phase. The [DAWN discovery landscape survey](https://datatracker.ietf.org/doc/draft-jimenez-dawn-discovery-landscape/) (individual draft, July 2026) compares mechanisms from the IETF, the Agentic AI Foundation, 3GPP and open source. DNS-AID (individual draft, revision 00, 2 November 2026) is not yet adopted.
- **Other individual drafts.** [AGENTS.TXT](https://datatracker.ietf.org/doc/draft-car-agents-txt-wellknown/) would register `/.well-known/agents.txt` and `agents.json` as positive capability declarations; it is an individual draft that expires on 14 December 2026 without adoption.
- **Adoption evidence.** No independent, dated census of `ard.json` publication was verified for this page. Vercel and Ora's harnesses reached some `.well-known` path in 22.7 per cent of 1,033 runs, and most attributed fetches of discovery files came through links rather than guessed paths ([Vercel guide](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents), vendor study). That measures reach, not use of any one format.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Linked files are found more than guessed ones (vendor study).* In the Vercel and Ora data, 86 to 97 per cent of attributed fetches of llms.txt, `.well-known` paths and `openapi.json` arrived through links. Advertising a discovery file from pages agents already visit matters as much as the path.
- *Discovery is fragmented (specification and survey).* The DAWN survey and the overlap between ARD, AI Catalog, Agent Cards, Server Cards and api-catalog show several groups solving neighbouring problems.

**Disputed or unsettled:**

- *Whether agents will query registries at scale.* That depends on major agent clients adopting a registry protocol. None of the sources checked here shows broad client-side support yet.
- *Trust and spam (opinion).* A searchable registry ranks resources, which invites the same manipulation as search engines. ARD carries verification metadata and publisher binding, but how registries weigh it is up to them.
- *Well-known files versus DNS.* DAWN starts from DNS; ARD and A2A start from HTTPS paths. They may coexist, but no profile yet ties them together.

## Practical checklist

1. Publish discovery files only for resources that exist, work and are meant for external agents.
2. If you have callable resources, publish `/.well-known/ard.json` at the current path, and include `representativeQueries` written as real user requests.
3. Serve an A2A Agent Card or an MCP Server Card when you run those protocols, and point to them from the ARD catalogue rather than duplicating details.
4. For HTTP APIs, publish `/.well-known/api-catalog` linking to your OpenAPI descriptions; see [OpenAPI, Arazzo and JSON Schema](openapi-arazzo-json-schema.md).
5. For protected resources, publish RFC 9728 metadata so clients can find the authorisation server without guessing.
6. Link each discovery file from a page agents already reach (footer, `<link>` in the head or a resources page).
7. Validate files with the ARD conformance tool and the relevant protocol inspectors, and record the specification version you targeted.
8. Monitor requests to `/.well-known/` paths and remove entries for retired resources promptly.

## Common mistakes

- Publishing stub catalogues or server cards to satisfy a readiness scanner. See [readiness scoring](../concepts/readiness-scoring.md).
- Using only the old `ai-catalog.json` path, which ARD v0.91 treats as optional for consumers.
- Treating a discovery listing as proof of trustworthiness; discovery binds a resource to a publisher, not to good behaviour.
- Implementing every individual Internet-Draft file format without evidence that any client reads it.
- Listing resources in a catalogue that require credentials the agent has no documented way to obtain.

## Sources and further reading

- [ARD specification v0.91](https://agenticresourcediscovery.org/spec/) and [AI Catalog](https://ai-catalog.io/spec/) (proposals)
- [Agent Discovery in A2A](https://a2a-protocol.org/latest/topics/agent-discovery/) and [SEP-2127: MCP Server Cards](https://modelcontextprotocol.io/seps/2127-mcp-server-cards) (protocol documentation)
- [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html) and [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728.html) (standards)
- [DAWN discovery landscape](https://datatracker.ietf.org/doc/draft-jimenez-dawn-discovery-landscape/), [DNS-AID](https://datatracker.ietf.org/doc/draft-mozleywilliams-dawn-dnsaid/) and [AGENTS.TXT](https://datatracker.ietf.org/doc/draft-car-agents-txt-wellknown/) (individual Internet-Drafts)
- [Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc) (vendor proposal)
- The curated list sections [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web) and [Protocols and machine-readable surfaces](../../../README.md#protocols-and-machine-readable-surfaces)
- Further reading (same maintainer): [Agentic resource discovery](https://agentexperience.tech/insights/agentic-resource-discovery/) and [Agent tool catalogs](https://agentexperience.tech/insights/agent-tool-catalogs/)

## Related pages

- [Tool selection at scale](../concepts/tool-selection-at-scale.md)
- [MCP](mcp.md)
- [A2A](a2a.md)
- [llms.txt](llms-txt.md)
- [Agent Skills](agent-skills.md)
- [NLWeb](nlweb.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Standards tracker](../standards-tracker.md)
