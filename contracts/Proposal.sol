// contracts/Proposal.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Proposal is Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private proposalId;
  mapping(uint256 => CustomProposal) private proposals;

  // Emitted when the stored value changes
  event ProposalAdded(string name, uint256 proposalId);
  // event ProposalExecuted(string name);

  struct CustomProposal {
    uint256 proposalId;
    string name;
    uint256 status; 
  }

  // Add a new proposal in the contract
  function proposalAdd(string memory name) public {
    CustomProposal memory proposal = CustomProposal({
        proposalId: proposalId.current(),
        name: name,
        status: 0
    });
    proposals[proposalId.current()] = proposal;
    emit ProposalAdded(name, proposalId.current());
  }

  // // Add a passed proposal in the contract
  // function proposalExecuted(uint256 _proposalId, uint16 _status) public onlyOwner{
  //   CustomProposal storage proposal = proposals[_proposalId];
  //   proposal.status = _status;
  //   proposals[proposalId.current()] = proposal;
  //   emit ProposalExecuted(proposal.name);
  // }

  // Reads the proposal by Id
  function retrieveProposal(uint256 _proposalId) public view returns (CustomProposal memory) {
    return proposals[_proposalId];
  }
}
