pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./Procurer.sol";
import "./Supplier.sol";
import "./Courier.sol";

contract Market {
   ERC20 erc20;

   address _owner;

   /**
    * @dev
    * notCreated => Default null value for comparisons in require
    * Ordered => Procurer places an order, to be approved or rejected by both internally and supplier
    * InternalApproved => Internal Finance team approved
    * InternalRejected => Internal Finance team rejected
    * SupplierApproved => Suplier approves order from procurer
    * SupplierRejected => Supplier rejects order from procurer
    * Delivering => Accepted order is passed to courier for delivery
    * Delivered => Delivering order is passed to procurer, pending transfer
    */
   enum OrderStatus { 
      notCreated,
      Ordered, 
      InternalApproved, 
      SupplierApproved, 
      InternalRejected, 
      SupplierRejected, 
      Delivering, 
      Delivered
   }

   /* Stakeholders */
   mapping(address => Procurer) procurers;
   mapping(address => Supplier) suppliers;
   mapping(address => Courier) couriers;

   /* Procurers' Purchase Orders */
   mapping(uint256 => PurchaseOrder) orders;

   /* Suppliers' Products */
   mapping(uint256 => Product) products;
   
   uint256 orderId;
   uint256 productId;

   struct Product {
      address supplier;
      uint256 productId;
      uint256 quantityAvailable;
      uint256 price;
      string productName;
      bool listed;
   }

   struct PurchaseOrder {
      /* Procurer */
      address procurer;
      address procurerLogisticsEmployee;
      address procurerFinanceEmployee;
   
      /* Supplier */
      address supplier;
      address supplierEmployee;

      /* Courier */
      address courier;
      address courierEmployee;

      /* Order Details */ 
      uint256 productId;
      uint256 orderId;
      uint256 quantity;
      uint256 price;  
      uint256 dateCreated; 
      OrderStatus status;
   }

   /* ==================== Events ==================== */
   event Registered(string registerType, address registerer);

   constructor(ERC20 erc20Address) public {
      erc20 = erc20Address;
      _owner = msg.sender;
      orderId = 1;
      productId = 1;
   }

   /* ==================== Modifiers ==================== */

   modifier ownerOnly() {
      require(msg.sender == _owner, "Only contract owner is allowed to perform this action");
      _;
   }

   modifier supplierOnly() {
      require(address(suppliers[msg.sender]) == msg.sender, "Only registered supplier is allowed to perform this action");
      _;
   }

   modifier procurerOnly() {
      require(address(procurers[msg.sender]) == msg.sender, "Only registered procurer is allowed to perform this action");
      _;
   }

   modifier courierOnly {
      require(address(couriers[msg.sender]) == msg.sender, "Only registered courier is allowed to perform this action");
      _;
   }


   /* ==================== Public Functions ==================== */ 

   /**
    * @notice View a product listed in the marketplace.
    * @return Product
    */
   function viewProduct(uint256 _productId) public view 
      returns (address supplier,
               uint256 productId_,
               uint256 quantityAvailable,
               uint256 price,
               string memory productName) {

      require(_productId > 0, "Invalid Product ID");
      require(products[_productId].productId != 0, "Product doesn't exist");
      require(products[_productId].listed, "Product is not listed currently");

      return (products[_productId].supplier, 
               products[_productId].productId, 
               products[_productId].quantityAvailable, 
               products[_productId].price,
               products[_productId].productName);
   }

   /**
    * @notice Registers a contract called to be a supplier.
    * @dev Emits Registered(Supplier, contract address)
    */
   function registerAsSupplier() public {
      require(msg.sender != address(0), "Invalid address called");
      require(address(suppliers[msg.sender]) == address(0), "Already registered as supplier");

      Supplier _supplier = Supplier(msg.sender);
      suppliers[msg.sender] = _supplier;

      emit Registered("Supplier", msg.sender);
   }

   /**
    * @notice Registers a contract called to be a procurer.
    * @dev Emits Registered(Procurer, contract address)
    */
   function registerAsProcurer() public {
      require(msg.sender != address(0), "Invalid address called");
      require(address(procurers[msg.sender]) == address(0), "Already registered as procurer");

      Procurer _procurer = Procurer(msg.sender);
      procurers[msg.sender] = _procurer;

      emit Registered("Procurer", msg.sender);
   }

   /**
    * @notice Registers a contract called to be a courier.
    * @dev Emits Registered(Courier, contract address)
    */
   function registerAsCourier() public {
      require(msg.sender != address(0), "Invalid address called");
      require(address(couriers[msg.sender]) == address(0), "Already registered as courier");

      Courier _courier = Courier(msg.sender);
      couriers[msg.sender] = _courier;

      emit Registered("Courier", msg.sender);
   }

   /* ==================== Procurer Functions ==================== */

   /**
    * @notice Creates a purchase order for a product listed, which waits for pending approval from the supplier.
    * @dev Called by a Procurer contract, from the logistics team only
    * @return Order ID of the newly created purchase order
    */
   function createPurchaseOrder(uint256 _productId, uint256 quantity, uint256 price) public procurerOnly returns (uint256) {
      
      require(_productId > 0, "Invalid Product ID");
      require(quantity > 0, "Invalid Quantity");
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].price * quantity == price, "Invalid Price");

      PurchaseOrder memory po = PurchaseOrder(
         msg.sender,
         tx.origin,
         address(0),
      
         products[_productId].supplier,
         address(0),

         address(0),
         address(0),

         _productId,
         orderId,
         quantity,
         price,
         now,
         OrderStatus.Ordered
      );

      orders[orderId] = po;
      orderId++;

      return po.orderId;
   }

   /**
    * @notice Procurer finance team approves a purchase order
    * @dev Called by a Procurer contract, from the finance team only
    */
   function procurerApprovePurchaseOrder(uint256 _orderId) public procurerOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = OrderStatus.InternalApproved;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   }

   /**
    * @notice Procurer finance team rejects a purchase order
    * @dev Called by a Procurer contract, from the finance team only
    */
   function procurerRejectPurchaseOrder(uint256 _orderId) public procurerOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = OrderStatus.InternalRejected;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   }

   /**
    * @notice Procurer accepts that the delivery has been delivered.
    * Will transfer the funds to the supplier.
    * @dev Called by a Procurer contract
    */
   function deliveredByDelivery(uint256 _orderId, uint256 companyId) public {
   }

   /* ==================== Supplier Functions ==================== */

   /**
    * @notice Supplier approves a purchase order, which waits for the supplier to assign a courier for delivery.
    * @dev Called by a Supplier contract
    */ 
   function supplierApprovePurchaseOrder(uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == OrderStatus.InternalApproved, "Current status of order is not internal approved");
      orders[_orderId].status = OrderStatus.SupplierApproved;
      orders[_orderId].supplierEmployee = tx.origin;
   }

   /**
    * @notice Supplier rejects a purchase order, hence the order will not have any further actions.
    * @dev Called by a Supplier contract
    */
   function supplierRejectPurchaseorder(uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == OrderStatus.InternalApproved, "Current status of order is not internal approved");
      orders[_orderId].status = OrderStatus.SupplierRejected;
      orders[_orderId].supplierEmployee = tx.origin;
   }

   /**
    * @notice Supplier lists a product on the marketplace, allowing procurers to procure the products.
    * @dev Called by a Supplier contract
    */
   function listProduct(uint256 _productId, uint256 quantityAvailable, uint256 price, string memory name) public supplierOnly {      
   } 

   /**
    * @notice Supplier unlists a product on the marketplace, no further purchases can be performed with this product.
    * Innately, the product is disabled and can be reenabled for further trade.
    * @dev Called by a Supplier contract
    */
   function unlistProduct(uint256 _productId) public {
   }

   /**
    * @notice Supplier assigns a courier to deliver an order made by a procurer.
    * @dev Called by a Supplier contract
    */
   function assignCourier(address courier, uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == OrderStatus.SupplierApproved, "Current status of order is not supplier approved");
      require(courier != address(0), "Invalid courier address");
      require(address(couriers[courier]) == courier, "Courier does not exist");
      
      orders[_orderId].courier = courier;
   }

   /* ==================== Courier Functions ==================== */

   /**
    * @notice Courier acknowledges they have received the goods to be delivered from the supplier.
    * @dev Called by a Courier contract
    */
   function receivedByCourier(uint256 _orderId) public courierOnly {
      require(orders[_orderId].status != OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].courier == msg.sender, "Only valid courier can access this purchase order");
      require(orders[_orderId].status == OrderStatus.SupplierApproved, "Current status of order is not supplier approved");

      orders[_orderId].courierEmployee = tx.origin;
      orders[_orderId].status = OrderStatus.Delivering;
   }
   
}