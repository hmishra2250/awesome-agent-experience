# Markdown for agents and content negotiation

**In one line:** serving a clean Markdown version of a page to agents, either on the same URL when the request asks for `text/markdown` or at a linked twin URL, so an agent spends its context on the content rather than on markup.

**Last reviewed:** 2026-11-20

## What it is

There are two delivery patterns, and they combine well.

- **Content negotiation on the canonical URL.** HTTP has long let a client state preferred formats in the `Accept` request header, and let a server pick a representation and say so with `Vary: Accept` ([RFC 9110, HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)). `text/markdown` is a registered media type ([RFC 7763](https://www.rfc-editor.org/rfc/rfc7763.html)). An agent sends something like `Accept: text/markdown, text/html, */*`; a server that supports it returns Markdown with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`, and otherwise returns HTML.
- **Markdown twins at predictable paths.** The [llms.txt proposal](https://llmstxt.org/) suggests a Markdown version at the same URL with `.md` appended (or the extension replaced), advertised with `rel="alternate" type="text/markdown"` in an HTML `<link>` element or an HTTP `Link` header, and a `rel="describedby"` link to the llms.txt file that covers the page (proposal).

Neither is new technology. What is new is that agent fetch tools have started to ask for Markdown, and that CDNs and frameworks now offer conversion.

## Why it matters for agents

An agent's fetch tool usually converts HTML to text, truncates it, and sometimes summarises it with a smaller model before the main model sees it. Navigation, scripts and layout markup cost tokens and can push the answer out of what survives. A Markdown representation with the same facts gives the agent more of what it came for. It also helps fetch-only clients when the answer would otherwise appear only after client-side JavaScript runs. See [documentation for agents](../concepts/documentation-for-agents.md) and [context engineering](../concepts/context-engineering.md).

The payoff depends on the HTML being right first. A Markdown twin generated from a page that hides the answer behind JavaScript still lacks the answer.

## Current state

As of 2026-11-20:

- **Steward.** No single steward. The mechanism is ordinary HTTP (IETF standards). The path-twin convention comes from the llms.txt proposal. Vendors document implementations.
- **Edge conversion.** Cloudflare's [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) (documentation modified 9 November 2026) converts HTML to Markdown at the edge when a request asks for `text/markdown`, on supported plans. It sets `Vary: Accept`, keeps security and caching headers, removes `ETag` and `Last-Modified` because conditional requests cannot be honoured for converted bodies, adds YAML front matter from meta tags, preserves JSON-LD as a fenced block, and adds a permissive `Content-Signal` header when the origin sets none (vendor documentation).
- **Framework guidance.** Vercel's [Make your site readable by AI agents](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents) (v1.0, August 2026, with Ora) recommends correct `Content-Type`, `Vary: Accept`, a fallback to HTML, and advertising a Markdown mirror with a `Link` header (vendor material).
- **Clients.** In February 2026 Checkly tested seven coding agents' fetch tools and found that three (Claude Code, Cursor and OpenCode) sent `Accept: text/markdown` ([The Current State of Content Negotiation for AI Agents](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/), vendor material). Client behaviour changes with releases, so this is a dated snapshot.
- **Adoption.** No independent, dated measurement of server support across a defined population was verified for this page.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Agents ask for Markdown when they can (vendor study).* In the Vercel and Ora harnesses, 65.1 per cent of 3,470 web fetches requested Markdown, and when a fetch named any format it chose Markdown in 95.7 per cent of cases. The same guide reports that, in controlled probes, adding Markdown mirrors, llms.txt or JSON-LD did not change whether clients retrieved an answer already present in server-rendered HTML. Both results come from one vendor partnership and measure retrieval, not task success.
- *Payloads shrink sharply on individual pages (vendor material).* Checkly reports 615.4 KB of HTML against 2.3 KB of Markdown for one documentation page. Such figures are single pages, not averages.
- *Readable first-party pages are associated with better answers (study).* The observational preprint [AX is the New AEO](https://arxiv.org/abs/2609.34951) ran 37,927 agent journeys over 1,056 businesses and reports that answers built from a business's own readable site were more accurate. Its readiness grouping comes from the authors' own ranking method, and it does not isolate Markdown delivery from other factors.

**Disputed or unsettled:**

- *Header or path.* Header negotiation keeps one canonical URL that every HTTP client understands. Path twins work for clients that never send the header, and can be linked from llms.txt. Vendor data disagree on which agents use more, and it changes with client releases. Supporting both is the low-risk option.
- *Fidelity.* Automated conversion can drop content that lives in scripts, tabs or interactive widgets. Whether edge conversion or authored Markdown gives agents better answers has not been measured independently.
- *Outcome.* No controlled study across many real sites isolates the effect of serving Markdown on task completion.

## Practical checklist

1. Fetch a key page with `curl` and no JavaScript, and confirm the answer is in the HTML before adding Markdown.
2. Run `curl -H "Accept: text/markdown" <url>` and check you receive Markdown with `Content-Type: text/markdown; charset=utf-8`.
3. Send `Vary: Accept` on both representations so caches keep them apart.
4. Fall back to HTML with the correct content type when Markdown is unavailable; never return an error for an unsupported `Accept`.
5. Publish a twin at a predictable path and advertise it with `<link rel="alternate" type="text/markdown">` and a `Link` header.
6. Generate HTML and Markdown from one source so they cannot drift.
7. Keep headings, tables, code blocks and links in the Markdown; strip navigation and boilerplate.
8. If an edge service converts for you, set your own `Content-Signal` header at the origin.
9. Return accurate status codes (404 for missing pages, 429 with `Retry-After` when throttling) on Markdown routes as well.
10. Log `Accept` headers and `.md` requests to see which agents actually use each route.

## Common mistakes

- Serving Markdown only at a separate URL and ignoring the header on the canonical URL, or the reverse, without linking the two.
- Omitting `Vary: Accept`, so a cache serves Markdown to browsers or HTML to agents.
- Converting a JavaScript shell and publishing an empty Markdown file.
- Returning a soft 404 (status 200 with a "not found" body) on Markdown routes.
- Quoting a single-page token saving as if it were typical.

## Sources and further reading

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) and [RFC 7763: The text/markdown Media Type](https://www.rfc-editor.org/rfc/rfc7763.html) (standards)
- [llms.txt proposal](https://llmstxt.org/) (proposal, Markdown twin and link relation guidance)
- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) and [Vercel: Make your site readable by AI agents](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents) (vendor documentation)
- [Checkly: The Current State of Content Negotiation for AI Agents](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) (vendor material)
- [AX is the New AEO](https://arxiv.org/abs/2609.34951) and [Designing Agent-Ready Websites for AI Web Agents](https://arxiv.org/abs/2607.12056) (preprints)
- The curated list section [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web)
- Further reading (same maintainer): [Make documentation legible](https://agentexperience.tech/insights/make-documentation-legible/) and [Agent-friendly websites](https://agentexperience.tech/insights/agent-friendly-websites/)

## Related pages

- [llms.txt](llms-txt.md)
- [Documentation for agents](../concepts/documentation-for-agents.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Content signals and AI preferences](content-signals-and-ai-preferences.md)
- [Agent analytics and observability](../concepts/agent-analytics-and-observability.md)
- [Readiness scoring](../concepts/readiness-scoring.md)
