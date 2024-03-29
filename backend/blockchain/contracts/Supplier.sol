pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './Structs.sol';
import './Market.sol';
import './MarketERC20.sol';

contract Supplier {

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

   constructor(Market _marketAddress, MarketERC20 _erc20Address) public {
      _owner = msg.sender;
      market = _marketAddress;
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

   /* ==================== General Functions ==================== */

   function getTokenBalance() public view employeeOnly returns (uint256) {
      return erc20.balanceOf(address(this));
   }

   /**
    * @notice Retrieves the statistics of a supplier
    * @return Total amount of tokens earned, total amount of products sold, and average rating across products.
    */
   function supplierStatistics() public view employeeOnly returns (uint, uint, uint) {
      return market.supplierStatistics();
   }

   /* ==================== Admin Functions ==================== */

   function addEmployee(address _employee, string memory name) public ownerOnly {
      require(_employee != address(0), "Invalid employee address");
      Employee memory _newEmployee = Employee(name, EmployeeType.Employee);
      employees[_employee] = _newEmployee;
   }

   function registerAsSupplier() public ownerOnly {
      market.registerAsSupplier();
   }

   function viewEmployee(address employeeAddress) public view ownerOnly returns (Employee memory) {
      return employees[employeeAddress];
   }

   /* ==================== Product Functions ==================== */

   /**   
    * @notice View supplier's own product
    * @return Struct.Product
    */
   function viewSelfProduct(uint _productId) public view employeeOnly returns (Structs.Product memory) {
      return market.supplierViewSelfProduct(_productId);
   }

   /**
    * @notice View all of supplier's own products
    * @return Struct.Product[]
    */
   function viewAllSelfProducts() public view employeeOnly returns (Structs.Product[] memory) {
      return market.supplierViewAllSelfProducts();
   }

   /**
    * @notice Supplier lists a product on the marketplace, allowing procurers to procure the products.
    * @dev Calls Market Contract
    * @return Product ID
    */
   function listProduct(uint quantityAvailable, uint price, string memory name, string memory description, string memory imageUrl) public employeeOnly returns (uint) {
      return market.listProduct(quantityAvailable, price, name, description, imageUrl);
   }

   /**
    * @notice Supplier unlists a product on the marketplace, no further purchases can be performed with this product.
    * Innately, the product is disabled and can be reenabled for further trade.
    * @dev Calls Market Contract
    */
   function unlistProduct(uint _productId) public employeeOnly {
      market.unlistProduct(_productId);
   }

   /**
    * @notice Supplier relists a product on the marketplace that has been previously unlisted.
    * @dev Calls Market Contract
    */
   function relistProduct(uint _productId) public employeeOnly {
      market.relistProduct(_productId);
   }

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Calls Market Contract
    */
   function updateProductPrice(uint _productId, uint newPrice) public employeeOnly {
      market.updateProductPrice(_productId, newPrice);
   }

   /**
    * @notice Supplier updates the price of a product on the marketplace
    * @dev Calls Market Contract
    */
   function updateProductQuantity(uint _productId, uint newQuantity) public employeeOnly {
      market.updateProductQuantity(_productId, newQuantity);
   }

   /**
    * @notice Supplier updates the description of a product on the marketplace
    * @dev Calls Market Contract
    */
   function updateProductDescription(uint _productId, string memory description) public employeeOnly {
      market.updateProductDescription(_productId, description);
   }

   /**
    * @notice Supplier updates the image URL path of a product on the marketplace
    * @dev Calls Market Contract
    */
   function updateProductImageUrl(uint _productId, string memory imageUrl) public employeeOnly {
      market.updateProductImageUrl(_productId, imageUrl);
   }

   /* ==================== Order Functions ==================== */

   /**
    * @notice Supplier approves a purchase order, which waits for the supplier to assign a courier for delivery.
    * @dev Calls Market Contract
    */ 
   function supplierApprovePurchaseOrder(uint _orderId) public employeeOnly {
      market.supplierApprovePurchaseOrder(_orderId);
   }

   /**
    * @notice Supplier rejects a purchase order, hence the order will not have any further actions.
    * @dev Calls Market Contract
    */
   function supplierRejectPurchaseOrder(uint _orderId) public employeeOnly {
      market.supplierRejectPurchaseorder(_orderId);
   }

   /**
    * @notice Supplier assigns a courier to deliver an order made by a procurer.
    * @dev Calls Market Contract
    */
   function assignCourier(address courier, uint _orderId) public employeeOnly {
      market.assignCourier(courier, _orderId);
   }

   /**
    * @notice View all purchase orders related to supplier.
    * @return Structs.PurchaseOrder[]
    */
   function supplierViewAllPurchaseOrders() public view employeeOnly returns (Structs.PurchaseOrder[] memory) {
      return market.supplierViewAllPurchaseOrders();
   }

   /**
    * @notice View a purchase order. Can only be viewed by relevant stakeholders.
    * @return PurchaseOrder
    */
   function viewPurchaseOrder(uint _orderId) public view employeeOnly returns (Structs.PurchaseOrder memory) {
      return market.viewPurchaseOrder(_orderId);
   }
}
