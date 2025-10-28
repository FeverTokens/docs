---
id: command-projects
title: 'Commands: projects'
sidebar_label: projects
slug: /cli/commands/projects
---

# `fever projects`

Manage your projects on the Fever platform. This command group allows you to list, create, and select a project to associate with your local workspace.

All artifacts and deployments you sync are tied to the currently selected project.

## Subcommands

### `projects` (default)

List all available projects in your Fever account and show the currently selected one.

**Usage**

```bash
fever projects
```

**Example Output**

```bash
📌 Current Project: My DeFi Protocol (my-defi-protocol)

Your Projects:
✓ 1. My DeFi Protocol
     A decentralized lending and borrowing system.
     ID: proj_abc123
     12 contracts, 5 deployments

  2. NFT Marketplace
     A platform for trading digital collectibles.
     ID: proj_def456

Commands:
  fever projects select    # Select different project
  fever projects create    # Create new project
```

### `select`

Interactively select a project to be the active project for the current directory. The selection is stored in `.fever/platform.json`.

**Usage**

```bash
fever projects select
```

This command opens an interactive menu where you can use arrow keys to navigate and `Enter` to select a project.

**Example**

```bash
$ fever projects select

Select a project:
(Use ↑↓ arrows to navigate, Enter to select, ESC to cancel)

→ ✓   My DeFi Protocol - A decentralized lending...
      NFT Marketplace - A platform for trading...

✅ Project selected: My DeFi Protocol
   ID: proj_abc123
```

### `create`

Create a new project on the Fever platform.

**Usage**

```bash
fever projects create --name "<project-name>" [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--name <name>` | **(Required)** The name of the new project. |
| `--description <desc>` | An optional description for the project. |

**Example**

```bash
$ fever projects create --name "My New App" --description "A next-gen social app"

🏗️  Creating project: My New App

✅ Project created successfully!

Project Details:
   Name: My New App
   ID: proj_ghi789
   Slug: my-new-app
   Description: A next-gen social app

📌 Project automatically selected for this workspace
```
