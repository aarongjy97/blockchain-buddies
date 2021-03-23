function parseProduct(product) {
  const p = {
    supplier: product[0],
    productId: product[1],
    quantityAvailable: product[2],
    price: product[3],
    numSold: product[4],
    productName: product[5],
    listed: product[6],
  };

  return p;
}

const orderStatus = [
  "Not Created",
  "Ordered",
  "Internal Approved",
  "Supplier Approved",
  "Internal Rejected",
  "Supplier Rejected",
  "Delivering",
  "Delivered",
];

function parsePurchaseOrder(purchaseOrder) {
  const po = {
    /* Procurer */
    procurer: purchaseOrder[0],
    procurerLogisticsEmployee: purchaseOrder[1],
    procurerFinanceEmployee: purchaseOrder[2],

    /* Supplier */
    supplier: purchaseOrder[3],
    supplierEmployee: purchaseOrder[4],

    /* Courier */
    courier: purchaseOrder[5],
    courierEmployee: purchaseOrder[6],

    /* Order Details */
    productId: purchaseOrder[7],
    orderId: purchaseOrder[8],
    quantity: purchaseOrder[9],
    price: purchaseOrder[10],
    dateCreated: purchaseOrder[11],
    status: orderStatus[parseInt(purchaseOrder[12])],
  };

  return po;
}

module.exports = {
  parseProduct: parseProduct,
  parsePurchaseOrder: parsePurchaseOrder,
};
