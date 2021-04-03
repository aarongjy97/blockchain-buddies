const express = require("express");
const { query, transact } = require("../db.js");
const courier = require("../contracts/Courier");
const structParser = require("../helpers/StructParser");
const errorParser = require("../helpers/ErrorParser");

const router = express.Router();

async function getCourierContractAddress(employeeAddress) {
  return await transact(async (query) => {
    const address = (
      await query(
        `
          select C.address 
          from courier C join courieremployee E on (E.company = C.id) 
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

router.post("/viewpurchaseorder", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getCourierContractAddress(employeeAddress);
    const result = await courier.viewPurchaseOrder(
      orderId,
      employeeAddress,
      address
    );
    const po = await structParser.parsePurchaseOrder(result);
    return res.status(200).send(po);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, `Failed to Retrieve Order ID ${orderId}`));
  }
});

router.post("/viewallpurchaseorders", async (req, res, next) => {
  const { employeeAddress } = req.body;
  try {
    const address = await getCourierContractAddress(employeeAddress);
    const result = await courier.courierViewAllPurchaseOrders(
      employeeAddress,
      address
    );
    const purchaseOrders = await Promise.all(result.map((po) =>
      structParser.parsePurchaseOrder(po)
    ));
    return res.status(200).send(purchaseOrders);
  } catch (error) {
    return res
      .status(500)
      .send(errorParser(error, "Failed to Retrieve Purchase Orders"));
  }
});

router.put("/receivedbycourier", async (req, res, next) => {
  const { orderId, employeeAddress } = req.body;
  try {
    const address = await getCourierContractAddress(employeeAddress);
    const result = await courier.receivedByCourier(
      orderId,
      employeeAddress,
      address
    );
    return res.status(202).send(`Order ID ${orderId} Acknowledged as Received`);
  } catch (error) {
    return res
      .status(500)
      .send(
        errorParser(
          error,
          `Failed to Acknowledge Order ID ${orderId} as Received`
        )
      );
  }
});

module.exports = router;
