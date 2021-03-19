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
      address: accounts[2],
      id: 1,
      name: "Dell",
      employees: [{ id: 1, address: accounts[3] }],
    },

    /* Supplier 2 */
    Foxconn: {
      address: accounts[4],
      id: 2,
      name: "Foxconn",
      employees: [{ id: 2, address: accounts[5] }],
    },

    /* Supplier 3 */
    TSMC: {
      address: accounts[6],
      id: 3,
      name: "TSMC",
      employees: [{ id: 3, address: accounts[7] }],
    },

    /* Procurer 1 */
    AMD: {
      address: accounts[8],
      id: 1,
      name: "AMD",
      employees: [
        { id: 1, address: accounts[9] },
        { id: 2, address: accounts[10] },
      ],
    },

    /* Procurer 2 */
    Apple: {
      address: accounts[9],
      id: 2,
      name: "Apple",
      employees: [
        { id: 3, address: accounts[10] },
        { id: 4, address: accounts[11] },
      ],
    },

    /* Procurer 3 */
    Google: {
      address: accounts[12],
      id: 3,
      name: "Google",
      employees: [
        { id: 5, address: accounts[13] },
        { id: 6, address: accounts[14] },
      ],
    },

    /* Courier 1 */
    NinjaVan: {
      address: accounts[15],
      id: 1,
      name: "NinjaVan",
      employees: [{ id: 1, address: accounts[16] }],
    },

    /* Courier 2 */
    DHL: {
      address: accounts[17],
      id: 2,
      name: "DHL",
      employees: [{ id: 2, address: accounts[18] }],
    },
  };

  await deployer.deploy(ERC20, { from: stakeholders.ERC20 });
  await deployer.deploy(market, ERC20.address, {
    from: stakeholders.Market,
  });

  await deployer.deploy(procurer, market.address, ERC20.address, {
    from: stakeholders.AMD.address,
  });
  await deployer.deploy(procurer, market.address, ERC20.address, {
    from: stakeholders.Apple.address,
  });
  await deployer.deploy(procurer, market.address, ERC20.address, {
    from: stakeholders.Google.address,
  });

  await deployer.deploy(supplier, market.address, ERC20.address, {
    from: stakeholders.Dell.address,
  });
  await deployer.deploy(supplier, market.address, ERC20.address, {
    from: stakeholders.Foxconn.address,
  });
  await deployer.deploy(supplier, market.address, ERC20.address, {
    from: stakeholders.TSMC.address,
  });

  await deployer.deploy(courier, market.address, ERC20.address, {
    from: stakeholders.NinjaVan.address,
  });
  await deployer.deploy(courier, market.address, ERC20.address, {
    from: stakeholders.DHL.address,
  });

  await syncWithDatabase(stakeholders);
};

async function syncWithDatabase(stakeholders) {
  const procurers = [stakeholders.AMD, stakeholders.Apple, stakeholders.Google];
  const suppliers = [
    stakeholders.Dell,
    stakeholders.Foxconn,
    stakeholders.TSMC,
  ];
  const couriers = [stakeholders.NinjaVan, stakeholders.DHL];

  await axios.post('http://localhost:5000/api/init/procurer', procurers);
  await axios.post('http://localhost:5000/api/init/supplier', suppliers);
  await axios.post('http://localhost:5000/api/init/courier', couriers);

}
