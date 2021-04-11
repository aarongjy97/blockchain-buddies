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
      throw new Error("Market Address Not Found");
    }

    return address.address;
  });
}

router.get("/viewproduct", async (req, res, next) => {
  const { productId } = req.query;
  try {
    const address = await getMarketAddress();
    const product = await market.viewProduct(productId, address);
    const p = await structParser.parseProduct(product);
    return res.status(200).send(p);
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
    const products = await Promise.all(
      result
        .filter(
          (product) =>
            product[0] !== "0x0000000000000000000000000000000000000000"
        )
        .map((p) => structParser.parseProduct(p))
    );
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
    const products = await Promise.all(
      result
        .filter(
          (product) =>
            product[0] !== "0x0000000000000000000000000000000000000000"
        )
        .map((p) => structParser.parseProduct(p))
    );
    return res.status(200).send(products);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Supplier Products`));
  }
});

router.get("/getmarketaddress", async (req, res, next) => {
  try {
    const address = await getMarketAddress();
    return res.status(200).send(address);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Supplier Products`));
  }
})

module.exports = router;
