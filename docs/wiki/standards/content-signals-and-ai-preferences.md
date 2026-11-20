# Content Signals, robots.txt extensions and IETF aipref

**In one line:** the layer where a site states, in robots.txt or an HTTP header, not only which paths automated clients may fetch but what they may do with the content afterwards, such as search indexing, AI training or use as live input to an answer.

**Last reviewed:** 2026-11-20

## What it is

Three related things sit here.

- **robots.txt** ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), the Robots Exclusion Protocol) says which paths a crawler should not fetch. It says nothing about use after access, and compliance is voluntary.
- **Content Signals** ([contentsignals.org](https://contentsignals.org/), from Cloudflare) adds a `Content-Signal` line to robots.txt with three use categories: `search` (building an index and returning links and short excerpts, explicitly excluding AI-generated summaries), `ai-input` (feeding content into a model in real time, for example for grounding or retrieval) and `ai-train` (training or fine-tuning). Each takes `yes` or `no`; an absent signal neither grants nor restricts. The policy text frames restrictions as a reservation of rights under Article 4 of the EU Directive 2019/790 (vendor convention).
- **IETF aipref** is a working group developing a standard vocabulary and attachment methods. [A Vocabulary For Expressing AI Usage Preferences](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/) defines categories labelled `train-ai`, `ai-use` and `search`, each of which can be allowed or disallowed. [Associating AI Usage Preferences with Content in HTTP](https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/) defines a `Content-Usage` HTTP header field and a `Content-Usage` rule for robots.txt, for example `Content-Usage: train-ai=n` (specification, draft).

The two vocabularies overlap but are not the same. Content Signals' `ai-input` and aipref's `ai-use` both concern input to a generative model; aipref's `search` category is defined with conditions about linking back and excerpts, and the draft says it overrides the other categories where they overlap. A Cloudflare individual draft that proposed nesting the three Content Signals categories inside aipref, [draft-romm-aipref-contentsignals](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/), has expired.

## Why it matters for agents

Agent experience cares about one distinction that blanket "block AI" rules erase: a crawler collecting training data is not the same as an agent fetching a page because a person asked it to complete a task. Content Signals' `ai-input` and aipref's `ai-use` are the categories closest to agent use, so a site that sets them carelessly may be telling the agents of its own customers to stay away. Equally, an agent builder needs to know which preferences its fetcher should read and honour. See [agent-ready websites](../concepts/agent-ready-websites.md).

These signals describe preferences. They do not identify the client or enforce anything. Enforcement comes from CDN rules and verified identity, for which see [Web Bot Auth](web-bot-auth.md).

## Current state

As of 2026-11-20, checked against the Datatracker and vendor pages:

- **aipref vocabulary.** Working group draft [draft-ietf-aipref-vocab-08](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/), dated 14 September 2026. Its note to readers says its contents do not reflect working group consensus in whole or part. Section 3.2 says the vocabulary does not ensure that preferences are followed. An open issue asks whether "directly provided by the user" covers a URL the user supplies, which is exactly the agent case.
- **aipref attachment.** Working group draft [draft-ietf-aipref-attach-05](https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/), dated 19 August 2026, which would update RFC 9309 if approved.
- **Content Signals.** Deployed by Cloudflare. Its [managed robots.txt documentation](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) (modified 2 November 2026) generates directives from separate Search, Agent and Training policies, uses `search=yes, ai-train=no` as its managed default, and is testing a fourth field, `use`, with values `immediate`, `reference` and `full` to describe what may be kept and reused. It states that robots.txt compliance is voluntary and points to its crawler controls for enforcement (vendor documentation).
- **Defaults on converted content.** Cloudflare's [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) adds `Content-Signal: ai-train=yes, search=yes, ai-input=yes` to converted responses when the origin sets no header of its own. A site that converts pages without setting a header is therefore publishing a permissive signal.
- **W3C boundary.** The [draft Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html) lists crawler controls as out of scope and names aipref as an external coordination point.
- **Adoption evidence.** No independent, dated measurement of Content-Signal or Content-Usage adoption across a defined population was verified for this page. Treat vendor counts with their population and date.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *Preferences are not enforcement (specification).* Both the aipref vocabulary and Cloudflare's documentation say so directly.
- *Assistants vary in honouring robots.txt (study).* A controlled study of ten AI assistants with web search, using server logs and secret codes, found that some followed allow and disallow rules while others fetched restricted pages without requesting robots.txt or used generic user agents ([arXiv 2607.14447](https://arxiv.org/abs/2607.14447), preprint). It also found retrieval and visible answers can diverge.
- *Blocking prevents reading (vendor study).* In controlled probes reported in Vercel's [readability guide](https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents), a 403 to agent user agents stopped both test clients from retrieving the answer. The same guide notes public sites do not need robots.txt to permit crawling.

**Disputed or unsettled:**

- *Which vocabulary wins.* Content Signals is deployed at scale through one CDN; aipref is the standards-track route but explicitly lacks consensus text. Sites can publish both, but agents may read neither.
- *Where agent use falls.* Whether an agent fetching a page on a user's request is "AI input" or something the user directly provided is unresolved in the aipref draft.
- *Proposals for richer terms.* [terms.txt](https://arxiv.org/abs/2609.11152) (preprint) proposes per-path, per-purpose terms with identity, price and receipts. It is a research proposal without deployment.

## Practical checklist

1. Write down three separate decisions: search indexing, model training, and agents acting for a user in real time.
2. Express them in robots.txt with a `Content-Signal` line, and consider adding an aipref `Content-Usage` line so both conventions are covered.
3. If an edge service converts or rewrites responses, set an explicit `Content-Signal` header at the origin so the default does not speak for you.
4. Check that firewall and bot-management rules match the preferences you publish; a permissive signal behind a blanket block confuses everyone.
5. Keep disallow rules for genuine exclusions, and do not add agent-specific rules by default.
6. Review server logs for which user agents request robots.txt and whether they then respect it.
7. If you build an agent, decide which signals your fetcher reads, document it, and send an honest user agent.
8. Record the date and draft revision you implemented, because aipref labels may still change.

## Common mistakes

- Assuming a `Content-Signal: ai-input=no` line will stop a fetcher that never reads robots.txt.
- Using `ai-train=no` as a proxy for "no AI at all" and blocking user-directed agents by accident.
- Treating the aipref draft labels as final.
- Leaving an edge default in place that publishes broader permission than intended.
- Confusing access rules (Disallow) with use preferences (Content-Signal or Content-Usage).

## Sources and further reading

- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html) (standard)
- [draft-ietf-aipref-vocab](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/) and [draft-ietf-aipref-attach](https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/) (working group Internet-Drafts)
- [Content Signals Policy](https://contentsignals.org/) and [Cloudflare managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) (vendor convention and documentation)
- [Do Generative AI Assistants Respect robots.txt?](https://arxiv.org/abs/2607.14447) (preprint)
- The curated list section [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web)
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/) and [Agent-friendly websites](https://agentexperience.tech/insights/agent-friendly-websites/)

## Related pages

- [Web Bot Auth](web-bot-auth.md)
- [Markdown content negotiation](markdown-content-negotiation.md)
- [llms.txt](llms-txt.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [GEO and AI search](../concepts/geo-and-ai-search.md)
- [Standards tracker](../standards-tracker.md)
