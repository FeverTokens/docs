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
| `--dry-run` | Validate the manifest, resolve every `${ENV}` / `$dependencies.*` placeholder with synthetic addresses, and print the resolved plan. **No RPC, no private key, no transactions.** Exits non-zero if the manifest is invalid. |
| `--chainId <id>` | Specify a network by its chain ID, overriding the manifest and default settings. |
| `--chainName <name>` | Specify a network by its name (from `f9s/networks.yml`), overriding the manifest. |
| `-y`, `--yes` | Skip the interactive deployment preview and confirmation prompt. |
| `-r`, `--redeploy` | Force a redeployment of the main system/contract and its packages, but **keeps existing dependencies**. |
| `--ra`, `--redeploy-all` | Force a complete redeployment of **everything**, including all dependencies. |
| `--skip-sync` | Skip syncing the deployment record to the Fever web platform. |

:::tip CI-friendly dry run
`fever apply -f manifest.yaml --dry-run` needs no secrets and no chain. Wire it
into your CI / pre-commit hooks to catch broken manifests, missing environment
variables, and stale dependency references **before** anything touches the
network.
:::

## The Manifest File

The `apply` command is driven by a YAML manifest file. This file declaratively defines everything about your deployment, including:

- The kind of deployment (`Contract`, `Package`, or `PackageSystem`).
- The contracts to be deployed.
- Constructor arguments, with support for environment variables and dependency references.
- Dependencies on other contracts.
- For `PackageSystem` deployments, the packages and their functions.
- The target network.

See the [Deployment Manifests Guide](../manifests.md) for a detailed breakdown of the manifest structure.

## Deployment Previews

Before executing any transactions, `fever apply` generates a detailed deployment preview. This preview shows you exactly what will happen:

- Which contracts **will be deployed** (new).
- Which contracts **already exist** and will be skipped.
- For PackageSystem deployments, which packages **will be added, updated, or removed**.

You must confirm this preview before the deployment proceeds, unless you use the `--yes` flag.

**Example Preview**

```bash
═ Deployment Preview: MicroLoanSystem on chain 1337 ═══════════
  Network: Localhost

Dependencies:
  ✓ PackageController (already deployed at 0x1234...)
  + PackageViewer (will deploy)

Main System:
  + MicroLoanPackageSystem (PackageSystem) (will deploy)

Packages:
  + LoanRegistry (will add to system)
  + LoanFunding (will add to system)
  ~ LoanRepayment (will update) - Functions:
       + 0xabcdef12 - repayNextInstallment(uint256) | added
       - 0x12345678 - oldRepayFunction(uint256) | removed
  - OldPackage (will remove)

──────────────────────────────────────────────────────────────────

? Proceed with deployment? (Y/n)
```

## Redeployment Modes

Fever CLI gives you fine-grained control over redeployments.

### Default (Smart Deployment)

```bash
fever apply -f manifest.yaml
```

- Checks for existing deployments of all contracts and dependencies.
- Only deploys what is missing or has changed.
- For PackageSystems, it updates the system to add, update, or remove packages as needed.
- **This is the safest and most common mode.**

### System Redeploy (`--redeploy` or `-r`)

```bash
fever apply -f manifest.yaml --redeploy
```

- **Keeps all existing dependencies** as they are.
- Forces a fresh deployment of the main contract (`PackageSystem` or `Contract`).
- For PackageSystems, this means a new system proxy is deployed, and all packages are configured from scratch.
- Useful when you need a new instance of your main system without redeploying the entire dependency tree.

### Full Redeploy (`--redeploy-all` or `--ra`)

```bash
fever apply -f manifest.yaml --redeploy-all
```

- **Wipes the slate clean.**
- Forces a fresh deployment of **all dependencies** and the **main contract**.
- Ignores all existing deployment records.
- Useful for starting from scratch on a testnet or in a local development environment.

## Dry-Run Mode

