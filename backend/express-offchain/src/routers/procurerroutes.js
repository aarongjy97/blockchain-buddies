const express = require("express");
const { query, transact } = require("../db.js");
const procurer = require("../contracts/Procurer");
const structParser = require("../helpers/StructParser");
const errorParser = require("../helpers/ErrorParser");

const router = express.Router();

async function getProcurerContractAddress(employeeAddress) {
  return await transact(async (query) => {
    const address = (
      await query(
        `
        select P.address 
        from procurer P join procureremployee E on (E.company = P.id) 
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

router.post("/createpurchaseorder", async (req, res, next) => {
  const { productId, quantity, employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.createPurchaseOrder(
      productId,
      quantity,
      employeeAddress,
      address
    );
    return res.status(202).send("Order Successfully Created");
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Failed to Create Purchase Order"));
  }
});

router.put("/approvepurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.approvePurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send("Order Successfully Approved");
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Failed to Approve Purchase Order"));
  }
});

router.put("/rejectpurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.rejectPurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send("Order Successfully Rejected");
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Failed to Reject Purchase Order"));
  }
});

router.post("/viewpurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.viewPurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    const po = await structParser.parsePurchaseOrder(result);
    return res.status(200).send(po);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(error, `Failed to Retrieve Purchase Order ID ${orderId}`)
      );
  }
});

router.post("/viewallpurchaseorders", async (req, res, next) => {
  const { employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.viewAllPurchaseOrders(
      employeeAddress,
      address
    );
    const purchaseOrders = await Promise.all(
      result
        .filter((po) => po[0] !== "0x0000000000000000000000000000000000000000")
        .map((po) => structParser.parsePurchaseOrder(po))
    );
    return res.status(200).send(purchaseOrders);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Failed to Retrieve Purchase Orders"));
  }
});

router.put("/deliveredbycourier", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.deliveredByCourier(
      orderId,
      employeeAddress,
      address
    );
    return res
      .status(202)
      .send(`Order ID ${orderId} is Successfully Delivered`);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(error, `Failed to Confirm Delivery of Order ID ${orderId}`)
      );
  }
});

router.get("/gettokenbalance", async (req, res, next) => {
  const { employeeAddress } = req.query;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.getTokenBalance(employeeAddress, address);
    return res.status(200).send(result.toString());
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Token Balance`));
  }
});

router.get("/getmarketallowance", async (req, res, next) => {
  const { employeeAddress } = req.query;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.getMarketAllowance(employeeAddress, address);
    return res.status(200).send(result.toString());
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Market Allowance`));
  }
});

router.put("/addrating", async (req, res, next) => {
  const { employeeAddress, orderId, rating } = req.body;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.addRating(employeeAddress, address, rating, orderId);
    return res.status(202).send(`Rating for Order ID ${orderId} Added`);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Add Rating`));
  }
})

router.get("/statistics", async (req, res, next) => {
  const { employeeAddress } = req.query;
  try {
    const address = await getProcurerContractAddress(employeeAddress);
    const result = await procurer.procurerStatistics(employeeAddress, address);
    const statistics = {
      totalSpent: result[0].toString(),
      productsBought: result[1].toString(),
      successfulOrdersMade: result[2].toString()
    }
    return res.status(200).send(statistics);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Statistics`));
  }
})

module.exports = router;
