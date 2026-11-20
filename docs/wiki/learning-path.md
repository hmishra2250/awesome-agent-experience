# Learning path

In one line: a self-paced course in ten modules, from what agent experience (AX) is to running it as an ongoing practice, with readings, an exercise and a self-check in each module.

Last reviewed: 2026-11-20

## How to use this course

The modules follow the order in which an agent meets a product: it finds the product, reads it, chooses and calls tools, acts under some authority, asks a person when it should, recovers when something fails, and is measured afterwards. Modules 1 to 3 are foundations, 4 to 8 cover the core surfaces, and 9 and 10 turn the work into a repeatable practice. Two optional electives cover commerce and AI search.

Each module has:

- **Learning goals**: what you should be able to do afterwards.
- **Readings**: mostly entries from the [curated list](../../README.md), with the wiki pages that explain them. Read the core readings; the further readings are for depth.
- **Exercise**: one task on your own product (or on an open-source project if you do not have one). Keep the outputs: the capstone in Module 10 uses them.
- **Self-check**: questions you should be able to answer without notes. If you cannot, reread the wiki page for that module.

Most modules take an evening or two (a suggestion, not a measured figure). You can take them in order, or jump to the module that matches your role after Module 1. If you only have an afternoon, do the audit in [Getting started](getting-started.md) instead.

A note on evidence: much of the reading is recent preprints from single teams. Treat their findings as hypotheses to test on your own product, not as settled practice. Each module points out where sources disagree.

## Module 1. Foundations: what AX is and is not

**Learning goals**

- Define AX in one sentence for your own team, and name the meanings of "agent experience" you are excluding.
- Explain how AX relates to UX, DX and GEO.
- Use the five questions (discover, call, control, evaluate, stay useful) to place a problem.

**Readings**

