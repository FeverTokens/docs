---
id: quickstart
title: Quickstart Tutorial
sidebar_label: Quickstart
sidebar_position: 2
slug: /cli/quickstart
---

# Quickstart Tutorial

## Why Fever CLI?

**The Problem**: Traditional smart contract deployment is tedious. You write deployment scripts, manually manage addresses, track dependencies, and coordinate multi-contract systems. When you deploy 5-8 interconnected contracts, the complexity explodes.

**The Solution**: Fever CLI uses **manifest-driven deployment** - define your entire system in YAML, and let Fever handle the rest. Plus, with the **Package Framework (POF)**, you can build modular, upgradeable systems that bypass the 24KB contract size limit.

### Three Deployment Types

Fever CLI supports three manifest kinds:

1. **`kind: Contract`** - Regular smart contracts (ERC20, NFTs, utilities)
2. **`kind: Package`** - Individual packages following POF architecture
3. **`kind: PackageSystem`** - Complex systems composed of multiple packages

This tutorial focuses on `Contract` and `PackageSystem` - the most common use cases.

### What Makes Fever CLI Powerful?

#### 1. Manifest-Driven Deployment

Instead of writing deployment scripts:

```yaml
# Simple deployment manifest
apiVersion: beta/v1
kind: Contract
spec:
  contract:
    name: StableCoin
    constructorArgs:
      - value: 'MockUSDC'
```

**Deploy to any network with one command:**

```bash
fever apply -f deployment.yaml
```

That's it! No scripts, no Web3 boilerplate, no manual gas estimation. Networks are managed through `fever networks` - just select and deploy.

#### 2. Package Framework (PackageSystem)

Deploy complex systems using `kind: PackageSystem`:

```yaml
# Multi-contract system with PackageSystem
kind: PackageSystem
spec:
  # The main proxy system contract
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - '${ADMIN_ADDRESS}'

  # Packages that attach to the system
  packages:
    - name: LoanRegistry # Auto-deployed
    - name: LoanFunding # Auto-deployed
```

**Benefits**:

- ✅ **Modular Design** - Split functionality across multiple contracts
- ✅ **Unlimited Size** - Bypass 24KB contract limit
- ✅ **Upgradeable** - Add/replace functions without full redeployment
- ✅ **Auto Dependency Management** - No manual address copying

#### 3. Smart Compilation

```bash
fever compile --all
```

- Auto-detects Solidity versions from pragma statements
- Extracts function selectors automatically
- Generates optimized artifacts

#### 4. Platform Integration

Every deployment automatically syncs to the **Fever Platform** where you can:

- 📊 Track all deployments across networks
- 🔍 View contract ABIs and transaction history
- 📦 Manage projects and artifacts
- 🎯 Monitor deployment status in real-time

---

## Quick Comparison: Before vs After

### Traditional Deployment (Hardhat/Foundry)

```javascript
// deploy.js - Manual script writing
const PackageViewer = await ethers.getContractFactory('PackageViewer')
const viewer = await PackageViewer.deploy()
await viewer.deployed()

const PackageController = await ethers.getContractFactory('PackageController')
const controller = await PackageController.deploy()
await controller.deployed()

// Manually pass addresses...
const System = await ethers.getContractFactory('MicroLoanPackageSystem')
const system = await System.deploy(
  controller.address, // ← Manual copy-paste
  viewer.address // ← Manual copy-paste
)

// Track deployments manually in a JSON file...
// Write tests to verify deployment...
// Repeat for each network...
```

### Fever CLI Deployment

```yaml
# microloan-system.yaml - Declarative configuration
kind: PackageSystem
spec:
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - $dependencies.packageController.address # ← Automatic!
      - $dependencies.packageViewer.address # ← Automatic!

  packages:
    - name: LoanRegistry
    - name: LoanFunding
      functions: '*'

  dependencies:
    packageViewer:
      name: PackageViewer
    packageController:
      name: PackageController
```

```bash
# One command deploys everything
fever apply -f microloan-package-system.yaml
```

**Result**:

- ✅ All 5 contracts deployed in correct order
- ✅ Addresses automatically resolved and injected
- ✅ Synced to platform with full tracking
- ✅ Works on any network (just use `fever networks select`)

