---
id: command-artifacts
title: 'Commands: artifacts'
sidebar_label: artifacts
slug: /cli/commands/artifacts
---

# `fever artifacts`

Manage your smart contract artifacts with the Fever platform. This command group provides a "Git-like" experience for tracking changes, syncing, and downloading your compiled contract artifacts.

## Smart Artifact Management

Fever CLI introduces an intelligent artifact management system. Instead of uploading all artifacts on every change, it calculates a content hash (based on ABI and bytecode) for each contract. This allows the `sync` command to only upload contracts that are new or have been modified, saving significant time and bandwidth (typically 70-90%).

## Subcommands

### `sync`

Synchronize local artifacts with the Fever platform. By default, it performs a "smart sync," uploading only untracked or modified contracts.

**Usage**

```bash
fever artifacts sync [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--all` | Force sync all contracts, ignoring their current status. |
| `--compile-first` | Run `fever compile --all` before syncing if no artifacts are found. |
| `--file <path>` | Sync a single, specific contract artifact. |
| `--force` | Force overwrite existing artifacts on the platform. |
| `--dry-run` | Show which contracts would be synced without actually performing the sync. |

**Example: Smart Sync**

```bash
$ fever artifacts sync

🔄 Syncing artifacts to platform...
🔍 Found 2 contracts to sync

📋 Contracts to sync:
   🔴 ● MyNewToken (deployable_contract) - untracked - 2.5KB
   🟡 ● StakingRewards (deployable_contract) - modified - 8.1KB

   Total size: 10.6KB
   Project: My-DeFi-Project

🚀 Syncing to platform...

✅ Sync completed successfully!

Sync Results:
   ✅ Synced: MyNewToken, StakingRewards
   Project: My-DeFi-Project
   Total size: 10.6KB
```

### `status`

Check the sync status of your local artifacts against the platform. This is similar to `git status`.

**Usage**

```bash
fever artifacts status
```

**Status Indicators**

-   `🔴 Untracked`: A new contract that has never been synced.
-   `🟡 Modified`: The contract's ABI or bytecode has changed since the last sync.
-   `🟢 Synced`: The local artifact is up-to-date with the platform.

**Example**

```bash
$ fever artifacts status

📊 Artifact Status

Selected Project: My-DeFi-Project (proj_abc123)

📁 Local Contracts:

🔴 Untracked (never synced):
   MyNewToken (deployable_contract) - 2.5KB

🟡 Modified (changed since last sync):
   StakingRewards (deployable_contract) - 8.1KB - last synced: 10/27/2025, 4:15 PM

🟢 Synced (up to date):
   MyToken (deployable_contract) - 2.2KB - synced: 10/26/2025, 11:30 AM

📈 Summary:
   Total contracts: 3
   ✅ Synced: 1
   🔄 Need sync: 2

💡 Quick actions:
   • Sync changes: fever artifacts sync
```

### `download`

Download the latest `combined.json` artifact from the currently selected project on the platform. This is useful for pulling down a canonical set of artifacts for a project.

**Usage**

```bash
fever artifacts download [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--backup` | If a local `.fever/combined.json` exists, create a backup before overwriting it. |

**Example**

```bash
$ fever artifacts download --backup

📥 Downloading artifacts from platform...
   Backed up existing artifacts to: .fever/combined.json.backup.1667842919

✅ Artifacts downloaded successfully!

Download Details:
   Project: My-DeFi-Project
   Contracts: 15
   Solidity: 0.8.20
   Downloaded from: 10/28/2025, 10:00 AM
   Saved to: .fever/combined.json
```

### `diff` (Coming Soon)

Compare local artifacts with the versions on the platform, showing a detailed diff of ABI or bytecode changes.

### `history` (Coming Soon)

View the sync history for a specific contract or for the entire project.
