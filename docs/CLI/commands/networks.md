---
id: command-networks
title: 'Commands: networks'
sidebar_label: networks
slug: /cli/commands/networks
---

# `fever networks`

Manage blockchain network configurations for your project. This command group allows you to list popular networks, add custom RPCs, select a default network for deployments, and view network status.

Network configurations are stored in `f9s/networks.yml` in your project root.

## Subcommands

### `list`

List available blockchain networks. By default, it shows popular testnets. You can filter to show mainnets or networks configured for your project.

**Usage**

```bash
fever networks list [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--mainnet` | Display popular mainnet networks. |
| `--project` | Display networks configured in your project's `f9s/networks.yml`. |

**Examples**

#### List Popular Testnets (Default)

```bash
$ fever networks list

🔥 FEVER CLI - Networks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Popular EVM Testnets (2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#   Network                    Chain ID    Currency    RPCs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. Localhost                 1337        ETH         1
   2. Ethereum Sepolia          11155111    ETH         1
   3. Base Sepolia              84532       ETH         1
   4. Arbitrum Sepolia          421614      ETH         1
   5. Polygon Amoy              80002       MATIC       1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tips:
   • Use 'fever networks select' to add a network to your project
   • Use 'fever networks --mainnet' to see mainnets
   • Use 'fever networks list --project' to see project networks
```

#### List Popular Mainnets

```bash
fever networks list --mainnet
```

#### List Project Networks

```bash
fever networks list --project
```

### `select`

Interactively select a network from a list of popular networks to add to your project's `f9s/networks.yml`.

**Usage**

```bash
fever networks select [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--mainnet` | Display popular mainnet networks for selection. |

**Example**

```bash
$ fever networks select

⚠️  No network configuration found
? Would you like to initialize f9s/networks.yml? (Y/n) Y
✅ Initialized f9s/networks.yml

🔍 Loading available networks...

🔥 Select Network for Project

? Choose a network to add: (Use arrow keys)
❯ Ethereum Sepolia (11155111) - ETH
  Base Sepolia (84532) - ETH
  Polygon Amoy (80002) - MATIC
  Cancel selection

✅ Network added to project!

Network Details:
   Name: Ethereum Sepolia
   Chain ID: 11155111
   Currency: ETH
   RPC: https://rpc.sepolia.org
   Explorer: https://sepolia.etherscan.io

📁 Saved to: f9s/networks.yml
✨ Set as default network for deployments
```

### `add`

Add a custom network to your project or globally. This is useful for private networks, local development chains, or networks not listed on Chainlist.

**Usage**

```bash
fever networks add [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--chainId <id>` | The chain ID of the network. |
| `--rpc <url>` | The RPC URL for the network. |
| `--name <name>` | A human-readable name for the network. |
| `--symbol <symbol>` | The native currency symbol (e.g., `ETH`, `MATIC`). |
| `--explorer <url>` | The block explorer URL (optional). |
| `--testnet` | Mark the network as a testnet (default is mainnet). |
| `--global` | Add the network globally (available to all projects). By default, it's added only to the current project. |
| `--local` | Quick add a localhost network (Chain ID 1337, RPC `http://localhost:8545`). |

**Examples**

#### Add a Custom Testnet

```bash
fever networks add \
  --name "My Private Testnet" \
  --rpc "http://192.168.1.100:8545" \
  --chainId 12345 \
  --symbol MYT \
  --testnet
```

#### Quick Add Localhost

```bash
fever networks add --local

✅ Local network added to project!

Network Details:
   Name: Localhost
   Chain ID: 1337
   Symbol: ETH
   RPC: http://localhost:8545
   Type: Local

```

### `use <chainId>`

Set a network as the active (default) network for deployments in your project. This network will be used if no network is specified in the manifest or via command-line flags.

**Usage**

```bash
fever networks use <chainId>
```

**Argument**

| Argument | Description |
| :--- | :--- |
| `<chainId>` | **(Required)** The chain ID of the network to set as active. |

**Example**

```bash
fever networks use 11155111

✅ Default network switched!

Default Network:
   Name: Ethereum Sepolia
   Chain ID: 11155111
   Currency: ETH
   RPC: https://rpc.sepolia.org
```

### `remove <chainId>`

Remove a network from your project's `f9s/networks.yml`.

**Usage**

```bash
fever networks remove <chainId>
```

**Argument**

| Argument | Description |
| :--- | :--- |
| `<chainId>` | **(Required)** The chain ID of the network to remove. |

**Example**

```bash
fever networks remove 1337

⚠️  Remove network: Localhost (1337)?
? Are you sure? (Y/n) Y
✅ Removed Localhost from project
```

### `status`

Display the currently active network and a summary of all networks configured for your project.

**Usage**

```bash
fever networks status
```

**Example**

```bash
$ fever networks status

📊 Network Status

✅ Default Network for Project

Default Network:
   Name: Ethereum Sepolia
   Chain ID: 11155111
   Currency: ETH
   Type: testnet
   RPC: https://rpc.sepolia.org
   Explorer: https://sepolia.etherscan.io
   Added: 10/28/2025, 12:00:00 PM

📁 Configuration File: f9s/networks.yml

Project Networks (2 configured):
   ⭐ Ethereum Sepolia (11155111) - DEFAULT
     Localhost (1337)

💡 Tips:
   • Use 'fever networks use <chainId>' to switch default network
   • Use 'fever networks list --project' to see all project networks
   • Use 'fever networks select' to add more networks
```