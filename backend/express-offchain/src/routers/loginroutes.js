const express = require("express");
const { query, transact } = require("../db.js");

const router = express.Router();

/* Procurer Employee Login */
router.get("/procureremployee", async (req, res, next) => {
  try {

    const { email, password } = req.body;
    
    await transact(async (query) => {

      const employee = (
        await query(
          `
            select * 
            from procureremployee 
            where email=$1
          `,
          [email]
        )
      ).rows[0];
      
      if (employee.password !== password) {
        return res.status(500).send("Invalid Password");
      }

      return res.status(200).send(employee);

    });
  } catch (error) {
    return res.status(500).send("Login Failed");
  }
});

/* Supplier Employee Login */
router.get("/supplieremployee", async (req, res, next) => {
  try {

    const { email, password } = req.body;
    
    await transact(async (query) => {

      const employee = (
        await query(
          `
            select * 
            from supplieremployee 
            where email=$1
          `,
          [email]
        )
      ).rows[0];
      
      if (employee.password !== password) {
        return res.status(500).send("Invalid Password");
      }

      return res.status(200).send(employee);

    });
  } catch (error) {
    return res.status(500).send("Login Failed");
  }
});

/* Courier Employee Login */
router.get("/courieremployee", async (req, res, next) => {
  try {

    const { email, password } = req.body;
    
    await transact(async (query) => {

      const employee = (
        await query(
          `
            select * 
            from courieremployee 
            where email=$1
          `,
          [email]
        )
      ).rows[0];
      
      if (employee.password !== password) {
        return res.status(500).send("Invalid Password");
      }

      return res.status(200).send(employee);

    });
  } catch (error) {
    return res.status(500).send("Login Failed");
  }
});

module.exports = router;
