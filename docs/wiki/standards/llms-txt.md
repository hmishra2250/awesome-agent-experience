# llms.txt

**In one line:** a community proposal for a short Markdown index, placed at a site root or under a path, that points agents to the pages that matter and to clean Markdown versions of them; useful as a map for agents on documentation sites, and not a search ranking lever.

**Last reviewed:** 2026-11-20

## What it is

[The /llms.txt file](https://llmstxt.org/) was proposed by Jeremy Howard in September 2024 and revised as v2 in August 2026 ([changes page](https://llmstxt.org/changes.html)). It is maintained as an informal proposal open for community input, not as a standards-track document.

The format is Markdown with a fixed order (specification):

- an H1 with the project or site name, which is the only required part;
- a blockquote summary;
- optional free text without headings;
- H2 sections containing lists of links, each a Markdown link optionally followed by a colon and a note.

By convention a section called "Optional" holds links an agent can skip. In v2 this is only a convention; it no longer carries the special meaning it had for v1 context-expansion tools.

Version 2 adds three things that matter in practice:

- **Path scoping.** A file can sit at any path and covers the pages beneath it; where several apply, the most specific wins. This lets authors who control only a path, such as a project site on a shared host, take part. The proposal explains that this is why it does not use `/.well-known/`.
- **Markdown twins.** Pages agents may need should have a Markdown version at the same URL with `.md` appended or replacing the extension.
- **Discovery by link relation.** `rel="alternate" type="text/markdown"` points from a page to its Markdown version, and `rel="describedby"` points to the covering llms.txt, as HTML `<link>` elements or an HTTP `Link:` header.

The proposal expects agents to read or search the file and then follow its links, which is why the file should stay small and the detail should live behind the links.

## Why it matters for agents

An agent fetching an HTML page pays for navigation, scripts and layout before it reaches the content. A good llms.txt gives it a curated table of contents and a route to text it can use directly, which can save fetches and guesswork, especially for coding agents reading API documentation. It complements [Markdown content negotiation](markdown-content-negotiation.md), which serves Markdown on request without guessing a URL. It does nothing for access control: it grants nothing and blocks nothing, which is the job of robots.txt and the preferences covered in [content signals and AI preferences](content-signals-and-ai-preferences.md).

## Current state

As of 2026-11-20, checked against the live proposal and the sources below:

- **Steward and status.** Maintained by its author at llmstxt.org, with a [reference repository](https://github.com/AnswerDotAI/llms-txt). Latest revision: v2 (August 2026). No standards body has adopted it.
- **Platform support.** Documentation platforms and site builders generate files automatically, and Chrome's [Lighthouse agentic browsing audit](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) checks for one. Google Search's [guide to generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says that for Google Search you can ignore AI text files such as llms.txt (vendor material).
- **Publication.** Ahrefs found an llms.txt on 28 per cent of 137,210 domains using its analytics product, which it describes as an upper bound because its customers skew technical ([Ahrefs](https://ahrefs.com/blog/llmstxt-study), vendor study). An independent HTTP Archive analysis found a valid file on about 5 per cent of popular origins in June 2026, with platform defaults (Shopify in particular) driving much of the growth ([caseyrb.com](https://caseyrb.com/blog/state-of-llms-txt-adoption/)). The populations differ, so the figures are not comparable.
- **Reading.** In May 2026 data, 97 per cent of the files Ahrefs observed received no requests at all, and no AI bot requested llms.txt from sites that did not have one. Among AI tools that did fetch files, GPTBot led and Claude-Code came second (vendor study).
- **Content.** Common Crawl seeded `/llms.txt` into its July 2026 crawl and analysed 584,107 non-empty files ([Common Crawl](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive)). About two thirds came from a plugin or template, about half had the full structure the proposal describes, only about a third followed the convention of a note on each link, 22.56 per cent contained no links, 6.59 per cent carried policy language the format does not support, and a small number held deliberate prompt injections (study, one crawl).

## What the evidence supports and what is disputed

**Reasonably supported:**

- *It is not a search ranking tactic for Google.* Google says so directly for its Search features (vendor material).
- *Most published files are never read.* The Ahrefs log data supports this for its population (vendor study).
- *Agents fetch it when directed, not speculatively.* Ahrefs saw no requests for missing files, and its guidance is to link the file from pages and documentation (vendor study).
- *Quality is low on average.* Template output dominates and many files lack the links that are the format's purpose (study).
- *Readability in general can help agents.* A controlled before-and-after study on one e-commerce prototype found that an agent-ready version raised browser-agent success and cut steps ([arXiv 2607.12056](https://arxiv.org/abs/2607.12056), study). It tests a bundle of structural changes and does not isolate llms.txt.

**Disputed or unsettled:**

- *Whether llms.txt changes task outcomes.* The evidence measures publication and fetches. No independent intervention study across many real sites isolates llms.txt and measures agent task success.
- *Value outside documentation.* The proposal suggests uses for businesses, personal sites and schools; current fetch evidence is concentrated on developer documentation and coding agents.
- *The index versus the full dump.* Some sites publish `llms-full.txt` with all content concatenated. The v2 proposal no longer describes context expansion, and a very large file works against the aim of a small index (opinion).

## Practical checklist

1. Write the file by hand, or edit the generated one: H1, one-sentence summary, then H2 sections of links with a short note on each.
2. Link only to pages you control, and point to Markdown versions where they exist.
3. Serve each linked Markdown twin with a `text/markdown` content type and keep it in step with the HTML.
4. Add `rel="alternate" type="text/markdown"` and `rel="describedby"` links, in HTML or a `Link:` header.
5. Use path-scoped files for large sites, such as `/docs/llms.txt` for documentation.
6. Keep policy out of it: put crawler rules in robots.txt and usage preferences in the appropriate standard.
7. Keep it free of instruction-shaped text and install commands; version-control it and review changes as you would code.
8. Reference it where agents receive instructions, such as documentation pages and [AGENTS.md](agents-md.md), so agents know it exists.
9. Check your own logs for requests to the file and its links before investing more.
10. Test it by giving an agent only the file and asking it to find specific answers.

## Common mistakes

- Selling llms.txt as GEO or an AI search ranking signal.
- Shipping a template file with placeholder text, no links or a parked-domain pitch.
- Serving robots.txt or an HTML application shell at the llms.txt path.
- Writing crawler opt-outs in llms.txt and assuming they work.
- Publishing a multi-megabyte dump that defeats the purpose of a small index.
- Letting the file drift from the site, so agents follow dead or outdated links.

## Sources and further reading

- [The /llms.txt file, v2](https://llmstxt.org/) and [Changes](https://llmstxt.org/changes.html) (proposal)
- [llms-txt reference repository](https://github.com/AnswerDotAI/llms-txt)
- [A Content Analysis of llms.txt Files from the July 2026 Crawl Archive](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive) (measurement study)
- [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study) (vendor study)
- [Does anyone actually have an llms.txt?](https://caseyrb.com/blog/state-of-llms-txt-adoption/) (independent analysis)
- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) and [Lighthouse agentic browsing scoring](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) (vendor material)
- [Docs URL Discovery Bench](https://github.com/mintlify/docs-url-discovery-bench) (vendor benchmark)
- [thedaviddias/llms-txt-hub](https://github.com/thedaviddias/llms-txt-hub) for examples (directory)
- The curated list section [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web)
- Further reading (same maintainer): [The state of llms.txt](https://agentexperience.tech/insights/state-of-llms-txt/)

## Related pages

- [Markdown content negotiation](markdown-content-negotiation.md)
- [Content signals and AI preferences](content-signals-and-ai-preferences.md)
- [AGENTS.md](agents-md.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Documentation for agents](../concepts/documentation-for-agents.md)
- [GEO and AI search](../concepts/geo-and-ai-search.md)
- [Readiness scoring](../concepts/readiness-scoring.md)
- [Standards tracker](../standards-tracker.md)
