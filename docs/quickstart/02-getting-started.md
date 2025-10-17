---
title: 🎬 Getting Started
sidebar_position: 2
description: Clone the example project, authenticate, and set up your first project.
---

# 🎬 Getting Started

## 📂 Clone the Example Project

We'll use the MicroLoan packages repository as our example project:

```bash
git clone https://github.com/FeverTokens/microloan-packages.git
cd microloan-packages
```

### What's Inside?

This project contains:

- **ERC20 Token** (`StableCoin.sol`) - A simple stablecoin for testing
- **Diamond Proxy System** - A complete DeFi lending platform
- **Deployment Configs** - Pre-configured YAML manifests
- **Tests** - Comprehensive test suite

## 🔐 Authentication

The Fever CLI integrates with the Fever web platform to track your deployments, contracts, and artifacts. Let's authenticate:

```bash
fever auth login
```

You can verify your authentication status anytime:

```bash
fever auth status
```

:::tip Authentication Token
Your authentication token is stored securely in your system's keychain. You won't need to login again unless you explicitly logout.
:::

## 📁 Project Management

Projects help you organize your contracts and deployments on the platform. Create a new project for this tutorial:

```bash
fever projects create --name "MicroLoan"
```

The CLI will automatically select this project for you. You can view your current project selection anytime:

```bash
fever projects
```

:::info Pro Tip
Use `fever projects select` to switch between projects interactively.
:::

## 📥 Install Dependencies

Install the project's Node.js dependencies:

```bash
npm install
```

This installs the necessary Solidity compiler and other development tools.

:::info Next Steps
Continue to [Compiling & Deploying](/quickstart/compile-deploy) to compile contracts and deploy your first token.
:::
