# GEO and AI search

**In one line:** Generative engine optimisation (GEO) asks whether AI answer engines retrieve and cite your content; agent experience asks whether an agent can complete a job once it reaches you, and the two overlap only at the reading step.

Last reviewed: 2026-11-20

## What it is

GEO is the practice of making content more likely to be retrieved, cited and used by AI systems that answer questions: AI search, chat assistants with web search, and features such as Google AI Overviews. The term comes from the 2023 paper [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735), which introduced a benchmark and reported visibility gains on it. Practitioners also use "answer engine optimisation" (AEO), "LLM optimisation" and "AI visibility" for overlapping ideas.

Google's own guidance, [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), treats this as ordinary search work and says tactics such as content chunking or llms.txt files are unnecessary for its Search (vendor material, one engine).

## How GEO and AX overlap and differ

| | GEO | AX |
|---|---|---|
| Question | Is my content retrieved and cited in an answer? | Can an agent finish the job a person delegated? |
| Unit | A query and its answer | A workflow from request to hand-back |
| Success measure | Mentions, citations, share of answer | Task completed correctly, at reasonable cost, with the person able to see and undo |
| Surfaces | Public pages and their retrieval | Pages plus APIs, tools, auth, approval and error paths |
| Typical failure | The right page is never retrieved or credited | The agent picks the wrong action, loses context or reports success falsely |
| Main risk | Manipulation of answers | Wrong or unauthorised actions |

The overlap is real. Before an agent can act it usually has to find and read something, and both disciplines reward the same basics: content served in the HTML, facts stated plainly, stable URLs. A preprint from authors at a readiness vendor, [AX is the New AEO](https://arxiv.org/abs/2609.34951), argues that once an agent drills down from search results to a business's own site, readability of that site decides much of the answer. Microsoft's [AX primer](https://developer.microsoft.com/blog/what-is-agent-experience-ax/) puts it more narrowly: GEO overlaps with propensity (whether the agent picks your technology) but says nothing about efficacy (whether it then uses it correctly) (vendor material).

## Why it matters for agents

Search and citation are often the first step of an agent's job, so GEO findings tell you something about how agents choose which pages to read. They tell you almost nothing about what happens next: whether the agent can sign in, call the right tool, understand an error, or return a checkable result. Teams that measure only citation share can be confident and wrong about their agent experience.

## Current state

As of 2026-11-20 the research has moved from pooled correlations towards causal and production-level measurement:

- **Causal replay (study).** [CITECHOICE](https://arxiv.org/abs/2609.15164) (September 2026) replays frozen agentic-search transcripts and finds structured rendering shifts citation credit towards a source without clearly increasing whether it is cited at all, and that about 15 per cent of binary citation decisions change under fresh decoding.
- **Production pipelines (study).** [Understanding ChatGPT Citations](https://arxiv.org/abs/2610.15382) (October 2026) separates query rewriting, retrieval rounds and citation choice across ChatGPT 5.2 to 5.5, and finds that Google results and the Responses API together recover only about a quarter of cited URLs.
- **Answer quality (study, peer reviewed).** [Measuring Google AI Overviews](https://arxiv.org/abs/2605.14021) (ACM IMC 2026) reports nearly 30 per cent of cited domains absent from the first results page and 11 per cent of atomic claims unsupported by the cited pages.
- **Measurement validity (study).** [Quantifying Uncertainty in AI Visibility](https://arxiv.org/abs/2603.08924) shows single-run visibility metrics are misleadingly precise and many apparent differences sit within the noise floor. An observational study of about two million citations ([arXiv 2609.35077](https://arxiv.org/abs/2609.35077)) finds that FAQ blocks, structured data and Core Web Vitals lose their apparent effect once domain fixed effects are applied.
- **Field synthesis (study).** The [critical survey of GEO](https://arxiv.org/abs/2607.14035) concludes no reviewed technique shows a stable, cross-platform effect over time. [What Gets Cited](https://arxiv.org/abs/2605.25517) finds relevance and position matter far more than formatting-only edits, and [citation absorption](https://arxiv.org/abs/2604.25707) shows being cited and shaping the answer diverge.
- **Manipulation (study).** [When Optimization Becomes Manipulation](https://arxiv.org/abs/2609.02964) treats automated GEO as an attack surface and proposes a defence.

## What the evidence supports and what is disputed

- **Supported.** Relevance and list position have real effects on citation. Citation metrics need repeated sampling and uncertainty intervals. Retrieval visibility and citation visibility are different things.
- **Supported with caveats.** Structured presentation can redistribute citation credit within a fixed set of retrieved sources (CITECHOICE), but that is not evidence that structure gets a source retrieved.
- **Disputed.** Whether any formatting or markup tactic reliably improves admission across engines over time. The survey and the fixed-effects study both cast doubt on it, and Google's guidance says no special markup is needed for its features.
- **Disputed, AX side.** Whether being readable to agents causes better outcomes for a business. AX is the New AEO reports large associations across 1,056 businesses and four harnesses, but it is observational and its readiness ranker is the authors' own instrument, which the paper itself notes.
- **Not measured.** None of the GEO studies above measures whether being cited helps an agent complete a task. That is why the curated list keeps GEO in an adjacent section.

## Practical checklist

1. Decide whether your problem is being found (GEO) or being usable (AX), and measure each separately.
2. If you track AI visibility, sample each query many times and report intervals, not single figures.
3. Report retrieval and citation separately where your tooling allows.
4. Re-check results when an engine changes model or mode; the ChatGPT study shows behaviour differs across settings.
5. Make sure the facts an answer needs are in the served HTML of your own pages.
6. Then test the drill-down: ask an agent a buyer's question and check whether it can read your page and act on it.
7. Do not place instructions aimed at models in pages or llms.txt; they read as prompt injection.
8. Treat vendor uplift claims as hypotheses until you see controlled evidence.

## Common mistakes

- Reporting citation share as an AX metric.
- Rewriting pages for citation in ways that make them worse for people or for retrieval.
- Comparing single-run visibility numbers between weeks or competitors.
- Assuming a schema or FAQ block will raise citations; current evidence does not support that as a general rule.
- Ignoring claim fidelity: being cited for something your page does not say is not a win.

## Sources and further reading

- Curated list: [GEO and AI search (adjacent)](../../../README.md#geo-and-ai-search-adjacent), [Agent experience framing](../../../README.md#agent-experience-framing).
- [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735) (paper).
- [Optimizing Visibility in Generative Engines: A Critical Survey](https://arxiv.org/abs/2607.14035) (paper).
- [Google AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (documentation, one engine).
- Further reading (same maintainer): [AX vs UX vs DX vs GEO](https://agentexperience.tech/insights/ax-vs-ux-dx-geo/), [The state of llms.txt](https://agentexperience.tech/insights/state-of-llms-txt/).

## Related pages

- [Agent experience](agent-experience.md)
- [Agent-ready websites](agent-ready-websites.md)
- [Readiness scoring](readiness-scoring.md)
- [Agent analytics and observability](agent-analytics-and-observability.md)
- [llms.txt](../standards/llms-txt.md)
