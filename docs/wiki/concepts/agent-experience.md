# Agent experience (AX)

**In one line:** Agent experience is the quality of a product, its documentation, interfaces, tools and recovery paths as an AI agent meets them while doing work for a person.

Last reviewed: 2026-11-20

## What it is

Agent experience (AX) treats an AI agent as a user of software. The agent has a goal, meets an interface, tries to reach the goal through it, and either succeeds, fails visibly, or fails silently. AX work is the design of everything the agent depends on along that path: how it finds the right surface, reads it, chooses a capability, calls it correctly, recovers when something breaks, and hands the result back to the person it acts for.

Mathias Biilmann of Netlify introduced the AI sense in [Introducing AX](https://biilmann.blog/articles/introducing-ax/) (28 January 2025), placing it after user experience (which the essay attributes to Don Norman, 1993) and developer experience (Jeremiah Lee, 2011). It asked whether an agent can get access on a user's behalf, whether APIs are clean and well described, and whether machine-ready documentation exists. [One Year of AX](https://biilmann.blog/articles/one-year-of-ax/) regrouped this into four pillars (access, context, tools and orchestration), and the community [Principles of AX](https://agentexperience.ax/concepts/principles-of-ax/) treat agents as delegates of people (opinion).

Later framings shift the emphasis rather than the core idea:

- Sean Roberts' O'Reilly essay [Stop Getting Good at Protocols. Get Good at Agent Experience.](https://www.oreilly.com/radar/stop-getting-good-at-protocols-get-good-at-agent-experience/) (June 2026) argues that MCP, Skills, A2A and similar are implementations that change, while the discipline of observing agents, finding where they struggle and locking improvements into CI is the durable part (opinion).
- Microsoft's [What is Agent Experience (AX)?](https://developer.microsoft.com/blog/what-is-agent-experience-ax/) (6 October 2026) splits measurement into propensity (does the agent choose your technology) and efficacy (does it use it correctly once chosen), each scored for quality and task cost, and says best-practice lists are hypotheses until measured (vendor material).
- The W3C Strategy Team paper [W3C and the State of the Web in the AI Era](https://www.w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html) (finalised 20 October 2026) proposes that an agent acting for a person is a user agent that owes that person loyalty, transparency and safety, and that consequential actions need real human consent. It is a discussion paper prepared for TPAC, not a consensus position.
- Nielsen Norman Group's [AI Agents as Users](https://www.nngroup.com/articles/ai-agents-as-users/) (April 2026) gives the most neutral statement of the functional view, and also lists legitimate reasons a business may choose not to serve agents (opinion).

## Variants of the term

"Agent experience" means different things depending on who the agent is and what unit of work is judged. Name your meaning on first use.

| Meaning | Who the agent is | What is judged | Example sources |
|---|---|---|---|
| Product AX | An AI agent using a product or platform | The product as the agent meets it: access, APIs, docs, errors | Biilmann; agentexperience.ax |
| Coding-agent AX | A coding agent building with your SDK, API or CLI for a developer | Whether the agent picks your technology and uses it correctly | Microsoft DevAX; CJ Avilla's [ADX](https://www.cjav.dev/articles/ax-dx-adx-naming-the-three-audiences-your-api-now-has-to-serve) label |
| Delegation-side design | The person handing work to an agent | Whether the person can direct, supervise and take control back | auxfirst's [AX versus AUX](https://auxfirst.com/agent-experience-vs-agentic-user-experience.html) split |
| Contact-centre AX | A human support worker | That person's working day | Contact-centre software vendors (out of scope for this wiki) |

Other labels (AXO, AXD, "agent-native") circulate in agency and vendor writing as frameworks rather than measured constructs. This wiki uses AX as the umbrella and treats the person's control over the agent as part of the same workflow.

## AX vs UX vs DX vs GEO

| | UX | DX | GEO | AX |
|---|---|---|---|---|
| Primary user | A person using the product | A person building with it | A person or system seeking an answer | An AI agent acting for a person |
| Interface | Screens, flows, copy | APIs, SDKs, docs, local tooling | Public pages and the retrieval layer above them | Entry points, tool descriptions, schemas, state, permissions, handoffs |
| Unit of work | A task in a session | An integration over days | A query and its answer | A delegated job from request to hand-back |
| Feedback | Observation, interviews, analytics | Tickets, time to first call | Citations, referrals | Traces, tool-call logs, retries, approvals, escalations |
| Success | The person understands and finishes | The builder ships correctly | Content is retrieved and attributed | The job completes, the person can see what happened, and the next run is better |

The surfaces overlap heavily: agents read the same docs and call the same APIs as developers. The difference is the cost of ambiguity. A developer who meets an unclear parameter stops and asks; an agent often proceeds. GEO is covered in [GEO and AI search](geo-and-ai-search.md); the short version is that being cited is not the same as being usable.

## Why it matters for agents

An agent has only what the surface states at the moment of choice. Products that leave constraints implicit, render content only with client-side JavaScript, return errors written for humans, or hide consequential actions behind ambiguous names push agents into guessing, and the person who delegated the job receives a wrong result, a silent failure or an unexpected charge.

## Current state

As of 2026-11-20 no standards body defines AX, and there is no certification. The framing literature is mostly practitioner essays, and a large share of the definitional pieces come from Netlify-affiliated authors. Microsoft developer relations has published a consolidated method, the [AX Practitioner Playbook](https://microsoft.github.io/agent-experience/playbook/), scoped to coding agents. Standards bodies are starting to frame adjacent questions: the W3C paper above, a [draft Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html), and the IETF work tracked in the [standards tracker](../standards-tracker.md). Academic framing remains thin; the main citable item is the position paper [From Human Interfaces to Agent Interfaces](https://arxiv.org/abs/2603.20300) (preprint, conceptual).

## What the evidence supports and what is disputed

- **Supported at interface level (study).** A controlled before-and-after study found an agent-ready version of one e-commerce prototype raised strict task success from about 49 to about 89 per cent across three models ([Designing Agent-Ready Websites](https://arxiv.org/abs/2607.12056), preprint, one site). Affora reports agent performance following preserved interaction meaning rather than visual style ([arXiv 2609.19125](https://arxiv.org/abs/2609.19125)).
- **Supported, with caveats (vendor material).** Microsoft's small-sample evals (typically five runs per condition) report several intuitive changes as drag, for example a JSON argument mode for a CLI that raised cost and lowered correctness for one smaller model. Each result holds only for the agent profile measured.
- **Observational (study, interested authors).** [AX is the New AEO](https://arxiv.org/abs/2609.34951) associates readable sites with answers built from the business's own pages across 37,927 agent journeys, but the readiness ranker it uses belongs to the authors.
- **Disputed.** Whether checklist-style AX advice can be trusted without per-product evaluation; whether coding-agent findings transfer to browsing or commerce agents (Microsoft says it has not measured that); and whether the delegating person's experience belongs inside AX or beside it.

## Practical checklist

1. Write down which meaning of AX your team means, and who the agent acts for.
2. Pick three real jobs a person would delegate, in that person's words.
3. Run each job with an agent on a bare baseline at least three times and keep the traces.
4. Record where the agent guessed, retried, stalled or reported success without the change happening.
5. Fix the surface the agent already reads (docs, error text, tool descriptions) before adding a new extension.
6. Re-run the same jobs with the same agent profile and compare quality and cost.
7. Check that the person can see what the agent did, approve consequential steps and undo where possible.
8. Name an owner for each delegated workflow end to end.

## Common mistakes

- Treating AX as a protocol choice ("we shipped an MCP server") rather than a property of the whole job.
- Treating a readiness score as an outcome (see [readiness scoring](readiness-scoring.md)).
- Optimising for citation and calling it AX.
- Bending accessibility semantics for agents in ways that harm people; the W3C paper warns against this.
- Publishing machine-readable claims (files, cards, catalogues) that are not true.

## Sources and further reading

- Curated list: [Agent experience framing](../../../README.md#agent-experience-framing), [Evaluation](../../../README.md#evaluation).
- Biilmann, [Introducing AX](https://biilmann.blog/articles/introducing-ax/) and [One Year of AX](https://biilmann.blog/articles/one-year-of-ax/) (essays).
- Microsoft, [What is Agent Experience (AX)?](https://developer.microsoft.com/blog/what-is-agent-experience-ax/) and [DevAX](https://microsoft.github.io/agent-experience/) (vendor material).
- W3C Strategy Team, [W3C and the State of the Web in the AI Era](https://www.w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html) (discussion paper).
- NN/g, [AI Agents as Users](https://www.nngroup.com/articles/ai-agents-as-users/) (essay).
- Further reading (same maintainer): [What is agent experience?](https://agentexperience.tech/insights/what-is-agent-experience/), [Five meanings of agent experience](https://agentexperience.tech/insights/meanings-of-agent-experience/), [AX vs UX vs DX vs GEO](https://agentexperience.tech/insights/ax-vs-ux-dx-geo/).

## Related pages

- [Glossary](../glossary.md)
- [Agent-ready websites](agent-ready-websites.md)
- [GEO and AI search](geo-and-ai-search.md)
- [Evaluating agent experience](evaluating-agent-experience.md)
- [Human approval and control](human-approval-and-control.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
