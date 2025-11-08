---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 3
slug: /cli/getting-started
---

# Getting Started

Welcome to Fever CLI! This guide will get you from installation to your first deployment in **under 10 minutes**.

You'll learn how to:
- ✅ Authenticate with the Fever platform
- ✅ Create and manage projects
- ✅ Compile smart contracts automatically
- ✅ Deploy your first contract with a manifest

:::tip Want to Jump Right In?
If you prefer learning by deploying a complete system, check out our **[Interactive Quickstart Tutorial](./quickstart.md)**. You'll deploy a 7-contract DeFi lending system in 15 minutes!
:::

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v20.x or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **GitHub** or **Google** account for platform authentication

---

## Step 1: Install Fever CLI

Install globally using npm:

```bash
npm install -g @fevertokens/cli
```

Verify the installation:

```bash
fever --version
```

You should see the version number (e.g., `0.0.15`).

:::info What You Just Installed
Fever CLI includes everything you need:
- Smart contract compiler with auto-version detection
- Manifest-driven deployment engine
- Local blockchain node (Anvil wrapper)
- Network and project management
- Smart artifact sync with the Fever platform
:::

---

## Step 2: Authenticate with the Fever Platform

Connect your CLI to your Fever developer account:

```bash
fever auth login
```

**What happens:**
1. 🌐 Your browser opens automatically
2. 📝 You'll see a device code on the page
3. ✅ Sign in with **Google** or **GitHub**
4. 🔐 Authorize Fever CLI
5. ✨ Return to terminal - you're connected!

Verify your authentication:

```bash
fever auth status
```

You should see:
```
✅ Authenticated as: your-email@example.com
✅ Access token valid
```

:::tip Why Authenticate?
Authentication enables:
- 📁 **Project management** - Organize your contracts
- 📊 **Deployment tracking** - Visual dashboard for all deployments
- 🔄 **Smart artifact sync** - Automatic contract storage
- 👥 **Team collaboration** - Share projects with team members
:::

---

## Step 3: Create Your First Project

Projects organize your contracts, deployments, and artifacts on the Fever platform.

Create a new project:

```bash
fever projects create --name "My First Project"
```

The CLI automatically selects this project for you. You can switch between projects anytime:

```bash
fever projects         # List all your projects
fever projects select  # Interactive project selection
```

:::note Project Storage
Your selected project is stored locally in `.fever/platform.json` in your current directory. Each workspace can have its own project selection.
:::

---

## Step 4: Quick Win - Deploy an ERC20 Token

Let's deploy something! We'll create a simple ERC20 token manifest and deploy it to a local blockchain.

### 4.1 Start a Local Blockchain

In a **separate terminal**, start a local Anvil node:

```bash
fever node
```

You'll see:
```
🚀 Starting Fever Local Blockchain...
📦 Using tool: anvil
⛓️  Chain ID: 1337
👥 Accounts: 10
🌐 Port: 8545

✅ Blockchain node is running!
```

:::info Don't Have Anvil?
Install Foundry (includes Anvil):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```
:::

**Keep this terminal open!** Open a new terminal for the next steps.

### 4.2 Add Local Network

In your **new terminal**, add the local network:

```bash
fever networks add --local
```

This creates `f9s/networks.yml` with your local network configuration.

Select it for deployment:

```bash
fever networks select
# Choose "Localhost" from the list
```

### 4.3 Create an Environment File

Create a `.env` file with a test wallet (Anvil's pre-funded account):

```bash
cat > .env << 'EOF'
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
OWNER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
EOF
```

:::warning Security Note
This is a **test account** for local development only. **Never** use these credentials on mainnet or public testnets!
:::

### 4.4 Create a Deployment Manifest

Create a directory for manifests and write your first manifest:

```bash
mkdir -p f9s
cat > f9s/my-token.yaml << 'EOF'
apiVersion: beta/v1
kind: Contract

