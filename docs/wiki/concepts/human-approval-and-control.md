# Human approval and control

**In one line:** An approval is a control only when a known person decides, at the right moment, on the exact action that will run, and the system enforces that decision rather than the model.

Last reviewed: 2026-11-20

## What it is

Human control covers the points where a person shapes or stops an agent's work: approving a consequential action, answering a question the agent cannot settle, interrupting a run, taking over, or reviewing what happened afterwards. Approval is the most visible of these, and it has three parts that fail independently.

- **Placement:** which actions pause, and who decides that.
- **Presentation:** what the person sees, and whether it describes the real action and its effects.
- **Binding:** whether the decision is tied to that one action, at that time, so a different or later action cannot reuse it.

The property that ties presentation and binding together has been named **consent integrity**: the action shown must be rendered by a trusted component from the real action, over a path the agent cannot spoof, and bound to the action that executes ([arXiv 2606.02668](https://arxiv.org/abs/2606.02668)). Its failure, where a person approves operation A and the system runs B, has been named **Loopjacking** ([arXiv 2609.21081](https://arxiv.org/abs/2609.21081)).

## Why it matters for agents

Approval is often treated as the last boundary before money moves or data leaves. If prompts are frequent and uninformative, people stop reading them. Anthropic reports that Claude Code users accepted 93 per cent of manual permission prompts, which motivated its classifier-based auto mode (vendor material, [March 2026](https://www.anthropic.com/research/claude-code-auto-mode)). A modelling study argues that, with a fatiguing reviewer, more escalation can lower realised safety past a point, and that flooding a tired reviewer is an attack (study, modelling only, [arXiv 2606.08919](https://arxiv.org/abs/2606.08919)). The design question is what to ask about, when, and how to make the answer binding.

## Current state

As of 2026-11-20:

- **MCP tools.** The [tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) says there should always be a human able to deny tool invocations, that clients should show tool inputs before calling and prompt for sensitive operations, and that tool annotations are untrusted unless they come from trusted servers (specification).
- **MCP elicitation.** The [2026-07-28 elicitation specification](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation) defines form mode and URL mode, delivered as an input-required result. Servers must not request passwords, keys, tokens or payment credentials through form mode, and must bind each request to the client and user identity. Clients must show which server is asking, offer decline and cancel, display the target domain, and get consent before opening a URL. The interface itself is left to clients (specification).
- **Who actually confirms.** A source-code study estimates that 90 per cent of destructive tools in a 1,000-repository sample of the MCP registry have no server-side confirmation, and that 32 of 41 popular open-source hosts and agent SDKs have no approval step by default (study, [arXiv 2611.02527](https://arxiv.org/abs/2611.02527)). Its authors calculate that prompting for every tool not annotated as read-only or non-destructive would cut unapproved pairs far more than universal elicitation support would.
- **Framework defaults.** In Microsoft Agent Framework, an approval response now authorises a tool call only when it matches a pending approval request in the same session, and unbound responses are ignored (vendor material, [documentation](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval)). The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/human_in_the_loop/) pauses a run for approval and resumes from saved state (vendor material).
- **Server-side approval.** Stripe requires confirmation for live-mode refunds and payouts made by an agent acting for a user, even if the client has turned off its own prompts. Agent-tagged API keys are subject to approval rules, the API returns an `approval_required` error and opens a request, outcomes arrive by webhook, unapproved requests expire after 14 days, and by default no actor can approve its own request (vendor material, [Stripe, 21 October 2026](https://stripe.dev/blog/your-ai-agent-can-move-money-in-stripe)).
- **Classifier review.** Claude Code auto mode replaces most prompts with a two-stage classifier. Anthropic publishes its own error rates, including a 17 per cent false negative rate on a small set of real overeager actions (vendor material, same source).

## What the evidence supports and what is disputed

Supported by evidence:

- **Binding failures are real and fixable in tested products.** Loopjacking reproduced representation mismatch and post-approval substitution in named releases of agent products, and found exact per-call binding blocked the tested attacks (study, not a prevalence estimate). The Verifiable Action Card rebuilds the approval from the pending browser action, shows it in trusted browser chrome and re-verifies it at dispatch; on its authors' 24-scenario benchmark attack success fell to zero (study, [arXiv 2609.18411](https://arxiv.org/abs/2609.18411)).
- **An approval can cover more than it names.** Approving one command can let through install scripts or network access the record never mentioned ([approval laundering, arXiv 2609.28586](https://arxiv.org/abs/2609.28586)), and approvals stored across sessions can be replayed later without fresh consent ([residual authority, arXiv 2609.33910](https://arxiv.org/abs/2609.33910)) (studies).
- **Timing matters more than quantity.** With 48 participants across 192 live sessions, oversight strategy changed exposure to problematic actions but not people's ability to intervene, because control often returned too early or too late, and upfront plan approval reduced later scrutiny (study, [arXiv 2604.04918](https://arxiv.org/abs/2604.04918)). A CHI 2026 study found intermediate confirmation points were preferred over confirm-at-end and reduced task time (study, [arXiv 2510.05307](https://arxiv.org/abs/2510.05307)).
- **Better traces help speed, not necessarily accuracy.** A redesigned trace interface cut time to find errors without meaningfully improving final accuracy (study, [arXiv 2602.16844](https://arxiv.org/abs/2602.16844)).
- **People supervise in different styles.** Real-user web trajectories show hands-off, hands-on, collaborative and full-takeover patterns, and predicting intervention improved rated usefulness (study, [arXiv 2602.17588](https://arxiv.org/abs/2602.17588)).

Disputed or open:

- **Standing rules versus per-action prompts.** In a randomised study, user-written allow, ask and never rules cut prompts but blocked less overreach than per-action approval: most rules were set to ask, and people then approved the overreach (study, [arXiv 2608.27443](https://arxiv.org/abs/2608.27443)).
- **Classifiers versus people.** Anthropic presents classifier review as a safer alternative to skipping permissions, but no independent study compares it with per-action approval.
- **Host or server.** One study argues hosts must own approval policy; Stripe enforces it on the server regardless of the host. No study compares the two in production.
- **Decoders are incomplete.** The consent integrity prototype silently passed 10 per cent of trusted-tool abuses while marking most normal commands uninspectable, so complete rendering trades against over-prompting.

## Practical checklist

1. Decide in code which actions pause (money, deletion, external sending, permission changes), never through a flag the model can set.
2. Render the approval from the actual pending call, with real arguments, target and known side effects, not from the agent's summary.
3. Give each pending action an identifier, accept only a response bound to it, and re-check at execution that the action has not changed.
4. Expire approvals, and require fresh consent when a task or session changes.
5. State transitive effects, or say plainly that they are unknown.
6. For risky server-side writes, return a structured approval-required result with a request identifier and a way to learn the outcome, so the agent waits instead of retrying.
7. Prevent self-approval, and name human reviewers for agents that have their own identity.
8. Never collect secrets through form elicitation; use URL mode and confirm the person completing the flow is the one who started it.
9. Track prompt volume and acceptance rate; near-universal acceptance means prompts are not carrying information.
10. Let a person stop or take over at any step without losing the run's state.

## Common mistakes

- Treating a confirmation the agent can reach, answer or fabricate as human approval.
- Asking only at the end of a long task, when an early error has already cascaded.
- Prompting for every call, which trains people to approve without reading.
- Trusting a server's `destructiveHint` or `readOnlyHint` from an unknown server.
- Falling back to a model-settable confirmation flag when the host cannot relay an elicitation.

## Sources and further reading

- Curated list: [Human control, approval and recovery](../../../README.md#human-control-approval-and-recovery).
- [Design Principles for Human-Agent Interaction](https://arxiv.org/abs/2606.20630) (position paper).
- [Let the Agent Do It?](https://arxiv.org/abs/2610.06047) (practitioner interviews and survey on permission decisions).
- [Agentic Browsing and Web Architecture](https://w3ctag.github.io/agentic-browsing-finding/) (W3C TAG Draft Finding on agents as user agents with duties).
- Further reading (same maintainer): [Approval is a workflow](https://agentexperience.tech/insights/approval-is-a-workflow/), [Approval, handoff and recovery patterns](https://agentexperience.tech/insights/approval-handoff-recovery-patterns/) and [Show the next decision](https://agentexperience.tech/insights/show-the-next-decision/).

## Related pages

- [Agent identity and authorisation](agent-identity-and-authorization.md)
- [Recovery and handoffs](recovery-and-handoffs.md)
- [Security for agent surfaces](security-for-agent-surfaces.md)
- [Tool design](tool-design.md)
- [MCP](../standards/mcp.md)
- [WebMCP](../standards/webmcp.md)
- [Agentic commerce](agentic-commerce.md)