---

## What You'll Learn

By the end of this tutorial:

- ✅ Understand the three manifest types: `Contract`, `Package`, `PackageSystem`
- ✅ Deploy a simple ERC20 token with `kind: Contract`
- ✅ Deploy a complex 7-contract system using `kind: PackageSystem`
- ✅ Understand POF architecture and PackageSystem benefits
- ✅ Track everything on the Fever Platform

## Prerequisites

- Node.js v20.19 or higher
- Git installed
- A GitHub or Google account (for platform authentication)

---

## Step 1: Install Fever CLI

Install the Fever CLI globally using npm:

```bash
npm install -g @fevertokens/cli
```

Verify the installation:

```bash
fever --version
```

You should see the version number displayed (e.g., `0.0.8`).

---

## Step 2: Clone the Example Project

We'll use the MicroLoan packages repository - a complete DeFi lending system:

```bash
git clone https://github.com/FeverTokens/microloan-packages.git
cd microloan-packages
```

**What's inside:**

```
microloan-packages/
├── contracts/
│   ├── StableCoin.sol                # Simple ERC20 token
│   ├── MicroLoanPackageSystem.sol    # Main System Proxy
│   ├── PackageViewer.sol             # System viewer package
│   ├── PackageController.sol         # System controller package
│   └── microloan/
│       ├── registry/LoanRegistry.sol     # Loan creation package
│       ├── funding/LoanFunding.sol       # Loan funding package
│       ├── repayment/LoanRepayment.sol   # Repayment handling package
│       └── tokenmanager/LoanTokenManager.sol  # Token management package
└── f9s/
    ├── erc20-config.yaml                 # Simple Contract deployment
    ├── microloan-package-system.yaml     # Complex PackageSystem
    ├── loan-registry.yml                 # Individual Package example
    └── networks.yml                      # Network configuration
```

This project demonstrates both deployment approaches:

- **Simple**: Single-contract deployment (StableCoin)
- **Advanced**: Multi-contract Application Proxy system (MicroLoan)

---

## Step 3: Install Dependencies & Compile

Install dependencies:

```bash
npm install
```

Now let's see the **compilation power** - compile all contracts with one command:

```bash
fever compile --all
```

**What happens:**

- ✅ Auto-detects Solidity version from `pragma` statements (no config needed!)
- ✅ Compiles all contracts in `contracts/` directory
- ✅ Generates artifacts (ABI, bytecode) in `.fever/` directory
- ✅ Extracts function selectors for Application proxy routing

You should see output like:

```
✅ Compiled StableCoin successfully
✅ Compiled MicroLoanPackageSystem successfully
✅ Compiled PackageViewer successfully
✅ Compiled PackageController successfully
✅ Compiled LoanRegistry successfully
✅ Compiled LoanFunding successfully
✅ Compiled LoanRepayment successfully
✅ Compiled LoanTokenManager successfully
```

**8 contracts compiled in seconds** - no configuration required!

---

## Step 4: Explore the Deployment Manifests

Before we deploy, let's examine the **manifest-driven approach**.

### Simple Deployment: StableCoin

The manifest file `f9s/erc20-config.yaml` shows a simple contract deployment:

```yaml
apiVersion: beta/v1
kind: Contract

metadata:
  name: stable-coin-contract
  version: 1.0.0
  description: 'StableCoin contract configuration for ERC20 tokens'

spec:
  contract:
    name: StableCoin
    constructorArgs:
      - name: 'name_'
        type: 'string'
        value: 'MockUSDC'
      - name: 'symbol_'
        type: 'string'
        value: 'mUSDC'
      - name: 'decimals_'
        type: 'uint8'
        value: 6

  deployer:
    wallet:
      type: privateKey
      value: '${PRIVATE_KEY}'
```

**Key features:**

- 🎯 Declarative configuration (no scripts)
- 🔐 Environment variables for sensitive data
- ⚙️ Type-safe constructor arguments (name, type, value)
- 🌐 Network management via `fever networks` (no hardcoded networks!)

### Advanced Deployment: MicroLoan System

The manifest file `f9s/microloan-package-system.yaml` shows a complex system deployment:

