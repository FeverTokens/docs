---
id: ai-agents
title: Using Fever with AI Agents
sidebar_label: AI Agents (MCP)
sidebar_position: 5
slug: /cli/ai-agents
---

# Using Fever with AI Agents

**Let your AI coding assistant understand Fever — and operate it for you.**

Fever CLI ships with a built-in **Model Context Protocol (MCP) server**. Any
MCP-capable assistant — **Claude Code, Cursor, Gemini CLI, Codex**, and others —
can connect to it to read the canonical Fever knowledge (manifest reference,
JSON schemas, worked examples) and call safe tools (validate a manifest,
scaffold a new one, list networks/deployments, generate a wallet, control a
local node).

No plugin to install, no separate package. If you have `fever`, you have the
server:

```bash
fever mcp
```

That command starts a stdio MCP server named `fever`. You normally don't run it
by hand — you point your agent at it (below) and it spawns it for you.

:::tip Why this matters
Without it, an assistant has to *guess* how f9s manifests work. With it, the
assistant reads the **exact** schema the CLI enforces and validates its drafts
against the real validator — so it writes manifests that actually deploy,
instead of plausible-looking YAML that fails.
:::

---

## What the agent gets

The server exposes two things over MCP: **resources** (read-only knowledge) and
**tools** (actions).

### Resources (knowledge)

| URI | What it is |
|---|---|
| `fever://docs/manifests` | How to write Contract / Package / PackageSystem / Network manifests |
| `fever://docs/commands` | Every `fever` command, its purpose, and safety notes |
| `fever://guide/authoring-manifests` | Deep authoring guide: constructor-arg shapes, templating rules, function routing, and what the validator enforces |
| `fever://examples` | Index of complete, working example manifests |
| `fever://examples/{slug}` | A specific example (e.g. `fever://examples/package-system`) |
| `fever://schemas` | Index of the embedded JSON schemas |
| `fever://schema/{version}/{kind}` | The **real** AJV schema the validator uses (e.g. `fever://schema/beta-v1/contract`) |

Because the schemas and examples are the same ones the CLI uses, there is **no
drift** between what the agent reads and what `fever apply` enforces.

### Tools (actions)

| Tool | What it does | Safety |
|---|---|---|
| `fever_validate_manifest` | Validate a manifest file against schema + templating rules | Read-only |
| `fever_scaffold_manifest` | Generate a valid starter manifest for a `kind` + `name` | Read-only |
| `fever_list_networks` | List configured networks and the active one | Read-only |
| `fever_list_deployments` | List locally recorded PackageSystem deployments | Read-only |
| `fever_auth_status` | Report platform authentication status | Read-only |
| `fever_generate_wallet` | Generate a new wallet (optionally write to `.env`) | Writes only if asked |
| `fever_list_node_tools` | List the local-node tools available | Read-only |
| `fever_start_node` / `fever_stop_node` / `fever_node_status` | Start / stop / inspect a local Anvil node | Local only |

:::info Safe by design
Every domain tool is **read-only** except wallet generation and node control.
The server never deploys, never spends funds, and never touches the network on
its own. `fever apply` remains an explicit human action.
:::

---

## Setup per assistant

In every case, the assistant launches `fever mcp` as a stdio server. Make sure
`fever` is installed and on your `PATH` first ([Installation](./installation.md)).

### Claude Code

Add the server with one command (run it inside your project):

```bash
claude mcp add fever -- fever mcp
```

Or add it to `.mcp.json` at the project root to share it with your team:

```json
{
  "mcpServers": {
    "fever": {
      "command": "fever",
      "args": ["mcp"]
    }
  }
}
```

### Cursor

Add Fever to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "fever": {
      "command": "fever",
      "args": ["mcp"]
    }
  }
}
```

Then enable the **fever** server in Cursor → Settings → MCP.

### Gemini CLI

Add it to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "fever": {
      "command": "fever",
      "args": ["mcp"]
    }
  }
}
```

### Codex / other MCP clients

