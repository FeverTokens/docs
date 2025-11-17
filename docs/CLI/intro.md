---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
slug: /cli/intro
---

# Introduction to Fever CLI

**Stop writing deployment scripts. Start declaring what you want.**

Fever CLI transforms smart contract deployment from hours of manual scripting to seconds of declarative configuration. Deploy everything from simple ERC20 tokens to complex, modular systems with a single command.

## The Problem

Traditional smart contract deployment is painful and error-prone:

- ❌ **Write custom scripts** for every contract and network
- ❌ **Manually copy-paste addresses** between dependent contracts
- ❌ **Track deployments** in spreadsheets or JSON files
- ❌ **Repeat everything** for each network
- ❌ **Hit the 24KB contract size limit** with no workaround
- ❌ **Can't upgrade** without full redeployment and data migration

**Result:** Deploying a 7-contract system takes **4-6 hours per network** with high error rates.

## The Solution

Fever CLI uses **manifest-driven deployment** powered by the **Package-Oriented Framework (POF)**:

```yaml
# Define what you want in YAML
kind: PackageSystem
spec:
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - $dependencies.packageController.address  # ← Auto-injected!

  packages:
    - name: LoanRegistry
    - name: LoanFunding
    - name: LoanRepayment
```

**One command deploys everything:**

```bash
fever apply -f manifest.yaml
```

**Result:** 7 contracts deployed, linked, and tracked in **30 seconds**. No scripts. No errors. No limits.

:::tip Time Savings
**Traditional approach:** 4-6 hours per network
**Fever CLI approach:** 30 seconds
**Time saved: 85-95%** | **Error rate: Near zero**
:::

---

## What is Fever CLI?

Fever CLI is a revolutionary command-line tool that provides:

### 🎯 Manifest-Driven Deployment

Define your entire contract system in declarative YAML manifests:

- **Three deployment types:** `Contract`, `Package`, `PackageSystem`
- **Auto dependency resolution:** `$dependencies.name.address` injection
- **Environment variables:** Secure credential management
- **Network agnostic:** Deploy to any network with `fever networks select`

**No more deployment scripts. Ever.**

### 💎 Package-Oriented Framework (POF)

Build modular, upgradeable systems that bypass the 24KB contract size limit:

- **♾️ Unlimited contract size** - Split logic across multiple packages
- **🔄 Modular upgrades** - Replace individual packages without full redeployment
- **🗄️ Shared storage** - All packages access the same state through a system proxy
- **🧩 Clean architecture** - Like microservices for smart contracts

