---
title: 🔧 Troubleshooting
sidebar_position: 5
description: Common issues and solutions when using Fever CLI.
---

# 🔧 Troubleshooting

## 🚫 Common Issues

### ❌ "anvil: command not found"

**Problem:** Anvil is not installed on your system.

**Solution:** Install Anvil (Foundry):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

After installation, verify it works:

```bash
anvil --version
```

---

### ❌ "Authentication token expired"

**Problem:** Your authentication token has expired or is invalid.

**Solution:** Login again:

```bash
fever auth login --force
```

The `--force` flag will refresh your authentication token even if one exists.

---

### ❌ "Failed to compile contracts"

**Problem:** The Solidity compiler is not installed or dependencies are missing.

**Solution:** Make sure you ran `npm install` to get the Solidity compiler:

```bash
npm install
```

If the issue persists, try clearing the cache:

```bash
rm -rf .fever node_modules
npm install
fever compile --all
```

---

### ❌ "Address already in use" when starting fever node

**Problem:** Port 8545 is already in use by another process.

**Solution:** Either stop the existing blockchain or use a different port:

```bash
fever node --port 8546
```

Then update your `.env` file:

```bash
RPC_URL=http://localhost:8546
```

To find and kill the process using port 8545:

```bash
# On macOS/Linux
lsof -ti:8545 | xargs kill -9

# On Windows
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

---

### ❌ "Deployment failed: insufficient funds"

**Problem:** The deployer account doesn't have enough ETH for gas fees.

**Solution:** If using local blockchain:

The default Anvil account should have 10000 ETH. Make sure you're using the correct private key from your `.env` file.

If using a testnet, fund your account:

1. Get the address from your private key
2. Use a faucet to get test ETH (search for "[network name] faucet")

---

### ❌ "Invalid constructor arguments"

**Problem:** Constructor arguments in the config file don't match the contract's constructor.

**Solution:** 

1. Check the contract's constructor signature
2. Verify the argument types in your YAML config match exactly
3. Ensure all required arguments are provided

Example:

```yaml
# ✅ Correct
constructorArgs:
  - name: 'amount'
    type: 'uint256'
    value: 1000000

# ❌ Wrong - missing quotes for uint256
constructorArgs:
  - name: 'amount'
    type: uint256
    value: 1000000
```

---

### ❌ "Network connection failed"

**Problem:** Cannot connect to the specified RPC URL.

**Solution:**

1. Verify the RPC URL in your `.env` file is correct
2. Check if your local blockchain is running (`fever node`)
3. Test the connection manually:

```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $RPC_URL
```

---

### ❌ "Contract size exceeds 24KB limit"

**Problem:** Your contract is too large to deploy.

**Solution:**

Consider using the Diamond Proxy pattern:

1. Split your contract into multiple smaller facets
2. Use a Diamond manifest instead of Deployment manifest
3. See the [Diamond Proxy Systems](/quickstart/diamond-proxy) guide

---

### ❌ "Function selector not found in artifacts"

**Problem:** The function selector specified in Diamond config doesn't exist in compiled artifacts.

**Solution:**

1. Recompile your contracts: `fever compile --all`
2. Check the `.fever/combined.json` file for correct selectors
3. Verify function names match exactly (case-sensitive)

To view all function selectors:

```bash
cat .fever/combined.json | grep -A 5 "functionSelectors"
```

---

## 📚 Additional Resources

### Getting Help

- 📖 **Documentation:** [https://cli.fevertokens.app/docs](https://cli.fevertokens.app/docs)
- 💬 **Discord:** Join our community for support
- 🐛 **GitHub Issues:** [https://github.com/FeverTokens/cli](https://github.com/FeverTokens/cli)

### Useful Commands

```bash
# Check CLI version
fever --version

# Get help for any command
fever --help
fever deploy --help

# View current authentication status
fever auth status

# List all projects
fever projects list

# View compiled artifacts
fever artifacts status

# Clear local cache
rm -rf .fever
```

---

## 🎉 Welcome to Fever CLI!

You're now ready to build and deploy complex smart contract systems with ease. Happy building! 🔥

:::tip Need More Help?
If you encounter an issue not covered here, please:
1. Check the [full documentation](https://cli.fevertokens.app/docs)
2. Search existing [GitHub issues](https://github.com/FeverTokens/cli/issues)
3. Join our Discord community for real-time support
:::
