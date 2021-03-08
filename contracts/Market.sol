pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./Procurer.sol";
import "./Supplier.sol";
import "./Courier.sol";

contract Market {
   ERC20 erc20;
   Supplier[] supplierContracts;
   Procurer[] companies;

   mapping(address => Procurer) procurers;

   // companies[address].employees
   // var companyA = Company.at(companies[address]) ->
   // companyA.createPurchaseOrder...
   
   // *** Accessing functions from address
   // Company _company = Company(address)
   
   uint256 orderId;

   struct Product {
      address supplier;
      uint256 productId;
      uint256 quantityAvailable;
      uint256 price;
      string productName;
   }

   struct PurchaseOrder {
      address LogisticsEmployee;
      address supplier;
      address deliveryCourier;
      uint256 productId;
      uint256 price;  
      date dateCreated; 
      string employeeName;
      bool isClosed;
   }

   // constructor
   constructor(ERC20 erc20Address) public {
      erc20 = erc20Address;
   }

   // events
   event createPurchaseOrder(Product product, uint256 quantity, uint256 price);
   event deletePurchaseOrder(uint256 orderId);
   event orderDelivered(uint OrderId);

   // modifiers
   modifier isFinanceEmployee(address employeeAddress) {
      require(employeeToCompany[employeeAddress].employees[employeeAddress].isFinance, 'Employee is not a finance employee');
      _;
   }
   
   modifier isLogisticsEmployee(address employeeAddress) {
      require(!employeeToCompany[employeeAddress].employees[employeeAddress].isFinance, 'Employee is not a logistics employee');
      _;
   }

   modifier supplierOnly(address supplierAddress) {
      require(suppliers[supplierAddress] != 0);
      _;
   }

   // Logistics team functions
   function createPurchaseOrder(Product product, uint256 quantity, uint256 price) public isLogisticsEmployee returns (uint256) {
      require();

      employeeToCompany[msg.sender].purchaseOrders[orderId] = PurchaseOrder(msg.sender, product.supplier, _, product.productId, price, block.timestamp, '', false);

      return orderId++;
   }

   function deletePurchaseOrder(uint256 orderId) public {
      delete company.purchaseOrders[id];
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

   // Finance team functions
   function approvePurchaseOrder(uint256 orderId) public {
      // require purchase order to be approved by supplier before

      // approve PO
      
      // grants permission to logistics team to buy
   }

   // Supplier functions 
   function listProduct(uint256 productId, uint256 quantityAvailable, uint256 price, string name) supplierOnly(msg.sender) {
      
      Product memory p = Product(msg.sender, productId, quantityAvailable, price, name);
      
   } 

   function unlistProduct(uint256 productId) public {
      // unlist
   }

   function assignCourier(uint256 courierId) public {
      
   }

   function approveSalesOrder(uint256 orderId) public {
      
   }

   // Delivery courier functions
   function receivedByDelivery(uint256 orderId) public {
      // require

      // acknowledgement
   }
   
}