`fever apply --dry-run` runs the entire manifest validation + resolution pipeline
**without** touching the chain. It is the Kubernetes-style
`kubectl apply --dry-run=client` for smart contracts.

What it does:

1. **Loads** the manifest and runs it through the full JSON-Schema validation.
2. **Resolves** every `${ENV}` / `${env:VAR:-default}` / `${file:PATH}` placeholder.
3. **Synthesises** deterministic placeholder addresses for every declared dependency
   and resolves every `$dependencies.<key>.address` reference against them.
4. **Prints** the resolved plan: system name, raw → resolved constructor args,
   packages with `[deploy]` or `[reuse 0x…]` tags, selector counts, synthetic
   dependency addresses.
5. **Exits `0`** if everything is valid, non-zero otherwise.

What it does **not** need:

- No `PRIVATE_KEY` / no signer.
- No `RPC_URL` / no chain.
- No compiled artifacts for the target (beyond what the schema requires).

### Example

```bash
$ fever apply -f f9s/microloan-package-system.yaml --dry-run
🧪 fever apply --dry-run
   manifest: f9s/microloan-package-system.yaml

✓ Manifest parsed and validated
  Name: microloan-application
  Kind: PackageSystem
  API Version: beta/v1

📋 Resolved plan
  ────────────────────────────────────
  Diamond System:
    • MicroLoanPackageSystem
  Constructor args (raw → resolved):
    1. $dependencies.packageController.address  →  0x0000…000002
    2. $dependencies.packageViewer.address       →  0x0000…000001
    3. ${ADMIN_ADDRESS}                          →  0xf39F…9242Eb8F
  Packages:
    • LoanRegistry  [reuse 0xB7f8…84F5e]
    • LoanFunding (all) [deploy]
    • LoanRepayment (1 selector) [deploy]
    • LoanTokenManager (3 selectors) [deploy]
  Dependencies (synthetic in dry-run):
    • packageController → 0x0000…000002
    • packageViewer     → 0x0000…000001

✅ Dry-run successful — no transactions were sent.
```

:::tip Use in CI
```yaml
# .github/workflows/manifests.yml
- run: fever apply -f f9s/app.yaml --dry-run
  env:
    ADMIN_ADDRESS: ${{ vars.ADMIN_ADDRESS }}
```
:::

### Dry-run on a Network manifest

`fever apply -f f9s/networks.yml --dry-run` succeeds and reports
*"Network manifest is valid — not deployable"*. Running without `--dry-run`
 against a Network manifest **exits non-zero**: Network manifests describe
available chains, not deployments.

## Examples

### Deploy a Simple Contract

```bash
fever apply -f simple-contract.yaml
```

**manifest: simple-contract.yaml**
```yaml
apiVersion: beta/v1
kind: Contract

metadata:
  name: MyToken
  version: 1.0.0

spec:
  contract:
    name: MyToken
    constructorArgs:
      - name: name_
        type: string
        value: "My Token"
      - name: symbol_
        type: string
        value: "MTK"
      - name: initialSupply_
        type: uint256
        value: 1000000

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**Result:**
- ✅ Deploys `MyToken` contract
- ✅ Syncs to platform automatically

---

### Deploy a Contract with Dependencies

```bash
fever apply -f vault-with-token.yaml
```

**manifest: vault-with-token.yaml**
```yaml
apiVersion: beta/v1
kind: Contract

metadata:
  name: TokenVault
  version: 1.0.0

spec:
  dependencies:
    token:
      name: StableCoin
      constructorArgs:
        - name: name_
          value: "Vault USD"
        - name: symbol_
          value: "vUSD"

  contract:
    name: TokenVault
    constructorArgs:
      - name: token
        value: $dependencies.token.address  # ← Auto-injected!
      - name: owner
        value: ${OWNER_ADDRESS}

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**Result:**
- ✅ Deploys `StableCoin` first
- ✅ Captures its address automatically
- ✅ Injects address into `TokenVault` constructor
- ✅ Deploys `TokenVault`
- ✅ Syncs both contracts to platform

