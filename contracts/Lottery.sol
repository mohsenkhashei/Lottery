// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract Lottery {
    address public manager;
    address[] public players ;

    constructor(){
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "you need to have at least 0.01 ether to join");

        players.push(msg.sender);
    }

    function random() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        // find the index of player to pick as winner
        uint index = random() % players.length;
        // send the ether to the winner
        payable(players[index]).transfer(address(this).balance);
        // empty the players array
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
