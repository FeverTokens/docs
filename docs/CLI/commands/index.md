---
id: commands-index
title: Commands Overview
sidebar_label: Overview
sidebar_position: 4
slug: /cli/commands
---

# Commands Overview

Fever CLI provides a comprehensive suite of commands to manage your entire smart contract development and deployment lifecycle. Commands are organized by function into logical groups.

Here is a high-level overview of the available commands. Click on any command to view its detailed documentation, including all options, arguments, and practical examples.

## Main Commands

| Command                                | Description                                                                 |
| :------------------------------------- | :-------------------------------------------------------------------------- |
| [`apply`](/cli/commands/apply)         | Deploy or update contracts from a declarative manifest file.                |
| [`artifacts`](/cli/commands/artifacts) | Manage contract artifacts with the Fever platform (sync, status, download). |
| [`auth`](/cli/commands/auth)           | Authenticate with the Fever platform (login, logout, status).               |
| [`compile`](/cli/commands/compile)     | Compile Solidity contracts with auto-detected compiler versions.            |
| [`install`](/cli/commands/install)     | Install project dependencies using the auto-detected package manager.       |
| [`networks`](/cli/commands/networks)   | Manage blockchain network configurations for your project.                  |
| [`node`](/cli/commands/node)           | Start a local blockchain node (Anvil) for development.                      |
| [`projects`](/cli/commands/projects)   | Manage your projects on the Fever platform (list, select, create).          |
| [`wallets`](/cli/commands/wallets)     | Generate new Ethereum wallets for development and testing.                  |
| `version`                              | Display the current version of the Fever CLI.                               |

## Command Structure

Most commands follow a simple structure:

```bash
fever [command] [subcommand] [arguments] [options]
```

- **`command`**: The main command group (e.g., `auth`, `networks`).
- **`subcommand`**: A specific action within the group (e.g., `login`, `list`).
- **`arguments`**: Positional arguments required by a subcommand (e.g., a `chainId` for `fever networks use`).
- **`options`**: Flags that modify a command's behavior (e.g., `--force`, `--mainnet`).

### Getting Help

You can get help for any command by passing the `--help` flag:

```bash
# Get help for the main program
fever --help

# Get help for a specific command
fever apply --help
fever networks --help
```
