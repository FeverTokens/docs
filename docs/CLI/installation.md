---
id: installation
title: Installation
sidebar_label: Installation
sidebar_position: 2
slug: /cli/installation
---

# Installation

Get Fever CLI installed and ready to revolutionize your smart contract deployment workflow in under 2 minutes.

## What You're Installing

Fever CLI is an all-in-one command-line tool that gives you:

- 🎯 **Manifest-driven deployment** - Stop writing scripts, start declaring
- 💎 **PackageSystem support** - Build modular, upgradeable systems
- 🔨 **Smart compiler** - Auto-detects Solidity versions
- 🌐 **Local blockchain** - Built-in Anvil node wrapper
- 📊 **Platform integration** - Automatic deployment tracking
- ⚡ **Smart artifact sync** - 70-90% bandwidth savings
- 🎯 **CREATE2 support** - Deterministic cross-chain deployments

**Time to first deployment:** Under 10 minutes after installation!

---

## Requirements

Before installation, ensure you have:

- **Node.js**: Version 20.x or higher is required for full compatibility
- **npm**: Comes bundled with Node.js

:::tip Check Your Node Version
```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 9.x or higher
```

Need to upgrade? Visit [nodejs.org](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm) for version management.
:::

---

## Standard Installation

The recommended way to install Fever CLI is globally using npm. This makes the `fever` command available in any terminal session.

```bash
npm install -g @fevertokens/cli
```

**Installation time:** ~30 seconds

---

## Verification

After installation, verify that the CLI is working correctly:

```bash
fever --version
```

You should see the installed version number (e.g., `0.0.15`).

Check authentication status (should report "not logged in" for first-time users):

```bash
fever auth status
```

**Expected output:**
```
❌ Not authenticated
Run 'fever auth login' to authenticate
```

:::tip All Systems Go! ✅
If you see the version number and auth status, Fever CLI is installed correctly!
:::

---

## What's Next?

Now that Fever CLI is installed, you have two paths:

### 🚀 Fast Track: Quickstart Tutorial (Recommended)

Deploy a complete 7-contract DeFi lending system in 15 minutes:

👉 **[Start the Interactive Quickstart](./quickstart.md)**

You'll learn by doing:
- Compile and deploy contracts
- Use manifest-driven deployment
- Deploy a PackageSystem with multiple packages
- Track everything on the Fever platform

**Duration:** 15-20 minutes | **Level:** Beginner to Advanced

### 📚 Step-by-Step: Getting Started Guide

Prefer a methodical approach? Start here:

👉 **[Begin the Getting Started Guide](./getting-started.md)**

You'll learn:
- Authenticate with the platform
- Create your first project
- Deploy a simple ERC20 token
- Understand manifest basics

**Duration:** 10 minutes | **Level:** Beginner

---

## Optional: Install Foundry (for local development)

For local blockchain testing, install Foundry (includes Anvil):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify Anvil installation:

```bash
anvil --version
```

:::info What is Anvil?
Anvil is a blazing-fast local Ethereum node written in Rust. Fever CLI's `fever node` command uses Anvil for local development and testing.

**Features:**
- Instant block mining
- Pre-funded test accounts
- Mainnet forking support
- Zero configuration needed
:::

You can skip this for now - the Getting Started and Quickstart guides will remind you when you need it.

---

## Troubleshooting

### Permission Errors (EACCES)

If you encounter a permission error (often with `EACCES` in the message) during global installation, it means npm does not have the rights to write to the default directory.

**Solutions:**

#### Option 1: Use Node Version Manager (Recommended)

Tools like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) install Node.js in a way that avoids permission issues for global packages.

**Install nvm:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Install Node.js with nvm:**
```bash
nvm install --lts
nvm use --lts
```

**Then install Fever CLI:**
```bash
npm install -g @fevertokens/cli
```

#### Option 2: Change npm's Default Directory

Configure npm to use a different directory. Follow the official npm guide on [resolving EACCES permissions errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

#### Option 3: Use `sudo` (Not Recommended)

You can prefix the command with `sudo`, but this is generally discouraged as it can lead to other security risks.

```bash
sudo npm install -g @fevertokens/cli
```

:::warning Security Note
Using `sudo` for npm installations can cause permission issues with future npm commands and is a security risk. We strongly recommend using nvm instead.
:::

---

### Command Not Found

If your terminal says `fever: command not found` after installation, it means the directory where npm installs global packages is not in your system's `PATH`.

**Fix:**

1. Find npm's global install location:
   ```bash
   npm get prefix
   ```

2. Add the resulting path to your shell's configuration file:

   **For Zsh (macOS default):**
   ```bash
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **For Bash:**
   ```bash
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. Verify the fix:
   ```bash
   fever --version
   ```

---

### Node.js Version Issues

If you see errors about Node.js version compatibility:

**Check your version:**
```bash
node --version
```

**If below v20.x, upgrade:**

**Using nvm:**
```bash
nvm install 20
nvm use 20
```

**Or download from:**
https://nodejs.org/

---

## Updating Fever CLI

To update to the latest version:

```bash
npm install -g @fevertokens/cli@latest
```

Check the new version:

```bash
fever --version
```

:::tip Stay Updated
Fever CLI is actively developed with frequent updates. Check for updates regularly to get the latest features and improvements!

View releases: [GitHub Releases](https://github.com/FeverTokens/fever-cli/releases)
:::

---

## Uninstalling

If you need to uninstall Fever CLI:

```bash
npm uninstall -g @fevertokens/cli
```

This removes the CLI while preserving your local `.fever` directory and configurations.

---

## Quick Reference

```bash
# Install
npm install -g @fevertokens/cli

# Verify
fever --version
fever auth status

# Update
npm install -g @fevertokens/cli@latest

# Uninstall
npm uninstall -g @fevertokens/cli

# Get help
fever --help
fever <command> --help
```

---

## What's Included

After installation, you have access to all Fever CLI commands:

```bash
# Core Commands
fever auth login              # Authenticate with platform
fever projects create         # Create projects
fever compile --all          # Compile contracts
fever apply -f manifest.yaml  # Deploy from manifest
fever artifacts sync          # Smart artifact sync

# Network Management
fever networks                # List networks
fever networks select         # Interactive selection
fever networks add --local    # Add localhost

# Development Tools
fever node                    # Start local blockchain
fever wallets generate        # Generate secure wallets

# Utilities
fever install                 # Install dependencies (auto-detect pm)
```

See [Command Reference](./commands/) for complete documentation.

---

## System Requirements

- **Operating System:** macOS, Linux, or Windows (WSL recommended)
- **Memory:** 4GB RAM minimum, 8GB recommended
- **Disk Space:** 500MB for Fever CLI and dependencies
- **Network:** Internet connection for platform features

---

## Next Steps

Choose your path:

### 🎯 For Quick Learners

**[→ Start the Quickstart Tutorial](./quickstart.md)**

Deploy a complete system in 15 minutes.

### 📚 For Methodical Learners

**[→ Begin Getting Started Guide](./getting-started.md)**

Step-by-step first deployment in 10 minutes.

### 📖 For Documentation Readers

**[→ Read the Manifest Guide](./manifests.md)**

Understand the three deployment types.

---

**Ready? Let's start deploying smarter!** 🔥

```bash
fever auth login
```