---

### Deploy a PackageSystem

```bash
fever apply -f microloan-system.yaml
```

**manifest: microloan-system.yaml**
```yaml
apiVersion: beta/v1
kind: PackageSystem

metadata:
  name: MicroLoanSystem
  version: 1.0.0

spec:
  # The main system proxy
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - name: controller
        value: $dependencies.packageController.address  # ← Auto-injected!
      - name: viewer
        value: $dependencies.packageViewer.address
      - name: admin
        value: ${ADMIN_ADDRESS}

  # Packages to compose into the system
  packages:
    - name: LoanRegistry      # All functions included by default

    - name: LoanFunding
      functions: "*"          # Explicitly include all functions

    - name: LoanRepayment
      functions:
        - repayNextInstallment(uint256)  # Specific function

    - name: LoanTokenManager
      functions:
        - balanceOf(address,address)
        - deposit
        - withdraw

  # External dependencies (deployed first)
  dependencies:
    packageViewer:
      name: PackageViewer
    packageController:
      name: PackageController

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**Result:**
- ✅ Deploys 2 dependencies (PackageViewer, PackageController)
- ✅ Deploys 4 packages (LoanRegistry, LoanFunding, LoanRepayment, LoanTokenManager)
- ✅ Deploys 1 system proxy (MicroLoanPackageSystem)
- ✅ Configures function routing automatically
- ✅ Syncs all 7 contracts to platform with relationships

**Time:** ~30 seconds | **Contracts:** 7 | **Scripts:** 0

---

### Deploy an Individual Package

```bash
fever apply -f loan-registry.yaml
```

**manifest: loan-registry.yaml**
```yaml
apiVersion: beta/v1
kind: Package

metadata:
  name: loan-registry-package
  version: 1.0.0

spec:
  package:
    name: LoanRegistry
    constructorArgs:
      - name: admin
        value: ${ADMIN_ADDRESS}

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**Result:**
- ✅ Deploys `LoanRegistry` package
- ✅ Can be used in PackageSystem deployments

---

## Network Selection

Networks are managed through `fever networks` - you don't specify them in manifests!

```bash
# View available networks
fever networks

# Select a network
fever networks select

# Deploy to selected network
fever apply -f manifest.yaml
```

You can override the network for a specific deployment:

```bash
# Deploy to specific chain ID
fever apply -f manifest.yaml --chainId 137

# Deploy to specific network name
fever apply -f manifest.yaml --chainName "Polygon Mainnet"
```

:::tip Network Configuration
Networks are stored in `f9s/networks.yml` and managed via `fever networks` commands.

See [Commands: networks](./networks.md) for more details.
:::

---

## Environment Variables

Manifests support environment variable substitution using `${VARIABLE_NAME}` syntax:

**`.env` file:**
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
OWNER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ORACLE_ADDRESS=0x1234567890123456789012345678901234567890
```

**Manifest:**
```yaml
spec:
  contract:
    constructorArgs:
      - value: ${ADMIN_ADDRESS}      # ← From .env
      - value: ${ORACLE_ADDRESS}     # ← From .env

  deployer:
    wallet:
      value: ${PRIVATE_KEY}          # ← From .env
```

:::warning Security
Never commit `.env` files to version control! Add `.env` to your `.gitignore`.
:::

---

## Dependency Injection

Reference deployed dependency addresses automatically using `$dependencies.name.address`:

```yaml
spec:
  dependencies:
    token:
      name: StableCoin
    oracle:
      name: PriceOracle

  contract:
    name: Vault
    constructorArgs:
      - value: $dependencies.token.address   # ← Auto-injected!
      - value: $dependencies.oracle.address  # ← Auto-injected!
      - value: ${OWNER_ADDRESS}              # ← From .env
