---
id: command-validate
title: 'Commands: validate'
sidebar_label: validate
slug: /cli/commands/validate
---

# `fever validate`

Validate a deployment manifest (YAML **or** JSON) without deploying.
`validate` is the fast, focused, CI-friendly sibling of
`fever apply --dry-run`:

- **No RPC.** No chain calls, no network.
- **No private key.** Missing secrets surface as warnings, not errors.
- **No `apply` semantics.** Validates every manifest kind — including
  `Network`, which `apply` intentionally refuses to deploy.
- **YAML and JSON.** Both formats route through the same pipeline and produce
  identical results.
- **Machine-readable.** `--json` emits a structured report that editors and
  CI jobs can parse.

## Usage

```bash
fever validate <file> [options]
```

## Options

| Option | Description |
| :--- | :--- |
| `--json` | Emit a JSON report on stdout. Exit code still reflects validity. |
| `--plan` | Additionally print the resolved deployment plan (constructor args + synthetic dependency addresses). |

## Exit codes

| Code | Meaning |
| :---: | :--- |
| `0` | Manifest loaded, schema-validated, and templating resolved. |
| `1` | Validation failed (schema error, bad dependency reference, unresolvable placeholder, malformed file). |
| `2` | Argument error (missing `<file>`, path doesn't exist). |

## Examples

### Validate a YAML manifest

```bash
$ fever validate f9s/microloan-package-system.yaml
✓ f9s/microloan-package-system.yaml — PackageSystem (beta/v1, yaml)
    ! Unresolved placeholder in spec.deployer.wallet.value: ${PRIVATE_KEY}
```

### Validate a JSON manifest

```bash
$ fever validate f9s/erc20-config.json
✓ f9s/erc20-config.json — Contract (beta/v1, json)
```

### Validate a Network manifest

```bash
$ fever validate f9s/networks.yml
✓ f9s/networks.yml — Network (beta/v1, yaml)
```

### Machine-readable output

```bash
$ fever validate f9s/microloan-package-system.yaml --json
{
  "file": "f9s/microloan-package-system.yaml",
  "format": "yaml",
  "ok": true,
  "kind": "PackageSystem",
  "apiVersion": "beta/v1",
  "name": "microloan-application",
  "errors": [],
  "warnings": [
    "Unresolved placeholder in spec.deployer.wallet.value: ${PRIVATE_KEY}"
  ],
  "resolved": {
    "constructorArgs": [
      "0x0000000000000000000000000000000000000002",
      "0x0000000000000000000000000000000000000001",
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ],
    "dependencies": {
      "packageController": "0x0000000000000000000000000000000000000002",
      "packageViewer": "0x0000000000000000000000000000000000000001"
    }
  }
}
```

### Inspect the resolved plan

```bash
$ fever validate f9s/microloan-package-system.yaml --plan
✓ f9s/microloan-package-system.yaml — PackageSystem (beta/v1, yaml)

  Resolved plan:
    Constructor args:
      1. 0x0000000000000000000000000000000000000002
      2. 0x0000000000000000000000000000000000000001
      3. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    Dependencies (synthetic):
      • packageController → 0x0000000000000000000000000000000000000002
      • packageViewer → 0x0000000000000000000000000000000000000001
```

## CI integration

`validate` is designed to drop straight into CI:

```yaml
# .github/workflows/manifests.yml
name: Manifest validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
      - name: Install fever CLI
        run: curl -fsSL https://cli.fevertokens.app/install.sh | bash
      - name: Validate all f9s manifests
        run: |
          for f in f9s/*.yml f9s/*.yaml f9s/*.json; do
            fever validate "$f" --json
          done
```

## How it differs from `apply --dry-run`

| | `fever validate` | `fever apply --dry-run` |
| :--- | :---: | :---: |
| Schema-validates the manifest | ✅ | ✅ |
| Resolves `${ENV}` placeholders | ✅ | ✅ |
| Resolves `$dependencies.*` refs with synthetic addresses | ✅ | ✅ |
| Prints a deployment plan by default | only with `--plan` | ✅ |
| Emits JSON for CI / editors | ✅ (`--json`) | ❌ |
| Accepts `kind: Network` | ✅ | ⚠️ reports "not deployable" |
| Accepts both YAML and JSON | ✅ | ✅ |

**Rule of thumb:** use `validate` in CI and pre-commit hooks, use
`apply --dry-run` when walking through a deployment interactively.

## Learn more

- **[Manifests Guide](../manifests.md)** — complete manifest reference, including
  the "YAML or JSON" and "Validating a manifest" sections.
- **[`fever apply`](./apply.md)** — sibling command, applies the manifest for real.
- **[`fever networks`](./networks.md)** — manage `f9s/networks.yml`.
