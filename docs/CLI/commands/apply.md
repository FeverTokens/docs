---
id: command-apply
title: 'Commands: apply'
sidebar_label: apply
slug: /cli/commands/apply
---

# `fever apply`

The `apply` command is the heart of the Fever CLI deployment system. It deploys or updates an entire smart contract system from a single, declarative YAML manifest file.

It is idempotent, meaning you can run the same command multiple times, and it will only perform the necessary actions to bring the on-chain state to match the state described in your manifest.

## Usage

```bash
fever apply -f <manifest-file> [options]
```

## Options

| Option | Description |
| :--- | :--- |
| `-f`, `--file <file>` | **(Required)** Path to the YAML manifest file. |
| `--chainId <id>` | Specify a network by its chain ID, overriding the manifest and default settings. |
| `--chainName <name>` | Specify a network by its name (from `f9s/networks.yml`), overriding the manifest. |
| `-y`, `--yes` | Skip the interactive deployment preview and confirmation prompt. |
| `-r`, `--redeploy` | Force a redeployment of the main application/contract and its facets, but **keeps existing dependencies**. |
| `--ra`, `--redeploy-all` | Force a complete redeployment of **everything**, including all dependencies. |

## The Manifest File

The `apply` command is driven by a YAML manifest file. This file declaratively defines everything about your deployment, including:

-   The kind of deployment (`Contract`, `Package`, or `Application`).
-   The contracts to be deployed.
-   Constructor arguments, with support for environment variables and dependency references.
-   Dependencies on other contracts.
-   For `Application` (Diamond) deployments, the facets and their functions.
-   The target network.

See the [Advanced Usage: Manifests](/cli/advanced-usage#deployment-manifests) guide for a detailed breakdown of the manifest structure.

## Deployment Previews

Before executing any transactions, `fever apply` generates a detailed deployment preview. This preview shows you exactly what will happen:

-   Which contracts **will be deployed** (new).
-   Which contracts **already exist** and will be skipped.
-   For Diamond applications, which facets **will be added, updated, or removed**.

You must confirm this preview before the deployment proceeds, unless you use the `--yes` flag.

**Example Preview**

```bash
═ Deployment Preview: MyLendingApp on chain 11155111 ═══════════
  Network: Sepolia

Dependencies:
  ✓ PriceOracle (already deployed at 0x1234...)
  + Token (will deploy)

Main Contract:
  + MyLendingApp (Application) (will deploy)

Facets:
  + LoanManager (will add to diamond)
  ~ StakingRewards (will update) - Functions:
       + 0xabcdef12 - newStakingFunction() | added
       - 0x12345678 - oldStakingFunction() | removed
  - OldFacet (will remove)

──────────────────────────────────────────────────────────────────

? Proceed with deployment? (Y/n)
```

## Redeployment Modes

Fever CLI gives you fine-grained control over redeployments.

### Default (Smart Deployment)

```bash
fever apply -f manifest.yaml
```

-   Checks for existing deployments of all contracts and dependencies.
-   Only deploys what is missing or has changed.
-   For Diamonds, it performs a `diamondCut` to add, update, or remove facets as needed.
-   **This is the safest and most common mode.**

### Application Redeploy (`--redeploy` or `-r`)

```bash
fever apply -f manifest.yaml --redeploy
```

-   **Keeps all existing dependencies** as they are.
-   Forces a fresh deployment of the main contract (`Application` or `Contract`).
-   For Diamonds, this means a new diamond proxy is deployed, and all facets are added to it from scratch.
-   Useful when you need a new instance of your main contract without redeploying the entire dependency tree.

### Full Redeploy (`--redeploy-all` or `--ra`)

```bash
fever apply -f manifest.yaml --redeploy-all
```

-   **Wipes the slate clean.**
-   Forces a fresh deployment of **all dependencies** and the **main contract**.
-   Ignores all existing deployment records.
-   Useful for starting from scratch on a testnet or in a local development environment.

## Examples

### Deploy a Simple Contract

```bash
fever apply -f simple-contract.yaml
```

*manifest.yaml*
```yaml
apiVersion: v1
kind: Contract
metadata:
  name: MyToken
  version: 1.0.0
spec:
  contract:
    name: MyToken
    constructorArgs:
      - name: name_
        value: "My Token"
      - name: symbol_
        value: "MTK"
  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
  network:
    chainId: 11155111
```

### Deploy a Diamond Application

```bash
fever apply -f application.yaml
```

*application.yaml*
```yaml
apiVersion: v1
kind: Application
metadata:
  name: MyDiamondApp
spec:
  application:
    name: MyDiamond
    constructorArguments:
      - ${OWNER_ADDRESS}

  # These packages will be auto-deployed as dependencies
  # and then added as facets to the diamond.
  packages:
    - name: AssetManagerFacet
      functions: "*" # Add all functions
    - name: StakingFacet
      functions:
        - stake(uint256)
        - unstake(uint256)

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```
