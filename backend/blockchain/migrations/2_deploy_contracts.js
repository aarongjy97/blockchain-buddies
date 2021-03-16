const market = artifacts.require("Market");
const procurer = artifacts.require("Procurer");
const ERC20 = artifacts.require("ERC20");
const supplier = artifacts.require("Supplier");
const courier = artifacts.require("Courier");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ERC20, { from: accounts[2] });
    await deployer.deploy(market, ERC20.address, { from: accounts[0] });
    await deployer.deploy(procurer, { from: accounts[1] });
    await deployer.deploy(supplier, { from: accounts[3] });
    await deployer.deploy(courier, { from: accounts[4] });
}