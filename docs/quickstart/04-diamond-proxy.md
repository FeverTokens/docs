---
title: 💎 Diamond Proxy Systems
sidebar_position: 4
description: Deploy sophisticated multi-contract systems using the Diamond Proxy pattern (EIP-2535).
---

# 💎 Diamond Proxy Systems

## 🤔 Why Multi-Contract Systems?

The simple `Deployment` manifest we used works great for single contracts. But what if you need to deploy a sophisticated system with 5-8 interconnected smart contracts?

**This is exactly what the MicroLoan system demonstrates!**

## 📐 Understanding Diamond Proxy (EIP-2535)

The Diamond Proxy pattern is an upgradeable smart contract architecture that allows you to:

- ✅ **Split functionality** across multiple "facet" contracts
- ✅ **Bypass the 24KB contract size limit**
- ✅ **Add, replace, or remove functions** without redeploying everything
- ✅ **Share storage** - All facets access the same storage through the diamond proxy

## 🏗️ MicroLoan System Architecture

The MicroLoan system is a complete DeFi lending platform with **6 smart contracts**:

```
MicroLoanDiamond (Main Proxy)
↓
├── PackageViewer (View storage/configuration)
├── PackageController (Manage system settings)
├── LoanRegistry (Create & track loans)
├── LoanFunding (Fund loan requests)
├── LoanRepayment (Handle installment payments)
└── LoanTokenManager (Manage token deposits/withdrawals)
```

Each contract handles a specific part of the lending workflow while sharing the same storage!

## ⚙️ Diamond Configuration

The configuration is in `f9s/microloan-system-config.yaml`:

```yaml title="f9s/microloan-system-config.yaml"
apiVersion: beta/v1
kind: Diamond  # ← Different kind: Diamond instead of Deployment

metadata:
  name: microloan-diamond
  version: 1.0.0

spec:
  deployer:
    wallet:
      type: privateKey
      value: '${PRIVATE_KEY}'

  # Step 1: Deploy all dependency contracts first
  dependencies:
    packageViewer:
      name: PackageViewer
    packageController:
      name: PackageController
    loanRegistry:
      name: LoanRegistry
    loanFunding:
      name: LoanFunding
    loanRepayment:
      name: LoanRepayment
    loanTokenManager:
      name: LoanTokenManager

  # Step 2: Deploy the main Diamond proxy
  diamond:
    name: MicroLoanDiamond
    constructorArguments:
      - $dependencies.packageController.address  # ← Reference deployed contracts!
      - $dependencies.packageViewer.address
      - '${ADMIN_ADDRESS}'

  # Step 3: Configure function routing (Diamond Cut)
  packages:
    - name: LoanRegistry
      functions:
        - '0xc19fa698'  # createLoan selector
        - '0x504006ca'  # getLoan selector
      address: $dependencies.loanRegistry.address
    
    - name: LoanFunding
      functions:
        - '0x846b909a'  # fundLoan selector
      address: $dependencies.loanFunding.address
    
    - name: LoanRepayment
      functions:
        - '0x84068d15'  # repayNextInstallment selector
      address: $dependencies.loanRepayment.address
    
    - name: LoanTokenManager
      functions:
        - '0xf7888aec'  # balanceOf selector
        - '0x47e7ef24'  # deposit selector
        - '0xf3fef3a3'  # withdraw selector
      address: $dependencies.loanTokenManager.address

  network:
    chainId: '${CHAIN_ID}'
    rpcUrl: '${RPC_URL}'
```

## 🔄 Deployment Flow

When you run `fever compose`, here's what happens:

### Step 1: Deploy Dependencies

```bash
✅ Deploying PackageViewer... → Address: 0x1234...
✅ Deploying PackageController... → Address: 0x5678...
✅ Deploying LoanRegistry... → Address: 0x9abc...
✅ Deploying LoanFunding... → Address: 0xdef0...
✅ Deploying LoanRepayment... → Address: 0x2468...
✅ Deploying LoanTokenManager... → Address: 0x1357...
```

### Step 2: Deploy Diamond Proxy

```bash
✅ Deploying MicroLoanDiamond...
   Constructor args:
     - packageController: 0x5678... ← Auto-injected!
     - packageViewer: 0x1234...     ← Auto-injected!
     - admin: 0xYourAdminAddress
   → Diamond Address: 0xABCD...
```

### Step 3: Execute Diamond Cut

```bash
💎 Executing DiamondCut...
   Adding facet: LoanRegistry (2 functions)
   Adding facet: LoanFunding (1 function)
   Adding facet: LoanRepayment (1 function)
   Adding facet: LoanTokenManager (3 functions)
✅ Diamond configured with 4 facets!
```

### Step 4: Sync to Platform

```bash
📡 Syncing all deployments to platform...
✅ 7 contracts synced successfully!
```

## 🚀 Deploy the MicroLoan System

First, add the admin address to your `.env` file:

```bash
cat >> .env << 'EOF'
# Add admin address for the system
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
EOF
```

Now deploy the entire system:

```bash
fever compose -f f9s/microloan-system-config.yaml
```

You'll see all **7 contracts** deployed in the correct order, with addresses automatically cross-referenced.

## 📊 Comparison: Deployment vs Diamond

| Feature | Deployment Manifest | Diamond Manifest |
|---------|-------------------|------------------|
| **Use Case** | Single contract | Multi-contract system |
| **Complexity** | Simple | Advanced |
| **Size Limit** | 24KB per contract | Unlimited |
| **Upgradeable** | No | Yes (via Diamond Cut) |
| **Dependencies** | Manual | Automatic |
| **Best For** | Tokens, simple contracts | DeFi protocols, DAOs, complex dApps |

## 🎯 Key Benefits

### 1. Automatic Dependency Management
No need to manually deploy contracts and pass addresses - Fever CLI handles it all!

### 2. Function Selector Management
Function selectors are automatically extracted from compiled artifacts and configured in the Diamond.

### 3. Deployment Tracking
All contracts are tracked on the Fever platform, making it easy to manage and verify your deployments.

### 4. Reproducible Deployments
The configuration file serves as documentation and can be version controlled for reproducible deployments.

:::info Next Steps
Having issues? Check out [Troubleshooting](/quickstart/troubleshooting) for common problems and solutions.
:::
