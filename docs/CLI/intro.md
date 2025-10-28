---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
slug: /cli/intro
---

# Introduction to Fever CLI

Welcome to the Fever CLI, a powerful command-line interface designed to streamline every aspect of your smart contract workflow. From local development and compilation to advanced, deterministic deployments, Fever CLI provides the tools you need to build, manage, and deploy your decentralized applications with confidence and efficiency.

## What is Fever CLI?

Fever CLI is an all-in-one tool for Web3 developers that simplifies the complexities of smart contract development. It replaces scattered scripts and manual processes with a unified, declarative, and automated system.

Whether you are deploying a simple ERC20 token or a complex, multi-faceted Diamond system, Fever CLI handles the heavy lifting, allowing you to focus on writing great code.

## Key Features

- **Declarative Deployments**: Define your entire contract system, including dependencies and configurations, in a single YAML manifest. Deploy everything with one command: `fever apply`.
- **Advanced Diamond Pattern Support**: First-class support for EIP-2535 Diamond Standard, including automated facet management, upgrades, and precise function selector control.
- **Deterministic CREATE2 Deployments**: Deploy contracts to the same address across multiple chains, enabled by default. Predict contract addresses before you even deploy.
- **Smart Artifact Management**: Intelligently syncs only changed contract artifacts with the Fever platform, saving 70-90% on bandwidth and time. Git-like `status` and `diff` commands provide full visibility.
- **Integrated Local Development**: Spin up a local Anvil or Ganache node instantly with `fever node`, including forking capabilities for realistic mainnet testing.
- **Comprehensive Network Management**: Easily add, remove, and switch between popular public networks or your own custom RPC endpoints.
- **Automated Dependency Handling**: The `fever install` command auto-detects your project's package manager (npm, yarn, pnpm, bun) and installs dependencies correctly every time.
- **Secure Authentication**: A secure, device-based authentication flow connects the CLI to your Fever developer account for project management and deployment tracking.

## Who Should Use It?

- **Smart Contract Developers**: Simplify your compilation, testing, and deployment pipeline.
- **DeFi Engineers**: Manage complex protocol deployments with intricate dependencies.
- **Web3 Teams**: Standardize your development and deployment processes across your team.
- **DApp Builders**: Accelerate your time-to-market with a tool that handles blockchain complexities for you.

## Common Use Cases

- **Rapid Prototyping**: Quickly deploy contracts to a local or test network.
- **Multi-Chain Deployments**: Deploy the same system to multiple chains with identical addresses.
- **CI/CD Automation**: Integrate Fever CLI into your CI/CD pipelines for automated, reliable deployments.
- **Complex System Composition**: Build and manage sophisticated applications using the Diamond Standard with ease.
