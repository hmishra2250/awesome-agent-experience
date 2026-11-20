# NLWeb

**In one line:** an open project, started at Microsoft, that gives a website a natural-language query endpoint built on its own structured data, answering people through `/ask` and agents through an MCP endpoint at `/mcp`.

**Last reviewed:** 2026-11-20

## What it is

The [NLWeb reference repository](https://github.com/nlweb-ai/NLWeb) describes NLWeb as a collection of open protocols and open-source tools for adding conversational interfaces to websites. It has two parts (project documentation):

- **A simple protocol.** A client sends a natural-language query and receives JSON whose results use Schema.org vocabulary. The repository's REST API notes list one required argument, `query`, and optional ones such as `site`, `prev` (earlier queries), `decontextualized_query`, `streaming` and `mode`, where `list` returns ranked matches, `summarize` adds a summary and `generate` behaves like retrieval-augmented generation. Each result carries a URL, name, site, score, a generated description and the underlying Schema.org object.
- **A reference implementation.** Python code that ingests structured content such as Schema.org markup and RSS into a vector store, retrieves and ranks matches, and calls a model of the site owner's choice. The README says the code is a proof of concept rather than the definitive implementation.

The README states that every NLWeb instance also acts as an MCP server, with `/mcp` supporting the core MCP list and call methods, and frames the relationship as "NLWeb is to MCP/A2A what HTML is to HTTP". That is the project's own framing, not a standards position.

## Why it matters for agents

NLWeb answers a real agent experience problem: an agent asking a content-heavy site a question has to crawl, search and read many pages, while the site already knows its own catalogue. A single query endpoint that returns structured, linked results can save the agent many fetches and give it typed objects instead of prose. For catalogues such as recipes, events, listings or products, that can be a better surface than either browsing or a long [llms.txt](llms-txt.md) file.

It also shows the trade-off clearly. A query endpoint returns what the site's retrieval and model decide is relevant; the agent sees less of the raw source and must trust the site's ranking. Compare [WebMCP](webmcp.md), where the page exposes actions, and a backend [MCP](mcp.md) server, where the site exposes tools of its own design.

## Current state

As of 2026-11-20:

- **Steward.** The project lives in the `nlweb-ai` GitHub organisation under an MIT licence. It is not a standards-body specification. The project site's specification page (nlweb.ai/spec), linked from the README, could not be reached when this page was reviewed.
- **Activity.** The repository was created in April 2025. Its most recent commits on the main branch at review time were dependency updates from June 2026, and its release notes folder runs to July 2025. The repository has since been reorganised into modules (AskAgent, AgentFinder, DataFinder, ModelRouter and a scorer).
- **Hosting.** Cloudflare documents an [NLWeb deployment through AI Search](https://developers.cloudflare.com/ai-search/how-to/nlweb/) that crawls a site and deploys a Worker exposing `/ask` and `/mcp`. It labels this a public preview for experimentation (vendor documentation, modified 10 July 2026).
- **Adoption evidence.** Secondary articles name publisher deployments, but none was verified against a primary source for this page. No independent measurement of NLWeb deployment across the web was found.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Non-HTML interfaces can be cheaper and more accurate on shop-like tasks (study).* A technical report built four simulated e-shops offering HTML, MCP and NLWeb interfaces and compared agents across several models. Averaged over tasks, F1 rose from 0.67 for HTML browsing to between 0.75 and 0.77 for the RAG, MCP and NLWeb agents, and token use per task fell from about 241,000 to between 47,000 and 140,000 ([MCP vs RAG vs NLWeb vs HTML](https://arxiv.org/abs/2511.23281), technical report). The best configuration in that study was RAG rather than NLWeb, and simulated shops may not transfer to production sites.
- *Structured data is the right raw material (opinion with wide practice).* NLWeb's reliance on Schema.org matches long-standing advice to publish machine-readable facts, but the project itself is the main source for its benefits.

**Disputed or unsettled:**

- *Whether NLWeb adds much beyond MCP.* Because an NLWeb instance is also an MCP server, a site that already offers a well-designed MCP search tool and good Markdown pages may gain little. No study compares the two on real sites.
- *Who controls ranking (opinion).* A site-operated answer endpoint can favour some results. The protocol does not define disclosure of ranking or sponsorship, which matters for commerce; see [agentic commerce](../concepts/agentic-commerce.md).
- *Project direction.* With a quiet main branch and an unreachable specification page at review time, it is unclear whether NLWeb will develop as a protocol or remain a reference design.

## Practical checklist

1. Decide whether your content is genuinely list-shaped (products, events, recipes, listings). If not, invest in readable pages and Markdown first.
2. Make sure your Schema.org markup is accurate and matches the visible page; NLWeb answers can only be as good as that data.
3. If you deploy NLWeb, treat `/mcp` as a public MCP server: describe its tool clearly, require authentication where data is not public, and rate-limit it.
4. Return the canonical page URL with every result so agents can verify and cite the source.
5. Prefer `list` mode for agents, so they receive ranked items with the underlying Schema.org objects rather than only a generated summary. Note that even in `list` mode each result's description is model-generated.
6. Log queries and failures, and evaluate whether agents complete tasks faster than by browsing.
7. Advertise the endpoint where agents look, for example in an [agentic resource discovery](agentic-resource-discovery.md) catalogue, and only once it works.
8. Pin the implementation version you run, given the project's limited recent activity.

## Common mistakes

- Treating NLWeb as a standard that agents expect; this review found no major agent client documenting built-in support.
- Exposing a generative `/ask` endpoint without telling agents that answers are model-generated.
- Letting the index drift from the live site, so the endpoint answers with stale prices or availability.
- Citing launch coverage or project framing as evidence of adoption.

## Sources and further reading

- [NLWeb reference repository](https://github.com/nlweb-ai/NLWeb) (project documentation)
- [Cloudflare: NLWeb with AI Search](https://developers.cloudflare.com/ai-search/how-to/nlweb/) (vendor documentation, public preview)
- [MCP vs RAG vs NLWeb vs HTML](https://arxiv.org/abs/2511.23281) (technical report)
- The curated list section [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web)
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/)

## Related pages

- [MCP](mcp.md)
- [WebMCP](webmcp.md)
- [Agentic resource discovery](agentic-resource-discovery.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Markdown content negotiation](markdown-content-negotiation.md)
- [llms.txt](llms-txt.md)
