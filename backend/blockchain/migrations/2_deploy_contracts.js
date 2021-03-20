const axios = require("axios");

const market = artifacts.require("Market");
const procurer = artifacts.require("Procurer");
const ERC20 = artifacts.require("ERC20");
const supplier = artifacts.require("Supplier");
const courier = artifacts.require("Courier");

module.exports = async function (deployer, network, accounts) {
  const stakeholders = {
    ERC20: accounts[0],
    Market: accounts[1],

    /* Supplier 1 */
    Dell: {
      ownerAddress: accounts[2],
      address: "",
      id: 1,
      name: "Dell",
      employees: [{ id: 1, address: accounts[3], name: "John Snow" }],
    },

    /* Supplier 2 */
    Foxconn: {
      ownerAddress: accounts[4],
      address: "",
      id: 2,
      name: "Foxconn",
      employees: [{ id: 2, address: accounts[5], name: "Carl John" }],
    },

    /* Supplier 3 */
    TSMC: {
      ownerAddress: accounts[6],
      address: "",
      id: 3,
      name: "TSMC",
      employees: [{ id: 3, address: accounts[7], name: "Carl Snow" }],
    },

    /* Procurer 1 */
    AMD: {
      ownerAddress: accounts[8],
      address: "",
      id: 1,
      name: "AMD",
      employees: [
        { id: 1, address: accounts[9], name: "Charlotte Wang" },
        { id: 2, address: accounts[10], name: "Jia Xuan Toh" },
      ],
    },

    /* Procurer 2 */
    Apple: {
      ownerAddress: accounts[11],
      address: "",
      id: 2,
      name: "Apple",
      employees: [
        { id: 3, address: accounts[12], name: "Vicki Yew" },
        { id: 4, address: accounts[13], name: "Jian Bin Huang" },
      ],
    },

    /* Procurer 3 */
    Google: {
      ownerAddress: accounts[14],
      address: "",
      id: 3,
      name: "Google",
      employees: [
        { id: 5, address: accounts[15], name: "Aaron Goh" },
        { id: 6, address: accounts[16], name: "Arnold Ng" },
      ],
    },

    /* Courier 1 */
    NinjaVan: {
      ownerAddress: accounts[17],
      address: "",
      id: 1,
      name: "NinjaVan",
      employees: [{ id: 1, address: accounts[18], name: "James Lim" }],
    },

    /* Courier 2 */
    DHL: {
      ownerAddress: accounts[19],
      address: "",
      id: 2,
      name: "DHL",
      employees: [{ id: 2, address: accounts[20], name: "Scott Koh" }],
    },
  };

  await deployer.deploy(ERC20, { from: stakeholders.ERC20 });

  await deployer.deploy(market, ERC20.address, {
    from: stakeholders.Market,
  });

  const amd = await deployer.deploy(procurer, market.address, ERC20.address, {
    from: stakeholders.AMD.ownerAddress,
  });

  stakeholders.AMD.address = amd.address;

  const apple = await deployer.deploy(procurer, market.address, ERC20.address, {
    from: stakeholders.Apple.ownerAddress,
  });

  stakeholders.Apple.address = apple.address;

  const google = await deployer.deploy(
    procurer,
    market.address,
    ERC20.address,
    {
      from: stakeholders.Google.ownerAddress,
    }
  );

  stakeholders.Google.address = google.address;

  const dell = await deployer.deploy(supplier, market.address, ERC20.address, {
    from: stakeholders.Dell.ownerAddress,
  });

  stakeholders.Dell.address = dell.address;

  const foxconn = await deployer.deploy(
    supplier,
    market.address,
    ERC20.address,
    {
      from: stakeholders.Foxconn.ownerAddress,
    }
  );

  stakeholders.Foxconn.address = foxconn.address;

  const tsmc = await deployer.deploy(supplier, market.address, ERC20.address, {
    from: stakeholders.TSMC.ownerAddress,
  });

  stakeholders.TSMC.address = tsmc.address;

  const ninjavan = await deployer.deploy(
    courier,
    market.address,
    ERC20.address,
    {
      from: stakeholders.NinjaVan.ownerAddress,
    }
  );

  stakeholders.NinjaVan.address = ninjavan.address;

  const dhl = await deployer.deploy(courier, market.address, ERC20.address, {
    from: stakeholders.DHL.ownerAddress,
  });

  stakeholders.DHL.address = dhl.address;

  await procurerAddEmployees(amd, stakeholders.AMD);
  await procurerAddEmployees(apple, stakeholders.Apple);
  await procurerAddEmployees(google, stakeholders.Google);

  await supplierCourierAddEmployees(dell, stakeholders.Dell);
  await supplierCourierAddEmployees(foxconn, stakeholders.Foxconn);
  await supplierCourierAddEmployees(tsmc, stakeholders.TSMC);

  await supplierCourierAddEmployees(ninjavan, stakeholders.NinjaVan);
  await supplierCourierAddEmployees(dhl, stakeholders.DHL);

  await addStakeholdersToMarket(
    stakeholders,
    [amd, apple, google],
    [dell, foxconn, tsmc],
    [ninjavan, dhl]
  );

  // await syncWithDatabase(stakeholders);
};

async function syncWithDatabase(stakeholders) {
  /* Adding correct addresses into database */

  const procurers = [stakeholders.AMD, stakeholders.Apple, stakeholders.Google];
  const suppliers = [
    stakeholders.Dell,
    stakeholders.Foxconn,
    stakeholders.TSMC,
  ];
  const couriers = [stakeholders.NinjaVan, stakeholders.DHL];

  await axios.post("http://localhost:5000/api/init/procurer", procurers);
  await axios.post("http://localhost:5000/api/init/supplier", suppliers);
  await axios.post("http://localhost:5000/api/init/courier", couriers);

  console.log(
    "\x1b[32m",
    "********** Ether Addresses Seeded into DB **********"
  );
}

async function procurerAddEmployees(contract, procurer) {
  let i = 1;

  for (const employee of procurer.employees) {
    await contract.addEmployee(employee.address, i, employee.name, {
      from: procurer.ownerAddress,
    });
    console.log(
      "\x1b[36m",
      `********** ${employee.name}, Type ${i} **********`
    );
    i++;
  }

  console.log(
    "\x1b[32m",
    `********** ${procurer.name} ${procurer.employees.length} employees seeded **********\n`
  );
}

async function supplierCourierAddEmployees(contract, company) {
  for (const employee of company.employees) {
    await contract.addEmployee(employee.address, employee.name, {
      from: company.ownerAddress,
    });
    console.log("\x1b[36m", `********** ${employee.name} seeded **********`);
  }

  console.log(
    "\x1b[32m",
    `********** ${company.name} employees seeded **********\n`
  );
}

async function addStakeholdersToMarket(
  stakeholders,
  procurerContracts,
  supplierContracts,
  courierContracts
) {

  const procurers = [stakeholders.AMD, stakeholders.Apple, stakeholders.Google];
  const suppliers = [
    stakeholders.Dell,
    stakeholders.Foxconn,
    stakeholders.TSMC,
  ];
  const couriers = [stakeholders.NinjaVan, stakeholders.DHL];

  for (let i = 0; i < procurers.length; i++) {
    await procurerContracts[i].registerAsProcurer({ from: procurers[i].ownerAddress });
  }

  for (let i = 0; i < suppliers.length; i++) {
    await supplierContracts[i].registerAsSupplier({ from: suppliers[i].ownerAddress });
  }

  for (let i = 0; i < couriers.length; i++) {
    await courierContracts[i].registerAsCourier({ from: couriers[i].ownerAddress });
  }

}
