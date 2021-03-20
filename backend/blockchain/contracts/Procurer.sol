pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './Structs.sol';
import './MarketERC20.sol';
import './Market.sol';
import './Supplier.sol';
import './Courier.sol';

contract Procurer {

    address _owner;
    Market market;
    MarketERC20 erc20;

    enum EmployeeType { NonEmployee, Disabled, Finance, Logistics }

    struct Employee {
        string name;
        EmployeeType employeeType;
    }    

    mapping(address => Employee) employees;

    constructor(Market _marketAddress, MarketERC20 _erc20Address) public {
        _owner = msg.sender;
        market = _marketAddress;
        erc20 = _erc20Address;
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

    modifier ownerOnly {
        require(msg.sender == _owner, "Only owner allowed to execute this function");
        _;
    }

    /* ==================== Order Functions ==================== */

    /**
     * @notice Creates a purchase order for the finance team to approve.
     * Only Logistics Employees are allowed to create purchase orders.
     * @dev Calls Market contract
     */
    function createPurchaseOrder(uint _productId, uint quantity, uint price) public isLogisticsEmployee returns (uint) {
        market.createPurchaseOrder(_productId, quantity, price);
    }
    
    /**
     * @notice Approves a purchase order internally, and the order will be pushed to the market
     * for the supplier to approve.
     * Changes the status of the purchase order from Ordered to Approved.
     * Only Finance Employees are allowed to approve purchase orders.
     * Purchase orders that are rejected previously cannot be approved.
     * @dev Calls Market contract
     */
    function approvePurchaseOrder(uint orderId) public isFinanceEmployee {
        erc20.increaseAllowance(address(market), viewPurchaseOrder(orderId).price);
        market.procurerApprovePurchaseOrder(orderId);
    }
    
    /**
     * @notice Rejects a purchase order internally, and the order cannot be approved again.
     * Changes the status of the purchase order from Ordered to Rejected.
     * Only Finance Employees are allowed to approve purchase orders.
     * @dev Calls Market Contract
     */
    function rejectPurchaseOrder(uint orderId) public isFinanceEmployee {
        market.procurerRejectPurchaseOrder(orderId);
    }

    /**
     * @notice Supplier rejected the purchase order, to remove allowance given to market contract.
     * @dev Calls ERC20 Contract
     */
    function supplierRejectPurchaseOrder(uint price) public {
        require(msg.sender == address(market), "Only Executable from Market Contract");
        erc20.decreaseAllowance(address(market), price);
    }
    
    /**
     * @notice Views a purchase order in the market. Can only be viewed by relevant stakeholders.
     * @dev Calls Market Contract to view order.
     * @return Structs.PurchaseOrder
     */
    function viewPurchaseOrder(uint orderId) public view isEmployee returns (Structs.PurchaseOrder memory) {
        return market.viewPurchaseOrder(orderId);
    }

    /**
     * @notice Views purchase orders tied to the procurer in the market. 
     * @dev Calls Market Contract to view all orders.
     * @return Structs.PurchaseOrder
     */
    function viewAllPurchaseOrders() public view isEmployee returns (Structs.PurchaseOrder[] memory) {
        return market.procurerViewAllPurchaseOrders();
    }

    /**
     * @notice Confirms the delivery has been received by the delivery courier.
     * Changes the status of the purchase order from Delivering to Delivered.
     * Will also transfer the price of the delivery to the supplier.
     * If the transfer goes through, the status will be eventually changes to Closed.
     * @dev Calls Market contract
     */
    function deliveredByCourier(uint orderId) isLogisticsEmployee isLogisticsEmployee public {
        market.deliveredByCourier(orderId);
    }

    /* ==================== Admin Functions ==================== */

    /**
     * @notice Adds an employee address to the contract, permitting the employee
     * to carry out functions on the contract.
     */
    function addEmployee(address newEmployee, uint employeeType, string memory name) public ownerOnly {

        require(employeeType == 1 || employeeType == 2, "Invalid Employee Type");
        require(newEmployee != address(0), "Invalid Address");
        
        /* Finance */
        if (employeeType == 1) {
            Employee memory _newEmployee = Employee(name, EmployeeType.Finance);
            employees[newEmployee] = _newEmployee;  
        } else if (employeeType == 2) {
            Employee memory _newEmployee = Employee(name, EmployeeType.Logistics);
            employees[newEmployee] = _newEmployee;  
        } else {
             
        }

    }

    function registerAsProcurer() public ownerOnly {
        market.registerAsProcurer();
    }
    
}
