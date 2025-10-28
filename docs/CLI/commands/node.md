---
id: command-node
title: 'Commands: node'
sidebar_label: node
slug: /cli/commands/node
---

# `fever node`

Start a local blockchain node for development and testing. Fever CLI integrates with popular tools like Anvil (from Foundry) to provide a fast and reliable local EVM environment.

## Subcommands

### `start` (default)

Start a local blockchain node. By default, it will try to use Anvil if available.

**Usage**

```bash
fever node start [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `-p`, `--port <port>` | The port to run the node on. Defaults to `8545`. |
| `-c`, `--chain-id <id>` | The chain ID for the local network. Defaults to `1337`. |
| `-a`, `--accounts <count>` | The number of pre-funded accounts to generate. Defaults to `10`. |
| `-f`, `--fork <url>` | Fork a remote network from a given RPC URL (e.g., `https://mainnet.infura.io/v3/YOUR-KEY`). |
| `-t`, `--tool <tool>` | Force a specific tool (`anvil`). |
| `-m`, `--mnemonic <phrase>` | Provide a custom mnemonic phrase for account generation. |
| `--verbose` | Show detailed output from the underlying blockchain tool. |

**Example: Start a Basic Node**

```bash
fever node start

🚀 Starting Fever Local Blockchain...

📦 Using tool: anvil
⛓️  Chain ID: 1337
👥 Accounts: 10

🌐 Network Information:
   Local:     http://127.0.0.1:8545
   Network:   http://localhost:8545
   JSON-RPC:  http://localhost:8545

🔄 Starting anvil...

⏳ Waiting for node to be ready...

✅ Blockchain node is running!

🔗 Connection Instructions:

  Add to MetaMask:
    Network Name: Fever Local Network
    RPC URL:      http://localhost:8545
    Chain ID:     1337
    Currency:     ETH

  Environment Variables:
    export RPC_URL=http://localhost:8545
    export CHAIN_ID=1337

🏦 Account Information:

   Using default anvil accounts
   Number of accounts: 10
   Each account funded with test ETH

⚠️  These are test accounts - never use for real funds!

Press Ctrl+C to stop the node
```

### `list`

List all available blockchain development tools detected on your system.

**Usage**

```bash
fever node list
```

**Example**

```bash
$ fever node list

🔧 Fever Node - Available Blockchain Tools

📋 Available Blockchain Development Tools:

   Anvil: ✅ Available (anvil 0.2.0 (f016135))

🎯 Preferred tool: anvil
   Version: anvil 0.2.0 (f016135)

💡 Usage:
   • fever node - Start with preferred tool
   • fever node --tool anvil - Force specific tool
   • fever node --help - See all options
```

## Installation of Tools

Fever CLI does not bundle blockchain tools. You need to install them separately. The recommended tool is Anvil, part of the Foundry toolchain.

### Anvil (Recommended)

Anvil is a fast, local EVM development environment provided by Foundry.

```bash
# Install Foundry (includes Anvil)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Then restart your terminal or run:
source ~/.zshenv
```

More info: [Foundry Book](https://book.getfoundry.sh/getting-started/installation)
