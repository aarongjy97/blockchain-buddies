const express = require("express");
const { query, transact } = require("../db.js");
const market = require("../contracts/Market");
const structParser = require("../helpers/StructParser");
const errorParser = require("../helpers/ErrorParser");

const router = express.Router();

async function getMarketAddress() {
  return await transact(async (query) => {
    const address = (
      await query(
        `
          select address
          from market
          where id=1
        `
      )
    ).rows[0];

    if (address == undefined) {
      throw new Error("Invalid Employee Address");
    }

    return address.address;
  });
}

router.get("/viewproduct", async (req, res, next) => {
  const { productId } = req.query;
  try {
    const address = await getMarketAddress();
    const product = await market.viewProduct(productId, address);
    return res.status(200).send(structParser.parseProduct(product));
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Product ID ${productId}`));
  }
});

router.get("/viewallproducts", async (req, res, next) => {
  try {
    const address = await getMarketAddress();
    const result = await market.viewAllProducts(address);
    const products = result.map((p) => structParser.parseProduct(p));
    return res.status(200).send(products);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Products`));
  }
});

router.get("/viewsupplierproducts", async (req, res, next) => {
  const { supplier } = req.query;
  try {
    const address = await getMarketAddress();
    const result = await market.viewSupplierProducts(supplier, address);
    const products = result.map((p) => structParser.parseProduct(p));
    return res.status(200).send(products);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Supplier Products`));
  }
});

module.exports = router;
