# Awesome Agent Experience (AX)

A curated public library for **agent experience**: the design of product, documentation, API, tool, protocol, evaluation, and recovery surfaces so AI agents can discover, understand, safely use, and repair workflows on behalf of people.

This list is intentionally narrow. It is about **software agent experience**: web agents, tool-using LLMs, MCP/API surfaces, evaluation harnesses, retrieval, human control, and operational recovery. It is not about call-center agent experience, real-estate agents, talent agents, or generic customer-experience copy.

The field framing includes the independent opinion essay [Introducing AX: Why Agent Experience Matters](https://biilmann.blog/articles/introducing-ax/). This repository is maintained by the same author as the [Agent Experience Readiness Rubric](https://agentexperience.tech/insights/agent-readiness-rubric/); that link is provided as same-maintainer context, not as neutral endorsement.

## Scope criteria

A source belongs here when it helps answer at least one of these questions:

- Can an agent discover the right surface, instruction, tool, or document?
- Can an agent select and call tools with clear schemas, examples, and error boundaries?
- Can humans inspect, approve, interrupt, or recover the agent's work?
- Can teams evaluate agent workflows in a reproducible way?
- Can the same surface stay useful as models, tools, and protocols change?

A source does **not** belong here if it is only a launch announcement, generic AI-agent marketing, SEO filler, private experiment, paid placement, or unlicensed copy of someone else's work.

## Start here

- **If you are defining the field:** read the AX framing essay, then compare it with the practical scope criteria in this repo.
- **If you build tools or APIs:** read MCP tools/resources, OpenAPI, JSON Schema, Toolformer, ReAct, and ToolLLM.
- **If you build websites or docs for agents:** read llms.txt, ARD, WebArena, Mind2Web, WAI-ARIA, and WCAG with the limitations in mind.
- **If you run experiments:** read τ-bench, AgentBoard, StableToolBench, and the benchmark limitations before claiming readiness.
- **If you own production risk:** start with MCP security and authorization, then design explicit approval and recovery paths.
## Agent experience framing

- [Introducing AX: Why Agent Experience Matters](https://biilmann.blog/articles/introducing-ax/) — A public opinion frame for AX as a discipline, useful because it states that agent-facing surfaces deserve product-design attention rather than being treated as incidental automation glue. _Limit: This is a framing essay, not a benchmark or standard; cite it as an opinionated field definition, not as proof of outcomes or ownership._

## Agent tool use and planning

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Connects reasoning traces with actions, making it a useful starting point for interfaces that expose why an agent chose a tool and what happened next. _Limit: Primarily a prompting and evaluation paper; it does not by itself specify production observability, permissioning, or recovery contracts._
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761) — Frames tool use as something models can learn from demonstrations, which is central to designing tool descriptions and examples that agents can actually use. _Limit: Uses a bounded set of tools and self-supervised data generation; production tool ecosystems add security, latency, and changing-schema problems._
- [ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs](https://arxiv.org/abs/2307.16789) — Shows how large tool corpora and tool-use data shape agent behavior, supporting AX work on catalog structure and retrieval-friendly tool metadata. _Limit: Large catalogs can hide quality variance; practical AX also needs clear scope boundaries, deprecation signals, and safe failure modes._

## Discovery and agent-readable web

- [WebArena: A Realistic Web Environment for Building Autonomous Agents](https://arxiv.org/abs/2307.13854) — Models web agents against realistic sites, showing why navigation, site state, and task context matter for agent-facing web design. _Limit: Self-hosted benchmark environments are useful for repeatability, but live websites change and need ongoing monitoring._
- [Mind2Web: Towards a Generalist Agent for the Web](https://arxiv.org/abs/2306.06070) — Focuses on mapping natural-language goals to web actions, which is a core AX concern for documentation, labels, and machine-readable task affordances. _Limit: Dataset-driven results should be treated as evidence about task representation, not as a universal recipe for every website._
- [llms.txt: The /llms.txt file, v2](https://llmstxt.org/) — Documents a proposed Markdown-based website discovery convention for helping language models and agents find the most relevant human-authored pages. _Limit: It is a proposal rather than an enforced web standard, so teams should treat it as one discoverability surface among several._
- [Agentic Resource Discovery (ARD) specification](https://github.com/ards-project/ard-spec) — Provides a draft discovery-layer vocabulary for cataloging agentic resources such as tools, prompts, feeds, and machine-readable endpoints. _Limit: Adoption is still evolving; use it as a living proposal and keep fallbacks for conventional sitemaps, docs, and links._

## Evaluation and benchmarks

- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) — Centers user-agent-tool interaction, making it especially relevant to AX work on handoffs, clarifications, and domain state. _Limit: Domain simulations still simplify messy real systems; use it to guide evaluation design, not to claim production readiness._
- [AgentBoard: An Analytical Evaluation Board of Multi-turn LLM Agents](https://arxiv.org/abs/2401.13178) — Supports analysis of multi-turn agent behavior rather than only recording a final success or failure, which helps AX reviews separate failure stages. _Limit: Benchmark assumptions can age quickly as tools, models, and web environments change, so it should not be treated as a universal scorecard._
- [StableToolBench: Towards Stable Large-Scale Benchmarking on Tool Learning of Large Language Models](https://arxiv.org/abs/2403.07714) — Calls attention to benchmark stability for tool learning, a necessary concern when tracking whether AX changes move an evaluation in a repeatable way. _Limit: Stability controls evaluation noise; it does not decide which product affordances matter to a given audience._

## Protocols and machine-readable surfaces

- [Model Context Protocol architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) — Gives the MCP mental model for hosts, clients, servers, tools, resources, prompts, and discovery, which is useful when designing agent-facing surfaces. _Limit: It is high-level documentation; implementation work still needs the specific dated specification pages and SDK behavior._
- [Model Context Protocol tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) — Defines how MCP servers expose callable tools, including metadata and schemas that agents and clients use to understand possible actions. _Limit: The spec defines the contract shape; product teams still need to write clear names, descriptions, input schemas, examples, and error responses._
- [Model Context Protocol resources specification](https://modelcontextprotocol.io/specification/2026-07-28/server/resources) — Defines the resource layer for exposing context such as files, data, and app-specific information to agent clients. _Limit: It does not choose the semantic taxonomy or freshness policy for a particular product's resources._
- [OpenAPI Specification v3.2.0](https://spec.openapis.org/oas/v3.2.0.html) — OpenAPI remains a practical bridge between HTTP APIs, developer docs, and agent-readable operation metadata. _Limit: An OpenAPI file can be syntactically valid while still being poor AX if operation names, examples, errors, and auth flows are unclear._
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12) — JSON Schema is a foundation for tool input contracts, structured outputs, API validation, and agent-readable constraints. _Limit: Schemas need examples, semantics, and versioning discipline; validation alone does not explain intent._

## Human control, accessibility, and recovery

- [Model Context Protocol security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) — Collects security guidance for tool exposure, trust boundaries, and defensive defaults in MCP-connected agent systems. _Limit: Security guidance is implementation-sensitive; teams still need product-specific threat models and operational review._
- [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization) — Explains consent, scopes, and OAuth-oriented authorization patterns that matter when agents act through user-authorized tools. _Limit: Remote and local transports differ, so the same authorization pattern will not fit every deployment._
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/) — Defines roles, states, and properties for accessible web interfaces; AX uses this as relevant machine-readable UI semantics, not as a shortcut to agent success. _Limit: Correct ARIA use is necessary for accessibility in many interfaces, but it does not guarantee that an agent can complete a workflow._
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) — Sets human accessibility requirements for perceivable, operable, understandable, and robust web content; AX relevance is an inference because agent tooling often benefits from the same explicit structure. _Limit: WCAG conformance is not equivalent to agent readiness and should not be cited as evidence that agents will operate a product reliably._
## Maintenance notes

- Retrieval date for the initial source pass: **2026-09-07**.
- Source metadata lives in [`data/sources.json`](data/sources.json).
- Linked papers, specifications, frameworks, and essays keep their original copyrights and licenses. This repository licenses only the original curation text and repository scaffolding.
- Link checks are intentionally dependency-free. Run `node scripts/check-links.mjs` for offline structure checks, or `node scripts/check-links.mjs --online` for bounded URL verification.
