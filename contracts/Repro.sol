//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Repro {
  function run() public pure {
    revert(unicode"¡¡¡");
  }
}
