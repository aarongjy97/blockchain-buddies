pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./MarketERC20.sol";
import "./Procurer.sol";
import "./Supplier.sol";
import "./Courier.sol";
import "./Structs.sol";

contract Market {

   MarketERC20 erc20;
   address _owner;

   uint orderId;
   uint productId;

   uint courierFee = 50;

   /* Stakeholders */
   mapping(address => Procurer) procurers;
   mapping(address => Supplier) suppliers;
   mapping(address => Courier) couriers;

   /* Procurers' Purchase Orders */
   mapping(uint => Structs.PurchaseOrder) orders;

   /* Suppliers' Products */
   mapping(uint => Structs.Product) products;

   /* ==================== Events ==================== */
   event Registered(string registerType, address registerer);

   /* === Supplier Events === */
   event Listed(address supplier, address supplierEmployee, uint _productId, uint quantity, uint price);
   event Unlisted(address supplier, address supplierEmployee, uint _productId);
   event Relisted(address supplier, address supplierEmployee, uint _productId);
   event ProductPriceUpdate(address supplier, address supplierEmployee, uint _productId, uint newPrice);
   event ProductQuantityUpdate(address supplier, address supplierEmployee, uint _productId, uint newQuantity);

   /* === Order Events === */
   event OrderCreated(uint _orderId, address procurer, address logisticsEmployee, uint _productId, uint _quantity, uint price);
   event OrderInternalApproved(uint _orderId, address procurer, address financeEmployee);
   event OrderInternalRejected(uint _orderId, address procurer, address financeEmployee);
   event OrderSupplierApproved(uint _orderId, address supplier, address supplierEmployee);
   event OrderSupplierRejected(uint _orderId, address supplier, address supplierEmployee);
   event OrderCourierAssigned(uint _orderId, address supplier, address supplierEmployee, address courier);
   event OrderCourierDelivering(uint _orderId, address supplier, address courier, address courierEmployee);
   event OrderDelivered(uint _orderId, address procurer);

   /* ==================== Constructor ==================== */

   constructor(MarketERC20 erc20Address) public {
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
   function viewProduct(uint _productId) public view returns (Structs.Product memory) {
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
      for (uint i = 1; i < productId; i++) {
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
      uint j = 0;
      for (uint i = 1; i < productId; i++) {
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
   function viewPurchaseOrder(uint _orderId) public view returns (Structs.PurchaseOrder memory) {
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
   function createPurchaseOrder(uint _productId, uint quantity) public procurerOnly returns (uint) {
      
      require(_productId > 0, "Invalid Product ID");
      require(quantity > 0, "Invalid Quantity");
      require(products[_productId].supplier != address(0), "Product does not exist");

      uint price = courierFee + (products[_productId].price * quantity);

      require(erc20.balanceOf(msg.sender) >= price, "Insufficient Tokens");

      Structs.PurchaseOrder memory po = Structs.PurchaseOrder(
         msg.sender,
         tx.origin,
         address(0),
      
         products[_productId].supplier,
         address(0),

         address(0),
         address(0),

         _productId,
         products[_productId].productName,
         orderId,
         quantity,
         price,
         now,
         Structs.OrderStatus.Ordered,
         0
      );

      orders[orderId] = po;
      orderId++;

      emit OrderCreated(po.orderId, msg.sender, tx.origin, _productId, quantity, price);

      return po.orderId;
   }

   /**
    * @notice Procurer finance team approves a purchase order
    * @dev Called by a Procurer contract, from the finance team only
    */
   function procurerApprovePurchaseOrder(uint _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = Structs.OrderStatus.InternalApproved;
      orders[_orderId].procurerFinanceEmployee = tx.origin;

      emit OrderInternalApproved(_orderId, msg.sender, tx.origin);
   }

   /**
    * @notice Procurer finance team rejects a purchase order
    * @dev Called by a Procurer contract, from the finance team only
    */
   function procurerRejectPurchaseOrder(uint _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Ordered, "Current status of order is not ordered");
      orders[_orderId].status = Structs.OrderStatus.InternalRejected;
      orders[_orderId].procurerFinanceEmployee = tx.origin;
   
      emit OrderInternalRejected(_orderId, msg.sender, tx.origin);
   }

   /**
    * @notice Procurer accepts that the delivery has been delivered.
    * Will transfer the funds to the supplier.
    * @dev Called by a Procurer contract
    */
   function deliveredByCourier(uint _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid procurer can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.Delivering, "Current status of order is not delivering");

      // transfer funds to supplier upon confirmation of delivery by procurer (items are in good condition)
      erc20.transferFrom(orders[_orderId].procurer, orders[_orderId].supplier, (orders[_orderId].price - courierFee));
      erc20.transferFrom(orders[_orderId].procurer, orders[_orderId].courier, courierFee);
      orders[_orderId].status = Structs.OrderStatus.Delivered;

      products[orders[_orderId].productId].numSold += orders[_orderId].quantity;

      emit OrderDelivered(_orderId, msg.sender);
   }

   /**
    * @notice View all purchase orders related to procurer.
    * @return Structs.PurchaseOrder[]
    */
   function procurerViewAllPurchaseOrders() public view procurerOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint j = 0;
      for (uint i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].procurer) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }

   /**
    * @notice Adds rating for product after order has been delivered.
    */
   function addRating(uint rating, uint _orderId) public procurerOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].procurer == msg.sender, "Only valid Procurer can rate product");
      require(orders[_orderId].status == Structs.OrderStatus.Delivered, "Order not delivered, Unable to give rating");
      require(rating > 0 && rating <= 5, "Invalid Rating");

      /* Update rating for Order */
      orders[_orderId].rating = rating;

      /* Update Product rating */
      uint _productId = orders[_orderId].productId;

      uint sum = 0;
      uint sumOrders = 0;
      for (uint i = 1; i < orderId; i++) {
         if (orders[i].status == Structs.OrderStatus.Delivered && orders[i].productId == _productId) {
            if (orders[i].rating > 0) {
               sum += orders[i].rating;
               sumOrders++;
            }
         }
      }

      uint newRating = sum / sumOrders;
      products[_productId].rating = newRating;
   }

   /**
    * @notice Retrieves the statistics of a procurer
    * @return Total amount of tokens spent, Total amount of products bought, and total amount of successful orders
    */
   function procurerStatistics() public view procurerOnly returns (uint, uint, uint) {
      uint _totalSpent = 0;
      uint _productsBought = 0;
      uint _successfulOrdersMade = 0;

      for (uint i = 0; i < orderId; i++) {
         if (msg.sender == orders[i].procurer) {
            if (orders[i].status == Structs.OrderStatus.Delivered) {
               _totalSpent += orders[i].price;
               _productsBought += orders[i].quantity;
            }

            if (orders[i].status == Structs.OrderStatus.SupplierApproved 
                  || orders[i].status == Structs.OrderStatus.Delivering 
                  || orders[i].status == Structs.OrderStatus.Delivered) {
               _successfulOrdersMade++;
            }
         }
      }

      return (_totalSpent, _productsBought, _successfulOrdersMade);
   }

   /* ==================== Supplier Functions ==================== */

   /**
    * @notice Supplier approves a purchase order, which waits for the supplier to assign a courier for delivery.
    * @dev Called by a Supplier contract
    */ 
   function supplierApprovePurchaseOrder(uint _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.InternalApproved, "Current status of order is not internal approved");

      orders[_orderId].status = Structs.OrderStatus.SupplierApproved;
      orders[_orderId].supplierEmployee = tx.origin;
   
      emit OrderSupplierApproved(_orderId, msg.sender, tx.origin);
   }

   /**
    * @notice Supplier rejects a purchase order, hence the order will not have any further actions.
    * @dev Called by a Supplier contract
    */
   function supplierRejectPurchaseorder(uint _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.InternalApproved, "Current status of order is not internal approved");
      orders[_orderId].status = Structs.OrderStatus.SupplierRejected;
      orders[_orderId].supplierEmployee = tx.origin;

      /* Decrease Allowance of Market */
      Procurer _p = Procurer(orders[_orderId].procurer);
      _p.supplierRejectPurchaseOrder(orders[_orderId].price);

      emit OrderSupplierRejected(_orderId, msg.sender, tx.origin);
   }

   /**
    * @notice Supplier lists a product on the marketplace, allowing procurers to procure the products.
    * @dev Called by a Supplier contract
    * @return Product ID
    */
   function listProduct(uint quantityAvailable, uint price, string memory name, string memory description) public supplierOnly returns (uint) {      
      Structs.Product memory _p = Structs.Product(
         msg.sender,
         productId,
         quantityAvailable,
         price,
         0,
         name,
         true,
         description,
         0
      );

      products[productId] = _p;
      productId++;

      emit Listed(msg.sender, tx.origin, _p.productId, quantityAvailable, price);

      return _p.productId;
   } 

   /**
    * @notice Supplier unlists a product on the marketplace, no further purchases can be performed with this product.
    * Innately, the product is disabled and can be reenabled for further trade.
    * @dev Called by a Supplier contract
    */
   function unlistProduct(uint _productId) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].listed = false;

      emit Unlisted(msg.sender, tx.origin, _productId);
   }

   /**
    * @notice Supplier relists a product on the marketplace that has been previously unlisted.
    * @dev Called by a Supplier contract
    */
   function relistProduct(uint _productId) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      require(!products[_productId].listed, "Product listed, cannot be relisted");
      products[_productId].listed = true;   

      emit Relisted(msg.sender, tx.origin, _productId);
   }

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Called by a Supplier contract
    */
   function updateProductPrice(uint _productId, uint newPrice) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].price = newPrice;

      emit ProductPriceUpdate(msg.sender, tx.origin, _productId, newPrice);
   }

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Called by a Supplier contract
    */
   function updateProductQuantity(uint _productId, uint newQuantity) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].quantityAvailable = newQuantity;

      emit ProductQuantityUpdate(msg.sender, tx.origin, _productId, newQuantity);
   }

   /**
    * @notice Supplier updates description of a product on the marketplace
    * @dev Called by a Supplier contract
    */
   function updateProductDescription(uint _productId, string memory description) public supplierOnly {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      products[_productId].description = description;
   }

   /**
    * @notice View supplier's own product
    * @return Struct.Product
    */
   function supplierViewSelfProduct(uint _productId) public view supplierOnly returns (Structs.Product memory) {
      require(products[_productId].supplier != address(0), "Product does not exist");
      require(products[_productId].supplier == msg.sender, "Unauthorised supplier");
      return products[_productId];
   }

   /**
    * @notice View all of supplier's own products
    * @return Struct.Product[]
    */
   function supplierViewAllSelfProducts() public view supplierOnly returns (Structs.Product[] memory) {
      Structs.Product[] memory _pa = new Structs.Product[](productId - 1);
      uint j = 0;
      for (uint i = 1; i < productId; i++) {
         if (msg.sender == products[i].supplier) {
            _pa[j++] = products[i];
         }
      } 
      return _pa;
   }

   /**
    * @notice Supplier assigns a courier to deliver an order made by a procurer.
    * @dev Called by a Supplier contract
    */
   function assignCourier(address courier, uint _orderId) public supplierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].supplier == msg.sender, "Only valid supplier can approve this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.SupplierApproved, "Current status of order is not supplier approved");
      require(courier != address(0), "Invalid courier address");
      require(address(couriers[courier]) == courier, "Courier does not exist");
      
      orders[_orderId].courier = courier;
      orders[_orderId].status = Structs.OrderStatus.CourierAssigned;

      emit OrderCourierAssigned(_orderId, msg.sender, tx.origin, courier);
   }

   /**
    * @notice View all purchase orders related to supplier.
    * @return Structs.PurchaseOrder[]
    */
   function supplierViewAllPurchaseOrders() public view supplierOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint j = 0;
      for (uint i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].supplier) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }

   /**
    * @notice Retrieves the statistics of a supplier
    * @return Total amount of tokens earned, total amount of products sold, and average rating across products.
    */
   function supplierStatistics() public view supplierOnly returns (uint, uint, uint) {
      uint _totalEarned = 0;
      uint _productsSold = 0;

      uint _totalRating = 0;
      uint _productsRated = 0;

      for (uint i = 0; i < orderId; i++) {
         if (orders[i].status == Structs.OrderStatus.Delivered && orders[i].supplier == msg.sender) {
            _totalEarned += (orders[i].price - courierFee);
            _productsSold += orders[i].quantity;
         }
      }

      for (uint j = 0; j < productId; j++) {
         if (products[j].supplier == msg.sender && products[j].rating > 0) {
            _totalRating += products[j].rating;
            _productsRated++;
         }
      }

      uint avgRating = 0;

      if (_productsRated > 0) {
         avgRating = _totalRating / _productsSold;
      }

      return (_totalEarned, _productsSold, avgRating);
   }

   /* ==================== Courier Functions ==================== */

   /**
    * @notice Courier acknowledges they have received the goods to be delivered from the supplier.
    * @dev Called by a Courier contract
    */
   function receivedByCourier(uint _orderId) public courierOnly {
      require(orders[_orderId].status != Structs.OrderStatus.notCreated, "Order does not exist");
      require(orders[_orderId].courier == msg.sender, "Only valid courier can access this purchase order");
      require(orders[_orderId].status == Structs.OrderStatus.CourierAssigned, "Current status of order is not Courier Assigned");

      orders[_orderId].courierEmployee = tx.origin;
      orders[_orderId].status = Structs.OrderStatus.Delivering;

      emit OrderCourierDelivering(_orderId, orders[_orderId].supplier, msg.sender, tx.origin);
   }
   
   /**
    * @notice View all purchase orders related to courier.
    * @return Structs.PurchaseOrder[]
    */
   function courierViewAllPurchaseOrders() public view courierOnly returns (Structs.PurchaseOrder[] memory) {
      Structs.PurchaseOrder[] memory _poa = new Structs.PurchaseOrder[](orderId - 1);
      uint j = 0;
      for (uint i = 1; i < orderId; i++) {
         if (orders[i].status != Structs.OrderStatus.notCreated && msg.sender == orders[i].courier) {
            _poa[j++] = orders[i];
         }
      } 
      return _poa;
   }

   /**
    * @notice Retrieves the statistics of a courier
    * @return Total amount of tokens earned and total number of orders delivered
    */
   function courierStatistics() public view courierOnly returns (uint, uint) {
      uint _totalEarned = 0;
      uint _ordersDelivered = 0;

      for (uint i = 0; i < orderId; i++) {
         if (orders[i].status == Structs.OrderStatus.Delivered && orders[i].courier == msg.sender) {
            _totalEarned += courierFee;
            _ordersDelivered++;
         }
      }

      return (_totalEarned, _ordersDelivered);
   }
}