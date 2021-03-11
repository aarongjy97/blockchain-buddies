pragma solidity ^0.5.0;
import './Market.sol';
import './Supplier.sol';
import './Courier.sol';

contract Procurer {

    address _owner;

    struct PurchaseOrder {
        address employee;
        address supplier;
        address courier;
        uint256 productId;
        uint256 price;
        uint256 quantity;  
        uint256 dateCreated; 
        string employeeName;
        bool isClosed;
    }

    struct Employee {
        string name;
        bool isFinance;
    }    

    mapping(address => Employee) employees;
    mapping(uint256 => PurchaseOrder) internalPurchaseOrders;

    constructor() public {
        _owner = msg.sender;
    }

    /* ==================== Modifiers ==================== */

    modifier isFinanceEmployee {
        require(employees[msg.sender] != 0, "Only employee can perform this function");
        require(employees[msg.sender].isFinance, 'Employee is not a finance employee');
        _;
    }
   
    modifier isLogisticsEmployee(address employeeAddress) {
        require(employees[msg.sender] != 0, "Only employee can perform this function");
        require(!employees[msg.sender].isFinance, 'Employee is not a logistics employee');
        _;
    }

    /**
     * Creates a purchase order for the finance team to approve.
     * Only Logistics Employees are allowed to create purchase orders.
     */
    function createPurchaseOrder(Product product, uint256 quantity, uint256 price) public isLogisticsEmployee returns (uint256) {
    }
    
    /**
     * Approves a purchase order internally, and the order will be pushed to the market
     * for the supplier to approve.
     * Changes the status of the purchase order from Ordered to Approved.
     * Only Finance Employees are allowed to approve purchase orders.
     * Purchase orders that are rejected previously cannot be approved.
     * @calls Market contract
     */
    function approvePurchaseOrder(uint256 orderId) public isFinanceEmployee {
    }
    
    /**
     * Rejects a purchase order internally, and the order cannot be approved again.
     * Changes the status of the purchase order from Ordered to Rejected.
     * Only Finance Employees are allowed to approve purchase orders.
     */
    function rejectPurchaseOrder(uint256 orderId) public {
    }
    
    /**
     * Confirms the delivery has been received by the delivery courier.
     * Changes the status of the purchase order from Delivering to Delivered.
     * Will also transfer the price of the delivery to the supplier.
     * If the transfer goes through, the status will be eventually changes to Closed.
     * @calls Market contract
     */
    function deliveredByCourier(uint256 orderId, uint256 companyId) public {
    }
    
}
