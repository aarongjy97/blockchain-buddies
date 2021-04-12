const { query, transact } = require("../db");

function addressChecker(address) {
  return address !== "0x0000000000000000000000000000000000000000";
}

async function parseProduct(product) {
  let p = {
    supplier: product[0],
    productId: product[1],
    quantityAvailable: product[2],
    price: product[3],
    numSold: product[4],
    productName: product[5],
    listed: product[6],
    description: product[7],
    rating: parseFloat(product[8]),
    ratings: parseInt(product[9])
  };

  try {

    /* Adds Supplier Name */
    const supplierName = (
      await query(
        `select name 
        from supplier
        where address=$1`,
        [p.supplier]
      )
    ).rows[0]; 
    p.supplierName = supplierName.name;
  } catch (error) {
    console.log(error)
  } finally {
    return p;
  }

}

const orderStatus = [
  "Not Created",
  "Ordered",
  "Internal Approved",
  "Supplier Approved",
  "Internal Rejected",
  "Supplier Rejected",
  "Courier Assigned",
  "Delivering",
  "Delivered",
];

async function parsePurchaseOrder(purchaseOrder) {
  let po = {
    /* Procurer */
    procurer: purchaseOrder[0],
    procurerName: '',

    procurerLogisticsEmployee: purchaseOrder[1],
    procurerLogisticsEmployeeName: '',

    procurerFinanceEmployee: purchaseOrder[2],
    procurerFinanceEmployeeName: '',

    /* Supplier */
    supplier: purchaseOrder[3],
    supplierName: '',

    supplierEmployee: purchaseOrder[4],
    supplierEmployeeName: '',

    /* Courier */
    courier: purchaseOrder[5],
    courierName: '',

    courierEmployee: purchaseOrder[6],
    courierEmployeeName: '',

    /* Order Details */
    productId: purchaseOrder[7],
    productName: purchaseOrder[8],
    orderId: purchaseOrder[9],
    quantity: purchaseOrder[10],
    price: purchaseOrder[11],
    dateCreated: new Date(parseInt(purchaseOrder[12]) * 1000),
    status: orderStatus[parseInt(purchaseOrder[13])],
    rating: purchaseOrder[14]
  };

  try {
    
    /* Adds Procurer Name */
    po.procurerName = (
      await query(
        `select name from procurer where address=$1`,
        [po.procurer]
      )
    ).rows[0].name;

    /* Adds Procurer Logs Employee Name */
    po.procurerLogisticsEmployeeName =  (
      await query(
        `select name from procureremployee where address=$1`,
        [po.procurerLogisticsEmployee]
      )
    ).rows[0].name

    /* Adds Procurer Finance Employee Name, if exists */
    if (addressChecker(po.procurerFinanceEmployee)) {
      po.procurerFinanceEmployeeName = (
        await query(
          `select name from procureremployee where address=$1`,
          [po.procurerFinanceEmployee]
        )
      ).rows[0].name;
    }

    /* Adds Supplier Name */
    po.supplierName = (
      await query(
        `select name from supplier where address=$1`,
        [po.supplier]
      )
    ).rows[0].name;

    /* Adds Supplier Employee Name, if exists */
    if (addressChecker(po.supplierEmployee)) {
      po.supplierEmployeeName = (
        await query(
          `select name from supplieremployee where address=$1`,
          [po.supplierEmployee]
        )
      ).rows[0].name;
    }

    /* Adds Courier Name, if exists */
    if (addressChecker(po.courier)) {
      po.courierName = (
        await query(
          `select name from courier where address=$1`,
          [po.courier]
        )
      ).rows[0].name;
    }

    /* Adds Courier Employee Name, if exists */
    if (addressChecker(po.courierEmployee)) {
      po.courierEmployeeName = (
        await query(
          `select name from courieremployee where address=$1`,
          [po.courierEmployee]
        )
      ).rows[0].name;
    }

  } catch (error) {
    console.log(error);
  } finally {
    return po;
  }

}

module.exports = {
  parseProduct: parseProduct,
  parsePurchaseOrder: parsePurchaseOrder,
};
