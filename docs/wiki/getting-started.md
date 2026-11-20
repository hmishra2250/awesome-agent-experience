# Getting started with agent experience

In one line: what agent experience (AX) is, the five questions it asks, and a first audit you can run on your own product in an afternoon.

Last reviewed: 2026-11-20

## What AX is

Agent experience is the quality of a product as an AI agent meets it while doing work for a person, and the design work that improves it. An agent does not see your product the way a person does. It reaches it through surfaces: web pages and their markup, documentation, an API or command-line tool, an MCP server, a login and permission flow, error messages, and whatever record is left when something goes wrong. AX asks whether each of those surfaces lets the agent find the right path, act correctly, stop when it should, and leave a state that a person can check and repair.

The term in this sense comes from Mathias Biilmann's essay [Introducing AX: Why Agent Experience Matters](https://biilmann.blog/articles/introducing-ax/) (opinion, 2025), followed by [One Year of AX](https://biilmann.blog/articles/one-year-of-ax/) (opinion, 2026). Other useful framings are the Nielsen Norman Group's [AI Agents as Users](https://www.nngroup.com/articles/ai-agents-as-users/), Microsoft's [What is Agent Experience (AX)?](https://developer.microsoft.com/blog/what-is-agent-experience-ax/) (vendor material) and the conceptual paper [From Human Interfaces to Agent Interfaces](https://arxiv.org/abs/2603.20300) (position paper). No standards body owns a definition. The W3C Strategy Team's discussion paper [W3C and the State of the Web in the AI Era](https://www.w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html) (October 2026) describes agents moving from reading the web to acting on it, and frames an agent acting for a person as a kind of user agent; it is a paper for discussion, not a W3C consensus position.

Three things AX is not:

- **Not contact-centre "agent experience".** That phrase also describes the working life of human support staff. This wiki does not cover it.
- **Not only GEO.** Generative engine optimisation is about being cited by AI answer engines. AX is about whether an agent can complete a task. The two overlap at discovery and are covered separately in [GEO and AI search](concepts/geo-and-ai-search.md).
- **Not a score.** Readiness scanners report whether certain files and headers exist. As the curated list notes in its [Readiness instruments](../../README.md#readiness-instruments) section, none of them has published evidence that a higher score predicts agent task success. See [Readiness scoring](concepts/readiness-scoring.md).

For a longer treatment, read [Agent experience](concepts/agent-experience.md).

## The five questions

The curated list uses five questions to decide what is in scope. They also work as a lens on your own product. Each one names a place where an agent can fail even when the model is capable.

| Question | What it asks | What failure looks like | Start with |
| --- | --- | --- | --- |
| **1. Discover** | Can an agent find the right surface, instruction, tool or document? | The agent reads a marketing page instead of the reference, gets an empty page because content needs JavaScript, or never learns that an API exists. | [Agent-ready websites](concepts/agent-ready-websites.md), [Documentation for agents](concepts/documentation-for-agents.md) |
| **2. Call** | Can an agent select and call tools with clear schemas, examples and error boundaries? | Two tools look the same, so the agent picks the wrong one; an error message tells a human to "check the dashboard"; a required field is undocumented. | [Tool design](concepts/tool-design.md), [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md) |
| **3. Control** | Can people inspect, approve, interrupt or recover the agent's work? | A destructive action runs without confirmation; the approval screen shows a summary that differs from what executes; a timed-out write is retried and runs twice. | [Human approval and control](concepts/human-approval-and-control.md), [Recovery and handoffs](concepts/recovery-and-handoffs.md) |
| **4. Evaluate** | Can teams evaluate agent workflows in a reproducible way? | One good demo is taken as proof; the agent says "done" and nobody checks the actual state. | [Evaluating agent experience](concepts/evaluating-agent-experience.md) |
| **5. Stay useful** | Does the surface stay useful as models, tools and protocols change? | An instruction file describes last year's build command; a server still assumes protocol sessions that the current MCP revision removed. | [Context engineering](concepts/context-engineering.md), [Standards tracker](standards-tracker.md) |

Security cuts across all five: anything an agent reads (a page, a tool description, a tool result) can carry instructions meant to redirect it. Keep [Security for agent surfaces](concepts/security-for-agent-surfaces.md) open while you work.

## A first audit you can run this afternoon

This audit is deliberately small: one job, one product, a few hours. It will not give you a score. It will give you a short list of concrete problems and one change worth making first. The time suggestions below are a guide (opinion), not measured durations.

### Step 0. Pick one job (20 minutes)

Choose a task a person would plausibly hand to an agent, such as "create a project and invite two colleagues", "find the price of plan X for 50 seats and start a trial", or "rotate an API key without downtime". Write down:

- **The goal**, phrased so that success is observable. You should be able to look at the end state and say yes or no.
- **What the agent starts with**: a URL, a repository, an API key, an installed MCP server.
- **The stopping point**: the moment the agent should stop and ask a person rather than proceed (for example, before anything is charged or deleted).

If you cannot agree on these in a few sentences, the problem is scope rather than AX. Narrow the job until you can.

### Step 1. Discover: fetch your surfaces as an agent would (40 minutes)

Use a terminal rather than a browser, because many agents fetch raw HTTP. Replace `example.com` with your own domain and pick the two or three pages the job depends on.

```sh
# What do you tell automated clients?
curl -s https://example.com/robots.txt

# Is there an llms.txt index, and what does it point to?
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://example.com/llms.txt

# Does a key page return readable content without running JavaScript?
curl -s https://example.com/docs/getting-started | head -c 2000

# Do you serve Markdown when an agent asks for it?
curl -s -H 'Accept: text/markdown' -o /dev/null \
  -w '%{http_code} %{content_type}\n' https://example.com/docs/getting-started

# Do you publish a machine-readable API catalogue?
curl -s -o /dev/null -w '%{http_code}\n' https://example.com/.well-known/api-catalog
```

Record for each page: does the content appear in the raw response, is the main task reachable from it in a few links, and are prices, limits and prerequisites stated in text rather than only in images or interactive widgets?

Keep the evidence in proportion. llms.txt is widely published but often not fetched: an [Ahrefs study](https://ahrefs.com/blog/llmstxt-study) (vendor material) found most published files were never requested, and a [Common Crawl analysis](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive) found many files do not follow the proposed structure. [Checkly's survey](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) (vendor material) found only some coding agents send `Accept: text/markdown`. A controlled before-and-after study, [Designing Agent-Ready Websites for AI Web Agents](https://arxiv.org/abs/2607.12056) (study, preprint), is a better guide to what helps web agents than any single file. Check your own server logs for which agents actually request what. See [llms.txt](standards/llms-txt.md), [Markdown content negotiation](standards/markdown-content-negotiation.md) and [Agentic resource discovery](standards/agentic-resource-discovery.md).

### Step 2. Call: read your tools and API as the agent's menu (40 minutes)

List every tool, endpoint or command an agent could use for the job. If you run an MCP server, connect to it with the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) and read the tool list exactly as a client receives it. For each item, check:

- **Name and description.** Does the description say what the tool is for, when not to use it, and which neighbouring tool to use instead? Could two tools be confused? Research on MCP descriptions finds many have defects of this kind ([From Docs to Descriptions](https://arxiv.org/abs/2602.18914), [MCP Tool Descriptions Are Smelly!](https://arxiv.org/abs/2602.14878), both studies).
- **Parameters.** Are required fields, formats, units and allowed values in the schema rather than only in prose? A controlled study reports that parameter schema shape affects which tool gets selected, not only how it is called ([Which Metadata Matters for LLM Tool Selection in MCP?](https://arxiv.org/abs/2610.14334), study, preprint).
- **Errors.** Trigger one realistic error, such as a missing field or an expired token. Does the response say what went wrong and what to do next in terms the agent can act on, or does it tell a human to open a dashboard? A preprint reports that error text written for developers misleads tool-only agents ([MCP Error Messages Written for Developers](https://arxiv.org/abs/2609.35381), study, preprint). For HTTP APIs, [RFC 9457 problem details](https://www.rfc-editor.org/rfc/rfc9457.html) (specification) gives a standard shape.
- **Effects.** Does each tool say whether it reads, writes, deletes or spends money? If you use MCP, are the tool annotations set?

Anthropic's [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (vendor material) is a good companion for this step. See [Tool design](concepts/tool-design.md).

### Step 3. Control: list every action that changes the world (30 minutes)

Make a table of the actions in the job that create, change, delete, send or pay for something. For each one, record:

| Action | Reversible? | Who must confirm? | Where is confirmation enforced? | Safe to retry? |
| --- | --- | --- | --- | --- |
| e.g. delete project | No | Account owner | Host prompt only | Unknown |

Then ask three questions:

1. **Is approval enforced, or only suggested?** A source-code audit of MCP servers and hosts reports that most pairings have no enforced approval for destructive tools by default ([When Neither Side Confirms](https://arxiv.org/abs/2611.02527), study, preprint). Decide whether your server, your API or the host owns the check, and write it down.
2. **Is what the person approves exactly what runs?** If the approval screen shows a summary written by the model, it can differ from the real call. See [Consent Integrity for Black-Box LLM Agents](https://arxiv.org/abs/2606.02668) and [Loopjacking](https://arxiv.org/abs/2609.21081) (both studies, preprints).
3. **What happens on a timeout?** If a write may or may not have happened, can the agent find out before retrying? Idempotency keys, as in [Stripe's idempotent requests](https://docs.stripe.com/api/idempotent_requests) (vendor documentation) and the IETF [Idempotency-Key header draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) (Internet-Draft, not yet a standard), are the common answer.

See [Human approval and control](concepts/human-approval-and-control.md) and [Recovery and handoffs](concepts/recovery-and-handoffs.md).

### Step 4. Evaluate: watch the agent do the job (60 minutes)

Give the job from Step 0 to one or two agents you expect your users to have (a coding agent, a browsing agent, a chat assistant with your MCP server installed). Run it at least three times, because results vary between runs. For each run, note:

- where the agent chose between options, and what it had to go on;
- where it guessed, hesitated, retried or asked;
- whether it said it had finished, and **whether the end state actually matches the goal**.

Check the last point against the real system (the database, the account page, the API), not the agent's summary. Recent benchmarks report a large gap between runs that agents declare finished and runs where the required change actually happened ([BreakingWeb](https://arxiv.org/abs/2609.35814), [WebPageBench](https://arxiv.org/abs/2609.35026), both studies, preprints). If your product does not return a clear confirmation of a state change, that is itself a finding.

This is a review, not an eval suite. When you want repeatable measurement, Vercel's [Agents are users, so your software needs evals](https://vercel.com/blog/agent-evals) (vendor material) describes a pyramid of deterministic tests, one-turn evals and end-to-end evals, and Anthropic's [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (vendor material) covers grading. See [Evaluating agent experience](concepts/evaluating-agent-experience.md).

### Step 5. Stay useful: check what will go stale (20 minutes)

Look at what you tell agents and when it was last true:

- Do your `AGENTS.md`, skills, llms.txt or quick-start pages name commands, versions and URLs that still work? A preprint reports that coding agents act on stale instruction files without repairing them ([When Instruction Files Go Stale](https://arxiv.org/abs/2611.09802), study, preprint).
- Which protocol versions do you depend on? As of 2026-11-20 the current MCP revision is [2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog), which removed protocol sessions and the initialize handshake. A server or guide written for an earlier revision may need updating. The [Standards tracker](standards-tracker.md) lists others.
- Is anyone named as the owner of each agent-facing surface?

### Step 6. Write it up and pick one change (30 minutes)

Sort what you found into four kinds:

- **Wording**: a description, error message or page that misleads.
- **Structure**: missing schema fields, content hidden behind JavaScript, no Markdown route, two tools that should be one.
- **Boundary**: an approval that is not enforced, a permission wider than the job, an unsafe retry.
- **Record**: no way to tell what the agent did, or to check the outcome.

Choose the single change with the best ratio of clarity gained to work required, ship it, and run Step 4 again with the same job. A change that you cannot observe in a rerun is not yet a finding. Further reading (same maintainer): [Run an AX review](https://agentexperience.tech/insights/run-an-ax-review/) and [Start with workflows](https://agentexperience.tech/insights/start-with-workflows/).

### Audit worksheet

Copy this into a document and fill it in as you go.

```text
Job:
Success looks like:
Agent starts with:
Stop and ask when:

DISCOVER  pages checked / raw content readable? / Markdown? / llms.txt? / API catalogue?
CALL      tools listed / confusable pairs / undocumented params / error tested and result
CONTROL   world-changing actions / enforced where / approval matches execution? / retry safe?
EVALUATE  runs: 1 [declared done? verified?]  2 [...]  3 [...]  decision points noted
STAY      stale instructions found / protocol versions / owners named

Findings (wording / structure / boundary / record):
First change:
Rerun result:
```

## Where to go next by role

- **You publish a website or documentation.** Read [Agent-ready websites](concepts/agent-ready-websites.md) and [Documentation for agents](concepts/documentation-for-agents.md), then the standards pages on [llms.txt](standards/llms-txt.md), [Markdown content negotiation](standards/markdown-content-negotiation.md), [Content signals and AI preferences](standards/content-signals-and-ai-preferences.md) and [WebMCP](standards/webmcp.md). List section: [Discovery and agent-readable web](../../README.md#discovery-and-agent-readable-web).
- **You build tools, APIs, CLIs or MCP servers.** Read [Tool design](concepts/tool-design.md), [Tool selection at scale](concepts/tool-selection-at-scale.md) and [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md), then [MCP](standards/mcp.md) and [OpenAPI, Arazzo and JSON Schema](standards/openapi-arazzo-json-schema.md). List section: [Tool use, tool descriptions and MCP](../../README.md#tool-use-tool-descriptions-and-mcp).
- **You work on coding-agent developer experience.** Read [Documentation for agents](concepts/documentation-for-agents.md), [AGENTS.md](standards/agents-md.md) and [Agent Skills](standards/agent-skills.md), and look at Microsoft's [AX Practitioner Playbook](https://microsoft.github.io/agent-experience/playbook/) (vendor material), which focuses on whether coding agents use a technology correctly.
- **You design product flows where agents act for users.** Read [Human approval and control](concepts/human-approval-and-control.md), [Recovery and handoffs](concepts/recovery-and-handoffs.md) and [Agent identity and authorization](concepts/agent-identity-and-authorization.md). List section: [Human control, approval and recovery](../../README.md#human-control-approval-and-recovery).
- **You own security or production risk.** Read [Security for agent surfaces](concepts/security-for-agent-surfaces.md), then [MCP](standards/mcp.md) and [Agent Skills](standards/agent-skills.md) for supply-chain issues. List section: [Security for agent-facing surfaces](../../README.md#security-for-agent-facing-surfaces).
- **You run identity, auth or platform infrastructure.** Read [Agent identity and authorization](concepts/agent-identity-and-authorization.md), [Web Bot Auth](standards/web-bot-auth.md) and [Agent authorization drafts](standards/agent-auth-drafts.md). List section: [Agent identity and authorization](../../README.md#agent-identity-and-authorization).
- **You run commerce or payments.** Read [Agentic commerce](concepts/agentic-commerce.md) and [Agent payment protocols](standards/agent-payment-protocols.md). List section: [Agentic commerce and payments](../../README.md#agentic-commerce-and-payments).
- **You run evaluations, analytics or research.** Read [Evaluating agent experience](concepts/evaluating-agent-experience.md), [Readiness scoring](concepts/readiness-scoring.md) and [Agent analytics and observability](concepts/agent-analytics-and-observability.md). List section: [Evaluation](../../README.md#evaluation).
- **You lead a team and need the overview.** Read [Agent experience](concepts/agent-experience.md), skim the [Standards tracker](standards-tracker.md), and ask one team to run the audit above on the job your customers most want to delegate.
- **You want a structured course.** Follow the [Learning path](learning-path.md).

## Related pages

- [Wiki home](README.md)
- [Learning path](learning-path.md)
- [Glossary](glossary.md)
- [Standards tracker](standards-tracker.md)
- [Agent experience](concepts/agent-experience.md)
