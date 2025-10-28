---
id: command-compile
title: 'Commands: compile'
sidebar_label: compile
slug: /cli/commands/compile
---

# `fever compile`

The `compile` command compiles your Solidity contracts. It features a powerful batch compiler that automatically detects the highest Solidity version specified in your source files and compiles all contracts in a single, efficient pass.

## Usage

```bash
fever compile [packageName] [options]
```

## Arguments

| Argument | Description |
| :--- | :--- |
| `[packageName]` | Optional. The name of a specific contract to compile (e.g., `MyContract`). If omitted, the command requires the `--all` flag. |

## Options

| Option | Description |
| :--- | :--- |
| `-a`, `--all` | Compile all contracts found in the source directory. This is the most common and recommended usage. |
| `-s`, `--source <directory>` | Specify the source directory containing your `.sol` files. Defaults to `contracts`. |

## How It Works

1.  **Version Detection**: The compiler scans all `.sol` files to find `pragma solidity` directives. It determines the highest version required across all files (e.g., `0.8.20`).
2.  **Batch Compilation**: It loads the appropriate `solc` version and compiles all source files in a single pass for maximum efficiency.
3.  **Artifact Generation**: For each compiled contract, it generates two sets of artifacts in the `.fever/` directory:
    -   **Individual Artifacts**: A detailed `artifact.json` for each contract is saved in `.fever/artifacts/[ContractName]/`. This granular format is used for smart artifact syncing.
    -   **Combined Artifact**: A `combined.json` file is created at `.fever/combined.json`, containing the ABI and bytecode for all compiled contracts. This is used internally by other CLI commands like `apply`.

## Examples

### Compile All Contracts

This is the standard way to use the command. It finds and compiles every `.sol` file in the `contracts/` directory.

```bash
fever compile --all
```

**Example Output**

```bash
$ fever compile --all

Compiling all contracts with Solidity 0.8.20
Compiling all contracts in a single pass...
Processed contract: MyToken
Processed contract: Ownable
Processed contract: StakingRewards
Successfully compiled 3 contracts
Generated combined artifact: .fever/combined.json
Contract categories: 2 deployables, 1 interfaces, 0 external dependencies
Associated with project: My-DeFi-Project
```

### Compile a Single Contract

If you only want to compile a specific contract.

```bash
fever compile MyToken
```

### Compile from a Different Source Directory

If your contracts are located in a directory other than `contracts/`.

```bash
fever compile --all --source ./src/contracts
```
