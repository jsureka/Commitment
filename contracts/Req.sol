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
  uint256 private total_verifiers = 0;
  struct User {
    string[] commitment;
    uint256 total_incentive;
    address user_address;
    uint256[] challenge_id;
  }
  mapping(uint256 => User) private users;
  uint256 private total_users = 0;
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

  function requirementFunction(uint256 value) public returns (uint256 success) {
    for (uint256 i = 0; i < total_verifiers; i++) {
      if (verifiers[i].step_count <= value) {
        for (uint256 j = 0; j < total_users; j++) {
          if (users[j].user_address == msg.sender) {
            for (uint256 k = 0; k < users[j].challenge_id.length; k++) {
              if (users[j].challenge_id[k] == i) {
                return 0;
              }
            }
          }
        }
        users[total_users].challenge_id.push(i);
        users[total_users].user_address = msg.sender;
        total_users++;
        return 1;
      }
    }
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

  function getVerifiers() public view returns (Verifier[] memory) {
    Verifier[] memory _verifiers = new Verifier[](total_verifiers);
    for (uint256 i = 0; i < total_verifiers; i++) {
      _verifiers[i] = verifiers[i];
    }
    return _verifiers;
  }

  function getCompletionList() public view returns (address[] memory) {
    uint256 verifier_id;
    for (uint256 i = 0; i < total_verifiers; i++) {
      if (verifiers[i].verifier_address == msg.sender) {
        verifier_id = i;
      }
    }
    address[] memory _users = new address[](total_users);
    uint256 count = 0;
    for (uint256 i = 0; i < total_users; i++) {
      for (uint256 j = 0; j < users[i].challenge_id.length; j++) {
        if (users[i].challenge_id[j] == verifier_id) {
          _users[count] = users[i].user_address;
          count++;
          break;
        }
      }
    }
    return _users;
  }

  function verifyWinner(uint256 challenge_id) public payable {
    for (uint256 i = 0; i < total_verifiers; i++) {
      if (verifiers[i].verifier_address == msg.sender) {
        for (uint256 j = 0; j < total_users; j++) {
          if (users[j].user_address == msg.sender) {
            for (uint256 k = 0; k < users[j].challenge_id.length; k++) {
              if (users[j].challenge_id[k] == challenge_id) {
                payable(users[j].user_address).transfer(
                  verifiers[i].incentive * 1000000000
                );
                return;
              }
            }
          }
        }
      }
    }
  }
}
