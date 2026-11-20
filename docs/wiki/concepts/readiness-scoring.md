# Readiness scoring

**In one line:** Agent-readiness scanners turn a set of chosen checks into a number; they are useful to-do lists, but none has published evidence that a higher score predicts agent task success.

Last reviewed: 2026-11-20

## What it is

A readiness score summarises automated checks of whether a surface has put in place things agents use: a sitemap, Markdown versions of pages, an MCP server card, well-described tools, and so on. Each instrument picks its own object, checks, weights and caps, so a score only means something next to the list of checks behind it.

Instruments differ first by the object they score:

| Instrument | Object scored | Method | Single number? |
|---|---|---|---|
| [Is Your Site Agent-Ready?](https://isitagentready.com/) (Cloudflare) | A public website | Checks across five categories: discoverability, content accessibility, bot access control, protocol discovery and commerce | Yes |
| [Is Agentic](https://is-agentic.com/) (Vercel, scans run by Ora) | A public website | Essential and Recommended checks; inapplicable checks excluded; emerging formats earn limited bonus credit; one observed agent journey shown as supporting evidence, not scored | Yes |
| [Lighthouse agentic browsing](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) | One page | Deterministic audits of WebMCP registration, agent-relevant accessibility, layout shift and llms.txt | No: a pass ratio, deliberately no weighted score |
| [Agent-Friendly Documentation Spec](https://agentdocsspec.com/) and [AFDocs](https://github.com/agent-ecosystem/afdocs) | A documentation site | Checks across seven categories; AFDocs implements spec v0.6.0 (2026-09-13) and is in early 0.x development | Yes, in AFDocs scorecards |
| [mcpgrade](https://github.com/tenglidev/mcpgrade) | An MCP server's tool catalogue | Static lint of descriptions, schemas, naming, token cost and consistency, with an optional model-based live evaluation | Yes, A to F |
| [Agent Readiness Model](https://docs.factory.ai/agent-readiness/overview) (Factory) | A code repository | Gated levels for coding agents | Levels |
| [AXIS](https://github.com/netlify/axis) (Netlify) | Agent runs on scenarios you write | Runs an agent, judges the transcript on four dimensions; supports repeated runs with a median headline | Yes |
| [Scope](https://github.com/microsoft/scope) (Microsoft) | Agent runs on tasks against criteria | Research preview evaluation platform with traces | Per criteria |
| [draft-shah-agent-readiness-evaluation](https://datatracker.ietf.org/doc/draft-shah-agent-readiness-evaluation/) | A website | Four pillars mapped to existing RFCs and W3C specifications, weighted 30, 30, 25 and 15 | Yes |

The first five are checklist scanners: they read what a surface serves. AXIS and Scope run an agent on a task, so they see outcomes, but only for the scenarios, agents and dates they ran. Scope is better described as evaluation tooling; see [evaluating agent experience](evaluating-agent-experience.md).

## Why it matters for agents

Scores are cheap, repeatable and easy to put in CI, which makes them good at catching regressions in the things they check. They are poor at telling you whether a delegated job will succeed, because most of what decides that (correct facts, sensible tool boundaries, recoverable errors, approval at the right moment, a checkable confirmation) is not visible to a static scan. A high score can also encourage teams to publish files that describe capabilities they do not have, which actively misleads agents.

## Current state

As of 2026-11-20:

- The number of instruments keeps growing, and several documentation platforms say they run AFDocs underneath their hosted scores (per the AFDocs README).
- An individual Internet-Draft, [draft-shah-agent-readiness-evaluation-00](https://datatracker.ietf.org/doc/draft-shah-agent-readiness-evaluation/) (17 October 2026, Independent Submission, Informational), anchors scoring in existing specifications such as RFC 9309, RFC 8288, RFC 9727 and JSON-LD. It treats llms.txt and Content-Signal as small observational bonuses rather than scored backbone, and it says the score must not be used as a security or trust signal. It has no working group standing.
- More instruments now include runs: Is Agentic shows one observed journey, AXIS documents repeated runs, and Microsoft published Scope as a research preview.

## What the evidence supports and what is disputed

- **No validation against task success.** None of the instruments listed here has published evidence that a higher score predicts that agents complete real tasks. Several say so themselves: Is Agentic describes its report as a prioritised technical review, not a guarantee, and the IETF draft says a high score says nothing about the correctness of a site's content.
- **Scores disagree (vendor material).** A vendor comparison, [Why Agent-Readiness Scores Disagree](https://glintbase.dev/blog/why-agent-readiness-scores-disagree) (23 October 2026), ran three sites through four scanners, its own included, and reports the same site scoring up to 43 points apart, with no two tools ranking the sites the same way. It is three sites and the author sells scoring, but the direction is unsurprising: the tools measure different objects.
- **Static checks can pass while tasks fail (vendor material).** Microsoft's DevAX site headlines a case where static checks of an agent extension passed above 90 per cent while the generated projects did not compile ([DevAX](https://microsoft.github.io/agent-experience/)).
- **Associations exist, but from interested instruments (study).** [AX is the New AEO](https://arxiv.org/abs/2609.34951) links higher readiness to answers built from a business's own pages, using a ranker the authors say is their own. It does not measure task completion.
- **Disputed.** Which checks matter, how to weight them, whether emerging conventions (llms.txt, server cards, commerce protocols) should count at all, and whether run-based scores are stable enough to compare. AXIS notes that agents are stochastic and the same scenario can score differently on identical runs.

## Practical checklist

1. Choose the instrument whose object matches what you are changing: a site scanner for public pages, a docs checker for documentation, a catalogue linter for MCP tools.
2. Record tool name, version and scan date with every score you quote.
3. Read the individual checks and their evidence; ignore the headline number when prioritising.
4. Never compare scores across tools, or across versions of one tool.
5. Fix failed checks only where the underlying capability exists; do not publish stub files to pass.
6. Pair any static score with at least one run-based check of a real job, repeated several times.
7. Use the same tool, version and profile when tracking regressions in CI.
8. Treat every score as a hypothesis about agent success until you have measured task outcomes on your own surface.

## Common mistakes

- Presenting a readiness score as evidence that agents succeed on your product.
- Gaming checks with files that describe tools, catalogues or auth flows that do not work.
- Comparing a score from one vendor with a competitor's score from another.
- Using a readiness score as an allow or deny signal for agents; the IETF draft explicitly rules that out.
- Assuming a docs score covers recovery, approval or hand-back. Almost no checklist sees those.

## Sources and further reading

- Curated list: [Readiness instruments](../../../README.md#readiness-instruments), [Evaluation](../../../README.md#evaluation).
- [Lighthouse agentic browsing scoring](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) (documentation).
- [AXIS](https://github.com/netlify/axis) and [Scope](https://github.com/microsoft/scope) (repositories).
- [draft-shah-agent-readiness-evaluation](https://datatracker.ietf.org/doc/draft-shah-agent-readiness-evaluation/) (individual Internet-Draft).
- Further reading (same maintainer): [Agent readiness scores compared](https://agentexperience.tech/insights/agent-readiness-scores-compared/), [Open Agent-Readiness Rubric](https://agentexperience.tech/insights/agent-readiness-rubric/), [Measure agent experience](https://agentexperience.tech/insights/measure-agent-experience/). The rubric is one of the methods compared on the first page, so read that comparison with this in mind.

## Related pages

- [Evaluating agent experience](evaluating-agent-experience.md)
- [Agent-ready websites](agent-ready-websites.md)
- [Documentation for agents](documentation-for-agents.md)
- [Tool design](tool-design.md)
- [Agent analytics and observability](agent-analytics-and-observability.md)
