# Agent Experience Wiki

In one line: a set of plain, sourced explainer pages for people who want to understand and practise agent experience (AX), built on top of the [Awesome Agent Experience](../../README.md) curated list.

Last reviewed: 2026-11-20

## What this wiki is

Agent experience is the design of the product, documentation, API, tool, protocol, evaluation and recovery surfaces that AI agents use when they work for people. The curated list collects the primary sources for that work. This wiki explains them: what each idea means, why it matters for agents, what the evidence supports, what is still disputed, and what you can check on your own product this week.

The wiki is written for practitioners who are new to the field as well as for those who want a careful reference. Every page aims to be:

- **Sourced.** Claims link to public sources, mostly entries in the curated list. Where a page states the status or version of a standard, it says the date on which that was checked (for example "As of 2026-11-20").
- **Labelled.** Where it matters, a claim is tagged as (specification), (study), (vendor material) or (opinion), so readers can tell a requirement from a finding from a recommendation.
- **Honest about uncertainty.** Much of the field is less than two years old and most of the research is preprints. Pages say so rather than presenting early results as settled practice.
- **Practical.** Concept and standard pages end with a short checklist of items you can verify, not general advice.

The wiki uses the same scope as the list: software agents (web agents, tool-using models, MCP and API surfaces, evaluation harnesses, human control and recovery). It is not about contact-centre agents, real-estate agents or generic AI marketing.

## How it relates to the curated list

The [curated list](../../README.md) is the index of sources. Each entry has a source type, a year, a reason it matters and a limitation. The wiki is the commentary layer: it groups those sources by question, compares them, and points out where they disagree.

Two rules keep the two in step:

1. A wiki page should cite sources that are in the list wherever possible. If a page needs a source that is not in the list, the contributor opens it, checks it, and considers proposing it as a list entry too.
2. The list stays the authority on what a source is and what its limits are. If a wiki page and a list annotation disagree, the list annotation is reviewed first, because it is the shorter and more often checked text.

## Where to start

- **New to AX?** Read [Getting started](getting-started.md). It explains the field in a few minutes and gives you a first audit you can run on your own product in an afternoon.
- **Want a structured course?** Follow the [Learning path](learning-path.md): ten modules from foundations to operations, each with readings, an exercise and a self-check.
- **Looking up a term?** Use the [Glossary](glossary.md).
- **Tracking a standard?** Use the [Standards tracker](standards-tracker.md), which records steward, status and last check date for each protocol and draft.

## Page map

### Start here

| Page | What it covers |
| --- | --- |
| [README.md](README.md) | This page: what the wiki is, how it relates to the list, and how to contribute. |
| [Getting started](getting-started.md) | AX in an afternoon: the five questions, a first audit of your own product, and where to go next by role. |
| [Learning path](learning-path.md) | A self-paced course in ten modules with readings, exercises and self-checks. |
| [Glossary](glossary.md) | Short definitions of the terms used across the wiki and the list. |
| [Standards tracker](standards-tracker.md) | One table of the protocols, specifications and drafts that matter for AX, with steward, status and date checked. |

### Concepts

| Page | What it covers |
| --- | --- |
| [Agent experience](concepts/agent-experience.md) | What AX means, where the term came from, the other meanings you will meet, and how it relates to UX, DX and GEO. |
| [Agent-ready websites](concepts/agent-ready-websites.md) | Making web pages and flows that agents can read, navigate and act on, including accessibility structure and stable layouts. |
| [Documentation for agents](concepts/documentation-for-agents.md) | Writing and serving documentation, instruction files and skills that agents can find and use, and what the evidence says about them. |
| [Context engineering](concepts/context-engineering.md) | Deciding what information reaches an agent, in what form and when, including memory, compaction and context rot. |
| [Tool design](concepts/tool-design.md) | Names, descriptions, schemas, results and error messages for tools that agents choose and call. |
| [Tool selection at scale](concepts/tool-selection-at-scale.md) | What happens when an agent faces hundreds of tools or skills: tool search, shadowing, pruning and progressive discovery. |
| [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md) | Command-line tools and HTTP APIs that work for agents: non-interactive defaults, structured output, problem details and rate limits. |
| [Agent identity and authorization](concepts/agent-identity-and-authorization.md) | How agents identify themselves, obtain delegated authority, and how that authority is scoped and revoked. |
| [Human approval and control](concepts/human-approval-and-control.md) | Where approval is enforced, binding what a person approves to what actually runs, and timing of oversight. |
| [Recovery and handoffs](concepts/recovery-and-handoffs.md) | Safe retries, idempotency, recoverable errors, verifying outcomes, and keeping context across handoffs between agents and people. |
| [Security for agent surfaces](concepts/security-for-agent-surfaces.md) | Prompt injection, tool poisoning, supply-chain risk in skills and servers, and architectural defences. |
| [Agentic commerce](concepts/agentic-commerce.md) | How agents discover products, check out and pay, and what the competing protocols and security studies say. |
| [Evaluating agent experience](concepts/evaluating-agent-experience.md) | Building product-owned evals, reading benchmarks critically, and verifying state rather than claims. |
| [Readiness scoring](concepts/readiness-scoring.md) | What readiness scanners measure, why their scores disagree, and how to use them without treating them as outcomes. |
| [GEO and AI search](concepts/geo-and-ai-search.md) | How answer engines cite content, what the research shows, and why it is adjacent to AX rather than the same thing. |
| [Agent analytics and observability](concepts/agent-analytics-and-observability.md) | Recognising agent traffic, tracing agent runs, and the OpenTelemetry and OpenInference conventions. |

