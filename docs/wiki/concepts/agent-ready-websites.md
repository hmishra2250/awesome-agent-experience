# Agent-ready websites

**In one line:** An agent-ready website is one an agent can reach, read, act on and verify without guessing: real content in the HTML, a sound accessibility tree, stable controls, honest discovery files and a deliberate access policy.

Last reviewed: 2026-11-20

## What it is

Agents meet websites in several ways at once. A fetch tool reads the raw HTTP response, often without running JavaScript. A browser agent reads the DOM and the accessibility tree, and sometimes a screenshot. A tool-using agent may skip the page and call an API, an MCP server or a WebMCP tool the page declares. Nielsen Norman Group describes the same three routes (screenshots, accessibility tree, direct API) in [AI Agents as Users](https://www.nngroup.com/articles/ai-agents-as-users/), and the W3C TAG's [Agentic Browsing and Web Architecture](https://w3ctag.github.io/agentic-browsing-finding/) notes that current agentic browsing relies on screenshots, the DOM and the accessibility tree, which can be brittle and slow.

It helps to think of a site in five layers, in rough order of how much evidence supports them:

1. **The page itself.** Server-rendered content, real links and buttons, labelled fields, honest headings, and the facts a decision needs (price, eligibility, what happens next) stated in text.
2. **Stability.** Controls that do not move between the moment an agent locates them and the moment it acts. Lighthouse's [agentic browsing audits](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) include Cumulative Layout Shift for this reason.
3. **Delivery.** Content negotiation (an `Accept: text/markdown` request answered with Markdown) or path-based Markdown twins. See [Markdown content negotiation](../standards/markdown-content-negotiation.md).
4. **Discovery files.** [llms.txt](../standards/llms-txt.md), [RFC 9727 api-catalog](https://www.rfc-editor.org/info/rfc9727), MCP server cards, [ARD](../standards/agentic-resource-discovery.md) and similar. Each describes what exists; none grants access.
5. **Access policy and identity.** robots.txt rules, [content signals and AI preferences](../standards/content-signals-and-ai-preferences.md), bot-management rules, and verification of signed agents through [Web Bot Auth](../standards/web-bot-auth.md).

Declared actions through [WebMCP](../standards/webmcp.md) sit across layers 1 and 4: the page describes its own tools so an agent does not have to infer them from layout.

## Why it matters for agents

A page that looks clear to a person can be close to empty for an agent. If the answer only appears after a client-side fetch, a fetch-only agent never sees it. If a control is a `div` with a click handler, the accessibility tree does not describe it as a button. If a bot rule blocks data-centre traffic, a legitimate agent acting for a customer never reaches the booking step. Each of these fails silently from the site owner's point of view, and the person who delegated the job receives a wrong or incomplete answer.

## Current state

As of 2026-11-20:

- **WebMCP** is a W3C Community Group draft ([Draft Community Group Report dated 19 November 2026](https://webmachinelearning.github.io/webmcp/)), not on the W3C Standards Track. Chrome documents [best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) for building tools.
- **W3C** has a [draft Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html) covering site capabilities, agent identity and delegation, and measurement of agent interactions. It lists crawler controls and bot detection as out of scope. The TAG published its finding as a Draft Finding on 27 October 2026.
- **AI usage preferences** at the IETF are working-group drafts: [draft-ietf-aipref-vocab-08](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/) (14 September 2026), which states its contents do not reflect working group consensus, and [draft-ietf-aipref-attach-05](https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/) (19 August 2026), which would update RFC 9309 if approved. The [Content Signals Policy](https://contentsignals.org/) is a deployed vendor convention.
- **Web Bot Auth** has an adopted working-group draft, [draft-ietf-webbotauth-httpsig-protocol](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/) (revision 01, 29 October 2026). Google's [Allow Google-Agent traffic](https://developers.google.com/crawling/docs/crawlers-fetchers/allow-google-agent) page says Google is experimenting with signing Google-Agent requests this way, alongside user-agent and IP-range verification.
- **api-catalog** is a Proposed Standard ([RFC 9727](https://www.rfc-editor.org/info/rfc9727)). llms.txt remains a [proposal](https://llmstxt.org/).

## What the evidence supports and what is disputed

- **Page structure changes outcomes (study).** On one e-commerce prototype, an agent-ready redesign with the same catalogue and flows raised strict success from about 49 to about 89 per cent across three models ([arXiv 2607.12056](https://arxiv.org/abs/2607.12056), preprint). Affora finds performance tracks preserved interaction meaning rather than visual style ([arXiv 2609.19125](https://arxiv.org/abs/2609.19125)). Region4Web reorganises the accessibility tree into functional regions and reports higher WebArena success with shorter observations ([arXiv 2605.07134](https://arxiv.org/abs/2605.07134)), which suggests clear landmark structure helps, though that is an agent-side technique, not a site study.
- **Interface choice matters (study).** On four simulated shops, agents using RAG, MCP or NLWeb interfaces outperformed HTML browsing on both F1 and token use ([MCP vs RAG vs NLWeb vs HTML](https://arxiv.org/abs/2511.23281), WWW 2026). Simulated shops may not transfer to production front ends.
- **Clients differ in what they request (vendor material).** Checkly's February 2026 test found 3 of the 7 agents it tested sent `Accept: text/markdown` ([The Current State of Content Negotiation for AI Agents](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/)). Behaviour changes with client releases, so check your own logs.
- **llms.txt is mostly unread and uneven (vendor and crawl data).** Ahrefs reports 97 per cent of published files received no requests in May 2026 across sites using its analytics ([We Analyzed 137K Sites](https://ahrefs.com/blog/llmstxt-study)). Common Crawl's July 2026 sample found about half of files follow the specified shape, about a fifth contain no links, and a small number carry prompt injection ([content analysis](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive)).
- **robots.txt is not a reliable control for assistants (study).** A controlled test of ten assistants found some fetched disallowed pages without requesting robots.txt or used generic user agents ([arXiv 2607.14447](https://arxiv.org/abs/2607.14447), preprint).
- **Behavioural bot defences do not cleanly separate agents from abuse (study).** Broken Gates finds browser and account state, not the model, largely decides whether agents pass challenges ([arXiv 2607.18659](https://arxiv.org/abs/2607.18659), preprint). This supports the move towards signed identity.
- **Disputed.** How much the layers around the page matter compared with the page itself (most measured effects come from the page); header-based negotiation versus path twins; and how far ARIA should serve agents. The W3C Strategy paper records ARIA participants cautioning against bending human-centred semantics for agents.

## Practical checklist

1. Fetch a key page with `curl` and no JavaScript. Confirm the facts a person needs are in the response.
2. Inspect the accessibility tree of each step in one real task. Every interactive element has a role and an accessible name.
3. Measure layout shift on the steps where actions happen, not only on landing pages.
4. State price, eligibility, requirements and the next step in page text, not only in visual cues.
5. If you serve Markdown, answer `Accept: text/markdown` on the canonical URL, send `Vary: Accept`, and advertise the twin with a `Link` header or a link in the page.
6. Write down a robots.txt and content-signal policy per crawler and purpose, then check that your CDN and firewall rules match it.
7. For verified agents (for example Google-Agent), confirm the allow rule runs before broad data-centre or AI-category blocks and covers search, filters, cart and API calls, as Google's page advises.
8. Publish discovery files only when what they describe exists and works.
9. After any state change, return a confirmation the agent can check (an order number, a visible status, a URL).
10. Review server logs monthly for which agents fetch what, and which requests fail.

## Common mistakes

- Publishing stub OAuth metadata, server cards or catalogues to satisfy a scanner. That misleads agents.
- Treating llms.txt as a strategy rather than an optional index.
- Assuming robots.txt rules are honoured by every assistant fetcher.
- Hiding navigation behind hover, or rendering critical text only on the client.
- Blocking all automated traffic, then wondering why delegated purchases or bookings never arrive.

## Sources and further reading

- Curated list: [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web), [Agent identity and authorization](../../../README.md#agent-identity-and-authorization), [Readiness instruments](../../../README.md#readiness-instruments).
- [Build agent-friendly websites](https://web.dev/articles/ai-agent-site-ux) and [Make your site readable by AI agents](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents) (vendor guidance).
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/) (specifications; necessary but not sufficient for agent readiness).
- Further reading (same maintainer): [Build websites agents can understand](https://agentexperience.tech/insights/agent-friendly-websites/), [The state of llms.txt](https://agentexperience.tech/insights/state-of-llms-txt/), [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/).

## Related pages

- [Readiness scoring](readiness-scoring.md)
- [Documentation for agents](documentation-for-agents.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Agent identity and authorization](agent-identity-and-authorization.md)
- [WebMCP](../standards/webmcp.md), [llms.txt](../standards/llms-txt.md), [NLWeb](../standards/nlweb.md)
