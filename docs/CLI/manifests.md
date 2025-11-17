---
id: manifests
title: Deployment Manifests
sidebar_label: Manifests
sidebar_position: 4
slug: /cli/manifests
---

# Deployment Manifests

**Stop writing deployment scripts. Start declaring what you want.**

Fever CLI uses **manifest-driven deployment** - you define your entire smart contract system in a single YAML file, and Fever handles all the complexity: compilation, dependency resolution, deployment order, address injection, and platform tracking.

One command deploys everything:

```bash
fever apply -f manifest.yaml
```

## The Three Manifest Types

Fever CLI supports three deployment patterns, each optimized for different use cases:

| Type | Use Case | Contracts Deployed | Upgradeable | Size Limit |
|------|----------|-------------------|-------------|------------|
| **`Contract`** | Single standalone contracts | 1 main + optional deps | ❌ No | 24KB per contract |
| **`Package`** | Individual POF components | 1 package + optional deps | ❌ No | 24KB per package |
| **`PackageSystem`** | Complex modular systems | 1 system + N packages | ✅ Yes | ♾️ Unlimited |

:::tip Quick Decision Guide
- **Building an ERC20, NFT, or simple contract?** → Use `Contract`
- **Building a modular package for composition?** → Use `Package`
- **Building a complex system with 3+ contracts?** → Use `PackageSystem`
- **Need to bypass the 24KB size limit?** → Use `PackageSystem`
- **Need upgradeable contracts?** → Use `PackageSystem`
:::

---

## Contract Manifests

### When to Use `kind: Contract`

Use Contract manifests for **regular smart contracts** that don't follow the Package-Oriented Framework (POF) architecture:

- ✅ ERC20 tokens, NFTs (ERC721/ERC1155)
- ✅ Simple utilities and standalone contracts
- ✅ Standard OpenZeppelin implementations
- ✅ Contracts under 24KB in size
- ❌ Complex multi-contract systems (use PackageSystem instead)

### Basic Example

Deploy a simple ERC20 token:

```yaml
apiVersion: beta/v1
kind: Contract

metadata:
  name: stable-coin-deployment
  version: 1.0.0
  description: Deploy MockUSDC stablecoin

spec:
  contract:
    name: StableCoin
    constructorArgs:
      - name: name_
        type: string
        value: MockUSDC
      - name: symbol_
        type: string
        value: mUSDC
      - name: decimals_
        type: uint8
        value: 6

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}  # From .env file
```

**Deploy:**
```bash
fever apply -f stablecoin.yaml
```

### Contract with Dependencies

Deploy a contract that depends on another contract:

```yaml
apiVersion: beta/v1
kind: Contract

metadata:
  name: token-vault-deployment
  version: 1.0.0

spec:
  # Dependencies are deployed first
  dependencies:
    tokenContract:
      name: StableCoin
      constructorArgs:
        - name: name_
          value: Vault Token
        - name: symbol_
          value: VUSD

  # Main contract with auto-injected dependency address
  contract:
    name: TokenVault
    constructorArgs:
      - name: token
        type: address
        value: $dependencies.tokenContract.address  # ← Auto-injected!
      - name: owner
        type: address
        value: ${OWNER_ADDRESS}

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**What happens:**
1. ✅ Deploys `StableCoin` first
2. ✅ Captures its address automatically
3. ✅ Injects address into `TokenVault` constructor
4. ✅ Deploys `TokenVault` with correct reference
5. ✅ Syncs both contracts to platform

**Time saved:** No manual address copying, no deployment scripts!

---

## Package Manifests

### When to Use `kind: Package`

Use Package manifests for **individual packages** designed with the Package-Oriented Framework (POF):

- ✅ Modular components designed for composition
- ✅ Packages that will be added to a PackageSystem
- ✅ Reusable contract modules
- ❌ Standalone contracts (use Contract instead)
- ❌ Complete systems (use PackageSystem instead)

:::info What is POF?
**Package-Oriented Framework (POF)** is FeverTokens's architecture for building modular, upgradeable smart contract systems. Think of it like **microservices for smart contracts** - specialized packages that work together through a system proxy.

📚 **Learn more:** [POF Architecture Guide](https://github.com/FeverTokens/packages)
:::

### Basic Example

Deploy an individual package:

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
        type: address
        value: ${ADMIN_ADDRESS}

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

**Deploy:**
```bash
fever apply -f loan-registry.yaml
```

### Package with Dependencies

```yaml
apiVersion: beta/v1
kind: Package

metadata:
  name: loan-funding-package
  version: 1.0.0