- Core: [Introducing AX](https://biilmann.blog/articles/introducing-ax/) and [One Year of AX](https://biilmann.blog/articles/one-year-of-ax/) (opinion essays by the person who popularised the term); [AI Agents as Users](https://www.nngroup.com/articles/ai-agents-as-users/) (Nielsen Norman Group).
- Core: [W3C and the State of the Web in the AI Era](https://www.w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html) (W3C Strategy Team discussion paper, October 2026).
- Further: [From Human Interfaces to Agent Interfaces](https://arxiv.org/abs/2603.20300) (position paper); [Stop Getting Good at Protocols. Get Good at Agent Experience.](https://www.oreilly.com/radar/stop-getting-good-at-protocols-get-good-at-agent-experience/) (opinion); [Principles of AX](https://agentexperience.ax/concepts/principles-of-ax/).
- Wiki: [Agent experience](concepts/agent-experience.md), [Glossary](glossary.md).
- Further reading (same maintainer): [Meanings of agent experience](https://agentexperience.tech/insights/meanings-of-agent-experience/), [AX vs UX, DX and GEO](https://agentexperience.tech/insights/ax-vs-ux-dx-geo/).

**Exercise.** Write a one-sentence definition of AX for your team. Below it, list one job your product supports that a person would plausibly delegate to an agent, and write down what success looks like, what the agent starts with, and when it should stop and ask. This job is your **course workflow**; you will reuse it in every module.

**Self-check**

1. Name two other meanings of "agent experience" that this field does not cover.
2. Why is a readiness score not the same thing as agent experience?
3. Which of the five questions does an unenforced approval prompt belong to?

## Module 2. How agents find and read you

**Learning goals**

- Explain what robots.txt, llms.txt, Markdown routes, content negotiation and API catalogues each do, and how strong the evidence is for each.
- Inspect a page the way a non-browsing agent fetches it.
- Explain why accessibility structure matters for browsing agents.

**Readings**

- Core: [Designing Agent-Ready Websites for AI Web Agents](https://arxiv.org/abs/2607.12056) (study, preprint); [Build agent-friendly websites](https://web.dev/articles/ai-agent-site-ux) (Google, vendor guidance); [llms.txt](https://llmstxt.org/) (proposal).
- Core: [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) (vendor documentation) and [The Current State of Content Negotiation for AI Agents](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) (vendor measurement).
- Evidence on llms.txt: [We Analyzed 137K Sites](https://ahrefs.com/blog/llmstxt-study) (vendor study) and [A Content Analysis of llms.txt Files](https://commoncrawl.org/blog/a-content-analysis-of-llms-txt-files-from-the-july-2026-crawl-archive) (Common Crawl).
- Further: [RFC 9727 api-catalog](https://www.rfc-editor.org/rfc/rfc9727.html) (standard); [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/); [Web Agents Should Use Typed Actions Instead of Click-Based Browsing](https://arxiv.org/abs/2602.17245); [AX is the New AEO](https://arxiv.org/abs/2609.34951) (observational preprint using its authors' own ranker).
- Wiki: [Agent-ready websites](concepts/agent-ready-websites.md), [llms.txt](standards/llms-txt.md), [Markdown content negotiation](standards/markdown-content-negotiation.md), [Agentic resource discovery](standards/agentic-resource-discovery.md), [NLWeb](standards/nlweb.md).
- List section: [Discovery and agent-readable web](../../README.md#discovery-and-agent-readable-web).

**Exercise.** Fetch the three pages your course workflow depends on with `curl`, once normally and once with `Accept: text/markdown`. For each, record whether the main content is in the raw response, whether the next step is reachable by a link, and whether key facts (prices, limits, prerequisites) are in text. Then search your server logs for requests to `/llms.txt` and for requests that send `Accept: text/markdown`, and note which user agents made them.

**Self-check**

1. What does the evidence so far say about whether agents fetch llms.txt files, and what does it not say?
2. Why might a page that looks complete in a browser be empty to some agents?
3. What is the difference between a sitemap, an llms.txt file and an API catalogue?

## Module 3. Documentation, instructions and context

**Learning goals**

- Decide when to use an instruction file (such as AGENTS.md), a skill, or ordinary documentation.
- Explain what the studies of context files and skills found, including the negative results.
- Explain context rot and why more context is not always better.

**Readings**

- Core: [AGENTS.md](https://agents.md/) and the [Agent Skills specification](https://agentskills.io/specification) (specifications).
- Core: [Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) (study, preprint), [What Open-Source Projects Tell Their Coding Agents](https://arxiv.org/abs/2610.31715) (census, preprint) and [When Instruction Files Go Stale](https://arxiv.org/abs/2611.09802) (study, preprint).
- Core: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (vendor material) and [Context Rot](https://www.trychroma.com/research/context-rot) (vendor research report).
- Further: [Do They Do as They Are Told?](https://arxiv.org/abs/2611.13709); [Signal or Noise? A Benchmark Study of Agent Skills in Web Development](https://arxiv.org/abs/2608.23067); [From Agent Behaviour to Agent-Friendly Documentation](https://arxiv.org/abs/2608.20195); [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) and [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions) (vendor and project guidance).
- Wiki: [Documentation for agents](concepts/documentation-for-agents.md), [Context engineering](concepts/context-engineering.md), [AGENTS.md](standards/agents-md.md), [Agent Skills](standards/agent-skills.md).
- List section: [Documentation for agents](../../README.md#documentation-for-agents).

**Exercise.** Give a coding agent a clean checkout of a repository that uses your product (or the product itself) and ask it to complete one setup task with no other help. Log every point where it had to guess. Then write or edit an instruction file that addresses only those points, keeping it short, and rerun the task. Note whether the guesses changed, and whether the run took more or fewer steps.

**Self-check**

1. What did the controlled AGENTS.md study find about task success and cost, and how does that compare with vendor reports?
2. Name one way an instruction file can make an agent worse.
3. When would you ship a skill rather than add a paragraph to your documentation?

## Module 4. Tool design: names, schemas, results and errors

**Learning goals**

- Write a tool description that says what the tool is for, when not to use it, and which neighbour to use instead.
- Use schemas to carry constraints that prose cannot enforce.
- Write error results that tell an agent what to do next.

**Readings**

- Core: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (vendor material); the [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) (specification).
- Core: [From Docs to Descriptions](https://arxiv.org/abs/2602.18914) and [MCP Tool Descriptions Are Smelly!](https://arxiv.org/abs/2602.14878) (studies on description defects); [Which Metadata Matters for LLM Tool Selection in MCP?](https://arxiv.org/abs/2610.14334) (controlled study, preprint).
- Core: [MCP Error Messages Written for Developers Hurt the Most Capable Agents Most](https://arxiv.org/abs/2609.35381) and [Callability Is Not Operability](https://arxiv.org/abs/2608.23628) (studies, preprints).
- Further: [Tool Preferences in Agentic LLMs are Unreliable](https://aclanthology.org/2025.emnlp-main.1060/) (EMNLP 2025); [Don't Adapt Small Language Models for Tools; Adapt Tool Schemas to the Models](https://aclanthology.org/2026.acl-long.948/) (ACL 2026); [Schema First Tool APIs for LLM Agents](https://arxiv.org/abs/2603.13404); [SilentProbe](https://arxiv.org/abs/2609.00035); [AT-AT: Automatic Tool Optimization from Agent Traces](https://arxiv.org/abs/2610.34679).
- Wiki: [Tool design](concepts/tool-design.md), [CLI and API design for agents](concepts/cli-and-api-design-for-agents.md), [OpenAPI, Arazzo and JSON Schema](standards/openapi-arazzo-json-schema.md).
- Further reading (same maintainer): [Tool descriptions](https://agentexperience.tech/insights/tool-descriptions/).

**Exercise.** List the tools, endpoints or commands your course workflow uses. Find the two an agent is most likely to confuse, and rewrite both descriptions so the boundary between them is explicit. Then trigger three realistic errors (a missing field, an invalid value, an expired credential) and rewrite each error result so that it names the problem and the next action in terms an agent can carry out. If you serve HTTP, shape the errors as [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) problem details.

**Self-check**

1. Besides the description, which parts of a tool definition have been shown to affect selection?
2. Why can an error message that is helpful to a developer be harmful to an agent?
3. What is the difference between a tool that is callable and one that is operable?

## Module 5. Tool selection at scale and choosing an interface

**Learning goals**

- Explain why adding tools or skills can make an agent worse, and what tool search and progressive discovery do about it.
- Compare MCP, CLI and code-execution interfaces without overstating any one result.
- Prune a catalogue on evidence.

**Readings**

- Core: [More Skills, Worse Agents? Skill Shadowing](https://arxiv.org/abs/2605.24050) (study, preprint); [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) and [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) (vendor documentation).
- Core, the interface debate: [The Scaffolding Matters More Than the Interface](https://arxiv.org/abs/2608.08654); [Terminal Agents Suffice for Enterprise Automation](https://arxiv.org/abs/2604.00073); [Beyond Plain MCP: Do Decision Models and Code Mode Make Tool Use Cheaper and Faster?](https://arxiv.org/abs/2611.19123); [Code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp) (vendor material).
- Further: [Toollery](https://arxiv.org/abs/2609.22218); [The Bitter Lesson of Tool Calling](https://arxiv.org/abs/2608.06370); [MCP-GRANITE](https://arxiv.org/abs/2609.24161); [What a Random Draw from the MCP Registry Contains](https://arxiv.org/abs/2609.10962).
- Wiki: [Tool selection at scale](concepts/tool-selection-at-scale.md), [MCP](standards/mcp.md).
- Further reading (same maintainer): [Agent tool catalogs](https://agentexperience.tech/insights/agent-tool-catalogs/), [Large API surfaces for agents](https://agentexperience.tech/insights/large-api-surfaces-for-agents/).
- List section: [Tool use, tool descriptions and MCP](../../README.md#tool-use-tool-descriptions-and-mcp).

**Exercise.** Count the tools an agent sees when it does your course workflow. Mark each one as needed for this job, sometimes needed, or never needed. Write down which tools you would hide, merge or defer behind a search step, and what you would lose by doing so. If you can, run the workflow three times with the full set and three times with the reduced set, and compare which tools were chosen.

**Self-check**

1. What is skill or tool shadowing?
2. Summarise the disagreement between studies that favour terminal or code access and studies that say scaffolding matters more than the protocol.
3. What does a random sample of a public MCP registry tell you that curated benchmarks do not?

## Module 6. Protocols, identity and delegated authority

**Learning goals**

- Describe what MCP and A2A each standardise, and what changed in the current MCP revision.
- Explain how an agent identifies itself to a website or API, and how it obtains authority from a person or an organisation.
- Tell an adopted working group draft from an individual proposal.

**Readings**

- Core: [MCP specification changelog for 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) and [MCP Extensions overview](https://modelcontextprotocol.io/docs/extensions/overview) (specification). As of 2026-11-20, 2026-07-28 is the revision that the MCP site serves as latest.
- Core: [A2A specification](https://a2a-protocol.org/latest/specification/) and [Agent Discovery in A2A](https://a2a-protocol.org/latest/topics/agent-discovery/) (specification).
- Core: [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization); [RFC 9728 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728.html); [OAuth Client ID Metadata Document](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/) (Internet-Draft).
- Core: [RFC 9421 HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) and [Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/) (vendor documentation), with the IETF [httpsig protocol draft](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/).
- Further: [A Protocol-Agnostic Threat Classification for Cross-Boundary AI Agent Authorization](https://openid.net/wp-content/uploads/2026/10/A-Protocol-Agnostic-Threat-Classification-for-Cross-Boundary-AI-Agent-Authorization_with-Cover.pdf) (OpenID Foundation); [NCCoE agent identity project hub](https://pages.nist.gov/nccoe-ai-identity/); [Broken Gates](https://arxiv.org/abs/2607.18659); [Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization).
- Wiki: [MCP](standards/mcp.md), [A2A](standards/a2a.md), [Agent identity and authorization](concepts/agent-identity-and-authorization.md), [Web Bot Auth](standards/web-bot-auth.md), [Agent authorization drafts](standards/agent-auth-drafts.md), [Standards tracker](standards-tracker.md).
- List sections: [Protocols and machine-readable surfaces](../../README.md#protocols-and-machine-readable-surfaces), [Agent identity and authorization](../../README.md#agent-identity-and-authorization).

**Exercise.** For your course workflow, write down which credential the agent uses, who granted it, which scopes it carries, how long it lasts, and how it would be revoked. Compare the scopes with what the job actually needs, and list the scopes you would remove. If you operate a public site, check your logs for signed agent requests and note whether you could tell one agent from another.

**Self-check**

1. Name two changes the 2026-07-28 MCP revision made to how clients and servers connect.
2. What problem does a Client ID Metadata Document solve, and what does it not prove?
3. Why do behavioural bot defences struggle to separate legitimate agents from abuse?

## Module 7. Human approval, control and recovery

**Learning goals**

- Classify actions by effect and reversibility, and decide where each approval is enforced.
- Design an approval that is bound to the exact action that will execute.
- Design safe retries and recoverable failures, and keep context intact across handoffs.

**Readings**

- Core, approval: [When Neither Side Confirms](https://arxiv.org/abs/2611.02527); [What You Approve Is What Executes](https://arxiv.org/abs/2606.02668); [Loopjacking](https://arxiv.org/abs/2609.21081); [Oversight Has a Capacity](https://arxiv.org/abs/2606.08919) (studies, preprints).
- Core, mechanisms: [MCP elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation) (specification); [Human-in-the-loop in the OpenAI Agents SDK](https://openai.github.io/openai-agents-python/human_in_the_loop/) and [tool approvals in Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval) (vendor documentation).
- Core, recovery: [Idempotency-Key header draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) (Internet-Draft); [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests); [Where Does Exactly-Once Live?](https://arxiv.org/abs/2609.29095); [Same Error, Different Recovery](https://arxiv.org/abs/2611.11581) (study, preprint).
- Further: [When Should Users Check?](https://arxiv.org/abs/2510.05307) (CHI 2026); [Comparing Human Oversight Strategies for Computer-Use Agents](https://arxiv.org/abs/2604.04918); [The Verifiable Action Card](https://arxiv.org/abs/2609.18411); [Outcome Monitors](https://arxiv.org/abs/2608.19303); [Agents Cannot Hand Over What They Have Not Yet Understood](https://arxiv.org/abs/2611.18642); [MasDrift](https://arxiv.org/abs/2608.07556).
- Wiki: [Human approval and control](concepts/human-approval-and-control.md), [Recovery and handoffs](concepts/recovery-and-handoffs.md).
- Further reading (same maintainer): [Approval is a workflow](https://agentexperience.tech/insights/approval-is-a-workflow/), [Design for recovery](https://agentexperience.tech/insights/design-for-recovery/).
- List section: [Human control, approval and recovery](../../README.md#human-control-approval-and-recovery).

**Exercise.** List every action in your course workflow that creates, changes, deletes, sends or pays for something. For each, record whether it is reversible, who must confirm it, where that confirmation is enforced (server, API, host or nowhere), and whether it is safe to retry after a timeout. Then pick the riskiest action and check, by reading the code or the request, that what the person sees on the approval screen is generated from the real request rather than from the model's description of it.

**Self-check**

1. Why is "the host will ask the user" not enough as an approval design?
2. What is an idempotency key for, and what problem remains if the agent cannot read back whether a write happened?
3. Why are more checkpoints not automatically better for oversight?

## Module 8. Securing agent-facing surfaces

**Learning goals**

- Explain indirect prompt injection and tool poisoning, and why every page, description and result an agent reads is untrusted input.
- Explain why architectural controls are preferred over string filters.
- Tell static from adaptive security evaluation.

**Readings**

- Core: [Not what you've signed up for](https://arxiv.org/abs/2302.12173) (the original indirect injection study); [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837); [Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813) (CaMeL).
- Core: [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) (specification guidance); [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/); [OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/) (beta).
- Core: [The Framing Gap](https://arxiv.org/abs/2608.27092); [MCPTox](https://arxiv.org/abs/2508.14925); [Agent Skills in the Wild](https://arxiv.org/abs/2601.10338).
- Further: [AgentDojo](https://arxiv.org/abs/2406.13352); [The Attacker Moves Second](https://arxiv.org/abs/2510.09023); [When Tool Names Are Not Identities](https://arxiv.org/abs/2611.21577); [DECEPTICON](https://arxiv.org/abs/2512.22894); [Threat Model for WebMCP](https://w3c.github.io/threat-model-webmcp/) (unofficial draft); [Agentic Browsing and Web Architecture](https://w3ctag.github.io/agentic-browsing-finding/) (W3C TAG draft finding); [Model Context Protocol Security v2.0](https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/blob/main/whitepapers/model-context-protocol-security.md) (CoSAI).
- Wiki: [Security for agent surfaces](concepts/security-for-agent-surfaces.md), [Agent Skills](standards/agent-skills.md), [WebMCP](standards/webmcp.md).
- List section: [Security for agent-facing surfaces](../../README.md#security-for-agent-facing-surfaces).

**Exercise.** Walk through your course workflow and list every point where the agent reads text that someone other than you could influence: user-generated content, third-party pages, tool results from other servers, uploaded files. For each, write down what the agent could do next if that text contained instructions (which tools it could call, where data could be sent). Then search your own agent-facing surfaces (docs, llms.txt, skills, tool descriptions) for install commands, credentials or instructions that an attacker could imitate.

**Self-check**

1. What is the difference between tool poisoning and indirect prompt injection through a tool result?
2. Why do studies caution against trusting near-zero attack success rates from static benchmarks?
3. What does a CaMeL-style design separate, and why does that help?

## Module 9. Evaluating agent experience

**Learning goals**

- Build a small, product-owned evaluation for one workflow and grade outcomes from real state.
- Read a benchmark or leaderboard result and name what besides the model could have moved it.
- Use readiness scanners as prompts for investigation, not as outcomes.

**Readings**

- Core: [Agents are users, so your software needs evals](https://vercel.com/blog/agent-evals) (vendor method essay, November 2026); [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (vendor material); [Harbor](https://github.com/harbor-framework/harbor) (open-source runner).
- Core, validity: [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825); [Benchmarking the Benchmarks](https://arxiv.org/abs/2607.02577); [Infrastructure noise in agentic coding evals](https://www.anthropic.com/research/infrastructure-noise) (vendor research).
- Core, declared versus verified: [BreakingWeb](https://arxiv.org/abs/2609.35814) and [WebPageBench](https://arxiv.org/abs/2609.35026) (studies, preprints).
- Further: [Towards a Science of AI Agent Reliability](https://arxiv.org/abs/2602.16666); [Holistic Agent Leaderboard](https://arxiv.org/abs/2510.11977); [An Empirical Study of Harness Design for Coding Agents](https://arxiv.org/abs/2609.20804); [The AX Practitioner Playbook](https://microsoft.github.io/agent-experience/playbook/) and [Scope](https://github.com/microsoft/scope) (Microsoft, vendor material); [MCP Conformance Test Framework](https://github.com/modelcontextprotocol/conformance); [τ²-Bench](https://arxiv.org/abs/2506.07982).
- Readiness: [Is Your Site Agent-Ready?](https://isitagentready.com/), [Lighthouse agentic browsing scoring](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring), [AFDocs](https://github.com/agent-ecosystem/afdocs) and the individual IETF draft [A Standards-Grounded Method for Evaluating Website Agent-Readiness](https://datatracker.ietf.org/doc/draft-shah-agent-readiness-evaluation/).
- Wiki: [Evaluating agent experience](concepts/evaluating-agent-experience.md), [Readiness scoring](concepts/readiness-scoring.md).
- Further reading (same maintainer): [Build a reliable agent evaluation loop](https://agentexperience.tech/insights/build-a-reliable-agent-evaluation-loop/), [Measure agent experience](https://agentexperience.tech/insights/measure-agent-experience/).
- List sections: [Evaluation](../../README.md#evaluation), [Readiness instruments](../../README.md#readiness-instruments).

**Exercise.** Write five fixed tasks for your course workflow, each with a check that reads the real end state (a database row, an API response, a file) rather than the agent's claim. Run each task at least three times with one agent setup, and record how often each task passes on every run, not only on any run. Then run two readiness scanners on your site or docs and list where they disagree with each other and with what you observed.

**Self-check**

1. Name three things other than the model that can change an agent benchmark score.
2. Why report how often a task passes on every one of several runs, as well as on at least one?
3. What would a readiness scanner need to publish before its score could be treated as a predictor of task success?

## Module 10. Operating AX: observability, upkeep and a capstone review

**Learning goals**

- Recognise agent traffic and trace agent runs using shared conventions.
- Keep instructions, tools and protocol dependencies true as they change.
- Run a complete AX review on one workflow and turn it into a change.

**Readings**

- Core: [OpenTelemetry semantic conventions for GenAI agent spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md) and [for MCP](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/mcp.md) (Development status, not yet released); [OpenInference Specification](https://openinf.dev/spec/).
- Core: [Agent observability: what to track first](https://aaif.io/blog/agent-observability-what-to-track-first) (Agentic AI Foundation blog); [Allow Google-Agent traffic](https://developers.google.com/crawling/docs/crawlers-fetchers/allow-google-agent) (vendor documentation).
- Further: [Langfuse](https://github.com/langfuse/langfuse); [Do Generative AI Assistants Respect robots.txt?](https://arxiv.org/abs/2607.14447); [When Instruction Files Go Stale](https://arxiv.org/abs/2611.09802) (reread with upkeep in mind).
- Wiki: [Agent analytics and observability](concepts/agent-analytics-and-observability.md), [Context engineering](concepts/context-engineering.md), [Standards tracker](standards-tracker.md).
- Further reading (same maintainer): [Run an AX review](https://agentexperience.tech/insights/run-an-ax-review/), [Keep agent instructions true](https://agentexperience.tech/insights/keep-agent-instructions-true/), [Retries are product history](https://agentexperience.tech/insights/retries-are-product-history/).

**Exercise (capstone).** Run a full review of your course workflow, using your outputs from Modules 1 to 9:

1. **Brief**: the job, success condition, starting state and stopping point (Module 1).
2. **Surface map**: the pages, documents, tools, credentials, approvals and records the job touches, with real URLs and names (Modules 2 to 7).
3. **Observed runs**: at least three runs, with decision points, guesses, retries and the verified end state for each (Module 9).
4. **Risk notes**: untrusted inputs, unenforced approvals and unsafe retries (Modules 7 and 8).
5. **Findings**: each one sorted as wording, structure, boundary or record.
6. **One change**: shipped, followed by a rerun of the same tasks, with the result recorded.
7. **Upkeep**: an owner and a review date for every agent-facing surface you touched, and a note of the protocol versions you depend on.

**Self-check**

1. Which spans or fields would you need to reconstruct why an agent chose a tool?
2. How would you notice that an instruction file has gone stale before a user does?
3. What did your capstone change, and how do you know it helped?

## Elective A. Agentic commerce and payments

For teams where agents browse catalogues, check out or pay.

- **Readings**: [Agentic Commerce Protocol](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol), [Universal Commerce Protocol](https://ucp.dev/), [AP2](https://ap2-protocol.org/), [x402](https://github.com/x402-foundation/x402) and the [Payment HTTP authentication scheme draft](https://datatracker.ietf.org/doc/draft-httpauth-payment/) (all pre-1.0 or draft); [Shared payment tokens](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) (vendor documentation); [A Formal Analysis of Agent Payment Protocols](https://arxiv.org/abs/2609.00060); [What Is Your AI Agent Buying?](https://arxiv.org/abs/2508.02630).
- **Wiki**: [Agentic commerce](concepts/agentic-commerce.md), [Agent payment protocols](standards/agent-payment-protocols.md).
- **Exercise**: for one purchase, write down what the user authorised, what was charged and what was delivered, and where in your system those three are bound together.
- **Self-check**: what do current payment credentials for agents limit, and what is the binding gap the security studies point to?

## Elective B. GEO and AI search

For teams that also care about being cited by answer engines.

- **Readings**: [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735); [Optimizing Visibility in Generative Engines: A Critical Survey](https://arxiv.org/abs/2607.14035); [CITECHOICE](https://arxiv.org/abs/2609.15164); [Measuring Google AI Overviews](https://arxiv.org/abs/2605.14021); Google's [Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (vendor guidance).
- **Wiki**: [GEO and AI search](concepts/geo-and-ai-search.md).
- **Exercise**: pick three questions your customers ask an assistant, sample the answers several times on different days, and record how much the cited sources vary.
- **Self-check**: why is being cited not the same as an agent completing a task, and why do single-run visibility figures mislead?

## Related pages

- [Wiki home](README.md)
- [Getting started](getting-started.md)
- [Glossary](glossary.md)
- [Standards tracker](standards-tracker.md)
