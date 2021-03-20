const express = require("express");
const { query, transact } = require("../db.js");

const router = express.Router();

router.post("/procurer", async (req, res, next) => {
  const procurers = req.body;

  try {
    await transact(async (query) => {
      for (const procurer of procurers) {
        await query(
          `
            update procurer
            set ownerAddress=$1
            where id=$2
          `,
          [procurer.ownerAddress, procurer.id]
        );

        await query(
          `
            update procurer
            set address=$1
            where id=$2
          `,
          [procurer.address, procurer.id]
        );

        for (const employee of procurer.employees) {
          await query(
            `
              update procureremployee
              set address =$1
              where id=$2
            `,
            [employee.address, employee.id]
          );
        }
      }

      res.status(202).send("Procurer and Employees Addresses Updated");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Updating Address on Init");
  }
});

router.post("/supplier", async (req, res, next) => {
  const suppliers = req.body;

  try {
    await transact(async (query) => {
      for (const supplier of suppliers) {
        await query(
          `
            update supplier
            set address=$1
            where id=$2
          `,
          [supplier.address, supplier.id]
        );

        await query(
          `
            update supplier
            set ownerAddress=$1
            where id=$2
          `,
          [supplier.ownerAddress, supplier.id]
        );

        for (const employee of supplier.employees) {
          await query(
            `
              update supplieremployee
              set address =$1
              where id=$2
            `,
            [employee.address, employee.id]
          );
        }
      }

      res.status(202).send("Supplier and Employees Addresses Updated");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Updating Address on Init");
  }
});

router.post("/courier", async (req, res, next) => {
  const couriers = req.body;

  try {
    await transact(async (query) => {
      for (const courier of couriers) {
        await query(
          `
            update courier
            set address=$1
            where id=$2
          `,
          [courier.address, courier.id]
        );

        await query(
          `
            update courier
            set ownerAddress=$1
            where id=$2
          `,
          [courier.ownerAddress, courier.id]
        );

        for (const employee of courier.employees) {
          await query(
            `
              update courieremployee
              set address =$1
              where id=$2
            `,
            [employee.address, employee.id]
          );
        }
      }

      res.status(202).send("Addresses Updated");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Updating Address on Init");
  }
});

module.exports = router;