metadata:
  name: my-first-token
  version: 1.0.0
  description: My first ERC20 token deployment

spec:
  contract:
    name: MyToken
    constructorArgs:
      - name: name_
        type: string
        value: My First Token
      - name: symbol_
        type: string
        value: MFT
      - name: initialSupply_
        type: uint256
        value: 1000000000000000000000  # 1000 tokens with 18 decimals

  deployer:
    wallet:
      type: privateKey
      value: ${PRIVATE_KEY}
EOF
```

:::tip What is a Manifest?
A **manifest** is a declarative YAML file that defines:
- What contracts to deploy
- Constructor arguments
- Dependencies between contracts
- Deployment configuration

**No scripts needed!** Just describe what you want.

📚 Learn more: [Deployment Manifests Guide](./manifests.md)
:::

### 4.5 Create the Contract

Create a simple ERC20 contract:

```bash
mkdir -p contracts
cat > contracts/MyToken.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply_);
    }
}
EOF
```

Install dependencies:

```bash
npm init -y
npm install @openzeppelin/contracts
```

### 4.6 Compile

Compile your contract with auto-version detection:

```bash
fever compile --all
```

**What happens:**
- ✅ Auto-detects Solidity version from `pragma` statement
- ✅ Downloads the correct compiler
- ✅ Compiles with optimization
- ✅ Generates artifacts in `.fever/` directory

You'll see:
```
✅ Compiled MyToken successfully
```

### 4.7 Deploy!

Deploy with one command:

```bash
fever apply -f f9s/my-token.yaml
```

**Magic happens:**
1. ✅ Loads manifest and validates configuration
2. ✅ Resolves `${PRIVATE_KEY}` from `.env`
3. ✅ Connects to local blockchain (Chain ID: 1337)
4. ✅ Deploys `MyToken` contract
5. ✅ **Syncs to Fever platform automatically** 🎯

You'll see:
```
🚀 Starting deployment from manifest...
📄 Loaded manifest: my-first-token (v1.0.0)
🔌 Connected to network (Chain ID: 1337)
⚡ Deploying MyToken...
✅ Deployed MyToken to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📡 Syncing deployment to platform...
✅ Deployment synced successfully!

🎉 Deployment complete!
   Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**🎉 Congratulations! You just deployed your first contract with Fever CLI!**

---

## Step 5: View on Fever Platform

