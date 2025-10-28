---
id: advanced-usage
title: Advanced Usage
sidebar_label: Advanced Usage
sidebar_position: 5
slug: /cli/advanced-usage
---

# Advanced Usage

This section delves into the more powerful and nuanced features of Fever CLI, enabling you to leverage its full potential for complex smart contract development and deployment scenarios.

## Deployment Manifests

Fever CLI uses declarative YAML manifests to define your smart contract deployments. These manifests are the single source of truth for your on-chain system, allowing for consistent, reproducible, and auditable deployments.

Manifests can define three primary kinds of deployments:

- **`Contract`**: For deploying a single, standalone smart contract.
- **`Package`**: (Deprecated, use `Contract`) Similar to `Contract`, but historically used for individual contract modules.
- **`Application`**: For deploying complex systems based on the [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535), enabling modular, upgradeable smart contract architectures.

### Basic Structure

All manifests share a common top-level structure:

```yaml
apiVersion: v1 # or beta/v1
kind: Application # or Contract, Package
metadata:
  name: my-deployment
  version: 1.0.0
  description: 'A brief description of the deployment'
spec:
  # Deployment-specific configuration goes here
```

### Key Sections

- **`apiVersion`**: Specifies the API version of the manifest schema. Currently `v1` or `beta/v1`.
- **`kind`**: Defines the type of deployment (e.g., `Application`, `Contract`).
- **`metadata`**: Contains descriptive information about the deployment (name, version, description).
- **`spec`**: The core of the manifest, containing all the configuration for the deployment, including:
  - `contract` / `package` / `application`: Details about the main contract or application.
  - `dependencies`: Other contracts that your main deployment relies on.
  - `packages`: (For `Application` kind) Defines the facets to be included in your Diamond.
  - `deployer`: Wallet and gas settings for the deployment.
  - `network`: Target blockchain network configuration.
  - `deployment`: General deployment settings like output paths or CREATE2 configuration.

For detailed examples, refer to the [`fever apply` command documentation](./commands/apply.md).

## CREATE2 Deterministic Deployments