### Standards

| Page | What it covers |
| --- | --- |
| [MCP](standards/mcp.md) | The Model Context Protocol: the stateless 2026-07-28 revision, extensions, registry, security and conformance. |
| [A2A](standards/a2a.md) | The Agent2Agent protocol for agent-to-agent tasks, Agent Cards and conformance tooling. |
| [AGENTS.md](standards/agents-md.md) | The repository instruction file for coding agents, its governance and the studies of whether it helps. |
| [Agent Skills](standards/agent-skills.md) | The SKILL.md format, skill discovery, Skills over MCP, and skills as a supply-chain surface. |
| [llms.txt](standards/llms-txt.md) | The llms.txt proposal, what adoption and fetch studies show, and where it fits next to sitemaps and Markdown routes. |
| [WebMCP](standards/webmcp.md) | Browser-side tools that a page exposes to agents, its Community Group status, origin trial and threat model. |
| [Web Bot Auth](standards/web-bot-auth.md) | Signed HTTP requests that let sites verify which agent or crawler is calling. |
| [Content signals and AI preferences](standards/content-signals-and-ai-preferences.md) | Content Signals, the IETF aipref vocabulary and attachment drafts, and robots.txt for AI uses. |
| [Markdown content negotiation](standards/markdown-content-negotiation.md) | Serving Markdown to agents with `Accept: text/markdown` or parallel routes, and which agents ask for it. |
| [NLWeb](standards/nlweb.md) | A natural-language query interface for websites and how it compares with other agent interfaces. |
| [Agentic resource discovery](standards/agentic-resource-discovery.md) | Well-known files, catalogues, DNS records and registries that help agents find capabilities. |
| [OpenAPI, Arazzo and JSON Schema](standards/openapi-arazzo-json-schema.md) | The API description standards most agent tool definitions build on. |
| [Agent payment protocols](standards/agent-payment-protocols.md) | ACP, UCP, AP2, x402, MPP and the card-network trust layers, side by side. |
| [Agent authorization drafts](standards/agent-auth-drafts.md) | The IETF and OpenID drafts for agent authentication and delegation, and which are adopted. |

## How to contribute pages

Contributions are welcome, including corrections and removals. A shorter accurate page is better than a long one that overstates the evidence. The general rules in [CONTRIBUTING.md](../../CONTRIBUTING.md) apply to the wiki as well as to the list.

**Before you write.** Check the page map above. If the topic fits an existing page, improve that page instead of adding a new one. New pages should answer a question that a practitioner actually has, and should be added to this map in the same pull request.

**Page shape.** Concept and standard pages follow one shape so readers know where to look:

1. Title, then an "In one line" summary.
2. "Last reviewed: YYYY-MM-DD".
3. What it is.
4. Why it matters for agents.
5. Current state. For standards: steward, status, latest version and adoption evidence, each with the date checked.
6. What the evidence supports and what is disputed.
7. Practical checklist: five to ten items a reader can verify.
8. Common mistakes.
9. Sources and further reading.
10. Related pages.

Aim for 600 to 1,400 words. The top-level pages (this one, Getting started, the Learning path, the Glossary and the Standards tracker) may use their own shape.

**Sources.**

- Link to the canonical public source: an arXiv abstract page, the ACL Anthology, a specification site, an IETF Datatracker page, or the project's own repository.
- Open every source before you cite it, and never cite a source for something it does not say.
- For any status or version claim about a standard, check the live specification on the day you write and say "As of" that date.
- Do not invent numbers. If you quote a figure, link the study it comes from and say what kind of study it is.
- Social media and forum posts are leads to primary sources, not sources in their own right.

**Style.**

- British English, plain declarative sentences, no hype.
- No contractions and no em or en dashes; use commas, colons or parentheses instead.
- Write in your own words. Do not copy abstracts or paste large parts of a specification.
- Say who wrote a vendor source and label it as vendor material.

**Links.** Use relative links between wiki pages (from `concepts/` to `standards/`, for example `../standards/mcp.md`). Link to the curated list as `../../README.md` from top-level wiki pages and `../../../README.md` from pages in `concepts/` and `standards/`, with section anchors where useful, such as `#human-control-approval-and-recovery`.

**Privacy.** Only public material belongs here. Do not include client, employer or unpublished work, private traces, credentials or local file paths.

**Review.** Before opening a pull request, run the repository checks described in [CONTRIBUTING.md](../../CONTRIBUTING.md), read your page once for dashes, contractions and broken relative links, and update its "Last reviewed" date.

## Disclosure

This repository, and so this wiki, is maintained by the author of the Open Agent-Readiness Rubric and of the guides at agentexperience.tech. Some pages link to those guides as "Further reading (same maintainer)". They are opinion and method material from one practitioner, not independent evidence, and they are never cited as the only support for a claim.
