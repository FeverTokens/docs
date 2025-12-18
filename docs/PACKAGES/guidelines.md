---
id: packages-guidelines
title: Guidelines
sidebar_label: Guidelines
sidebar_position: 5
slug: /packages/guidelines
---

# **FeverTokens Packages**

## **🔍 Overview**

The **FeverTokens Package-Oriented Framework** is a composable smart contract architecture based on the [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535). It provides a structured and modular approach for building scalable, upgradable, and reusable smart contract packages tailored to institutional and mission-critical systems.

By following a strict separation of concerns, this framework makes smart contracts:

- Easier to audit and maintain

- Highly composable and upgradable

- Compatible with tooling for version management and deployment

- Ready for integration into larger smart contract systems using the FeverTokens Hub

## **📏 Compliance Rules**

### **Critical Separation Requirements**

Every package MUST ship the five files listed below with **strict separation of concerns**:

**`IMyPackageInternal.sol` - Types & Interface ONLY:**

- ✅ MUST declare enums and structs at file scope (outside the `interface` block)
- ✅ MUST declare events and errors inside the interface
- ❌ MUST NOT contain any implementation logic
- ❌ MUST NOT declare state variables

**`IMyPackage.sol` - External Interface ONLY:**

- ✅ MUST inherit `IMyPackageInternal`
- ✅ MUST declare every externally callable function signature
- ❌ MUST NOT contain any implementation

**`MyPackageStorage.sol` - State Storage ONLY:**

- ✅ MUST contain a `Layout` struct with all state variables
- ✅ MUST use ERC-7201 namespacing: `erc7201:fevertokens.storage.<PackageName>`
- ✅ MUST precompute the storage slot constant
- ✅ MUST include the `@custom:storage-location` docblock immediately above `STORAGE_SLOT`
- ✅ SHOULD include a comment showing the derivation formula used to compute `STORAGE_SLOT`
- ✅ MUST provide a `layout()` function returning the storage reference
- ❌ MUST NOT contain business logic (other than `layout()`)

**`MyPackageInternal.sol` - Internal Logic ONLY:**

- ✅ MUST implement `IMyPackageInternal`
- ✅ MUST contain ONLY internal functions (business logic functions MUST be prefixed with `_`; initializer functions MUST use `__MyPackage_init` / `__MyPackage_init_unchained`)
- ✅ MUST access state ONLY via `MyPackageStorage.layout()`
- ✅ MAY inherit other internal contracts for reusable modifiers/helpers
- ❌ MUST NOT declare structs, enums, events, or errors (use `IMyPackageInternal.sol`)
- ❌ MUST NOT declare state variables (use `MyPackageStorage.sol`)
- ❌ MUST NOT contain public/external functions (use `MyPackage.sol`)

**`MyPackage.sol` - External Delegation ONLY:**

- ✅ MUST inherit both `IMyPackage` and `MyPackageInternal`
- ✅ MUST implement every function from `IMyPackage`
- ✅ Each non-initializer function MUST immediately delegate to its `_functionName` internal function (initializer entrypoints delegate to `__MyPackage_init(...)`)
- ❌ MUST NOT contain business logic, authorization checks, or storage access
- ❌ MUST NOT duplicate logic from internal functions

---

## **💎 Diamond Architecture Principles**

Each package is a modular facet of a Diamond and adheres to the following design principles:

- **Separation of Concerns**: Interfaces, logic, and storage are explicitly decoupled.

- **Interface Definitions**: Cleanly specified internal and external interfaces for integration and documentation.

- **Storage Management**: Explicit and namespaced layout management using custom storage slots.

- **Upgradeable Logic**: Built to support safe upgrades via the Diamond proxy architecture.

---

## **⛔ Cross-Package Communication Rules**

### **Within the Same Diamond**

Packages integrated into the same Diamond MUST NOT call each other via external calls:

```solidity
// ❌ FORBIDDEN: External call between packages of the same Diamond
function _doSomething() internal {
  IPackageB(address(this)).someFunction(); // NO!
}
```