spec:
  dependencies:
    tokenManager:
      name: TokenManager

  package:
    name: LoanFunding
    constructorArgs:
      - name: tokenManager
        value: $dependencies.tokenManager.address  # ← Auto-injected!

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
```

---

## PackageSystem Manifests

### When to Use `kind: PackageSystem`

Use PackageSystem manifests for **complex, modular systems** using POF architecture:

- ✅ **Multi-contract systems** (3+ interconnected contracts)
- ✅ **Large contracts** that exceed the 24KB size limit
- ✅ **Upgradeable systems** that need modular updates
- ✅ **DeFi protocols**, DAOs, complex dApps
- ✅ Systems that need **shared storage** across packages

### Why PackageSystem?

| Challenge | Traditional Approach | PackageSystem Solution |
|-----------|---------------------|----------------------|
| **Contract Size** | Hit 24KB limit, can't deploy | ♾️ Split logic across unlimited packages |
| **Upgrades** | Redeploy everything, lose state | 🔄 Replace individual packages, keep data |
| **Complexity** | Monolithic contract, hard to maintain | 🧩 Modular packages, clean separation |
| **Deployment** | Manual scripts, error-prone | 🎯 One manifest, automated deployment |
| **State Management** | Separate storage per contract | 🗄️ Shared storage through system proxy |

### Architecture Overview

```
┌─────────────────────────────────────┐
│  MicroLoanPackageSystem (System)    │  ← Users interact with this address
│                                     │
│  User calls: createLoan()           │
│      ↓                              │
│  System routes to correct package   │
└─────────────────────────────────────┘
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Loan   │  │ Loan   │  │ Loan   │  ← Modular packages
    │Registry│  │Funding │  │Repay   │     (upgradeable)
    └────────┘  └────────┘  └────────┘
```

**Key Benefits:**
- **One address** for users (the System)
- **Unlimited size** by splitting logic
- **Modular upgrades** - replace packages independently
- **Shared storage** - all packages access same data

📚 **Learn more:** [POF Architecture Guide](https://github.com/FeverTokens/packages)

### Basic Example

Deploy a complete multi-contract system:

```yaml
apiVersion: beta/v1
kind: PackageSystem

metadata:
  name: microloan-application
  version: 1.0.0
  description: Complete DeFi lending system with 7 contracts

spec:
  # The main system proxy (what users interact with)
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - name: controller
        value: $dependencies.packageController.address  # ← Auto-injected!
      - name: viewer
        value: $dependencies.packageViewer.address
      - name: admin
        type: address
        value: ${ADMIN_ADDRESS}

  # Packages to compose into the system
  packages:
    # Include all functions (default)
    - name: LoanRegistry

    # Explicitly include all functions
    - name: LoanFunding
      functions: '*'

    # Include specific function by signature
    - name: LoanRepayment
      functions:
        - repayNextInstallment(uint256)

    # Include multiple specific functions
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

**Deploy:**
```bash
fever apply -f microloan-system.yaml
```

**What happens:**
1. ✅ Deploys 2 dependencies (PackageViewer, PackageController)
2. ✅ Deploys 4 packages (LoanRegistry, LoanFunding, LoanRepayment, LoanTokenManager)
3. ✅ Deploys 1 system proxy (MicroLoanPackageSystem)
4. ✅ Configures function routing automatically
5. ✅ Syncs all 7 contracts to platform with relationships

**Result:** 7 contracts deployed, linked, and tracked in ~30 seconds!

### Function Routing Options

Control which functions are exposed from each package:

```yaml
packages:
  # Option 1: Include all functions (omit 'functions' field)
  - name: LoanRegistry

  # Option 2: Explicitly include all functions
  - name: LoanFunding
    functions: '*'

  # Option 3: Include by function name (no parameters)
  - name: LoanTokenManager
    functions:
      - deposit      # Matches any deposit(...) signature
      - withdraw

  # Option 4: Include by full signature (precise control)
  - name: LoanRepayment
    functions:
      - repayNextInstallment(uint256)
      - getLoanStatus(uint256)

  # Option 5: Include by function selector (advanced)
  - name: AdvancedPackage
    functions:
      - '0xc19fa698'  # Specific function selector
```

### Package with Constructor Args

Packages can have their own constructor arguments:

```yaml
spec:
  packages:
    - name: PriceOracle
      constructorArgs:
        - name: chainlinkOracle
          type: address
          value: ${CHAINLINK_ORACLE_ADDRESS}
      functions: '*'
```

### Package with Initializer

Some packages need initialization after deployment:

```yaml
spec:
  packages:
    - name: RewardSystem
      functions: '*'
      initializer:
        function: initialize
        arguments:
          - name: rewardToken
            type: address
            value: ${REWARD_TOKEN_ADDRESS}
          - name: rate
            type: uint256
            value: 100
```

