---
title: 🔨 Compile & Deploy
sidebar_position: 3
description: Compile contracts, understand deployment configuration, and deploy your first smart contract.
---

# 🔨 Compile & Deploy

## 🔧 Compiling Contracts

Now let's compile all the smart contracts in the project:

```bash
fever compile --all
```

### What Happens During Compilation?

The CLI will:

1. **Compile all contracts** with the appropriate Solidity version
2. **Generate artifacts** in the `.fever/` directory with a separate directory per contract
3. **Create a combined artifact** at `.fever/combined.json` with formatted function selectors for Diamond proxy support

You should see output like:

```bash
ℹ️ Info: Compiling all contracts in contracts
ℹ️ Info: Compiling all contracts with Solidity 0.8.26
ℹ️ Info: Compiling all contracts in a single pass...
....
ℹ️ Info: Processed contract: StableCoin
ℹ️ Info: Processed contract: LoanRegistry
✅ Success: Successfully compiled 170 contracts
ℹ️ Info: Generated combined artifact: .fever/combined.json
ℹ️ Info: Contract categories: 47 deployables, 112 interfaces, 6 external dependencies
```

## 📤 Syncing Artifacts

After compiling your contracts, sync the artifacts to the Fever CLI platform for deployment tracking and management:

```bash
fever artifacts sync
```

Check sync status anytime:

```bash
fever artifacts status
```

## 📖 Understanding the StableCoin Contract

Let's examine the contract we'll deploy. The `StableCoin` contract is located at `contracts/StableCoin.sol`:

```solidity title="contracts/StableCoin.sol"
/// @title StableCoin
/// @notice Minimal ERC20-like token for testing microloan flows.
/// @dev Implements IERC20 with simple owner-controlled minting.
contract StableCoin is IERC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public override totalSupply;
    
    // ... ERC20 standard mappings
    
    address public owner;

    /// @notice Set token metadata and initial owner
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param decimals_ Token decimals (e.g., 18 or 6)
    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
        owner = msg.sender;
    }

    /// @notice Mint new tokens to an account
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyOwner {...}
    
    // ... ERC20 standard functions
}
```

## ⚙️ Deployment Configuration

The deployment configuration is defined in `f9s/erc20-config.yaml`. Let's examine it:

```yaml title="f9s/erc20-config.yaml"
apiVersion: beta/v1
kind: Deployment

metadata:
  name: stablecoin-contract
  version: 1.0.0

spec:
  deployer:
    wallet:
      type: privateKey
      value: '${PRIVATE_KEY}'
    gasSettings:
      gasLimit: 3000000
  
  package:
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
  
  network:
    chainId: '${CHAIN_ID}'
    rpcUrl: '${RPC_URL}'
```

### Key Configuration Elements

- **Contract Name** - `StableCoin` (the compiled contract to deploy)
- **Constructor Arguments** - Token name, symbol, and decimals
- **Environment Variables** - `${PRIVATE_KEY}` for deployment wallet

## 🌐 Start Local Blockchain

Before deploying, we need a blockchain to deploy to. Fever CLI includes a built-in local blockchain using Anvil (from Foundry):

```bash
fever node
```

You should see:

```bash
🚀 Starting Fever Local Blockchain...
📦 Using tool: anvil
⛓️ Chain ID: 1337
👥 Accounts: 10

🌐 Network Information:
   Local: http://127.0.0.1:8545
   Network: http://localhost:8545
   JSON-RPC: http://localhost:8545
```

:::tip Alternative Blockchain
You can also use `hardhat node` or any other local blockchain. Fever node uses Anvil under the hood for blazing-fast performance.
:::

:::warning Keep Terminal Open
Keep this terminal open! Open a new terminal for the next steps.
:::

## 🔑 Configure Environment

Create a `.env` file in the project root with the following command:

```bash
cat > .env << 'EOF'
CHAIN_ID=1337
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://localhost:8545
EOF
```

:::danger Security Note
These are test credentials for local development only. **Never use them on mainnet or with real funds!**
:::

## 🚀 Deploy Your First Contract

Now for the exciting part - let's deploy our StableCoin contract!

```bash
fever deploy -f f9s/erc20-config.yaml
```

You should see output like:

```bash
🚀 Starting deployment from manifest...
📄 Loaded manifest: stablecoin-contract (v1.0.0)
🔌 Connected to network (Chain ID: 1337)
⚡ Deploying StableCoin...
✅ Deployed StableCoin to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📡 Syncing deployment to platform...
✅ Deployment synced successfully!
```

## 🎉 Congratulations!

You've deployed your first contract with Fever CLI!

### View on Platform

Visit the [Fever CLI Platform](https://cli.fevertokens.app/dashboard) and sign in with the same account you used for authentication.

:::info Next Steps
Ready for advanced multi-contract systems? Continue to [Diamond Proxy Systems](/quickstart/diamond-proxy).
:::
