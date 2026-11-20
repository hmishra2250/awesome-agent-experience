# WebMCP

**In one line:** a proposed browser API through which a web page registers named, schema-described tools that an agent in the browser can discover and call, so the agent no longer has to guess what a button or form does.

**Last reviewed:** 2026-11-20

## What it is

WebMCP lets a page expose parts of its own application logic as tools. The [WebMCP draft](https://webmachinelearning.github.io/webmcp/) describes such a page as an MCP server implemented in client-side script rather than on a backend. Each tool has a name, an optional human-readable title, a natural-language description, a JSON Schema for its input, an optional output schema and an `execute` callback that runs inside the page (specification).

There are two ways to declare tools, as described in [Chrome's WebMCP overview](https://developer.chrome.com/docs/ai/webmcp) (vendor documentation):

- **Imperative.** Script calls `document.modelContext.registerTool()` and can unregister the tool later, for example through an `AbortSignal`.
- **Declarative.** Attributes on an ordinary HTML form, such as `toolname`, turn the form into a tool without new JavaScript.

Tools carry annotation hints: `readOnlyHint`, `untrustedContentHint` for results that contain user-generated or third-party content, and `consequentialHint`, which Chrome's [security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools) recommends for high-stakes or non-reversible actions (specification and vendor documentation). Access is gated by a `tools` Permissions Policy feature whose default allowlist is `'self'`, so a cross-origin iframe can only register or expose tools when the embedding page delegates the feature with `allow="tools"`.

WebMCP is not a replacement for a backend [MCP](mcp.md) server. OpenAI's [site tools documentation](https://learn.chatgpt.com/docs/webmcp) (vendor documentation) draws the line clearly: an MCP server works without an open page, while WebMCP suits tasks where the person and the agent need to see the same live page and signed-in session. A site can offer both.

## Why it matters for agents

A browser agent without declared tools has to infer intent from the DOM, the accessibility tree or screenshots. Each inferred step can go wrong, and the agent rarely knows when it has. WebMCP moves that inference to the site owner, who knows what a control means, what inputs it needs and whether it changes state. That is the core agent experience argument: state the action and its consequences instead of leaving the agent to reverse-engineer them. See [agent-ready websites](../concepts/agent-ready-websites.md) and [tool design](../concepts/tool-design.md).

It also gives a page a way to say which actions are consequential, which is the hook a browser needs to ask the person for confirmation. See [human approval and control](../concepts/human-approval-and-control.md).

## Current state

As of 2026-11-20, checked against the live pages:

- **Steward and status.** The specification is a [Draft Community Group Report dated 19 November 2026](https://webmachinelearning.github.io/webmcp/), published by the W3C Web Machine Learning Community Group with editors from Microsoft and Google. It states that it is not a W3C Standard and not on the W3C Standards Track. A Web Platform Tests suite is linked from the specification.
- **Path to a Working Group.** A [draft Agentic Web Working Group charter](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html) names WebMCP as the initial input to a normative deliverable called Site Capabilities for Agents, covering imperative and declarative descriptions. The charter is a draft with no start date, and it lists crawler controls, bot detection and cryptographic authentication as out of scope.
- **Browser support.** Chrome documents an origin trial starting in Chrome 149 and a local testing flag ([WebMCP overview](https://developer.chrome.com/docs/ai/webmcp), last updated 7 October 2026). Chrome also publishes [best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) (last updated 30 October 2026), a [tool-building framework](https://developer.chrome.com/docs/ai/webmcp/build-tools) and [security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
- **Clients.** OpenAI documents [site tools](https://learn.chatgpt.com/docs/webmcp) as its WebMCP implementation in the ChatGPT desktop app's built-in browser for ChatGPT Work and Codex. It says each invocation receives a safety review and that tool definitions and results are treated as untrusted content.
- **Supply.** Shopify announced WebMCP tools on every Liquid storefront and the Hydrogen developer preview on [5 August 2026](https://shopify.dev/changelog/posts/webmcp-liquid-hydrogen), and checkout tools on [28 September 2026](https://shopify.dev/changelog/posts/webmcp-support-for-checkout). Its [tool reference](https://shopify.dev/docs/api/web-mcp) notes that agent support is currently limited to Chromium-based browsers and that call conventions are still changing between Chrome versions (vendor documentation).
- **Tooling.** [WebMCP tools (Chrome Labs)](https://github.com/GoogleChromeLabs/webmcp-tools) collects an inspector extension, an evals CLI, a polyfill and demos. It says it is not an officially supported Google product.
- **Threat model.** The [Threat Model for WebMCP](https://w3c.github.io/threat-model-webmcp/) is an Unofficial Proposal Draft dated 15 November 2026. It states that it does not represent consensus or a W3C position.

## What the evidence supports and what is disputed

**Reasonably supported:**

- *The risk surface is well described (specification).* The specification's non-normative security section covers tool poisoning through metadata, output injection, misrepresentation of intent (including "ambiguous finalisation" of consequential actions), privacy leakage through over-parameterised tools and same-origin interactions. The unofficial threat model separates threats inherent to agentic navigation from those introduced by tool mediation and those specific to WebMCP.
- *Hints are not enforcement (vendor material).* Chrome's tool-building guide says authorisation, identifier checks and sequence safety belong in application logic rather than in `readOnlyHint` or `untrustedContentHint`, and recommends binding approval of a consequential action to the exact draft being approved. OpenAI says a tool's name or read-only claim is not proof of what it does.
- *Declared actions are the direction of related research (study and opinion).* A declarative framework for agent and web interaction, [Building the Web for Agents](https://arxiv.org/abs/2511.11287), and a position paper, [Web Agents Should Use Typed Actions](https://arxiv.org/abs/2602.17245), both argue that explicit actions are more reliable and auditable than click-based browsing. Neither measures WebMCP on production sites.

**Disputed or unproven:**

- *Outcome lift on real sites.* No published study yet compares task success with and without WebMCP on production sites. Chrome's claim of higher accuracy is vendor material.
- *Headless and remote agents.* Chrome says the API is primarily designed for local browser workflows with a human in the loop, and that clients must visit a site to learn whether it has tools. How server-side agents will use it is open.
- *Final shape.* The API is still moving; Shopify's reference records a change in how arguments are passed planned across Chrome versions. Treat any code sample as tied to a browser version.

## Practical checklist

1. Start from user goals and role-play the conversation, as Chrome's framework suggests, before choosing tools.
2. Give each tool one purpose, a specific name and a description that says when to use it; avoid overlapping tools.
3. Register the complete tool set for a page state at once, and unregister tools when that state ends.
4. Route tools through the same application service as the visible interface, so validation, permissions and side effects match.
5. Resolve a tool call as successful only when application state actually reflects the change, and return something the agent can verify (an order number, a new status).
6. Set `readOnlyHint`, `untrustedContentHint` and `consequentialHint` honestly, and enforce authorisation and confirmation server-side regardless.
7. Return errors that name the missing prerequisite or the valid format, and use idempotency keys for writes that might be repeated.
8. Keep `allow="tools"` off third-party iframes unless you trust them with your users' session.
9. Test with the Chrome Labs inspector and evals, and record the specification revision, browser version, agent client and model for each run.
10. Keep the normal interface fully working for people and browsers without WebMCP.

## Common mistakes

- Exposing a tool per button instead of per user goal.
- Treating `consequentialHint` as if it guaranteed a confirmation prompt in every client.
- Returning success before the page or backend has committed the change.
- Placing user-generated text in tool results without marking it untrusted.
- Expecting WebMCP to improve search visibility; nothing in the specification or vendor documentation claims that.

## Sources and further reading

- [WebMCP specification](https://webmachinelearning.github.io/webmcp/) (Community Group draft) and [Threat Model for WebMCP](https://w3c.github.io/threat-model-webmcp/) (unofficial draft)
- [Agentic Web Working Group charter (draft)](https://w3c.github.io/charter-drafts/2026/agenticweb-wg.html)
- Chrome: [overview](https://developer.chrome.com/docs/ai/webmcp), [best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices), [build tools](https://developer.chrome.com/docs/ai/webmcp/build-tools), [secure tools](https://developer.chrome.com/docs/ai/webmcp/secure-tools) and [WebMCP tools](https://github.com/GoogleChromeLabs/webmcp-tools) (vendor material)
- [ChatGPT site tools](https://learn.chatgpt.com/docs/webmcp) and [Shopify WebMCP tools](https://shopify.dev/docs/api/web-mcp) (vendor documentation)
- [webfuse-com/awesome-webmcp](https://github.com/webfuse-com/awesome-webmcp) (vendor-maintained list)
- The curated list sections [Discovery and agent-readable web](../../../README.md#discovery-and-agent-readable-web) and [Security for agent-facing surfaces](../../../README.md#security-for-agent-facing-surfaces)
- Further reading (same maintainer): [Agent web standards](https://agentexperience.tech/insights/agent-web-standards/) and [Agent-friendly websites](https://agentexperience.tech/insights/agent-friendly-websites/)

## Related pages

- [MCP](mcp.md)
- [Agent-ready websites](../concepts/agent-ready-websites.md)
- [Tool design](../concepts/tool-design.md)
- [Human approval and control](../concepts/human-approval-and-control.md)
- [Security for agent surfaces](../concepts/security-for-agent-surfaces.md)
- [Web Bot Auth](web-bot-auth.md)
- [Standards tracker](../standards-tracker.md)