```

**No manual address copying needed!**

---

## CI/CD Integration

Use the `--yes` flag to skip interactive confirmations:

```bash
# CI/CD deployment script
fever auth login
fever projects select
fever networks use 11155111
fever apply -f manifest.yaml --yes  # No prompt
```

:::tip Automation
For automated deployments:
1. Store credentials securely (CI secrets, vaults)
2. Use `--yes` flag to skip prompts
3. Check exit codes for success/failure
4. Parse output for contract addresses
:::

---

## Understanding the Three Manifest Types

### `kind: Contract`

For **regular smart contracts** (ERC20, NFTs, utilities):

```yaml
kind: Contract
spec:
  contract:
    name: MyToken
```

- Simple, standalone contracts
- Not part of POF architecture
- Single contract deployment

### `kind: Package`

For **individual POF packages**:

```yaml
kind: Package
spec:
  package:
    name: LoanRegistry
```

- Designed for Package-Oriented Framework
- Can be composed into PackageSystems
- Modular, reusable components

### `kind: PackageSystem`

For **complex multi-contract systems**:

```yaml
kind: PackageSystem
spec:
  system:
    name: MicroLoanPackageSystem
  packages:
    - name: LoanRegistry
    - name: LoanFunding
```

- Modular, upgradeable systems
- Bypass 24KB contract size limit
- Shared storage across packages
- Automatic function routing

📚 **Learn more:** [Deployment Manifests Guide](../manifests.md)

---

## Common Workflows

### Local Development

```bash
# Start local blockchain
fever node

# Add local network
fever networks add --local
fever networks select

# Deploy to local
fever apply -f manifest.yaml
```

### Testnet Deployment

```bash
# Select testnet
fever networks select
# Choose "Sepolia" or your preferred testnet

# Deploy
fever apply -f manifest.yaml

# View on platform
open https://cli.fevertokens.app/dashboard
```

### Mainnet Deployment

```bash
# Use hardware wallet or secure key management!

# Select mainnet
fever networks use 1

# Review deployment preview carefully
fever apply -f manifest.yaml

# Confirm after thorough review
```

:::danger Mainnet Security
For production deployments:
- ✅ Use hardware wallets (Ledger, Trezor)
- ✅ Test thoroughly on testnet first
- ✅ Review deployment preview carefully
- ✅ Start with small amounts
- ❌ Never use test private keys
- ❌ Never commit credentials
:::

---

## Troubleshooting

### "Contract already deployed"

If you see this message but want to redeploy:

```bash
# Redeploy main contract, keep dependencies
fever apply -f manifest.yaml --redeploy

# Redeploy everything from scratch
fever apply -f manifest.yaml --redeploy-all
```

### "Dependency not found"

Make sure dependencies are defined before they're referenced:

```yaml
spec:
  # Define dependencies first
  dependencies:
    token:
      name: StableCoin

  # Then reference them
  contract:
    constructorArgs:
      - value: $dependencies.token.address  # ✅ Correct
```

### "Environment variable not found"

Ensure your `.env` file exists and contains the required variables:

```bash
# Check .env file
cat .env

# Variables used in manifest must be defined
PRIVATE_KEY=0x...
ADMIN_ADDRESS=0x...
```

### Network Issues

If network connection fails:

```bash
# Check available networks
fever networks

# Verify network selection
fever networks status

# Test RPC connection
fever networks select
```

---

## Related Commands

- **[compile](./compile.md)** - Compile contracts before deployment
- **[networks](./networks.md)** - Manage networks
- **[projects](./projects.md)** - Manage projects
- **[artifacts](./artifacts.md)** - Sync artifacts after deployment

---

## Learn More

- **[Deployment Manifests Guide](../manifests.md)** - Complete manifest reference
- **[Getting Started](../getting-started.md)** - First deployment tutorial
- **[Quickstart Tutorial](../quickstart.md)** - Deploy a complete system
- **[Configuration](../configuration.md)** - Environment setup
- **[POF Architecture](https://github.com/FeverTokens/packages)** - Package-Oriented Framework

---

**Deploy smarter, not harder. Use `fever apply` for all your smart contract deployments.**