Fever CLI leverages **CREATE2 by default** for deterministic contract deployment, primarily via the [Safe Singleton Factory](https://github.com/safe-global/safe-singleton-factory). This ensures that your contracts are deployed to the same address across all compatible EVM chains.

### Why CREATE2?

- **Same Address Across Chains**: Deploy your contracts to Ethereum, Polygon, Arbitrum, etc., and they will all have the identical address.
- **Predictability**: Know your contract addresses before deployment, which is crucial for frontend integration and cross-chain interactions.
- **Security**: Mitigate address squatting and front-running risks.
- **Upgradability**: Redeploy to the same address if needed, simplifying certain upgrade patterns.

### Default Behavior

CREATE2 is automatically enabled for all deployments. No special configuration is needed in your manifest for basic usage.

```bash
fever apply -f manifest.yaml
```

When authenticated with a project selected, the CLI automatically generates a **project-based salt**, ensuring the same address across all chains for that project and contract.

```bash
fever auth login
fever projects select my-project
fever apply -f manifest.yaml
```

Output:

```
🔐 Using project-based deterministic salt
✅ CREATE2 factory found
📍 Predicted address: 0xABC123...
✅ MyContract deployed at 0xABC123...
```

### Custom Configuration

You can customize CREATE2 behavior within the `spec.deployment.create2` section of your manifest.

```yaml
spec:
  deployment:
    create2:
      enabled: true # Optional, true by default
      salt: 'my-custom-salt-v1' # Optional, auto-generated if not provided
      factoryAddress: '0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7' # Optional, defaults to Safe Singleton Factory
      fallbackToCreate: true # Optional, true by default. Fallback to CREATE if factory missing
```

| Option             | Default                                      | Description                                                                                                                                                                 |
| :----------------- | :------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`          | `true`                                       | Enable/disable CREATE2 deployment.                                                                                                                                          |
| `salt`             | Auto-generated                               | A 32-byte hex string or plain string. If a plain string, it's keccak256-hashed. Auto-generated from project context if not provided.                                        |
| `factoryAddress`   | `0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7` | The address of the CREATE2 factory contract. Defaults to the Safe Singleton Factory.                                                                                        |
| `fallbackToCreate` | `true`                                       | If `true`, the CLI will fall back to a traditional `CREATE` deployment if the specified `factoryAddress` is not found on the network. If `false`, the deployment will fail. |

### Multi-Chain Same Address Deployments

To achieve the same address across multiple chains, ensure you are authenticated and have a project selected. Then, use the same manifest (or manifests with identical contract names and constructor arguments) for each chain.

```yaml
# ethereum.yaml
apiVersion: v1
kind: Deployment
metadata:
  name: MultiChainContract
spec:
  contract:
    name: MyContract
  constructorArgs:
    - value: 1000
  network:
    chainId: 1
    rpcUrl: ${ETHEREUM_RPC_URL}
```

```yaml
# polygon.yaml
apiVersion: v1
kind: Deployment
metadata:
  name: MultiChainContract # Same metadata = same address
spec:
  contract:
    name: MyContract
  constructorArgs:
    - value: 1000 # Must be identical!
  network:
    chainId: 137
    rpcUrl: ${POLYGON_RPC_URL}
```

Deploy to each chain:

```bash
fever apply -f ethereum.yaml
fever apply -f polygon.yaml
```

Both deployments will result in `MyContract` having the same address on Ethereum and Polygon.

## Application Proxy Support (Diamond Pattern)

Fever CLI provides robust support for the [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535), enabling you to build modular, upgradeable smart contract systems. This includes features like auto-deploying facets, flexible function identifier formats, and automatic selector expansion for precise change tracking.

### Auto-Deploy Packages (Facets)

When defining `packages` (facets) within an `Application` manifest, you no longer need to explicitly define them as `dependencies` if they don't have an `address` field. The CLI will automatically treat them as implicit dependencies and deploy them for you.

**Before (Traditional Approach)**

```yaml
dependencies:
  loanRegistry:
    name: LoanRegistry

packages:
  - name: LoanRegistry
    address: $dependencies.loanRegistry.address
    functions: '*'
```

**After (New Auto-Deploy Approach)**

```yaml
packages:
  # Just define the package - it will be auto-deployed!
  - name: LoanRegistry
    functions: '*'
    # Optional: Add constructor args if needed
    constructorArgs:
      - value: '${SOME_PARAM}'
```

This simplifies your manifests and leverages the existing dependency deployment infrastructure, including CREATE2 support, deployment tracking, and redeployment checks.

### Function Identifier Formats

When specifying functions for your facets in the `packages` section, Fever CLI supports three flexible formats, all of which are internally normalized to hex selectors:

1.  **Hex Selector** (traditional): `"0xc19fa698"`
2.  **Function Signature** (precise): `"createLoan((uint8,uint16,...))"`
3.  **Function Name** (simple): `"createLoan"` (only if unique in the contract ABI)
4.  **Wildcard**: `"*"` or omitting the `functions` field entirely (expands to all functions).

**Example**

```yaml
packages:
  - name: LoanRegistry
    functions:
      - '0xc19fa698' # Hex selector
      - getLoan # Function name (if unique)
      - 'updateLoan(uint256,uint256)' # Function signature
      - '*' # Wildcard - all functions
```

:::note
If a function name is ambiguous (due to overloading), the CLI will provide a helpful error message suggesting the full signature to use.
:::

### Automatic Selector Expansion

When you use `functions: "*"` or omit the `functions` field for a package, the CLI automatically expands this to the complete list of function selectors from the contract's ABI. This provides several benefits:

- **Precise Change Detection**: The system can compare old vs. new selectors, identifying exactly what changed.
- **Efficient Diamond Cuts**: Only the necessary `Add`, `Replace`, or `Remove` operations are performed on your Diamond, optimizing gas costs and transaction complexity.
- **Easier Maintenance**: You don't need to manually update selector lists when your facet contracts change.

**Example Scenario: Updating a Facet**

1.  **Initial Deployment**: Your manifest defines `LoanRegistry` with `functions: "*"`.
2.  **Contract Update**: You add new functions (`updateLoan`, `deleteLoan`) to your `LoanRegistry` Solidity contract.
3.  **Recompile & Apply**: You run `fever compile --all` and then `fever apply -f application.yaml`.
4.  **Automatic Update**: The CLI detects the new functions, calculates their selectors, and performs a `DiamondCut` operation to add only those new selectors to your deployed `LoanRegistry` facet.

This intelligent system ensures your Diamond application stays synchronized with your codebase with minimal manual intervention.
