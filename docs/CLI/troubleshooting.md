---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 8
slug: /cli/troubleshooting
---

# Troubleshooting

This guide provides solutions to common issues you might encounter while using Fever CLI.

## General Issues

### `fever: command not found`

**Problem**: The `fever` command is not recognized after installation.

**Solution**:
1.  **Verify Installation**: Ensure Fever CLI is installed globally:
    ```bash
npm list -g @fevertokens/cli
    ```
    If it's not listed, reinstall it: `npm install -g @fevertokens/cli`.
2.  **Check PATH**: The directory where npm installs global packages might not be in your system's `PATH` environment variable. Find npm's global install location by running `npm get prefix` and add it to your shell's configuration file (e.g., `.zshrc`, `.bashrc`).
    ```bash
    export PATH="$(npm get prefix)/bin:$PATH"
    ```
3.  **Restart Terminal**: After modifying your shell configuration, restart your terminal or run `source ~/.zshrc` (or equivalent).

### Node.js Version Warnings

**Problem**: You see warnings about your Node.js version.

**Solution**: Fever CLI requires Node.js 20.x or higher for optimal performance and compatibility. Upgrade your Node.js version using `nvm` or by downloading the latest LTS version from [nodejs.org](https://nodejs.org/).

## Authentication Issues

### `Not connected to platform` or `Authentication failed`

**Problem**: The CLI reports that you are not authenticated or authentication fails.

**Solution**:
1.  **Log in**: Run `fever auth login` to initiate the authentication process.
2.  **Force Re-authentication**: If you were previously logged in but are still facing issues, force a re-authentication:
    ```bash
fever auth login --force
    ```
3.  **Check Network**: Ensure you have a stable internet connection and that the Fever platform URL is accessible.

### `Authorization expired`

**Problem**: Your authentication token has expired.

**Solution**: Simply run `fever auth login` again. The CLI will guide you through the re-authentication process.

## Compilation Problems

### `Compilation error: ...`

**Problem**: Your contracts fail to compile.

**Solution**:
1.  **Check Solidity Syntax**: Review your Solidity code for syntax errors.
2.  **Dependencies**: Ensure all imported contracts are correctly resolved. If you're using `node_modules`, make sure they are installed.
3.  **Clear Artifacts**: Sometimes, corrupted or outdated artifacts can cause issues. Try clearing the `.fever/` directory and recompiling:
    ```bash
rm -rf .fever/
fever compile --all
    ```
4.  **Solidity Version**: Verify that your `pragma solidity` directives are compatible with the compiler versions available. The CLI automatically detects the highest version, but conflicts can arise.

### `Contract artifacts not found`

**Problem**: Commands like `fever artifacts sync` or `fever apply` report that contract artifacts are missing.

**Solution**: You need to compile your contracts first:
```bash
fever compile --all
```

## Deployment Issues (`fever apply`)

### `Missing manifest file`

**Problem**: The `apply` command complains about a missing manifest file.

**Solution**: Ensure you are providing the path to your YAML manifest file using the `-f` or `--file` option:
```bash
fever apply -f my-manifest.yaml
```

### `Manifest validation failed`

**Problem**: Your manifest file has structural or logical errors.

**Solution**:
1.  **Review Error Messages**: The CLI provides detailed error messages, including the exact location and nature of the error. Pay close attention to these.
2.  **Check Schema**: Refer to the [Advanced Usage: Manifests](/cli/advanced-usage#deployment-manifests) section for the correct manifest structure and field requirements.
3.  **Dependency Conflicts**: If you see errors about dependency name conflicts, ensure that auto-deployed packages do not share names with explicitly defined dependencies.

### `Chain ID required` or `Network not found`

**Problem**: The CLI cannot determine which network to deploy to.

**Solution**:
1.  **Configure Project Network**: Use `fever networks select` to add networks to your project and `fever networks use <chainId>` to set a default network.
2.  **Specify in Manifest**: Add a `spec.network` section to your manifest file.
3.  **Use CLI Flags**: Override settings with `--chainId <id>` or `--chainName <name>` flags.

### `CREATE2 factory not available and fallback disabled`

**Problem**: You are attempting a CREATE2 deployment on a network where the factory contract is not deployed, and you have disabled fallback to `CREATE`.

**Solution**:
1.  **Enable Fallback**: Set `fallbackToCreate: true` in your manifest's `spec.deployment.create2` section.
2.  **Deploy Factory**: Manually deploy the [Safe Singleton Factory](https://github.com/safe-global/safe-singleton-factory) to your target network.
3.  **Disable CREATE2**: If deterministic deployment is not critical, disable CREATE2 in your manifest: `enabled: false` under `spec.deployment.create2`.

### `Getting different addresses on different chains?`

**Problem**: Your CREATE2 deployments are resulting in different addresses across chains.

**Solution**: Ensure the following are identical across all deployments:
-   **Project**: Authenticate and select the same project (`fever auth login`, `fever projects select`).
-   **Contract Name**: The `name` field in your manifest's `contract` or `application` section.
-   **Constructor Arguments**: The exact values and order of `constructorArgs`.
-   **Compiler Settings**: Consistent Solidity compiler version and optimizer settings.

## Artifact Sync Issues

### `Not connected to platform` or `No project selected`

**Problem**: `fever artifacts sync` fails because you are not authenticated or no project is selected.

**Solution**:
1.  **Authenticate**: Run `fever auth login`.
2.  **Select Project**: Run `fever projects select`.

### `Failed to sync artifacts`

**Problem**: Artifact synchronization with the platform fails.

**Solution**:
1.  **Check Network**: Ensure you have a stable internet connection.
2.  **Platform Status**: Check the status of the Fever platform.
3.  **Force Sync**: Try forcing a full sync:
    ```bash
fever artifacts sync --all --force
    ```
4.  **Clear Local Cache**: Remove local artifact tracking and try again:
    ```bash
rm .fever/workspace.json
fever artifacts sync
    ```

## Getting Help

If you encounter an issue not covered here, or need further assistance:

-   **Check Documentation**: Review the relevant command documentation.
-   **Fever CLI Platform**: Visit [cli.fevertokens.app](https://cli.fevertokens.app/) for more resources.
-   **Report Bugs**: Use the `/bug` command in this CLI to report issues directly.
