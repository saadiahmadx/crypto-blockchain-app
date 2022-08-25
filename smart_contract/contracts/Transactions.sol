// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    // variable type always has to be declared first
    uint256 transactionCount;

    event Transfer(address from, address reciever, 
    uint amount, string message, uint256 timestamp, 
    string keyword);

    struct TransferStruct {
        address sender;
        address reciever;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    // always need to specify visibilty function/class,
    // memory means that the data specified is stored in the data
    // of the transaction, memoryField is our keyword
    function addToBlockchain(address payable reciever, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        //msg is an auto store of info from blockchain
        transactions.push(TransferStruct(msg.sender, reciever, amount, message, block.timestamp, keyword));

        //makes the actual transfer
        emit Transfer(msg.sender, reciever, amount, message, block.timestamp, keyword);
    }
    function getAllTransactions() public view returns (TransferStruct[] memory){
        return transactions;
    }
    function getTransactionCount() public view returns (uint256){
        return transactionCount;
    }
}