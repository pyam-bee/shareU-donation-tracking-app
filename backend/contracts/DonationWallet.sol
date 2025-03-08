// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationWallet {
    address public owner;
    mapping(address => uint256) public donations;
    
    event DonationReceived(address donor, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        donations[msg.sender] += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    function getDonationAmount(address donor) public view returns (uint256) {
        return donations[donor];
    }
}