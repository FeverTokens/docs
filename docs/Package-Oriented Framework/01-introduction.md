---
title: 📦 FeverTokens Package-Oriented Framework
sidebar_position: 1
slug: /pof-introduction
description: Learn how to build composable smart contracts using the FeverTokens Package-Oriented Framework.
---

# **FeverTokens Package-Oriented Framework**

## **🔍 Overview**

The **FeverTokens Package-Oriented Framework** is a composable smart contract architecture based on the [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535). It provides a structured and modular approach for building scalable, upgradable, and reusable smart contract packages tailored to institutional and mission-critical systems.

By following a strict separation of concerns, this framework makes smart contracts:

- Easier to audit and maintain

- Highly composable and upgradable

- Compatible with tooling for version management and deployment

- Ready for integration into larger smart contract systems using the FeverTokens Hub

## **💎 Diamond Architecture Principles**

Each package is a modular facet of a Diamond and adheres to the following design principles:

- **Separation of Concerns**: Interfaces, logic, and storage are explicitly decoupled.

- **Interface Definitions**: Cleanly specified internal and external interfaces for integration and documentation.

- **Storage Management**: Explicit and namespaced layout management using custom storage slots.

- **Upgradeable Logic**: Built to support safe upgrades via the Diamond proxy architecture.

## **📦 Package Structure**

Each package must include **five distinct components**, each as a separate file:

| File                     | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `IMyPackageInternal.sol` | Internal interface: declares events, structs, enums       |
| `IMyPackage.sol`         | External interface: defines externally callable functions |
| `MyPackageStorage.sol`   | Storage layout using diamond storage pattern              |
| `MyPackageInternal.sol`  | Internal logic: uses and modifies package storage         |
| `MyPackagePackage.sol`   | External-facing contract: wraps internal logic            |

### **🔹 Internal Interface – `IMyPackageInternal.sol`**

Defines the internal elements of the package: enums, structs, events, and errors.

```solidity
interface IMyPackageInternal {
 enum MyEnum { Option1, Option2 }

    struct MyStruct1 {
        uint256 value;
        address addr;
    }

    struct MyStruct2 {
        bool active;
        uint256 count;
    }

    event MyEvent1(address indexed sender, uint256 value);
    event MyEvent2(address indexed actor, bool action);

}
```

### **🔹 External Interface – `IMyPackage.sol`**

Inherits the internal interface and exposes external functions.

```solidity
import "./IMyPackageInternal.sol";

interface IMyPackage is IMyPackageInternal {
 function myFunction1(uint256 value1) external;
 function myFunction2(address addr, uint256 value2) external;
}
```

### **🔹 Storage Layout – `MyPackageStorage.sol`**

Encapsulates the state in a `Layout` struct, using a dedicated slot for namespacing based on [ERC-7201](https://eips.ethereum.org/EIPS/eip-7201).

```solidity
import "./IMyPackageInternal.sol";

library MyPackageStorage {

 struct Layout {
    uint256 value1;
    address addr1;
    uint256 value2;
    MyStruct1 myObject1;
    bool active;
 }

    bytes32 constant STORAGE_SLOT =
        keccak256(abi.encode(uint256(keccak256("company.storage.MyPackage")) - 1)) & ~bytes32(uint256(0xff));

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

}
```

### **🔹 Internal Logic – `MyPackageInternal.sol`**

Implements the core business logic using the namespaced storage.

```solidity
import "./IMyPackageInternal.sol";
import {MyPackageStorage} from "./MyPackageStorage.sol";

abstract contract MyPackageInternal is IMyPackageInternal {
 using MyPackageStorage for MyPackageStorage.Layout;

    function _myFunction1(uint256 value1) internal {
        MyPackageStorage.Layout storage l = MyPackageStorage.layout();
        // Logic using l.value1
    }

    function _myFunction2(address addr, uint256 value2) internal {
        MyPackageStorage.Layout storage l = MyPackageStorage.layout();
        // Logic using l.addr1 and l.value2
    }

}
```

### **🔹 Package Entry Point – `MyPackage.sol`**

Implements external interface and delegates to internal logic.

```solidity
import {IMyPackage} from "./IMyPackage.sol";
import {MyPackageInternal} from "./MyPackageInternal.sol";

contract MyPackagePackage is IMyPackage, MyPackageInternal {
    function myFunction1(uint256 value1_) external override {
        _myFunction1(value1_);
    }

    function myFunction2(address addr_, uint256 value2_) external override {
        _myFunction2(addr_, value2_);
    }

}
```

## **✅ Best Practices**

- **Function naming**: Prefix internal functions with `_` (e.g., `_myFunction1`) for clarity.

- **External function implementation**: Avoid direct calls to internal functions; always use the `_` prefixed versions. Use `override` to ensure compliance with the interface.

- **Parameter naming**: Use trailing underscores (e.g., `value1_`) to avoid variable shadowing.

- **Testing**: Unit-test each package and integration-test multiple packages as part of a system.

- **Documentation**: Comment the purpose and logic of each package, especially for critical functions.

- **Storage safety**: Never change the order or type of variables in a layout struct once deployed.

## **🚀 Create Your Own Package (Quick Guide)**

1. **Define internal elements** in `IMyPackageInternal.sol`:

   - Enums, structs, events

2. **Define external interface** in `IMyPackage.sol`:

   - Extend the internal interface

   - Declare externally accessible functions

3. **Create a storage layout** in `MyPackageStorage.sol`:

   - Add a namespaced `Layout` struct

   - Declare the storage slot using `keccak256`

4. **Implement internal logic** in `MyPackageInternal.sol`:

   - Use the layout via `MyPackageStorage.layout()`

   - Implement internal helper methods

5. **Build your package** in `MyPackagePackage.sol`:

   - Inherit from `IMyPackage` and `MyPackageInternal`

   - Implement external methods by calling internal functions
