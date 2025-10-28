---
id: installation
title: Installation
sidebar_label: Installation
sidebar_position: 2
slug: /cli/installation
---

# Installation

Fever CLI is distributed as an npm package, making it easy to install globally on your system.

## Requirements

- **Node.js**: Version 20.x or higher is required for full compatibility.
- **npm**: Comes bundled with Node.js.

## Standard Installation

The recommended way to install Fever CLI is globally using npm. This makes the `fever` command available in any terminal session.

```bash
npm install -g @fevertokens/cli
```

## Verification

After installation, verify that the CLI is working correctly by running the `version` command:

```bash
fever version
```

This should display the installed version number of the CLI.

You can also check the authentication status, which should report that you are not yet logged in:

```bash
fever auth status
```

## Troubleshooting

### Permission Errors (EACCES)

If you encounter a permission error (often with `EACCES` in the message) during global installation, it means npm does not have the rights to write to the default directory. You have a few options:

1.  **Recommended: Use a Node Version Manager**: Tools like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) install Node.js in a way that avoids permission issues for global packages.

2.  **Change npm's Default Directory**: You can configure npm to use a different directory. Follow the official npm guide on [resolving EACCES permissions errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

3.  **Use `sudo` (Not Recommended)**: You can prefix the command with `sudo`, but this is generally discouraged as it can lead to other security risks.

    ```bash
    sudo npm install -g @fevertokens/cli
    ```

### Command Not Found

If your terminal says `fever: command not found` after installation, it means the directory where npm installs global packages is not in your system's `PATH`.

1.  Find npm's global install location by running:
    ```bash
    npm get prefix
    ```
2.  Add the resulting path (e.g., `/usr/local` or `~/.npm-global`) to your shell's configuration file (`.zshrc`, `.bashrc`, or `.bash_profile`). For example:

    ```bash
    export PATH="$HOME/.npm-global/bin:$PATH"
    ```

3.  Restart your terminal or run `source ~/.zshrc` (or the equivalent for your shell) to apply the changes.
