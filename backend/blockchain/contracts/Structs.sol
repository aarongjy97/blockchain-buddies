pragma solidity ^0.5.0;

library Structs {

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

    struct Product {
      address supplier;
      uint productId;
      uint quantityAvailable;
      uint price;
      uint numSold;
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
      uint productId;
      uint orderId;
      uint quantity;
      uint price;  
      uint dateCreated; 
      OrderStatus status;
    
    }

}