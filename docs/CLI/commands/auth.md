---
id: command-auth
title: 'Commands: auth'
sidebar_label: auth
slug: /cli/commands/auth
---

# `fever auth`

Manage authentication with the Fever platform. This command group allows you to log in, log out, and check your current authentication status.

A successful authentication is required for commands that interact with the platform, such as `projects` and `artifacts`.

## Subcommands

### `login`

Initiate the device authorization flow to authenticate the CLI with your Fever account.

**Usage**

```bash
fever auth login [options]
```

**Alias**: `fever login`

**Process**

1.  The CLI requests a device code from the Fever platform.
2.  It displays a verification URL and a unique user code.
3.  It attempts to open the URL in your default browser.
4.  You enter the code at the URL and authorize the device.
5.  The CLI polls for authorization and, upon success, securely stores an API key for future requests.

**Options**

| Option | Description |
| :--- | :--- |
| `--url <url>` | Specify a custom platform URL. Defaults to `https://cli.fevertokens.app/`. |
| `--force` | Force re-authentication even if you are already logged in. |

**Example**

```bash
$ fever auth login

🔐 Authenticating with Fever Web Platform...
Platform: https://cli.fevertokens.app/
📱 Initiating device authorization...

🔑 Authorization Required
Please visit the following URL and enter the code:

   https://cli.fevertokens.app/activate?cliVersion=x.x.x

   Code: ABCD-EFGH

🌐 Opening browser automatically...
⏳ Waiting for authorization...

✅ Successfully authenticated!
```

### `status`

Check your current authentication status and connection details.

**Usage**

```bash
fever auth status [options]
```

**Options**

| Option | Description |
| :--- | :--- |
| `--json` | Output the status in JSON format for scripting. |
| `--verbose` | Show detailed connection information, including API key prefix and expiration. |

**Example: Standard Status**

```bash
$ fever auth status

📊 Authentication Status

✅ Authenticated
```

**Example: Verbose Status**

```bash
$ fever auth status --verbose

📊 Authentication Status

✅ Authenticated

Connection Details:
   Platform: https://cli.fevertokens.app/
   API Key: fv_xxxxxxxxxxxx...
   Project: my-project-slug
   Expires: 1/26/2026
   Status: Active
```

### `logout`

Log out of the Fever platform by clearing your locally stored credentials.

**Usage**

```bash
fever auth logout [options]
```

**Alias**: `fever logout`

**Options**

| Option | Description |
| :--- | :--- |
| `--all` | (Future use) Clear all stored connections. |

**Example**

```bash
$ fever auth logout

🚪 Logging out from Fever Web Platform...
Platform: https://cli.fevertokens.app/

✅ Successfully logged out
```
