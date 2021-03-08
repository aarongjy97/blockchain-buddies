pragma solidity ^0.5.0;

contract Supplier {
   constructor() public {}

   struct Product {
      address supplier;
      uint256 productId;
      uint256 quantityAvailable;
      uint256 price;
      string productName;
   }

   uint256 numProducts;

   mapping(uint256 => Product) products;

   function listProduct(uint256 productId, uint256 quantityAvailable, uint256 price, string name) returns (uint256) {

      Product memory p = Product(msg.sender, productId, quantityAvailable, price, name);
      products[numProducts] = p;

      return numProducts++;
   }

   function unlistProduct(uint256 productId) {

      delete products[productId];
   }
}
