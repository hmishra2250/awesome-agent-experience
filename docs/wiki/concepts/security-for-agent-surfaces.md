# Security for agent surfaces

**In one line:** Everything an agent reads (pages, documents, tool descriptions, tool results, skills) can carry instructions, so the defences with the strongest evidence limit what an agent can do after reading untrusted text rather than trying to recognise bad text.

Last reviewed: 2026-11-20

## What it is

An agent-facing surface is anything an agent reads or calls: a web page, an `llms.txt` file, an API, an MCP server's tool list and results, a WebMCP tool, a skill. Security for these surfaces covers three overlapping problems.

- **Prompt injection through content and tools.** Text from a source the user did not write is treated as an instruction. Indirect prompt injection was described in 2023 for retrieved content ([arXiv 2302.12173](https://arxiv.org/abs/2302.12173)). Tool poisoning places the instruction in tool metadata, and output injection places it in tool results.
- **Tool and skill supply chain.** MCP servers, skills and plugins are code and instructions that an agent installs and trusts, with the usual risks of a package ecosystem plus the ability to steer the model.
- **Execution and authority.** Whatever the agent can reach (shell, network, credentials, other origins) sets the damage a successful injection can do.

The W3C TAG summarises the core risk with Simon Willison's "lethal trifecta": access to private data, exposure to untrusted content and a way to communicate externally. Its draft finding argues that agentic browsers combine all three and that cross-origin protections must be enforced mechanically, not left to the model's judgement (opinion, [TAG Draft Finding, 27 October 2026](https://w3ctag.github.io/agentic-browsing-finding/)).

## Why it matters for agents

The surface, not only the agent, decides exposure. In a benchmark of 44 web vulnerabilities reached through agent-facing interfaces, interface design changed how many attacks stayed exploitable far more than the choice of commercial agent did (study, [arXiv 2610.35541](https://arxiv.org/abs/2610.35541)). For a product team this cuts both ways: your content may attack someone else's agent, and interfaces you expose to agents can reopen vulnerabilities your web front end had hidden.

## Current state

As of 2026-11-20, guidance exists but very little is final:

- **MCP specification.** The [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) requires servers to validate inputs, apply access controls, rate limit and sanitise outputs, and tells clients to treat annotations as untrusted unless the server is trusted. The [security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) cover the confused deputy in OAuth proxies, token passthrough, SSRF and local server compromise (specification).
- **OWASP.** The [Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) was published in December 2025. The [OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/) says it is in its beta release and pilot testing phase.
- **CoSAI.** [MCP Security v2.0](https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/blob/main/whitepapers/model-context-protocol-security.md) was updated on 12 August 2026 for the 2026-07-28 MCP release, with twelve threat categories and 34 threats; the document marks its own status as draft.
- **W3C.** Besides the TAG draft finding, a [Threat Model for WebMCP](https://w3c.github.io/threat-model-webmcp/) exists as an Unofficial Proposal Draft (15 November 2026). It separates threats inherent to agentic navigation, those from MCP-style tool mediation and those specific to WebMCP, and notes that a consequential-action hint does not help when a malicious site omits or misstates it. See [WebMCP](../standards/webmcp.md).
- **Tooling.** [Snyk Agent Scan](https://github.com/snyk/agent-scan) scans local agents, MCP servers and skills; its output format is labelled experimental. [AgentDojo](https://arxiv.org/abs/2406.13352) remains the shared environment for measuring injection attacks and defences.

## What the evidence supports and what is disputed

Most of what follows is preprint or workshop evidence from 2025 and 2026.

**Injection is present and models are not a reliable filter.**

- About 15,300 validated injections were found on some 11,700 pages from 1.2 billion URLs, around 70 per cent in non-rendered HTML; controlled compliance was limited but non-negligible (study, [arXiv 2604.27202](https://arxiv.org/abs/2604.27202)).
- On 45 live MCP servers, tool poisoning succeeded widely, more capable models were often more susceptible, and refusals were rare (study, [MCPTox, arXiv 2508.14925](https://arxiv.org/abs/2508.14925)).
- Across 12 frameworks with real execution, resistance varied by model rather than framework, no framework had an intentional defence, and a regex description scanner caught 20 of 45 scenarios (study, AISec 2026, [arXiv 2611.03555](https://arxiv.org/abs/2611.03555)).
- Payloads split across tool descriptions, results and sampling messages led models that resisted single-channel injection to exfiltrate data, and seven third-party MCP security tools missed the fragments (study, [arXiv 2609.18217](https://arxiv.org/abs/2609.18217)).
- Dark patterns steered web agents in over 70 per cent of tested tasks, more often than people, and prompting and guardrail models did not fix it consistently (study, [DECEPTICON, arXiv 2512.22894](https://arxiv.org/abs/2512.22894)).

**Metadata is not identity.** Tool names are not bound to a verified provider, so a second MCP server advertising colliding names and compatible schemas can capture requests meant for another (study, [arXiv 2611.21577](https://arxiv.org/abs/2611.21577)). About 13 per cent of 10,240 MCP servers showed substantial mismatches between their descriptions and their code (study, [arXiv 2602.03580](https://arxiv.org/abs/2602.03580)).

**The supply chain is large and lightly vetted.** In 31,132 analysed skills, 26.1 per cent had at least one vulnerability pattern, and skills bundling scripts were about twice as likely to (study, [arXiv 2601.10338](https://arxiv.org/abs/2601.10338)). Audits of public MCP servers find missing authentication and exploitable flaws ([arXiv 2608.00150](https://arxiv.org/abs/2608.00150), [arXiv 2605.21392](https://arxiv.org/abs/2605.21392), [arXiv 2510.16558](https://arxiv.org/abs/2510.16558)). At the protocol level, A2ABreak reports specification-compliant attacks including cross-client context injection through unprotected context identifiers (study, [arXiv 2609.10871](https://arxiv.org/abs/2609.10871)).

**Architectural controls have the best evidence.** Destination allow-lists and a planner and reader capability split closed an exfiltration gap that a fine-tuning defence did not, in a laboratory setting (study, [arXiv 2608.27092](https://arxiv.org/abs/2608.27092)). CaMeL separates control flow, taken from the trusted query, from untrusted data and enforces capability policies at tool calls, solving 77 per cent of AgentDojo tasks with provable security against 84 per cent undefended (study, [arXiv 2503.18813](https://arxiv.org/abs/2503.18813)). Six [design patterns](https://arxiv.org/abs/2506.08837) generalise the approach for narrow agents.

**Disputed.**

- **How much model-level or scanner defence can achieve.** Adaptive attacks bypassed 12 recent defences, most of which had reported near-zero attack success against static tests ([The Attacker Moves Second, arXiv 2510.09023](https://arxiv.org/abs/2510.09023)). Treat any near-zero figure from a static benchmark with caution.
- **The utility cost of architectural controls.** Separation reduces what an agent can do, and the design patterns paper says securing general-purpose agents remains out of reach.
- **Description-level mitigations.** Adding security guidance to tool descriptions reduced exploitation of taint flaws in one study ([arXiv 2607.07461](https://arxiv.org/abs/2607.07461)), but it does not fix the code underneath.

## Practical checklist

1. Treat every tool description, tool result, page, document and skill as untrusted input that cannot widen the agent's authority.
2. Expose the narrowest operations agents need, and validate every input on the server as if no agent sat in between.
3. Restrict where agent-initiated data can go: allow-list outbound destinations and control egress from agent sandboxes.
4. Separate reading from acting, so a plan comes from the trusted request and untrusted content cannot add new tool calls.
5. Namespace tools by server, flag name collisions, pin server versions and require re-review when a description changes.
6. Keep descriptions accurate to what the code does, and scan them, without treating a clean scan as proof of safety.
7. Install MCP servers and skills like dependencies: review the source, pin versions, prefer instruction-only skills, and run scripts sandboxed without ambient credentials.
8. Keep secrets out of the model context and the execution environment; inject them at a proxy that checks scope per call.
9. Do not hide instructions for agents in your own content, and never publish install commands for packages you do not control.
10. Test with AgentDojo-style suites and adaptive attacks, and require human approval for consequential actions as a backstop, not as the main defence.

## Common mistakes

- Relying on a system prompt telling the model to ignore instructions in content.
- Trusting `readOnlyHint` or other annotations from servers you do not control.
- Scanning each field separately when payloads can be split across channels.
- Assuming the agent framework defends against tool poisoning.
- Publishing a remote MCP server without authentication because it is "only a wrapper".
- Using dark patterns on your own pages, which manipulate agents acting for your customers as well as people.

## Sources and further reading

- Curated list: [Security for agent-facing surfaces](../../../README.md#security-for-agent-facing-surfaces) and [Evaluation](../../../README.md#evaluation).
- [Breaking the Protocol](https://arxiv.org/abs/2601.17549) (architectural analysis of MCP security gaps).
- Further reading (same maintainer): [Agent tool catalogs](https://agentexperience.tech/insights/agent-tool-catalogs/), on naming neighbouring tools so they are not confused.

## Related pages

- [Agent identity and authorisation](agent-identity-and-authorization.md)
- [Human approval and control](human-approval-and-control.md)
- [Tool design](tool-design.md)
- [Tool selection at scale](tool-selection-at-scale.md)
- [Evaluating agent experience](evaluating-agent-experience.md)
- [MCP](../standards/mcp.md)
- [WebMCP](../standards/webmcp.md)
- [Agent Skills](../standards/agent-skills.md)
- [A2A](../standards/a2a.md)