**Why this is forbidden:**

1. **Gas overhead**: External calls cost ~2600 gas minimum vs ~100 for internal jumps
2. **Reentrancy surface**: Creates unexpected entry points into your own Diamond
3. **Selector collisions**: Diamond routing adds complexity and potential conflicts
4. **Upgrade fragility**: External interfaces are harder to change than internal ones

### **Correct Pattern: Internal API Inheritance**

Use the Internal API pattern to share functionality between packages:

```solidity
// ✅ CORRECT: Inherit minimal internal API
abstract contract PackageAInternal is IPackageAInternal, PackageBInternalAPI {
  function _doSomething() internal {
    uint256 value = _getPackageBValue(); // Direct internal call
  }
}
```

### **Between Different Diamonds**

External calls between separate Diamond deployments ARE permitted when necessary,
but should be clearly documented and guarded against reentrancy.

---

## **📦 Package Structure**

Each package MUST include **five distinct components**, each as a separate file:

| File                     | Purpose                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `IMyPackageInternal.sol` | Houses file-scope enums/structs plus the internal interface declarations |
| `IMyPackage.sol`         | External interface: defines every externally callable function           |
| `MyPackageStorage.sol`   | Storage layout using diamond storage pattern                             |
| `MyPackageInternal.sol`  | Internal logic: uses and modifies package storage                        |
| `MyPackage.sol`          | External-facing contract: wraps internal logic                           |

---

### **🔹 Internal Interface – `IMyPackageInternal.sol`**

Defines the internal elements of the package: enums, structs, events, and errors. All enums/structs MUST be declared outside the `interface` block to prevent accidental inheritance bloat.

```solidity
enum MyEnum {
  Option1,
  Option2
}

struct MyStruct1 {
  uint256 value;
  address addr;
}

struct MyStruct2 {
  bool active;
  uint256 count;
}

interface IMyPackageInternal {
  event MyEvent1(address indexed sender, uint256 value);
  event MyEvent2(address indexed actor, bool action);
  error Unauthorized();
}
```

---

### **🔹 External Interface – `IMyPackage.sol`**

This interface MUST inherit `IMyPackageInternal` and declare every selector that the package exposes. `MyPackage.sol` MUST implement every function declared here.

```solidity
import "./IMyPackageInternal.sol";

interface IMyPackage is IMyPackageInternal {
  function myFunction1(uint256 value1) external;
  function myFunction2(address addr, uint256 value2) external;
}
```

---

### **🔹 Storage Layout – `MyPackageStorage.sol`**

