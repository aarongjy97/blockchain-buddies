const express = require("express");
const { query, transact } = require("../db.js");
const supplier = require("../contracts/Supplier");
const structParser = require("../helpers/StructParser");
const errorParser = require("../helpers/ErrorParser");

const router = express.Router();

async function getSupplierContractAddress(employeeAddress) {
  return await transact(async (query) => {
    const address = (
      await query(
        `
        select S.address 
        from supplier S join supplieremployee E on (E.company = S.id) 
        where E.address = $1;
        `,
        [employeeAddress]
      )
    ).rows[0];

    if (address == undefined) {
      throw new Error("Invalid Employee Address");
    }

    return address.address;
  });
}

router.get("/viewselfproduct", async (req, res, next) => {
  const { employeeAddress, productId } = req.query;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.viewSelfProduct(
      productId,
      employeeAddress,
      address
    );
    return res.status(200).send(structParser.parseProduct(result));
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Viewing of Self Product Failed"));
  }
});

router.get("/viewallselfproduct", async (req, res, next) => {
  const { employeeAddress } = req.query;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.viewAllSelfProducts(employeeAddress, address);
    const products = result.map((product) =>
      structParser.parseProduct(product)
    );
    return res.status(200).send(products);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Viewing of Self Products Failed"));
  }
});

router.post("/listproduct", async (req, res, next) => {
  const { employeeAddress, quantity, name, price } = req.body;

  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.listProduct(
      quantity,
      price,
      name,
      employeeAddress,
      address
    );
    return res.status(202).send("Product Listed");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorParser(error, "Listing of Product Failed"));
  }
});

router.post("/unlistproduct", async (req, res, next) => {
  const { productId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.unlistProduct(
      productId,
      employeeAddress,
      address
    );
    return res.status(202).send("Product Unlisted");
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Unlisting of Product Failed"));
  }
});

router.post("/relistproduct", async (req, res, next) => {
  const { productId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.relistProduct(
      productId,
      employeeAddress,
      address
    );
    return res.status(202).send("Product Relisted");
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Relisting of Product Failed"));
  }
});

router.post("/updateproductprice", async (req, res, next) => {
  const { productId, newPrice, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.updateProductPrice(
      productId,
      newPrice,
      employeeAddress,
      address
    );
    return res
      .status(202)
      .send(`Product ID ${productId} Price Updated to ${newPrice} tokens`);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(error, `Updating Price of Product ${productId} failed`)
      );
  }
});

router.post("/updateproductquantity", async (req, res, next) => {
  const { productId, newQuantity, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.updateProductQuantity(
      productId,
      newQuantity,
      employeeAddress,
      address
    );
    return res
      .status(202)
      .send(`Product ID ${productId} Quantity Updated to ${newQuantity}`);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(error, `Updating Quantity of Product ${productId} failed`)
      );
  }
});

router.post("/approvepurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.supplierApprovePurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send(`Order ID ${orderId} Approved by Supplier`);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Approval of Order ID ${orderId} Failed`));
  }
});

router.post("/rejectpurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.supplierRejectPurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send(`Order ID ${orderId} Rejected by Supplier`);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Rejection of Order ID ${orderId} Failed`));
  }
});

router.post("/assigncourier", async (req, res, next) => {
  const { courier, orderId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.assignCourier(
      courier,
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send(`Courier of Order ID ${orderId} Assigned`);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(
          error,
          `Assignment of Courier for Order ID ${orderId} Failed`
        )
      );
  }
});

router.post("/viewallpurchaseorders", async (req, res, next) => {
  const { employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.supplierViewAllPurchaseOrders(
      employeeAddress,
      address
    );
    const purchaseOrders = result.map((po) =>
      structParser.parsePurchaseOrder(po)
    );
    return res.status(200).send(purchaseOrders);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(error, `Error Ocurred While Retreiving Purchase Orders`)
      );
  }
});

router.post("/viewpurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getSupplierContractAddress(employeeAddress);
    const result = await supplier.viewPurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    return res.status(200).send(structParser.parsePurchaseOrder(result));
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(
          error,
          `Failed to Retrieve Order ${orderId}`
        )
      );
  }
});

module.exports = router;