Visit the [Fever CLI Platform](https://cli.fevertokens.app/dashboard) and sign in.

**You'll see:**
- ✅ **Your Project** - "My First Project"
- ✅ **MyToken Contract** - With address and transaction hash
- ✅ **Network Info** - Chain ID 1337 (Localhost)
- ✅ **Contract ABI** - Ready for frontend integration
- ✅ **Transaction Details** - Gas used, block number

**This is the power of automatic platform sync** - instant visibility with zero extra work!

---

## Step 6: Check Artifact Status

Fever CLI includes Git-like artifact management. Check your contract's sync status:

```bash
fever artifacts status
```

You'll see:
```
Contract Artifacts Status:

  🟢 MyToken - Synced (local matches platform)

Legend:
  🔴 Untracked - New contract, not synced
  🟡 Modified - Local changes detected
  🟢 Synced - Up-to-date on platform
```

:::tip Smart Artifact Sync
Fever CLI only syncs **changed contracts**, saving **70-90% bandwidth**!

```bash
fever artifacts sync          # Smart sync (only changed)
fever artifacts sync --all    # Force sync all contracts
```

📚 Learn more: [Commands: artifacts](./commands/artifacts.md)
:::

---

## What You Just Accomplished

In under 10 minutes, you:

✅ **Installed** Fever CLI
✅ **Authenticated** with the platform
✅ **Created** a project
✅ **Started** a local blockchain
✅ **Compiled** a smart contract (auto-version detection)
✅ **Created** a declarative manifest (no scripts!)
✅ **Deployed** to blockchain in one command
✅ **Synced** to platform automatically

**Traditional approach:** 2-3 hours
**Fever CLI approach:** 10 minutes
**Time saved: 95%** ⚡

---

## What's Next?

Now that you've mastered the basics, explore these powerful features:

### 🚀 Deploy a Complete System

Try the **[Interactive Quickstart](./quickstart.md)** to deploy a 7-contract DeFi lending system with PackageSystem architecture.

### 📖 Learn Manifest Types

Read the **[Deployment Manifests Guide](./manifests.md)** to understand:
- `kind: Contract` - Simple contracts
- `kind: Package` - POF components
- `kind: PackageSystem` - Complex modular systems

### 🌐 Deploy to Testnets

Add public test networks:

```bash
# View available networks
fever networks

# Add Sepolia testnet
fever networks select
# Choose "Sepolia" from the list

# Deploy to testnet
fever apply -f f9s/my-token.yaml
```

:::tip Get Testnet Funds
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **Mumbai Faucet:** https://faucet.polygon.technology/
:::

### 💎 Build with PackageSystem

Learn about the **Package-Oriented Framework (POF)** for building:
- Modular, upgradeable systems
- Contracts that bypass the 24KB limit
- Complex DeFi protocols and DAOs

📚 **POF Guide:** [Packages Repository](https://github.com/FeverTokens/packages)

### 🎯 Explore Commands

```bash
fever compile --help        # Smart compilation
fever apply --help          # Manifest deployment
fever networks --help       # Network management
fever artifacts --help      # Artifact sync
fever wallets generate      # Generate secure wallets
```

### 📚 Advanced Features

- **[Advanced Usage](./advanced-usage.md)** - Complex deployments
- **[Configuration](./configuration.md)** - Environment setup
- **[Troubleshooting](./troubleshooting.md)** - Common issues

---

## Common Next Steps

### Generate a Production Wallet

For testnets and mainnet, generate a secure wallet:

```bash
fever wallets generate
```

This creates a new Ethereum wallet and offers to save credentials to your `.env` file.

:::warning Mainnet Security
For mainnet deployments:
- Use hardware wallets (Ledger, Trezor)
- Never commit `.env` to version control
- Store private keys securely (password managers, vaults)
:::

### Deploy to Multiple Networks

Deploy the same contract to multiple chains:

```bash
# Deploy to Sepolia
fever networks use 11155111
fever apply -f f9s/my-token.yaml

# Deploy to Polygon Mumbai
fever networks use 80001
fever apply -f f9s/my-token.yaml

# Same manifest works everywhere! 🎯
```

With **CREATE2** (enabled by default), you can even deploy to the **same address** on every chain!

### Organize Your Manifests

Create a structure for different environments:

```
f9s/
├── local/
│   └── my-token.yaml
├── testnet/
│   └── my-token.yaml
└── mainnet/
    └── my-token.yaml
```

---

## Quick Reference

```bash
# Authentication
fever auth login
fever auth status
fever auth logout

# Projects
fever projects
fever projects create --name "Project Name"
fever projects select

# Networks
fever networks                    # List networks
fever networks select             # Interactive selection
fever networks add --local        # Add localhost

# Development
fever node                        # Start local blockchain
fever compile --all              # Compile contracts
fever artifacts status            # Check sync status
fever artifacts sync             # Smart sync

# Deployment
fever apply -f manifest.yaml      # Deploy from manifest
```

---

## Need Help?

- **📚 Full Documentation:** Browse guides in this section
- **🎓 Interactive Tutorial:** [Quickstart](./quickstart.md)
- **📖 Manifest Guide:** [Deployment Manifests](./manifests.md)
- **💬 Support:** [GitHub Issues](https://github.com/FeverTokens/fever-cli/issues)
- **🌐 Platform:** [Fever CLI Dashboard](https://cli.fevertokens.app)

---

**You're ready to build! Start deploying smarter with Fever CLI.** 🔥
