pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './Structs.sol';
import './Market.sol';
import './MarketERC20.sol';

contract Courier {

    address _owner;
    Market market;
    MarketERC20 erc20;

    enum EmployeeType { NonEmployee, Employee }

    struct Employee {
        string name;
        EmployeeType employeeType;
    }

    mapping (address => Employee) employees;

    /* ==================== Constructor ==================== */

    constructor(Market _marketAddress, MarketERC20 _erc20Address) public {
        _owner = msg.sender;
        market = _marketAddress;
        erc20 = _erc20Address;
    }

    /* ==================== Modifiers ==================== */

    modifier employeeOnly {
        require(employees[msg.sender].employeeType == EmployeeType.Employee, "Only employee can execute function");
        _;
    }

    modifier ownerOnly {
        require(msg.sender == _owner, "Only owner can execute this function");
        _;
    }

    /* ==================== General Functions ==================== */

    function getTokenBalance() public view employeeOnly returns (uint256) {
        return erc20.balanceOf(address(this));
    }

    /**
     * @notice Retrieves the statistics of a courier
     * @return Total amount of tokens earned and total number of orders delivered
     */
    function courierStatistics() public view employeeOnly returns (uint, uint) {
        return market.courierStatistics();
    }

    /* ==================== Admin Functions ==================== */
    
    function addEmployee(address _employee, string memory name) public ownerOnly {
        require(_employee != address(0), "Invalid employee address");
        Employee memory _newEmployee = Employee(name, EmployeeType.Employee);
        employees[_employee] = _newEmployee;
    }

    function registerAsCourier() public ownerOnly {
        market.registerAsCourier();
    }

    function viewEmployee(address employeeAddress) public view ownerOnly returns (Employee memory) {
        return employees[employeeAddress];
    }

    /* ==================== Order Functions ==================== */

    /**
    * @notice View a purchase order. Can only be viewed by relevant stakeholders.
    * @return PurchaseOrder
    */
    function viewPurchaseOrder(uint _orderId) public view employeeOnly returns (Structs.PurchaseOrder memory) {
        return market.viewPurchaseOrder(_orderId);
    }

    /**
     * @notice View all purchase orders related to courier.
     * @return Structs.PurchaseOrder[]
     */
    function courierViewAllPurchaseOrders() public view employeeOnly returns (Structs.PurchaseOrder[] memory) {
        return market.courierViewAllPurchaseOrders();
    }

    /**
     * @notice Courier acknowledges they have received the goods to be delivered from the supplier.
     * @dev Calls Market Contract
     */
    function receivedByCourier(uint _orderId) public employeeOnly {
        market.receivedByCourier(_orderId);
    }

}