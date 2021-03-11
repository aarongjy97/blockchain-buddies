pragma solidity ^0.5.0;
import './Market.sol';
import './Supplier.sol';
import './Courier.sol';

contract Procurer {
    address owner;
    uint256 orderId;

    constructor() public {
        owner = msg.sender;
    }

    mapping(address => Employee) employees;
    mapping(uint256 => PurchaseOrder) purchaseOrders;

    // Struct
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
    
    modifier isFinanceEmployee(address employeeAddress) {
        require(employees[employeeAddress].isFinance, 'Employee is not a finance employee');
        _;
    }
   
    modifier isLogisticsEmployee(address employeeAddress) {
        require(!employees[employeeAddress].isFinance, 'Employee is not a logistics employee');
        _;
    }

    function createPurchaseOrder(Product product, uint256 quantity, uint256 price) public isLogisticsEmployee(msg.sender) returns (uint256) {
        purchaseOrders[orderId] = PurchaseOrder(msg.sender, product.supplier, product.courier, product.productId, price, quantity, block.timestamp, employees[msg.sender].name, false);

        // @TODO push purchase order to marketplace so supplier can see
        return orderId++;
    }
    
    function approvePurchaseOrder(uint256 orderId) public isFinanceEmployee(msg.sender) {
        
    }
    
    function cancelPurchaseOrder(uint256 orderId) public {
        purchaseOrders[orderId].isClosed = true;
    }
    
    function deliveredByDelivery(uint256 orderId, uint256 companyId) public {
      require(companies[companyId].purchaseOrders[orderId].LogisticsEmployee == msg.sender);     // Check that the person accepting the order is the person who created the order
      // acknowledge goods in good condition (Skipz)
      
      // wire money to supplier
      // ERC token transferFrom...

      // close purchase order
      companies[companyId].purchaseOrders[orderId].isClosed = true;
      emit orderDelivered(orderId);
    }
    
}
