pragma solidity ^0.5.0;

contract Market {
   // Roles struct 
   struct company {
      address add;
   }

   struct supplier {  
      address add;
      mapping(uint256 => product) products;
   }

   struct logisticsDepartment { 
      address add;
      mapping(uint256 => logisticsEmployee) logisticsEmployees; 
   }

   struct logisticsEmployee { 
      address add;
      string name;
      uint256 companyId;
   }

   struct financeDepartment {
      address add;
      mapping(uint256 => financeEmployee) financeEmployees; 
   }

   struct financeEmployee { 
      address add;
      string name;
      uint256 companyId;
   }

   struct deliveryCourier {
      address add;
   }

   // Misc struct

   struct product {
      address supplier;
   }

   struct purchaseOrder {
      address logisticsDepartment
      address supplier
      address deliveryCourier 
      uint256 productId
      uint256 price  
      date dateCreated 
      string employeeName
   }
}