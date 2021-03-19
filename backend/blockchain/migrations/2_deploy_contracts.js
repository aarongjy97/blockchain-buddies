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
      employees: [{ 1: accounts[3] }],
    },

    /* Supplier 2 */
    Foxconn: {
      address: accounts[4],
      id: 2,
      name: "Foxconn",
      employees: [{ 2: accounts[5] }],
    },

    /* Supplier 3 */
    TSMC: {
      address: accounts[6],
      id: 3,
      name: "TSMC",
      employees: [{ 3: accounts[7] }],
    },

    /* Procurer 1 */
    AMD: {
      address: accounts[8],
      id: 1,
      name: "AMD",
      employees: [{ 1: accounts[9] }, { 2: accounts[10] }],
    },

    /* Procurer 2 */
    Apple: {
      address: accounts[9],
      id: 2,
      name: "Apple",
      employees: [{ 3: accounts[10] }, { 4: accounts[11] }],
    },

    /* Procurer 3 */
    Google: {
      address: accounts[12],
      id: 3,
      name: "Google",
      employees: [{ 5: accounts[13] }, { 6: accounts[14] }],
    },

    /* Courier 1 */
    NinjaVan: {
      address: accounts[15],
      id: 1,
      name: "NinjaVan",
      employees: [{ 1: accounts[16] }],
    },

    /* Courier 2 */
    DHL: {
      address: accounts[17],
      id: 2,
      name: "DHL",
      employees: [{ 2: accounts[18] }],
    },
  };

  await deployer.deploy(ERC20, { from: stakeholders.ERC20 });
  await deployer.deploy(market, ERC20.address, {
    from: stakeholders.Market,
  });

  await deployer.deploy(procurer, market.address, ERC20.address, { from: stakeholders.AMD.address });
  await deployer.deploy(procurer, market.address, ERC20.address, { from: stakeholders.Apple.address });
  await deployer.deploy(procurer, market.address, ERC20.address, { from: stakeholders.Google.address });

  await deployer.deploy(supplier, market.address, ERC20.address, { from: stakeholders.Dell.address });
  await deployer.deploy(supplier, market.address, ERC20.address, { from: stakeholders.Foxconn.address });
  await deployer.deploy(supplier, market.address, ERC20.address, { from: stakeholders.TSMC.address });

  await deployer.deploy(courier, market.address, ERC20.address, { from: stakeholders.NinjaVan.address });
  await deployer.deploy(courier, market.address, ERC20.address, { from: stakeholders.DHL.address });
};

async function addSupplierEmployee(accounts) {
    
}
