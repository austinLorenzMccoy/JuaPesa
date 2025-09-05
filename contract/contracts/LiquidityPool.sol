// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LiquidityPool {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient pool balance");
        to.transfer(amount);
        emit Withdrawn(to, amount);
    }

    function poolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
