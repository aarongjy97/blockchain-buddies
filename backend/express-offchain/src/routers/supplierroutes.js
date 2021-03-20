const express = require("express");
const { query, transact } = require("../db.js");
const supplier = require("../contracts/Supplier");
const structParser = require("../helpers/StructParser");

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

    return address.address;
  });
}

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
    return res.status(500).send("Listing of product failed");
  }
});

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
    return res.status(500).send("Viewing of self product failed");
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
    return res.status(500).send("Viewing of self products failed");
  }
});

module.exports = router;