Encapsulates the state in a `Layout` struct and MUST declare an [ERC-7201](https://eips.ethereum.org/EIPS/eip-7201) storage slot using the package namespace `erc7201:fevertokens.storage.MyPackage` (replace `MyPackage` with your package name).

The `STORAGE_SLOT` value is precomputed and hardcoded as a constant to avoid hashing/encoding at runtime, reducing gas and keeping `layout()` as a minimal “point to the right storage” helper.

`STORAGE_SLOT` and `layout()` MUST remain present and stable across upgrades: they are the canonical way (for other packages and for tooling) to locate this package’s storage when the namespace and `Layout` schema are known.

```solidity
import { MyStruct1 } from "./IMyPackageInternal.sol";

library MyPackageStorage {
  struct Layout {
    uint256 value1;
    address addr1;
    uint256 value2;
    MyStruct1 myObject1;
    bool active;
  }

  /**
   * @dev Storage slot constant for the MyPackage storage layout.
   * @custom:storage-location erc7201:fevertokens.storage.MyPackage
   */
  bytes32 internal constant STORAGE_SLOT =
    0x69fb3151f6b03a5cd3dd3c005b691dc969efc5968c08d9f970b3180328dafb00; // Replace with your package-specific slot constant.

  // Derivation id (portion after `erc7201:`): "fevertokens.storage.MyPackage"
  // keccak256(abi.encode(uint256(keccak256("fevertokens.storage.MyPackage")) - 1)) & ~bytes32(uint256(0xff))

  function layout() internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly {
      l.slot := slot
    }
  }
}
```

You can deterministically derive the `STORAGE_SLOT` value with a short TypeScript helper:

```ts
import {keccak256, toUtf8Bytes, AbiCoder, toBeHex, zeroPadValue} from "ethers";

/**
 * Computes an ERC-7201 compliant storage slot.
 *
 * Formula: keccak256(abi.encode(uint256(keccak256(id)) - 1)) & ~bytes32(uint256(0xff))
 *
 * The subtraction by 1 and final byte masking prevent collisions with
 * Solidity's native mapping/array slot derivations.
 *
 * @param storageLocation - Must follow format "erc7201:vendor.storage.PackageName"
 * @returns The 32-byte storage slot as a hex string
 */
export function computeERC7201StorageSlot(
	storageLocation: string,
): `0x${string}` {
	if (!storageLocation.startsWith("erc7201:")) {
		throw new Error(
			"storageLocation must use ERC-7201 format: erc7201:vendor.storage.PackageName",
		);
	}

	// FeverTokens uses the portion after `erc7201:` as the derivation id.
	const id = storageLocation.slice("erc7201:".length);

	// Step 1: keccak256 of the id string
	const namespaceHash = keccak256(toUtf8Bytes(id));

	// Step 2: Convert to BigInt and subtract 1
	const hashBigInt = BigInt(namespaceHash);
	const decremented = hashBigInt - 1n;

	// Step 3: abi.encode(uint256(decremented))
	const abiCoder = AbiCoder.defaultAbiCoder();
	const encoded = abiCoder.encode(["uint256"], [decremented]);

	// Step 4: keccak256 of the encoded value
	const finalHash = keccak256(encoded);

	// Step 5: Mask out the last byte (& ~0xff)
	// This sets the last byte to 0x00
	const masked = BigInt(finalHash) & ~0xffn;

	// Convert back to 32-byte hex string
	return zeroPadValue(toBeHex(masked), 32) as `0x${string}`;
}

// Verification helper - computes using Solidity-equivalent approach
export function verifySlot(storageLocation: string): void {
	const slot = computeERC7201StorageSlot(storageLocation);
	console.log(`Storage location: ${storageLocation}`);
	console.log(`Storage Slot: ${slot}`);
	console.log(`Last byte (should be 00): ${slot.slice(-2)}`);
}

// Example usage
verifySlot("erc7201:fevertokens.storage.MyPackage");
// Output:
// Namespace: erc7201:fevertokens.storage.MyPackage
// Storage Slot: 0x... (ends with 00)
// Last byte (should be 00): 00
```

Run it with `ts-node`, `tsx`, or the TypeScript runner of your choice and paste the emitted hash back into `MyPackageStorage.sol`.

---

### **🔹 Internal Logic – `MyPackageInternal.sol`**

Implements the core business logic using the namespaced storage. This abstract contract MUST keep functions `internal`, MAY inherit other internal logic libraries/contracts, SHOULD centralize modifiers there for reuse, and is the canonical place to perform access control/authorization checks before writing to storage.

**✅ CORRECT Implementation:**

```solidity
import "./IMyPackageInternal.sol";
import { MyPackageStorage } from "./MyPackageStorage.sol";
import { SharedInternal } from "./SharedInternal.sol";

// SharedInternal exposes reusable helpers such as the `MyModifier` modifier.
abstract contract MyPackageInternal is IMyPackageInternal, SharedInternal {
  using MyPackageStorage for MyPackageStorage.Layout;

  // ✅ Constants are OK
  uint256 internal constant MAX_VALUE = 1000;

  // ✅ Modifiers accessing storage via layout()
  modifier onlyAdmin() {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    if (msg.sender != l.addr1) revert Unauthorized();
    _;
  }

  // ✅ Internal functions with _ prefix
  function _myFunction1(uint256 value1_) internal onlyAdmin MyModifier {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    l.value1 = value1_;
    emit MyEvent1(msg.sender, value1_);
  }

  function _myFunction2(address addr_, uint256 value2_) internal {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    l.addr1 = addr_;
    l.value2 = value2_;
  }
}
```

**❌ WRONG - Common Violations:**

```solidity
abstract contract MyPackageInternal is IMyPackageInternal {
  // ❌ VIOLATION: State variables belong in MyPackageStorage.sol
  uint256 public myValue;
  address public admin;
  mapping(address => bool) public authorized;

  // ❌ VIOLATION: Structs belong in IMyPackageInternal.sol at file scope
  struct MyData {
    uint256 value;
    address owner;
  }

  // ❌ VIOLATION: Events belong in IMyPackageInternal.sol interface
  event DataUpdated(uint256 value);

  // ❌ VIOLATION: Errors belong in IMyPackageInternal.sol interface
  error Unauthorized();

  // ❌ VIOLATION: Public/external functions belong in MyPackage.sol
  function doSomething() external {
    // ...
  }

  // ❌ VIOLATION: Accessing state variables directly instead of via layout()
  function _updateValue(uint256 newValue) internal {
    myValue = newValue; // WRONG! Use MyPackageStorage.layout().myValue
  }
}
```

**✅ Correct Pattern - Access Storage:**

Always access state through the storage layout:

```solidity
function _updateAdmin(address newAdmin) internal {
  MyPackageStorage.Layout storage l = MyPackageStorage.layout();
  l.addr1 = newAdmin; // ✅ CORRECT
}
```

---

### **🔹 Package Entry Point – `MyPackage.sol`**

Implements the external interface and MUST delegate every non-initializer call to the `_`-prefixed internal function defined in `MyPackageInternal.sol` (initializer entrypoints delegate to `__MyPackage_init(...)`). This contract MUST NOT re-implement business logic.
All access control, authorization guards, and state mutations happen inside `MyPackageInternal`, so this file remains a thin, declarative delegate.

```solidity
import { IMyPackage } from "./IMyPackage.sol";
import { MyPackageInternal } from "./MyPackageInternal.sol";

contract MyPackage is IMyPackage, MyPackageInternal {
  function myFunction1(uint256 value1_) external override {
    _myFunction1(value1_);
  }

  function myFunction2(address addr_, uint256 value2_) external override {
    _myFunction2(addr_, value2_);
  }
}
```

---

## **🧱 Package Initialization (Upgradeable Facets)**

Packages which need one-time setup (roles, initial configuration, cached values) MUST follow a two-step initializer pattern, similar to OpenZeppelin Upgradeable contracts:

- `__MyPackage_init(...)` starts initialization for the package and is guarded by `initializer(MyPackageStorage.STORAGE_SLOT)`.
- `__MyPackage_init_unchained(...)` contains only this package’s initialization logic and is guarded by `onlyInitializing(MyPackageStorage.STORAGE_SLOT)`.

This split allows safe composition when a package’s internal logic is built from multiple internal “mixins” that share the _same_ package storage slot. The top-level initializer can call each mixin’s unchained initializer exactly once, in a deterministic order, avoiding accidental double-initialization in complex inheritance graphs.

### **🔹 Internal initializer pattern**

```solidity
function __MyPackage_init(
  MyInitParams memory p
) internal initializer(MyPackageStorage.STORAGE_SLOT) {
  // If this package composes other internal mixins that also use
  // MyPackageStorage.STORAGE_SLOT, initialize them first (unchained):
  // __MyMixinA_init_unchained(p);
  // __MyMixinB_init_unchained(p);

  __MyPackage_init_unchained(p);
}

function __MyPackage_init_unchained(
  MyInitParams memory p
) internal onlyInitializing(MyPackageStorage.STORAGE_SLOT) {
  // package-specific initialization only
}
```

### **🔹 External entrypoint (facet initializer)**

If a package needs initialization, `MyPackage.sol` SHOULD expose an external initializer (used as `initCalldata` during `diamondCut`) which delegates to the internal initializer. If exposed, this initializer MUST also be declared in `IMyPackage.sol`.

```solidity
function MyPackage_init(MyInitParams calldata p) external {
  __MyPackage_init(p);
}
```

### **🔹 Notes on composing across packages**

- The `initializer/onlyInitializing` guards are keyed by the `storageSlot_` argument and tracked in `InitializableStorage.initialization[storageSlot_]`. Treat that storage slot as “the package’s init domain”.
- If you are composing multiple _separate packages_ (each with its own `STORAGE_SLOT`), initialize each package by calling its own `__OtherPackage_init(...)` (not the other package’s unchained initializer), since the other package’s `onlyInitializing` guard applies to its own storage slot.

---

## **✅ Best Practices**

- **Interface hygiene**: Declare enums and structs at file scope within `IMyPackageInternal.sol` so other packages can import them without inheriting the interface.
- **Function naming**: Prefix internal functions with `_` (e.g., `_myFunction1`) for clarity.
- **Initializer naming**: When a package needs one-time setup, use `__MyPackage_init` / `__MyPackage_init_unchained` (not `_`-prefixed names) to match the upgradeable initializer convention.

- **External delegation**: The external contract MUST implement every selector and immediately call the internal logic (`_...` for normal functions, `__..._init` for initializer entrypoints). Never duplicate logic in `MyPackage.sol`.
- **Access control**: Keep every modifier and authorization check inside `MyPackageInternal` (or shared internal helpers) so there is a single source of truth.

- **Parameter naming**: Use trailing underscores (e.g., `value1_`) to avoid variable shadowing.

- **Testing**: Unit-test each package and integration-test multiple packages as part of a system.

- **Documentation**: Comment the purpose and logic of each package, especially for critical functions.

- **Storage safety**: Never change the order or type of variables in a layout struct once deployed, and always annotate the ERC-7201 slot with `@custom:storage-location`.

---

## **🚀 Create Your Own Package (Quick Guide)**

1. **Define internal elements** in `IMyPackageInternal.sol`:

   - You MUST declare enums and structs at file scope, and keep events/errors inside the interface

2. **Define external interface** in `IMyPackage.sol`:

   - MUST extend the internal interface

   - MUST declare every externally accessible function

3. **Create a storage layout** in `MyPackageStorage.sol`:

   - MUST add a namespaced `Layout` struct

   - MUST precompute the ERC-7201 slot constant for `erc7201:fevertokens.storage.<PackageName>` and annotate it with `@custom:storage-location`
   - MUST include `STORAGE_SLOT` and `layout()` (stable across upgrades)
   - SHOULD include a `STORAGE_SLOT` derivation comment (formula)

4. **Implement internal logic** in `MyPackageInternal.sol`:

   - MUST use the layout via `MyPackageStorage.layout()`

   - SHOULD implement reusable internal helper methods (and MAY inherit other internal contracts if you need their modifiers)

5. **Build your package** in `MyPackage.sol`:

   - MUST inherit from `IMyPackage` and `MyPackageInternal`

   - MUST implement every external function and immediately delegate to internal logic (`_...` for normal functions, `__..._init` for initializer entrypoints)

---

## **🔍 Compliance Checklist**

Use this checklist to verify your package follows all guidelines:

### **IMyPackageInternal.sol**

- [ ] All enums declared at file scope (outside interface)
- [ ] All structs declared at file scope (outside interface)
- [ ] All events declared inside the interface
- [ ] All errors declared inside the interface
- [ ] NO implementation code
- [ ] NO state variables

### **IMyPackage.sol**

- [ ] Inherits `IMyPackageInternal`
- [ ] Declares all external function signatures
- [ ] NO implementation code

### **MyPackageStorage.sol**

- [ ] Contains single `Layout` struct with all state variables
- [ ] Uses ERC-7201 namespacing (`erc7201:fevertokens.storage.<PackageName>`)
- [ ] Has precomputed `STORAGE_SLOT` constant
- [ ] Has `@custom:storage-location` annotation
- [ ] `@custom:storage-location` docblock is immediately above `STORAGE_SLOT`
- [ ] Includes a `STORAGE_SLOT` derivation comment (formula)
- [ ] Provides `layout()` function
- [ ] NO logic or functions (except `layout()`)

### **MyPackageInternal.sol**

- [ ] Implements `IMyPackageInternal`
- [ ] Contains ONLY internal functions (business logic functions prefixed with `_`; initializer functions use `__MyPackage_init` / `__MyPackage_init_unchained`)
- [ ] Accesses state ONLY via `MyPackageStorage.layout()`
- [ ] NO structs (use `IMyPackageInternal.sol`)
- [ ] NO enums (use `IMyPackageInternal.sol`)
- [ ] NO events (use `IMyPackageInternal.sol`)
- [ ] NO errors (use `IMyPackageInternal.sol`)
- [ ] NO state variables (use `MyPackageStorage.sol`)
- [ ] NO public/external functions (use `MyPackage.sol`)
- [ ] NO direct state access (must use `layout()`)

### **MyPackage.sol**

- [ ] Inherits both `IMyPackage` AND `MyPackageInternal`
- [ ] Implements all functions from `IMyPackage`
- [ ] Each non-initializer function immediately delegates to `_functionName` (initializer entrypoints delegate to `__MyPackage_init(...)`)
- [ ] NO business logic
- [ ] NO authorization checks (handled inside `MyPackageInternal`)
- [ ] NO storage access
- [ ] NO duplicated logic

### **Initialization**

- [ ] If the package needs one-time setup, it implements `__MyPackage_init(...)` / `__MyPackage_init_unchained(...)`
- [ ] `__MyPackage_init(...)` is guarded by `initializer(MyPackageStorage.STORAGE_SLOT)`
- [ ] `__MyPackage_init_unchained(...)` is guarded by `onlyInitializing(MyPackageStorage.STORAGE_SLOT)` and contains only package-specific init
- [ ] `MyPackage.sol` exposes `MyPackage_init(...)` delegating to `__MyPackage_init(...)` when used as `initCalldata` during `diamondCut`
- [ ] `IMyPackage.sol` declares `MyPackage_init(...)` when the package is initializable

### **Cross-Package Communication**

- [ ] No external calls between packages within the same Diamond (no `IPackageB(address(this)).someFunction()`)
- [ ] Shared behavior uses internal APIs (inheritance/shared internal helpers) instead of external calls
- [ ] External calls between different Diamond deployments are documented and guarded against reentrancy

### **Common Violations to Avoid**

**❌ State variables in Internal contract:**

```solidity
// WRONG
abstract contract MyPackageInternal {
  uint256 public myValue; // ❌ Goes in MyPackageStorage.sol
}
```

**❌ Structs/Events/Errors in Internal contract:**

```solidity
// WRONG
abstract contract MyPackageInternal {
  struct MyData {} // ❌ Goes in IMyPackageInternal.sol at file scope
  event MyEvent(); // ❌ Goes in IMyPackageInternal.sol interface
  error MyError(); // ❌ Goes in IMyPackageInternal.sol interface
}
```

**❌ Business logic in External contract:**

```solidity
// WRONG
contract MyPackage is IMyPackage, MyPackageInternal {
  function doSomething(uint256 value) external override {
    if (value == 0) revert(); // ❌ Logic goes in _doSomething
    MyPackageStorage.Layout storage l = MyPackageStorage.layout(); // ❌
    l.value = value; // ❌
  }
}

// CORRECT
contract MyPackage is IMyPackage, MyPackageInternal {
  function doSomething(uint256 value) external override {
    _doSomething(value); // ✅ Pure delegation
  }
}
```
