pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./Procurer.sol";
import "./Supplier.sol";
import "./Courier.sol";

contract Market {
   ERC20 erc20;

   address _owner;

   /**
    * Ordered => Procurer places an order, to be accepted or rejected
    * Accepted => Supplier accepts order from procurer
    * Rejected => Supplier rejects order from procurer
    * Delivering => Accepted order is passed to courier for delivery
    * Delivered => Delivering order is passed to procurer, pending transfer
    * Closed => Payment for delivered order has been transferred to supplier
    */
   enum OrderStatus { ordered, accepted, rejected, delivering, delivered, closed }

   mapping(address => Procurer) procurers;
   mapping(address => Supplier) suppliers;
   mapping(address => Courier) couriers;
   mapping(uint256 => PurchaseOrder) orders;
   mapping(uint256 => Product) products;
   
   uint256 orderId;

   struct Product {
      address supplier;
      uint256 productId;
      uint256 quantityAvailable;
      uint256 price;
      string productName;
      bool listed;
   }

   // @TODO decide on whether supplier and couriers need employees
   struct PurchaseOrder {
      address procurer;
      address supplier;
      address courier;
      uint256 productId;
      uint256 price;  
      uint256 dateCreated; 
      string employeeName;
      bool isClosed;
   }

   constructor(ERC20 erc20Address) public {
      erc20 = erc20Address;
      _owner = msg.sender;
   }

   /* ==================== Modifiers ==================== */

   modifier ownerOnly() {
      require(msg.sender == _owner, "Only contract owner is allowed to perform this action");
      _;
   }

   modifier supplierOnly() {
      require(suppliers[msg.sender] != 0, "Only registered supplier is allowed to perform this action");
      _;
   }

   modifier procurerOnly() {
      require(procurers[msg.sender] != 0, "Only registered procurer is allowed to perform this action");
      _;
   }

   modifier courierOnly {
      require(couriers[msg.sender] != 0, "Only registered courier is allowed to perform this action");
   }


   /* ==================== Procurer Functions ==================== */

   /**
    * Creates a purchase order for a product listed, which waits for pending approval from the supplier.
    * @called Procurer contract
    * @return Order ID of the newly created purchase order
    */
   function createPurchaseOrder(Product product, uint256 quantity, uint256 price) public procurerOnly returns (uint256) {
   }

   /**
    * Procurer accepts that the delivery has been delivered.
    * Will transfer the funds to the supplier.
    * @called Procurer contract
    */
   function deliveredByDelivery(uint256 orderId, uint256 companyId) public {
   }

   /* ==================== Supplier Functions ==================== */

   /**
    * Supplier accepts a purchase order, which waits for the supplier to assign a courier for delivery.
    * @called Supplier contract
    */ 
   function acceptPurchaseOrder(uint256 orderId) public {
   }

   /**
    * Supplier rejects a purchase order, hence the order will not have any further actions.
    * @called Supplier contract
    */
   function rejectPurchaseorder(uint256 orderId) public {
   }

   /**
    * Supplier lists a product on the marketplace, allowing procurers to procure the products.
    * @called Supplier contract
    */
   function listProduct(uint256 productId, uint256 quantityAvailable, uint256 price, string name) supplierOnly {      
   } 

   /**
    * Supplier unlists a product on the marketplace, no further purchases can be performed with this product.
    * Innately, the product is disabled and can be reenabled for further trade.
    * @called Supplier contract
    */
   function unlistProduct(uint256 productId) public {
   }

   /**
    * Supplier assigns a courier to deliver an order made by a procurer.
    * @called Supplier contract
    */
   function assignCourier(uint256 courierId, uint256 orderId) public {
   }

   /* ==================== Courier Functions ==================== */

   function receivedByCourier(uint256 orderId) public {
   }
   
}