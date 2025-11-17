---
id: packages-guidelines
title: Packages Guidelines
sidebar_label: Packages Guidelines
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
- ✅ MUST provide a `layout()` function returning the storage reference
- ❌ MUST NOT contain any logic

**`MyPackageInternal.sol` - Internal Logic ONLY:**

- ✅ MUST implement `IMyPackageInternal`
- ✅ MUST contain ONLY internal functions, and those functions MUST be prefixed with `_` (modifiers and helpers do not need the prefix)
- ✅ MUST access state ONLY via `MyPackageStorage.layout()`
- ✅ MAY inherit other internal contracts for reusable modifiers/helpers
- ❌ MUST NOT declare structs, enums, events, or errors (use `IMyPackageInternal.sol`)
- ❌ MUST NOT declare state variables (use `MyPackageStorage.sol`)
- ❌ MUST NOT contain public/external functions (use `MyPackage.sol`)

**`MyPackage.sol` - External Delegation ONLY:**

- ✅ MUST inherit both `IMyPackage` and `MyPackageInternal`
- ✅ MUST implement every function from `IMyPackage`
- ✅ Each function MUST immediately delegate to `_functionName` internal function
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
}
```

---

### **🔹 External Interface – `IMyPackage.sol`**

This interface MUST inherit `IMyPackageInternal` and declare every selector that the package exposes. `MyPackage.sol` MUST implement every function declared here.

```solidity
import './IMyPackageInternal.sol';

interface IMyPackage is IMyPackageInternal {
  function myFunction1(uint256 value1) external;
  function myFunction2(address addr, uint256 value2) external;
}
```

---

### **🔹 Storage Layout – `MyPackageStorage.sol`**

Encapsulates the state in a `Layout` struct and MUST declare an [ERC-7201](https://eips.ethereum.org/EIPS/eip-7201) storage slot using the package namespace `erc7201:fevertokens.storage.MyPackage` (replace `MyPackage` with your package name). Precompute the slot constant offline to avoid on-chain hashing.

```solidity
import './IMyPackageInternal.sol';

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
    0x1df51cfccae0f501bb17b68cd61348a867f942cf359f7c8de1bac417c3cea087; // Replace with your package-specific slot constant.

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
import {keccak256, toUtf8Bytes} from "ethers";

export function computeStorageSlot(namespace: string): `0x${string}` {
	if (!namespace.startsWith("erc7201:")) {
		throw new Error(
			"Namespace must use the ERC-7201 format, e.g., erc7201:fevertokens.storage.MyPackage",
		);
	}

	return keccak256(toUtf8Bytes(namespace)) as `0x${string}`;
}

console.log(computeStorageSlot("erc7201:fevertokens.storage.MyPackage")); // 0x1df51cfccae0f501bb17b68cd61348a867f942cf359f7c8de1bac417c3cea087
```

Run it with `ts-node`, `tsx`, or the TypeScript runner of your choice and paste the emitted hash back into `MyPackageStorage.sol`.

---

### **🔹 Internal Logic – `MyPackageInternal.sol`**

Implements the core business logic using the namespaced storage. This abstract contract MUST keep functions `internal`, MAY inherit other internal logic libraries/contracts, SHOULD centralize modifiers there for reuse, and is the canonical place to perform access control/authorization checks before writing to storage.

**✅ CORRECT Implementation:**

```solidity
import './IMyPackageInternal.sol';
import { MyPackageStorage } from './MyPackageStorage.sol';
import { SharedInternal } from './SharedInternal.sol';

// SharedInternal exposes reusable helpers such as the `MyModifier` modifier.
abstract contract MyPackageInternal is IMyPackageInternal, SharedInternal {
  using MyPackageStorage for MyPackageStorage.Layout;

  // ✅ Constants are OK
  uint256 internal constant MAX_VALUE = 1000;

  // ✅ Modifiers accessing storage via layout()
  modifier onlyAdmin() {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    if (msg.sender != l.admin) revert Unauthorized();
    _;
  }

  // ✅ Internal functions with _ prefix
  function _myFunction1(uint256 value1) internal onlyAdmin MyModifier {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    l.value1 = value1;
    emit MyEvent1(msg.sender, value1);
  }

  function _myFunction2(address addr, uint256 value2) internal {
    MyPackageStorage.Layout storage l = MyPackageStorage.layout();
    l.addr1 = addr;
    l.value2 = value2;
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
  l.admin = newAdmin; // ✅ CORRECT
}
```

---

### **🔹 Package Entry Point – `MyPackage.sol`**

Implements the external interface and MUST delegate every call to the `_`-prefixed internal function defined in `MyPackageInternal.sol`. This contract MUST NOT re-implement business logic.
All access control, authorization guards, and state mutations happen inside `MyPackageInternal`, so this file remains a thin, declarative delegate.

```solidity
import { IMyPackage } from './IMyPackage.sol';
import { MyPackageInternal } from './MyPackageInternal.sol';

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

## **✅ Best Practices**

- **Interface hygiene**: Declare enums and structs at file scope within `IMyPackageInternal.sol` so other packages can import them without inheriting the interface.
- **Function naming**: Prefix internal functions with `_` (e.g., `_myFunction1`) for clarity.

- **External delegation**: The external contract MUST implement every selector and immediately call the `_`-prefixed internal logic. Never duplicate logic in `MyPackage.sol`.
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

4. **Implement internal logic** in `MyPackageInternal.sol`:

   - MUST use the layout via `MyPackageStorage.layout()`

   - SHOULD implement reusable internal helper methods (and MAY inherit other internal contracts if you need their modifiers)

5. **Build your package** in `MyPackage.sol`:

   - MUST inherit from `IMyPackage` and `MyPackageInternal`

   - MUST implement every external function and immediately delegate to the `_`-prefixed internal version

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
- [ ] Provides `layout()` function
- [ ] NO logic or functions (except `layout()`)

### **MyPackageInternal.sol**

- [ ] Implements `IMyPackageInternal`
- [ ] Contains ONLY internal functions (each prefixed with `_`; modifiers/helpers may omit the prefix)
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
- [ ] Each function immediately delegates to `_functionName`
- [ ] NO business logic
- [ ] NO authorization checks (handled inside `MyPackageInternal`)
- [ ] NO storage access
- [ ] NO duplicated logic

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
