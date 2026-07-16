# System Design Exercise: Agent Orchestration Service

A whiteboard-style design discussion. There is no single right answer; we care about how you reason about trade-offs, not a finished diagram.

## Drawing

Use [Excalidraw](https://excalidraw.com) (no login, click "Share" for a live link). [tldraw](https://tldraw.com), [draw.io](https://draw.io), or FigJam are fine too. Boxes and arrows are all we need.

## The prompt

Design a backend service that runs LLM-powered agents. Given a goal, an agent should:

- Work in an iterative loop: decide the next step, take an action, observe the result, repeat until the goal is met or it gives up.
- Call external tools to get things done (search, fetch data, run code, etc.).
- Hand off subtasks to child agents that each work in their own separate context, then fold their results back into the parent.
- Record a step-by-step trace of everything it did, so a run can be inspected and debugged after the fact.
- Pull tools from a registry that holds both tools running inside the service and tools hosted on separate servers, discovered through a shared protocol.

Start with a rough architecture, then we'll go deeper on whichever areas are most interesting.

## Areas we may dig into

- **The agent loop:** stopping conditions, step/token/cost budgets, avoiding infinite loops.
- **Tools and registry:** the tool interface, local vs. remote tools, discovery, versioning, and auth to remote tool servers.
- **Delegation:** how child agents are isolated, how results return, depth and fan-out limits, runaway-cost control.
- **Tracing and observability:** what a trace captures, how you'd replay or debug a failed run.
- **State and reliability:** where run state lives, handling crashes/timeouts/retries, resuming a long run.
- **Concurrency and scale:** many runs at once, long-running work, backpressure.
- **Security:** untrusted tool output, prompt injection, blast radius of a misbehaving tool.

## How to approach it

Think out loud. Ask clarifying questions before committing to a design. State your assumptions, call out trade-offs, and flag what you'd defer to v2.
