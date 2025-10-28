---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 3
slug: /cli/getting-started
---

# Getting Started

This guide will walk you through the essential first steps to get up and running with Fever CLI: authentication, project setup, and your first compilation.

## 1. Authenticate with the Fever Platform

Your first step is to connect the CLI to your Fever developer account. This is done via a secure device authorization flow.

Run the `login` command:

```bash
fever auth login
```

The CLI will display a user code and a verification URL. It will also attempt to open the URL in your default browser.

1.  Open the verification URL in your browser.
2.  Enter the user code displayed in your terminal.
3.  Authorize the CLI to access your Fever account.

Once you authorize, the CLI will automatically complete the authentication process and store your credentials securely on your local machine.

To verify your status, run:

```bash
fever auth status
```

## 2. Create or Select a Project

Fever CLI organizes your work into projects. All your synced artifacts and deployments will be associated with the currently selected project.

First, list your available projects:

```bash
fever projects
```

If you have no projects, create one:

```bash
fever projects create --name "My First Project"
```

Once you have projects, you can select one to be the active project for your workspace:

```bash
fever projects select
```

This will open an interactive menu where you can choose which project to work on. The selected project is saved in a `.fever/platform.json` file in your current directory.

## 3. Compile Your First Contract

Fever CLI includes a powerful batch compiler that automatically detects the Solidity version from your source files.

1.  Make sure you have your contracts in a `contracts/` directory.
2.  Run the `compile` command:

    ```bash
    fever compile --all
    ```

The `--all` flag tells the compiler to find and compile all `.sol` files in the source directory (`contracts/` by default).

After a successful compilation, you will find the output in the `.fever/` directory:

-   `.fever/combined.json`: A single file containing the ABI and bytecode for all compiled contracts, used internally by the CLI.
-   `.fever/artifacts/[ContractName]/artifact.json`: Individual, granular artifact files for each contract.

## 4. Check Artifact Status

Now that you have compiled contracts, you can check their sync status with the Fever platform using the `artifacts status` command. This works much like `git status`.

```bash
fever artifacts status
```

You will see a list of your contracts, marked with their status:

-   `🔴 Untracked`: This is a new contract that has never been synced to the platform.
-   `🟡 Modified`: The contract has been changed since its last sync.
-   `🟢 Synced`: The local version is up-to-date with the platform.

## Next Steps

Congratulations! You've successfully set up Fever CLI. You are now ready to explore more advanced features:

-   **Deploy a Contract**: Learn how to deploy contracts using a manifest in the [Commands: apply](./commands/apply.md) guide.
-   **Local Development**: Start a local test node with the [Commands: node](./commands/node.md) command.
-   **Manage Networks**: Configure custom networks for deployment with the [Commands: networks](./commands/networks.md) command.