📚 **Learn more about POF:** [Packages Repository](https://github.com/FeverTokens/packages)

### ⚡ Developer Experience

Everything you need in one tool:

- **Smart compilation** - Auto-detects Solidity versions, parallel builds
- **Local development** - Built-in Anvil blockchain node
- **Network management** - Add, switch, and configure networks easily
- **Wallet tools** - Generate secure wallets with `.env` integration
- **Artifact management** - Git-like status with 70-90% bandwidth savings

### 🔐 Platform Integration

Every deployment automatically syncs to the [Fever Platform](https://cli.fevertokens.app):

- **📊 Deployment dashboard** - Visual graphs and transaction history
- **📁 Project organization** - Group related contracts
- **🔍 Contract explorer** - Browse ABIs and bytecode
- **📈 Analytics** - Track gas usage and deployment metrics

### 🌐 CREATE2 Deterministic Deployments

**Enabled by default** for cross-chain consistency:

- **Same address everywhere** - Ethereum, Polygon, Arbitrum, etc.
- **Predictable addresses** - Know addresses before deployment
- **No configuration needed** - Works out of the box

---

## Before vs After

### Traditional Deployment (Hardhat/Foundry)

```javascript
// deploy.js - Hours of manual scripting
const PackageViewer = await ethers.getContractFactory('PackageViewer')
const viewer = await PackageViewer.deploy()
await viewer.deployed()

const PackageController = await ethers.getContractFactory('PackageController')
const controller = await PackageController.deploy()
await controller.deployed()

// ... 5 more contracts

// Manually copy-paste addresses (error-prone!)
const System = await ethers.getContractFactory('MicroLoanPackageSystem')
const system = await System.deploy(
  controller.address,  // ← Did I get this right?
  viewer.address       // ← Is this the correct order?
)

// Configure function routing manually...
// Track deployments in JSON files...
// Write tests to verify...
// Repeat for each network...
```

**Time:** 4-6 hours per network | **Error rate:** High | **Maintainability:** Low

### Fever CLI Deployment

```yaml
# manifest.yaml - 35 lines of YAML
kind: PackageSystem
spec:
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - $dependencies.packageController.address  # ← Auto-injected!
      - $dependencies.packageViewer.address

  packages:
    - name: LoanRegistry
    - name: LoanFunding
    # ... more packages

  dependencies:
    packageViewer:
      name: PackageViewer
    packageController:
      name: PackageController
```

```bash
# One command - done in seconds
fever apply -f manifest.yaml
```

**Result:**
- ✅ 7 contracts deployed in correct order
- ✅ All addresses automatically resolved
- ✅ Function routing configured
- ✅ Synced to platform with full tracking
- ✅ Works on any network (just `fever networks select`)

**Time:** 30 seconds | **Error rate:** Near zero | **Maintainability:** High

---

## Key Features

### Manifest-Driven Architecture

- **📝 Declarative configuration** - YAML manifests instead of scripts
- **🔄 Auto dependency resolution** - No manual address management
- **🎯 Three deployment types** - Contract, Package, PackageSystem
- **🌐 Network management** - Centralized configuration via `fever networks`

### Package-Oriented Framework (POF)

- **💎 Modular architecture** - Build systems from reusable packages
- **♾️ Unlimited contract size** - Bypass 24KB limit by splitting logic
- **🔄 Upgradeable systems** - Replace individual packages without redeployment
- **🧩 Shared storage** - All packages access same state through proxy

### Platform Integration

- **🔐 Secure authentication** - Device-code flow with Fever platform
- **📁 Project management** - Organize contracts by project
- **⚡ Smart artifact sync** - 70-90% bandwidth savings with change detection
- **📊 Deployment tracking** - Visual graphs, ABIs, transaction history

### Developer Tools

- **🔨 Smart compilation** - Auto-version detection, parallel builds
- **🎯 CREATE2 support** - Deterministic cross-chain deployments (default!)
- **🌐 Local development** - Built-in Anvil blockchain nodes
- **💰 Wallet tools** - Generate wallets with `fever wallets generate`

---

## Who Should Use Fever CLI?

### Smart Contract Developers
Eliminate deployment scripts and focus on building great contracts. Compile, deploy, and track everything with simple commands.

### DeFi Engineers
Manage complex protocol deployments with intricate dependencies. Deploy multi-contract systems in seconds, not hours.

### Web3 Teams
Standardize your development and deployment processes across your entire team. One tool, one workflow, zero confusion.

### dApp Builders
Accelerate your time-to-market with deterministic deployments and automatic platform tracking. Ship faster, with confidence.

---

## Common Use Cases

### Rapid Prototyping
```bash
fever node                    # Start local blockchain
fever compile --all          # Compile contracts
fever apply -f manifest.yaml # Deploy system
# Done in 2 minutes! 🚀
```

### Multi-Chain Deployments
Deploy to the same address on multiple chains with CREATE2:
```bash
fever networks use 1         # Ethereum
fever apply -f manifest.yaml # Address: 0x1234...

fever networks use 137       # Polygon
fever apply -f manifest.yaml # Address: 0x1234... ✅ Same address!
```

### Complex System Composition
Build sophisticated applications using POF:
```yaml
kind: PackageSystem
spec:
  packages:
    - name: LoanRegistry
    - name: LoanFunding
    - name: LoanRepayment
    - name: LoanTokenManager
# 7 contracts, 1 command, 30 seconds ⚡
```

### Modular Upgrades
Replace individual packages without touching others:
```bash
# Update LoanFunding package in manifest
fever apply -f manifest.yaml --redeploy
# Only LoanFunding redeployed, data preserved! ✅
```

### CI/CD Automation
Integrate Fever CLI into your CI/CD pipelines:
```bash
fever auth login
fever projects select
fever networks use 11155111
fever apply -f manifest.yaml --yes  # No interactive prompt
```

---

## What Makes Fever CLI Different?

### vs. Hardhat/Foundry Scripts

| Feature | Hardhat/Foundry | Fever CLI |
|---------|----------------|-----------|
| **Deployment** | Custom scripts | Declarative manifests |
| **Address Management** | Manual copy-paste | Automatic injection |
| **Multi-network** | Repeat scripts | Same manifest |
| **Tracking** | JSON files | Platform dashboard |
| **Time per deploy** | 4-6 hours | 30 seconds |
| **Contract size limit** | 24KB | Unlimited (POF) |
| **Upgradeable** | Complex proxies | Modular packages |

### vs. Traditional Tools

- **No scripts to maintain** - Just edit YAML
- **No address management** - Auto-injected dependencies
- **No deployment tracking** - Automatic platform sync
- **No size limits** - Split logic across packages
- **No upgrade complexity** - Replace packages independently

---

## Getting Started

Ready to revolutionize your deployment workflow?

1. **📦 [Install Fever CLI](./installation.md)** - One npm command
2. **🚀 [Quick Start Tutorial](./quickstart.md)** - Deploy a complete system in 15 minutes
3. **📖 [Read the Manifest Guide](./manifests.md)** - Learn the three deployment types
4. **🎯 [Getting Started Guide](./getting-started.md)** - Set up authentication and projects

:::tip Start with the Quickstart
We highly recommend starting with our **[Interactive Quickstart Tutorial](./quickstart.md)**. You'll deploy a real DeFi lending system and learn manifest-driven deployment by doing.

**Duration:** 15-20 minutes | **Level:** Beginner to Advanced
:::

---

## What's New

**Latest Features (v0.0.15+):**

- 💎 **Package-Oriented Framework (POF)** - Build modular, upgradeable systems
- 📝 **Three Manifest Types** - Contract, Package, PackageSystem
- ♾️ **Unlimited Contract Size** - Bypass 24KB limit with PackageSystem
- 🎯 **CREATE2 Deterministic Deployments** - Enabled by default
- 🌐 **Enhanced Network Management** - Mainnet/testnet filtering
- 💰 **Wallet Tools** - Generate wallets with auto `.env` creation
- 🔄 **Smart Artifact Sync** - 70-90% bandwidth savings
- 📦 **Package Manager Detection** - Auto-detect npm, yarn, pnpm, bun

---

## Need Help?

- **📚 Documentation:** Browse the guides in this section
- **🎓 Quickstart:** [Interactive Tutorial](./quickstart.md)
- **🌐 Platform:** [Fever CLI Platform](https://cli.fevertokens.app)
- **💬 Support:** [GitHub Issues](https://github.com/FeverTokens/fever-cli/issues)
- **📖 POF Guide:** [Packages Repository](https://github.com/FeverTokens/packages)

---

**Start deploying smarter today. Install Fever CLI and experience the future of smart contract deployment.**

```bash
npm install -g @fevertokens/cli
fever --version
```
