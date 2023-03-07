//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "hardhat/console.sol";

contract Greeter {
  string private greeting;
  address private _owner;
  uint256 private requirement_balance = 1000;
  string[] private commitment;
  modifier onlyOwner() {
    require(msg.sender == _owner, "Not an owner");
    _;
  }

  constructor(string memory _greeting) {
    console.log("Deploying a Greeter with greeting:", _greeting);
    _owner = msg.sender;
    greeting = _greeting;
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public payable onlyOwner {
    require(msg.value > 10000, "Not enough paid");
    console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
    greeting = _greeting;
  }

  function getOwner() public view returns (address) {
    return _owner;
  }

  function requirementFunction(uint256 value) public view returns (bool) {
    if (value > requirement_balance) return true;
    else return false;
  }

  function setCommitment(string[] memory user_commitment) public payable {
    commitment = user_commitment;
  }

  function getCommitment() public view returns (string[] memory) {
    return commitment;
  }
}