```yaml
apiVersion: beta/v1
kind: PackageSystem

metadata:
  name: microloan-application
  version: 1.0.0

spec:
  # Step 1: Deploy the System (main contract)
  system:
    name: MicroLoanPackageSystem
    constructorArgs:
      - $dependencies.packageController.address # ← Automatic!
      - $dependencies.packageViewer.address
      - ${ADMIN_ADDRESS}

  # Step 2: Configure packages with function routing
  packages:
    - name: LoanRegistry
      # No functions specified = all functions included

    - name: LoanFunding
      functions: '*' # Explicitly include all functions

    - name: LoanRepayment
      functions:
        - repayNextInstallment(uint256) # Function signature

    - name: LoanTokenManager
      functions:
        - balanceOf(address,address)
        - deposit
        - withdraw

  # Step 3: Define dependencies (auto-deployed)
  dependencies:
    packageViewer:
      name: PackageViewer
    packageController:
      name: PackageController

  deployer:
    wallet:
      type: privateKey
      value: '${PRIVATE_KEY}'
```

**This single manifest**:

- ✅ Deploys 7 contracts (1 system + 2 dependencies + 4 packages)
- ✅ Automatically resolves and injects addresses
- ✅ Flexible function routing (names, signatures, or \*)
- ✅ No manual address management needed!

---

## Step 5: Authenticate with Fever Platform

Now that you've seen the power of Fever CLI, let's connect to the **Fever Platform** to track your deployments.

The platform provides:

- 📊 **Deployment Dashboard** - See all your contracts across networks
- 🔍 **Transaction History** - Track every deployment
- 📦 **Artifact Management** - Store ABIs and bytecode
- 🎯 **Project Organization** - Group related contracts

Let's authenticate:

```bash
fever auth login
```

**What happens:**

1. Browser opens with a device code
2. Sign in with **Google** or **GitHub**
3. Authorize Fever CLI
4. Return to terminal - you're connected! ✅

Verify your authentication:

```bash
fever auth status
```

---

## Step 6: Create a Project

Projects organize your contracts on the platform. Create one:

```bash
fever projects create --name "MicroLoan Tutorial"
```

The CLI automatically selects this project. View it anytime:

```bash
fever projects
```

💡 **Pro Tip:** Use `fever projects select` to switch between projects interactively.

---

## Step 7: Launch Local Blockchain

Before deploying, start a local blockchain. Fever CLI includes built-in support for Anvil:

```bash
fever node --verbose
```

**What you'll see:**

```
🚀 Starting Fever Local Blockchain...
📦 Using tool: anvil
⛓️  Chain ID: 1337
👥 Accounts: 10
🌐 Port: 8545

✅ Blockchain node is running!
```

💡 Anvil is blazing-fast (written in Rust) and comes with Foundry. If you don't have it:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

⚠️ **Keep this terminal open!** Open a new terminal for the next steps.

---

## Step 8: Configure Network & Environment

### Set up Local Network

Add the local network using `fever networks`:

```bash
fever networks add --local
# Or manually:
fever networks add --name "Local" --rpc "http://localhost:8545" --chainId 1337

# Select it for deployment
fever networks select
# Choose "Local" from the list
```

This creates `f9s/networks.yml` to track your networks.

### Generate a Wallet

Generate a secure wallet for deployment:

```bash
fever wallets generate
```

When prompted, select **Yes** to append to your `.env` file.

**For testing with Anvil**, use this one-command shortcut with a pre-funded test account:

```bash
cat > .env << 'EOF'
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEPLOY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
EOF
```

_This account is pre-funded with 10,000 ETH on Anvil._

⚠️ **Security Note:** These are test credentials for local development only. **Never** use them on mainnet!

---

## Step 9: Deploy the StableCoin

Now for the exciting part - deploy with one command:

```bash
fever apply -f f9s/erc20-config.yaml
```

**What happens:**

1. ✅ Loads the manifest
2. ✅ Resolves environment variables
3. ✅ Connects to blockchain
4. ✅ Deploys the StableCoin contract
5. ✅ **Syncs to Fever Platform automatically** 🎯

You'll see:

