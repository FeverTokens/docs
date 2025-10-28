---
id: command-wallets
title: 'Commands: wallets'
sidebar_label: wallets
slug: /cli/commands/wallets
---

# `fever wallets`

Manage Ethereum wallets for your project. This command group currently supports generating new wallets with mnemonic seed phrases, private keys, and addresses.

## Subcommands

### `generate`

Generate a new Ethereum wallet, including its mnemonic seed phrase, private key, and public address. You will be prompted to append these values to your project's `.env` file.

**Usage**

```bash
fever wallets generate
```

**Example**

```bash
$ fever wallets generate

🔐 Creating new wallet...

✅ Wallet created successfully!

MNEMONIC:
word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12

PRIVATE_KEY:
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

DEPLOY_ADDRESS:
0xYourNewWalletAddressHere

? Do you want to append these values to your .env file? (Y/n) Y

✅ Wallet information appended to .env file
   Location: /path/to/your/project/.env
```

:::warning
**Secure Your Mnemonic and Private Key!**

-   Never share your mnemonic or private key with anyone.
-   Store them in a secure, encrypted location.
-   The generated wallets are primarily for development and testing. For production, consider hardware wallets or robust key management solutions.
:::
