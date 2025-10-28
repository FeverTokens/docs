---
id: command-install
title: 'Commands: install'
sidebar_label: install
slug: /cli/commands/install
---

# `fever install`

Automatically detect and run the appropriate package manager install command based on your project's lock files. This command simplifies dependency management, especially when working across multiple projects that use different package managers.

## Usage

```bash
fever install [options]
```

## Options

| Option | Description |
| :--- | :--- |
| `--pm <manager>` | Force a specific package manager (`npm`, `yarn`, `pnpm`, `bun`). |
| `--silent` | Run the installation silently, suppressing detection info and package manager output. |
| `--ci`, `--frozen-lockfile` | Use clean install mode for reproducible installations (e.g., `npm ci`, `pnpm install --frozen-lockfile`). |

## How It Works

1.  **Lock File Detection**: The command checks for lock files in the current directory in the following priority order:
    1.  `bun.lockb` (Bun)
    2.  `pnpm-lock.yaml` (pnpm)
    3.  `yarn.lock` (Yarn)
    4.  `package-lock.json` (npm)
2.  **Package Manager Verification**: Once a lock file is detected, it verifies that the corresponding package manager is installed and available in your system's PATH.
3.  **Installation**: It then executes the appropriate install command (e.g., `bun install`, `pnpm install`, `yarn install`, `npm install`).
4.  **Fallback**: If no lock file is found but a `package.json` exists, it defaults to `npm install`.

## Clean Install Mode (`--ci` or `--frozen-lockfile`)

This mode is ideal for CI/CD pipelines or when you need reproducible builds. It ensures that your `node_modules` directory exactly matches your lock file, preventing accidental updates.

-   **npm**: Uses `npm ci` (removes `node_modules`, faster, requires lock file).
-   **pnpm**: Uses `pnpm install --frozen-lockfile`.
-   **Yarn v1**: Uses `yarn install --frozen-lockfile`.
-   **Yarn v2+ (Berry)**: Uses `yarn install --immutable`.
-   **Bun**: Uses `bun install --frozen-lockfile`.

## Examples

### Auto-Detect and Install

```bash
fever install

# Example output if yarn.lock is found:
📦 Package Manager Detection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Manager: yarn
   Lock file: yarn.lock
   Command: yarn install
   Detection: Detected from lock file

⏳ Running yarn install...
# ... yarn output ...
✅ Dependencies installed successfully!
```

### Force a Specific Package Manager

```bash
fever install --pm pnpm

Using specified package manager: pnpm

⏳ Running pnpm install...
# ... pnpm output ...
✅ Dependencies installed successfully!
```

### Clean Install for CI/CD

```bash
fever install --ci

# Example output if package-lock.json is found:
📦 Package Manager Detection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Manager: npm
   Lock file: package-lock.json
   Command: npm ci (clean install)
   Detection: Detected from lock file

⏳ Running npm ci (clean install)...
# ... npm ci output ...
✅ Dependencies installed successfully!
```

### Silent Installation

```bash
fever install --silent
```

## Troubleshooting

### `Could not detect package manager`

This usually means there's no `package.json` or lock file in your current directory.

-   Ensure you are running the command from the root of your Node.js project.
-   If you're starting a new project, you might need to run `npm init -y` first.

### `Package manager not installed`

If `fever install` detects a lock file (e.g., `pnpm-lock.yaml`) but the corresponding package manager (`pnpm`) is not installed on your system, it will warn you and try to fall back to another detected package manager (usually npm).

To fix this, install the missing package manager globally:

```bash
npm install -g pnpm # or yarn, or bun
```