Any client that speaks MCP over stdio works. Configure a server whose command is
`fever` with the single argument `mcp`:

```toml
# Codex: ~/.codex/config.toml
[mcp_servers.fever]
command = "fever"
args = ["mcp"]
```

:::tip Verify the connection
Once configured, ask the assistant to "list the Fever MCP tools" or "read
`fever://guide/authoring-manifests`". If it can do that, the server is wired up
correctly.
:::

---

## Giving the agent project context

The MCP server provides the *Fever* knowledge. For best results, also tell the
assistant about *your* project. Add an `AGENTS.md` (or `CLAUDE.md`) at your repo
root:

```markdown
# Project notes for AI agents

This repo deploys smart contracts with **Fever CLI**. A `fever` MCP server is
configured — use it.

- Manifests live in `f9s/*.yaml`.
- Before writing a manifest, read `fever://guide/authoring-manifests` and a
  matching example from `fever://examples`.
- After writing or editing any manifest, ALWAYS run `fever_validate_manifest`
  and fix every reported error before suggesting `fever apply`.
- Never hardcode private keys — reference `${PRIVATE_KEY}` from the environment.
- Deploys (`fever apply`) are performed by a human, not the agent.
```

---

## Example prompts

Once connected, you can drive Fever in natural language:

> "Scaffold a `PackageSystem` manifest called `MicroLoanPackageSystem` with
> packages `LoanRegistry`, `LoanFunding`, and `LoanRepayment`, then validate it."

The assistant will call `fever_scaffold_manifest`, refine it using the authoring
guide and examples, and run `fever_validate_manifest` until it passes.

> "Why is `f9s/microloan-package-system.yaml` failing validation?"

It calls `fever_validate_manifest` on the file and explains the errors using the
real validator output.

> "Which networks are configured, and what have I deployed on chain 11155111?"

It calls `fever_list_networks` and `fever_list_deployments`.

> "Spin up a local node and generate a funded test wallet I can put in `.env`."

It calls `fever_start_node` and `fever_generate_wallet`.

---

## How an agent learns to author manifests

The authoring guide (`fever://guide/authoring-manifests`) is grounded in the
CLI's own templating and validation code, so the agent learns the rules that a
schema alone can't express:

- **Constructor args** come in three shapes — bare scalar, named/typed object
  (`{ name, type, value }`), and tuple (`type: "(address,address)"` with a list
  `value`).
- **Environment templating:** `${VAR}`, `${VAR:-default}`, `${env:VAR}`,
  `${file:PATH}` — undefined vars are left literal and warned about.
- **Dependency references:** `$dependencies.<key>.<attr>` (with
  `address | chainId | txHash | abi`), matched **whole-string only**, and every
  referenced key **must** be declared under `spec.dependencies`.
- **Function routing** in a `PackageSystem`: `"*"`, full signatures, bare names,
  or raw 4-byte selectors.

The result is a tight **draft → validate → fix** loop entirely inside the agent,
before you ever run a deployment.

📖 For the manifest format itself, see the [Manifest Guide](./manifests.md).

---

## Troubleshooting

### The agent can't find the server

- Confirm `fever --version` works in the same shell the agent uses.
- If `fever: command not found`, fix your `PATH` (see
  [Installation → Command Not Found](./installation.md#command-not-found)).
- Some clients need an **absolute path** to the binary. Use the output of
  `which fever` as the `command`.

### Tools return "not authenticated" or empty results

`fever_auth_status`, `fever_list_deployments`, and friends read your local
project state. Run them from (or point the agent at) a real Fever project
directory, and run `fever auth login` if a tool needs the platform.

### Validation passes but `fever apply` still fails

Validation checks the manifest shape and references — it does not compile or
simulate. Run `fever compile --all` and check your network/wallet config before
deploying.

---

## Next steps

- 📖 **[Manifest Guide](./manifests.md)** — the three deployment types in depth
- 🎯 **[Quickstart](./quickstart.md)** — deploy a real system in 15 minutes
- 🧰 **[Command Reference](./commands/)** — every `fever` command
