// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract chai {

    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
        uint amount;  // new field to store Ether amount sent
    }

    Memo[] memos;
    address payable owner; // owner is going to receive funds

    constructor() {
        owner = payable(msg.sender);
    }

    function buyChai(string calldata name, string calldata message) external payable {
        require(msg.value >= 0.0000001 ether, "Insufficient Ether to buy chai");
        owner.transfer(msg.value);
        
        // Store the memo with the Ether amount sent
        memos.push(Memo(name, message, block.timestamp, msg.sender, msg.value));
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
    
}







