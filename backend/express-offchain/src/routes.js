const express = require("express");
const { query, transact } = require("./db.js");
const procurer = require("./contracts/Procurer");

const router = express.Router();

router.get("/api/get/hello", async (req, res, next) => {
  try {

    let acc = "0xB8C25A8f845AB3dEEB13b63B3F22099f008288c0";

    await procurer.createPurchaseOrder(1, 1, 1, acc);

    return res.status(200).send("Hello World");
  } catch (error) {
      console.log(error);
  }
});

module.exports = router;
