# Agent analytics and observability

**In one line:** Agent analytics counts which agents reach your surfaces and what they fetch or call, and agent observability reconstructs what a run did and why. Both are needed, and neither on its own shows that the experience worked.

Last reviewed: 2026-11-20

## What it is

The topic has two halves, and they use different data.

- **Agent analytics** covers traffic to surfaces you own but agents you do not run: website and documentation logs, API gateways and MCP servers. The questions are who is calling, through which route (HTML, Markdown, llms.txt, API, MCP), what they ask for, and where they fail.
- **Agent observability** covers runs you can trace, either because you operate the agent or because your server receives its trace context. The unit is the whole run, recorded as a tree of model calls, tool calls, retrieval steps and sub-agents.

The [Agentic AI Foundation's guide to agent observability](https://aaif.io/blog/agent-observability-what-to-track-first) (August 2026, foundation blog) separates five signals: logs for local detail, traces for how events relate, metrics for trends, evaluations for whether the behaviour was good, and human review for what automated checks miss. It also proposes a per-run "context receipt": prompt and tool-catalogue versions, available tool schemas, retrieval sources and document identifiers, the tokens that retrieval added, and cache and redaction status. The point is to record what context a run received without storing the raw content.

## Why it matters for agents

Agents fail quietly. A run can return clean status codes and still call the wrong tool, work from stale documentation or stop early and report success. On a documentation site, an agent that cannot find an answer does not file a ticket: it leaves or guesses. Ordinary web metrics also mislead. A two-second fetch that answers the question is not a bounce.

Analytics is the only way to see which agents actually use a surface and how. Several measurements show that assumptions about agent behaviour often turn out to be wrong:

- A [controlled study of ten AI assistants](https://arxiv.org/abs/2607.14447) (study, preprint, July 2026) used server logs and secret codes in pages to separate access from answers. Some assistants reached restricted pages without requesting robots.txt, some used generic user agents that made attribution hard, and page access and answer correctness did not always match.
- [Checkly's February 2026 test](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) (vendor material) found that 3 of 7 coding agents sent `Accept: text/markdown`.
- [Ahrefs](https://ahrefs.com/blog/llmstxt-study) (vendor material) found that 97 per cent of llms.txt files on 137,000 domains received no requests in May 2026.

At the far end, analytics is also how operators detect harm. The [Wikimedia Foundation](https://diff.wikimedia.org/2026/10/05/openai-rogue-agent-activities-found-on-wikimedia-projects/) (operator report, October 2026) describes investigating edits, exploitation attempts and heavy traffic it attributes to one vendor's agents, and the effort that attribution took. [Characterizing Agentic Flooding of Government Services](https://arxiv.org/abs/2608.16603) (study, AIES 2026) collects 84 possible cases of demand surges driven by agents.

## Current state

**Identifying agents.** User-agent strings can be spoofed and are often generic. Signed requests are emerging. [Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/) uses HTTP message signatures to identify the operator, not the person behind the request. Google's [Google-Agent page](https://developers.google.com/crawling/docs/crawlers-fetchers/allow-google-agent) (vendor documentation) gives three checks: the user-agent string, published IP ranges and, experimentally, a signature from the `agent.bot.goog` identity. See [Web Bot Auth](../standards/web-bot-auth.md).

**Counting agents.** Traffic-share figures depend on the counting rule. Fern's [State of Docs](https://buildwithfern.com/post/state-of-docs) (vendor material) is unusually explicit about its method. It counts an agent request by route (Markdown and llms.txt), excludes 17 million internal and checker requests in one month, and says that 68 per cent of agent requests carried a browser or generic user agent. Counting only named AI user agents gave 32.8 per cent instead. Quote the source, the population and the definition with any figure.

**Tracing conventions.** As of 2026-11-20 the OpenTelemetry GenAI conventions live in the [semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai) repository, and both relevant documents are marked Development:

- The [agent and framework spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md) document defines operations such as `create_agent` and `invoke_agent`, with attributes including `gen_ai.agent.name`, `gen_ai.conversation.id` and token usage. It warns that message attributes are likely to contain personal data (specification, development status).
- The [MCP conventions](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/mcp.md) say instrumentations should inject trace context into `params._meta`, using unprefixed `traceparent`, `tracestate` and `baggage` keys. Span names follow `{mcp.method.name} {target}`, where the target is usually the tool name. The page still lists an `mcp.session.id` attribute and uses an older protocol version in its examples, so expect it to lag the stateless MCP revision.
- [OpenInference](https://openinf.dev/spec/) is a parallel convention built on OpenTelemetry, with span kinds such as `AGENT`, `TOOL` and `RETRIEVER` and an experimental export to `gen_ai.*` attributes. Which vocabulary will prevail is unsettled.

**What MCP now gives a server operator.** The [MCP 2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) documents the `_meta` trace keys (SEP-414). It says clients should identify themselves on each request (`io.modelcontextprotocol/clientInfo`), and it requires `Mcp-Method` and `Mcp-Name` headers on Streamable HTTP POST requests, which lets a gateway log method and target without parsing bodies (specification).

**Measurement in the browser.** The draft W3C [Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html) lists an "Agent Interaction Measurement" deliverable: APIs that would let pages measure agent capability invocations, their outcomes and time spent waiting for the user. It is a draft charter, not an approved group or specification.

## What the evidence supports and what is disputed

**Supported:**

- **User agents alone are not enough to identify agents.** This is shown by the robots.txt study and Fern's own counting caveats.
- **Traces of tool calls reveal problems that request metrics miss.** This rests on practitioner reports such as the AAIF guide, and on [AT-AT](https://arxiv.org/abs/2610.34679) (study, preprint). AT-AT improved shared tool descriptions and implementations offline from historical agent traces while keeping the agents fixed, and lowered cost or tool error rates on three production MCP servers.

**Disputed:**

- **Every traffic-share headline.** Vendor figures come from their own customers, with different counting rules, and are not independent.
- **Which tracing convention to adopt.** OpenTelemetry GenAI and OpenInference overlap, and both are still changing.
- **Whether fetch counts mean anything for outcomes.** A fetched llms.txt or Markdown page shows demand, not task success.

## Practical checklist

1. Log agent traffic separately from human traffic, and record how each request was classified: verified signature, published IP range, claimed user agent or route only.
2. Verify Web Bot Auth signatures where agents offer them, and never grant trust on the user-agent string alone.
3. Log machine routes explicitly: Markdown responses, the `Accept` header, llms.txt fetches and 404s on guessed URLs.
4. On an MCP server, record client identity, method, tool name, outcome, error type, latency and result size for every call.
5. Accept `traceparent` from `_meta`, emit spans that follow the OpenTelemetry MCP conventions, and pin the convention version you implement.
6. Redact prompts, arguments and results before export, and keep baggage small and free of sensitive values.
7. For agents you operate, keep a context receipt per run, covering versions, tool schemas offered, retrieved document identifiers and token counts.
8. Pair traffic with outcomes: run a sample of real tasks regularly and compare them with what the logs show (see [evaluating agent experience](evaluating-agent-experience.md)).
9. Feed failing traces back into tool descriptions, error text and documentation, and re-measure.
10. When you publish a figure, publish its counting rule and its exclusions.

## Common mistakes

- Reading visit counts as success.
- Treating a self-declared user agent as identity.
- Storing full prompts and tool results in traces without redaction.
- Adopting a Development-status attribute set without pinning its version.
- Comparing your share of agent traffic with a vendor headline that uses a different definition.
- Monitoring uptime and error rates while never looking at the shape of runs.

## Sources and further reading

- Curated list: [Observability and traces](../../../README.md#observability-and-traces), [Evaluation](../../../README.md#evaluation) and [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web).
- [Langfuse](https://github.com/langfuse/langfuse) (open-source tracing tool).
- [Principles of AX](https://agentexperience.ax/concepts/principles-of-ax/) (opinion), which asks services to record agent actions separately from human ones.
- Further reading (same maintainer): [How do you measure agent experience?](https://agentexperience.tech/insights/measure-agent-experience/) and [Keep retry history honest](https://agentexperience.tech/insights/retries-are-product-history/).

## Related pages

- [Evaluating agent experience](evaluating-agent-experience.md) and [readiness scoring](readiness-scoring.md)
- [Agent identity and authorization](agent-identity-and-authorization.md)
- [Web Bot Auth](../standards/web-bot-auth.md), [MCP](../standards/mcp.md) and [Markdown content negotiation](../standards/markdown-content-negotiation.md)
- [Content signals and AI preferences](../standards/content-signals-and-ai-preferences.md)
- [Context engineering](context-engineering.md)
- [Glossary](../glossary.md)
