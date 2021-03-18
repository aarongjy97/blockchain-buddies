pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./MarketERC20.sol";
import "./Procurer.sol";
import "./Supplier.sol";
import "./Courier.sol";
import "./Structs.sol";

contract Market {
   ERC20 erc20;

   address _owner;

   /* Stakeholders */
   mapping(address => Procurer) procurers;
   mapping(address => Supplier) suppliers;
   mapping(address => Courier) couriers;

   /* Procurers' Purchase Orders */
   mapping(uint256 => Structs.PurchaseOrder) orders;

   /* Suppliers' Products */
   mapping(uint256 => Structs.Product) products;
   
   uint256 orderId;
   uint256 productId;

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
   function viewProduct(uint256 _productId) public view returns (Structs.Product memory) {
      require(_productId > 0, "Invalid Product ID");
      require(products[_productId].productId != 0, "Product doesn't exist");
      require(products[_productId].listed, "Product is not listed currently");
      return products[_productId];
   }

   /**
    * @notice Views all available products listed in the marketplace.
    * @return Product[]
    */
   function viewAllProducts() public view returns (Structs.Product[] memory) {
      Structs.Product[] memory _pa = new Structs.Product[](productId - 1);
      for (uint256 i = 1; i < productId; i++) {
         if (products[i].listed) {
            _pa[i - 1] = products[i];
         }
      } 
      return _pa;
   }

   /**
    * @notice Views all available products from a supplier listed in the marketplace
    * @return Product[]
    */
   function viewSupplierProducts(address _supplier) public view returns (Structs.Product[] memory) {
      Structs.Product[] memory _pa = new Structs.Product[](productId - 1);
      uint256 j = 0;
      for (uint256 i = 1; i < productId; i++) {
         if (products[i].listed && _supplier == products[i].supplier) {
            _pa[j++] = products[i];
         }
      } 
      return _pa;
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

   /* ==================== Common Functions ==================== */

   /**
    * @notice View a purchase order. Can only be viewed by relevant stakeholders.
    * @return PurchaseOrder
    */
   function viewPurchaseOrder(uint256 _orderId) public view returns (Structs.PurchaseOrder memory) {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(
         orders[_orderId].procurer == msg.sender || orders[_orderId].supplier == msg.sender || orders[_orderId].courier == msg.sender,
         "Unauthorised Access to Purchase Order"
      );
      return orders[_orderId];
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

      Structs.PurchaseOrder memory po = Structs.PurchaseOrder(
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
         Structs.OrderStatus.Ordered
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
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = Structs.OrderStatus.InternalApproved;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   }

   /**
    * @notice Procurer finance team rejects a purchase order
    * @dev Called by a Procurer contract, from the finance team only
    */
   function procurerRejectPurchaseOrder(uint256 _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = Structs.OrderStatus.InternalRejected;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   }

   /**
    * @notice Procurer accepts that the delivery has been delivered.
    * Will transfer the funds to the supplier.
    * @dev Called by a Procurer contract
    */
   function deliveredByDelivery(uint256 _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Ordered, "Current status of order is not ordered");

      // transfer funds to supplier upon confirmation of delivery by procurer (items are in good condition)
      erc20.transferFrom(orders[_orderId].procurer, orders[_orderId].supplier, orders[_orderId].price * orders[_orderId].quantity);
      orders[_orderId].status = Structs.OrderStatus.Delivered;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   }

   /**
    * @notice View all purchase orders related to procurer.
    * @return Structs.PurchaseOrder[]
    */
   function procurerViewAllPurchaseOrders() public view procurerOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint256 j = 0;
      for (uint256 i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].procurer) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }

   /* ==================== Supplier Functions ==================== */

   /**
    * @notice Supplier approves a purchase order, which waits for the supplier to assign a courier for delivery.
    * @dev Called by a Supplier contract
    */ 
   function supplierApprovePurchaseOrder(uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.InternalApproved, "Current status of order is not internal approved");

      // assuming that funds from procurer are transfered to marketplace upon approval from supplier 
      require(erc20.transferFrom(orders[_orderId].procurer, address(this), orders[_orderId].price * orders[_orderId].quantity), "Insufficient funds in procurer's account");
      orders[_orderId].status = Structs.OrderStatus.SupplierApproved;
      orders[_orderId].supplierEmployee = tx.origin;
   }

   /**
    * @notice Supplier rejects a purchase order, hence the order will not have any further actions.
    * @dev Called by a Supplier contract
    */
   function supplierRejectPurchaseorder(uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.InternalApproved, "Current status of order is not internal approved");
      orders[_orderId].status = Structs.OrderStatus.SupplierRejected;
      orders[_orderId].supplierEmployee = tx.origin;
   }

   /**
    * @notice Supplier lists a product on the marketplace, allowing procurers to procure the products.
    * @dev Called by a Supplier contract
    * @return Product ID
    */
   function listProduct(uint256 quantityAvailable, uint256 price, string memory name) public supplierOnly returns (uint256) {      
      Structs.Product memory _p = Structs.Product(
         msg.sender,
         productId,
         quantityAvailable,
         price,
         0,
         name,
         true
      );

      products[productId] = _p;
      productId++;

      return _p.productId;
   } 

   /**
    * @notice Supplier unlists a product on the marketplace, no further purchases can be performed with this product.
    * Innately, the product is disabled and can be reenabled for further trade.
    * @dev Called by a Supplier contract
    */
   function unlistProduct(uint256 _productId) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].listed = false;
   }

   // function relistProduct(uint256 _productId) public supplierOnly {}

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Called by a Supplier contract
    */
   function updateProductPrice(uint256 _productId, uint256 newPrice) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].price = newPrice;
   }

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Called by a Supplier contract
    */
   function updateProductQuantity(uint256 _productId, uint256 newQuantity) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].quantityAvailable = newQuantity;
   }

   /**
    * @notice Supplier assigns a courier to deliver an order made by a procurer.
    * @dev Called by a Supplier contract
    */
   function assignCourier(address courier, uint256 _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.SupplierApproved, "Current status of order is not supplier approved");
      require(courier != address(0), "Invalid courier address");
      require(address(couriers[courier]) == courier, "Courier does not exist");
      
      orders[_orderId].courier = courier;
   }

   /**
    * @notice View all purchase orders related to supplier.
    * @return Structs.PurchaseOrder[]
    */
   function supplierViewAllPurchaseOrders() public view supplierOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint256 j = 0;
      for (uint256 i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].supplier) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }

   /* ==================== Courier Functions ==================== */

   /**
    * @notice Courier acknowledges they have received the goods to be delivered from the supplier.
    * @dev Called by a Courier contract
    */
   function receivedByCourier(uint256 _orderId) public courierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].courier == msg.sender, "Only valid courier can access this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.SupplierApproved, "Current status of order is not supplier approved");

      orders[_orderId].courierEmployee = tx.origin;
      orders[_orderId].status = Structs.OrderStatus.Delivering;
   }
   
   /**
    * @notice View all purchase orders related to courier.
    * @return Structs.PurchaseOrder[]
    */
   function courierViewAllPurchaseOrders() public view courierOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint256 j = 0;
      for (uint256 i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].courier) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }
}