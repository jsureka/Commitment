//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "hardhat/console.sol";

contract Req {
  string private greeting;
  address private _owner;
  uint256 private requirement_balance = 1000;
  struct Verifier {
    uint256 incentive;
    uint256 step_count;
    address verifier_address;
    string challengeName;
  }
  mapping(uint256 => Verifier) private verifiers;
  struct User {
    string[] commitment;
    uint256 incentive;
  }
  uint256 private total_verifiers = 0;
  mapping(address => User) private users;
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

  function setVerifier() public payable {
    for (uint256 i = 0; i < total_verifiers; i++) {
      require(
        verifiers[i].verifier_address != msg.sender,
        "Already a verifier"
      );
    }
    verifiers[total_verifiers] = Verifier(0, 0, msg.sender, "");
    total_verifiers++;
  }

  function getVerifier()
    public
    view
    returns (
      uint256 incentive,
      uint256 step_count,
      address verifier_address,
      string memory challengeName
    )
  {
    for (uint256 i = 0; i < total_verifiers; i++) {
      if (verifiers[i].verifier_address == msg.sender) {
        return (
          verifiers[i].incentive,
          verifiers[i].step_count,
          verifiers[i].verifier_address,
          verifiers[i].challengeName
        );
      }
    }
    // Return default values if the verifier is not found
    return (0, 0, address(0), "");
  }

  function createChallenge(
    string memory challengeName,
    uint256 incentive,
    uint256 step_count
  ) public payable {
    for (uint256 i = 0; i < total_verifiers; i++) {
      if (verifiers[i].verifier_address == msg.sender) {
        // require payable amount >1000
        require(msg.value >= requirement_balance, "Not enough balance");
        verifiers[i].challengeName = challengeName;
        verifiers[i].incentive = incentive;
        verifiers[i].step_count = step_count;
        return;
      }
    }
  }
}