---

## Common Manifest Patterns

### Environment Variables

Use environment variables for sensitive data:

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

### Dependency Injection

Reference deployed dependency addresses automatically:

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

### Network Management

Networks are managed through `fever networks` - no need to specify in manifests!

```bash
# Add networks
fever networks add --local
fever networks add --name "Polygon" --rpc "https://polygon-rpc.com" --chainId 137

# Select network for deployment
fever networks select

# Deploy to selected network
fever apply -f manifest.yaml
```

Networks are stored in `f9s/networks.yml`.

:::tip
You can override the network for a specific deployment:
```bash
fever apply -f manifest.yaml --chainId 137
fever apply -f manifest.yaml --chainName "Polygon Mainnet"
```
:::

### CREATE2 Deterministic Deployments

CREATE2 is **enabled by default** for deterministic cross-chain deployments:

```yaml
apiVersion: beta/v1
kind: Contract

spec:
  contract:
    name: MyContract
  # CREATE2 automatically enabled with project-based salt
```

**Result:** Same address on Ethereum, Polygon, Arbitrum, etc.!

**Custom salt:**
```yaml
spec:
  deployment:
    create2:
      salt: "myproject-mainnet-v1.0.0"  # Custom salt
```

**Disable CREATE2:**
```yaml
spec:
  deployment:
    create2:
      enabled: false  # Use traditional CREATE
```

📚 **Learn more:** See README.md section on CREATE2

---

## Comparison Table

| Feature | `Contract` | `Package` | `PackageSystem` |
|---------|-----------|-----------|-----------------|
| **Architecture** | Regular contract | POF component | POF system |
| **Manifest Field** | `spec.contract` | `spec.package` | `spec.system` + `spec.packages` |
| **Contracts** | 1 main + deps | 1 package + deps | 1 system + N packages |
| **Dependencies** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Auto-injection** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Size Limit** | 24KB | 24KB | ♾️ Unlimited |
| **Upgradeable** | ❌ No | ❌ No | ✅ Yes (modular) |
| **Shared Storage** | N/A | N/A | ✅ Yes |
| **Function Routing** | N/A | N/A | ✅ Automatic |
| **Use Case** | Tokens, NFTs | POF components | Complex systems |
| **Complexity** | Simple | Simple | Advanced |
| **Deploy Command** | `fever apply` | `fever apply` | `fever apply` |

---

## Best Practices

### 1. Use Environment Variables for Secrets

❌ **Never hardcode private keys:**
```yaml
deployer:
  wallet:
    value: "0xac0974bec39..."  # ❌ DON'T DO THIS!
```

✅ **Always use environment variables:**
```yaml
deployer:
  wallet:
    value: ${PRIVATE_KEY}  # ✅ From .env file
```

### 2. Use Dependency Injection

❌ **Don't hardcode addresses:**
```yaml
contract:
  constructorArgs:
    - value: "0x1234..."  # ❌ Manual address
```

✅ **Let Fever inject them:**
```yaml
dependencies:
  token:
    name: Token

contract:
  constructorArgs:
    - value: $dependencies.token.address  # ✅ Auto-injected
```

### 3. Organize by Environment

Keep separate manifests for different networks:

```
f9s/
├── local/
│   └── microloan-system.yaml
├── testnet/
│   └── microloan-system.yaml
└── mainnet/
    └── microloan-system.yaml
```

### 4. Use Descriptive Metadata

```yaml
metadata:
  name: microloan-production-v1
  version: 1.0.0
  description: Production DeFi lending system for Ethereum mainnet
```

### 5. Test Locally First

```bash
# Start local node
fever node

# Deploy to local
fever networks use 1337
fever apply -f manifest.yaml

# Test thoroughly, then deploy to testnet
fever networks use 11155111
fever apply -f manifest.yaml
```

---

## Next Steps

- **Deploy your first contract:** Follow the [Getting Started](./getting-started.md) guide
- **Explore commands:** See [Commands: apply](./commands/apply.md)
- **Learn POF architecture:** Visit the [Packages Repository](https://github.com/FeverTokens/packages)
- **Try the quickstart:** Complete [Quickstart Tutorial](./quickstart.md)

---

## Need Help?

- **Command reference:** Run `fever apply --help`
- **Troubleshooting:** See [Troubleshooting Guide](./troubleshooting.md)
- **Platform:** Visit [Fever CLI Platform](https://cli.fevertokens.app)
- **Examples:** Check [Example Manifests](https://github.com/FeverTokens/microloan-packages/tree/main/f9s)
