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

    constructor(Market _marketAdress, MarketERC20 _erc20Address) public {
        _owner = msg.sender;
        market = _marketAdress;
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

    /* ==================== Admin Functions ==================== */
    function addEmployee(address _employee, string memory name) public ownerOnly {
        require(_employee != address(0), "Invalid employee address");
        Employee memory _newEmployee = Employee(name, EmployeeType.Employee);
        employees[_employee] = _newEmployee;
    }

    function registerAsCourier() public ownerOnly {
        market.registerAsCourier();
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