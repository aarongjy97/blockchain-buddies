pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './Structs.sol';
import './Market.sol';
import './Supplier.sol';
import './Courier.sol';

contract Procurer {

    address _owner;
    Market market;

    enum EmployeeType { NonEmployee, Disabled, Finance, Logistics }

    struct Employee {
        string name;
        EmployeeType employeeType;
    }    

    mapping(address => Employee) employees;

    constructor(Market _marketAddress) public {
        _owner = msg.sender;
        market = _marketAddress;
    }

    /* ==================== Modifiers ==================== */

    modifier isEmployee {
        require(employees[msg.sender].employeeType != EmployeeType.NonEmployee, "Only employee can perform this function");
        _;
    }

    modifier isFinanceEmployee {
        require(employees[msg.sender].employeeType == EmployeeType.Finance, 'Employee is not a finance employee');
        _;
    }
   
    modifier isLogisticsEmployee {
        require(employees[msg.sender].employeeType == EmployeeType.Logistics, 'Employee is not a logistics employee');
        _;
    }

    /**
     * Creates a purchase order for the finance team to approve.
     * Only Logistics Employees are allowed to create purchase orders.
     * @dev Calls Market contract
     */
    function createPurchaseOrder(uint256 _productId, uint256 quantity, uint256 price) public isEmployee isLogisticsEmployee returns (uint256) {
    }
    
    /**
     * Approves a purchase order internally, and the order will be pushed to the market
     * for the supplier to approve.
     * Changes the status of the purchase order from Ordered to Approved.
     * Only Finance Employees are allowed to approve purchase orders.
     * Purchase orders that are rejected previously cannot be approved.
     * @dev Calls Market contract
     */
    function approvePurchaseOrder(uint256 orderId) public isEmployee isFinanceEmployee {
    }
    
    /**
     * Rejects a purchase order internally, and the order cannot be approved again.
     * Changes the status of the purchase order from Ordered to Rejected.
     * Only Finance Employees are allowed to approve purchase orders.
     */
    function rejectPurchaseOrder(uint256 orderId) public isEmployee {
    }
    
    /**
     */
    function viewPurchaseOrder(uint256 orderId) public view isEmployee returns (Structs.PurchaseOrder memory) {
        return market.viewPurchaseOrder(orderId);
    }

    /**
     * Confirms the delivery has been received by the delivery courier.
     * Changes the status of the purchase order from Delivering to Delivered.
     * Will also transfer the price of the delivery to the supplier.
     * If the transfer goes through, the status will be eventually changes to Closed.
     * @dev Calls Market contract
     */
    function deliveredByCourier(uint256 orderId, uint256 companyId) isEmployee public {
    }

    /**
     * Adds an employee address to the contract, permitting the employee
     * to carry out functions on the contract.
     */
    function addEmployee(address newEmployee) public {
    }
    
}