```
🚀 Starting deployment from manifest...
📄 Loaded manifest: stablecoin-contract (v1.0.0)
🔌 Connected to network (Chain ID: 1337)
⚡ Deploying StableCoin...
✅ Deployed StableCoin to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📡 Syncing deployment to platform...
✅ Deployment synced successfully!
```

🎉 **You just deployed a contract with manifest-driven deployment!**

---

## Step 10: View on Fever Platform

Visit the [Fever CLI Platform](https://cli.fevertokens.app/dashboard) and sign in.

**You'll see:**

- ✅ **Your Project**: "MicroLoan Tutorial"
- ✅ **StableCoin Deployment**: Contract address, transaction hash
- ✅ **Network Info**: Chain ID, block number
- ✅ **Artifacts**: ABI and bytecode available for download

**Platform Features:**

1. **Deployment Timeline** - See when each contract was deployed
2. **Contract Details** - Click any contract to view full details
3. **Transaction History** - Track all deployment transactions
4. **Artifact Browser** - Download ABIs for integration

This is the power of **automatic platform sync** - no manual tracking needed!

---

## Advanced: The Power of Package Framework

### The Challenge

You just deployed one contract - that was easy. But real-world dApps need **multiple interconnected contracts**.

Imagine deploying a DeFi lending platform with:

- 6 package contracts (LoanRegistry, LoanFunding, LoanRepayment, etc.)
- 1 main System Proxy (MicroLoanPackageSystem)
- Each package needs to know about the others
- The proxy needs all their addresses for function routing

**Traditional approach:**

```javascript
// 1. Deploy 6 contracts manually
const registry = await deploy('LoanRegistry')
const funding = await deploy('LoanFunding')
// ... 4 more contracts

// 2. Copy-paste addresses (error-prone!)
const system = await deploy('MicroLoanPackageSystem', [
  '0x1234...', // Did I get the right address?
  '0x5678...', // Is this the viewer or controller?
])

// 3. Configure function routing manually
await system.packageCut([
  { packageAddress: '0x9abc...', functionSelectors: ['0xc19f...'] },
])

// 4. Track everything in a spreadsheet or JSON file
// 5. Repeat for each network
```

**This takes hours and is error-prone!**

### The Solution: PackageSystem

With Fever CLI, deploy all 7 contracts with **one command**:

```bash
fever apply -f microloan-system-config.yaml
```

**What Fever does:**

1. ✅ Deploys 6 package contracts in parallel
2. ✅ Automatically captures all addresses
3. ✅ Deploys System Proxy with auto-injected addresses
4. ✅ Configures function routing (Package Cut)
5. ✅ Syncs all 7 contracts to platform with relationships tracked

**Time saved: 90%** | **Errors eliminated: 100%**

---

## Understanding PackageSystem

The **PackageSystem** is like a **smart contract operating system**.

When you use `kind: PackageSystem`, you're deploying a modular proxy architecture:

```
┌─────────────────────────────────────┐
│  MicroLoanPackageSystem (System)    │
│                                     │
│  User calls: createLoan()           │
│      ↓                              │
│  System looks up function selector  │
│      ↓                              │
│  Routes to: LoanRegistry package    │
└─────────────────────────────────────┘
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Loan   │  │ Loan   │  │  Token │
    │Registry│  │Funding │  │Manager │
    └────────┘  └────────┘  └────────┘
```

**Key Benefits:**

1. **Bypass 24KB Limit** - Ethereum contracts have a 24KB size limit. With PackageSystem, split your logic across unlimited packages!

2. **Modular Upgrades** - Replace `LoanFunding` package without touching `LoanRegistry`

3. **Shared Storage** - All packages access the same state through the system

4. **Clean Interfaces** - Users interact with ONE address (the system) for ALL functions

---

### What is POF (Package-Oriented Framework)?

POF is FeverTokens's architecture pattern for building modular, upgradeable smart contract systems:

- **`kind: Package`** - Individual reusable components following POF design
- **`kind: PackageSystem`** - Systems that compose multiple packages with a central proxy

**Key concepts:**

- Packages are modular contracts designed to work together
- Systems route function calls to the appropriate package
- All packages share the same storage through the system
- You can upgrade by replacing individual packages

**Think of it like microservices for smart contracts** - instead of one monolithic contract, you have specialized packages that work together through a system proxy.

📚 **Learn more about POF architecture**: https://github.com/FeverTokens/packages

---

## Deploy the MicroLoan System

Let's deploy a **complete 7-contract system** to see the Package Framework in action!

### Step 1: Review the Manifest

The manifest `f9s/microloan-system-config.yaml` defines the entire system. It automatically:

- Deploys packages (LoanRegistry, LoanFunding, etc.)
- Deploys dependencies (PackageViewer, PackageController) first
- Injects addresses via `$dependencies.name.address`

### Step 2: Deploy with One Command

**If you used `fever wallets generate`**, add `ADMIN_ADDRESS` to your `.env`:

```bash
# Add this line to your .env
ADMIN_ADDRESS=${DEPLOY_ADDRESS}
```

**If you used the Anvil test account**, you already have `ADMIN_ADDRESS` set! ✅

Now deploy the entire system:

```bash
fever apply -f f9s/microloan-system-config.yaml
```

### Step 3: Watch the Magic

You'll see a beautiful deployment sequence:

#### Phase 1: Deploy 6 Package Contracts

```
🚀 Starting PackageSystem deployment...
📦 Deploying dependencies...

✅ Deployed PackageViewer → 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
✅ Deployed PackageController → 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
✅ Deployed LoanRegistry → 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
✅ Deployed LoanFunding → 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
✅ Deployed LoanRepayment → 0x0165878A594ca255338adfa4d48449f69242Eb8F
✅ Deployed LoanTokenManager → 0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f
```

#### Phase 2: Deploy System Proxy

```
💎 Deploying MicroLoanPackageSystem System...
   Constructor args auto-injected:
   - packageController: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 ✓
   - packageViewer: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 ✓
   - admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 ✓

✅ Deployed MicroLoanPackageSystem → 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

#### Phase 3: Configure Function Routing

```
🎯 Executing Package Cut...
   Adding LoanRegistry package (2 functions)
   Adding LoanFunding package (1 function)
   Adding LoanRepayment package (1 function)
   Adding LoanTokenManager package (3 functions)

✅ System configured with 4 packages!
```

#### Phase 4: Sync to Platform

```
📡 Syncing 7 contracts to Fever Platform...
✅ All contracts synced successfully!

🎉 PackageSystem deployment complete!
   Application Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**You just deployed 7 contracts in under 30 seconds!**

---

### Step 4: View on Platform

Go back to the [Fever Platform](https://cli.fevertokens.app/dashboard).

**You'll now see:**

- ✅ **7 Contracts** - All packages + System Proxy
- ✅ **Deployment Relationships** - Visual graph showing dependencies
- ✅ **Function Routing** - Which functions route to which packages
- ✅ **All ABIs** - Ready for frontend integration

**This is the platform advantage** - instant visibility into complex systems!

---

## What You Just Accomplished

### Traditional Approach (Hardhat/Foundry)

```bash
# Write deployment scripts (30-60 minutes)
npx hardhat run scripts/deploy-packages.js
npx hardhat run scripts/deploy-system.js
npx hardhat run scripts/package-cut.js

# Track addresses in JSON file
# Manually verify on Etherscan
# Document everything in README
# Hope you didn't make a mistake copying addresses

Total time: 2-3 hours
Error rate: High
```

### Fever CLI Approach

```bash
# Write manifest once (15 minutes)
# Deploy everywhere with one command
fever apply -f microloan-system-config.yaml

# Everything tracked automatically on platform
# All contracts linked and documented
# Ready to deploy to any network

Total time: 30 minutes
Error rate: Near zero
```

**Time saved: 85%** | **Mental overhead: Eliminated**

---

## Manifest Comparison

| Feature          | `kind: Contract`         | `kind: Package`           | `kind: PackageSystem`              |
| ---------------- | ------------------------ | ------------------------- | ---------------------------------- |
| **Architecture** | Regular contract         | POF architecture          | POF system composition             |
| **Use Case**     | Single contract          | Individual package        | Multi-package system               |
| **Spec Field**   | `spec.contract`          | `spec.package`            | `spec.system` + `spec.packages`    |
| **Contracts**    | 1 main + optional deps   | 1 package + optional deps | 1 System + N packages              |
| **Size Limit**   | 24KB per contract        | 24KB per package          | Unlimited (split across packages)  |
| **Upgradeable**  | No                       | No                        | Yes (add/replace/remove packages)  |
| **Best For**     | Tokens, NFTs, utilities  | POF components            | DeFi protocols, DAOs, systems      |
| **Complexity**   | Beginner                 | Beginner                  | Advanced                           |
| **Example**      | ERC20, NFT, simple logic | Modular package           | Lending platforms, DEXs, protocols |

---

## Next Steps

### 1. Deploy to Testnets/Mainnet

Use `fever networks` to manage networks:

```bash
# View available networks (popular testnets/mainnets)
fever networks

# Select a network for deployment
fever networks select

# Add your own network
fever networks add --name "Polygon Mumbai" --rpc "https://rpc-mumbai.maticvigil.com" --chainId 80001
```

Then deploy to any network with the **same command**:

```bash
fever apply -f erc20-config.yaml
fever apply -f microloan-system-config.yaml
```

⚠️ **Mainnet Security:** Use hardware wallets or secure key management!

### 2. Smart Artifact Management

Sync compiled artifacts to platform:

```bash
fever artifacts sync           # Smart sync (only changed contracts)
fever artifacts status          # Git-like status view
fever artifacts download        # Download platform artifacts
```

### 3. Explore Platform Features

Visit [cli.fevertokens.app](https://cli.fevertokens.app) to:

- 📊 View deployment analytics
- 🔍 Compare deployments across networks
- 📦 Download ABIs for frontend integration
- 👥 Collaborate with team members

---

## What You've Learned

In this tutorial, you've mastered:

- ✅ **Manifest-Driven Deployment** - No more deployment scripts
- ✅ **Three Manifest Types** - `Contract`, `Package`, and `PackageSystem`
- ✅ **Contract Manifests** (`kind: Contract`) - Simple single-contract deployment
- ✅ **PackageSystem Manifests** (`kind: PackageSystem`) - Complex modular systems
- ✅ **Automatic Dependency Management** - Let Fever handle the plumbing
- ✅ **Platform Integration** - Track everything automatically

**You're now equipped to build production-ready smart contract systems!**

---

## Additional Resources

- **CLI Documentation**: Run `fever --help` for any command
- **Platform Dashboard**: [https://cli.fevertokens.app](https://cli.fevertokens.app)
- **GitHub Repository**: [github.com/FeverTokens/fever-cli](https://github.com/FeverTokens/fever-cli)
- **Example Projects**: [github.com/FeverTokens/microloan-packages](https://github.com/FeverTokens/microloan-packages)

---

## Troubleshooting

### Issue: "No blockchain tools found"

Install Anvil (comes with Foundry):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Issue: "Authentication required"

Re-authenticate:

```bash
fever auth login --force
```

### Issue: "Authentication fetch error"

Update Node.js to LTS 20 or 22 with [NVM](https://github.com/nvm-sh/nvm):

```bash
nvm install lts/iron  # LTS 20
nvm install lts/jod   # LTS 22
```

### Issue: "Port 8545 already in use"

Use a different port:

```bash
fever node --port 8546

# Update your network:
fever networks add --name "Local Alt" --rpc "http://localhost:8546" --chainId 1337
```

### Issue: "Contract compilation failed"

Make sure dependencies are installed:

```bash
npm install
```

---

## You're Ready!

You've completed the Fever CLI Quickstart and learned:

- 🎯 Manifest-driven deployment with three kinds: `Contract`, `Package`, `PackageSystem`
- 💎 PackageSystem pattern for modular systems (unlimited contract size)
- 📦 POF (Package-Oriented Framework) architecture
- 🔧 Automatic dependency management (zero manual work)
- 🚀 Platform integration (instant visibility)

**Welcome to the future of smart contract deployment!**

---

### Ready to build something amazing?

[Create Your Project](https://cli.fevertokens.app) • [View Docs](https://cli.fevertokens.app/docs)

<sub>Built with ❤️ by the FeverTokens team</sub>
