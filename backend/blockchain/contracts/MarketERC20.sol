pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MarketERC20 is ERC20 {

    address _owner;

    constructor() public {
        _owner = msg.sender;
    }

    modifier ownerOnly() {
        require(msg.sender == _owner, "Only ERC20 Contract Owner Allowed To Execute Functions");
        _;
    }

    function mintTokens(address recipient, uint amount) public ownerOnly {
        _mint(recipient, amount);
    }
}