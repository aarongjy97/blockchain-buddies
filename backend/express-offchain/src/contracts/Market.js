const provider = require("./Provider");
const contract = require("@truffle/contract");
const market = require("../../../blockchain/build/contracts/Market.json");

const marketContractInterface = contract(market);
marketContractInterface.setProvider(provider);

async function viewProduct(productId, contractAddress) {
  const marketContract = await marketContractInterface.at(contractAddress);
  return await marketContract.viewProduct(productId);
}

async function viewAllProducts(contractAddress) {
  const marketContract = await marketContractInterface.at(contractAddress);
  return await marketContract.viewAllProducts();
}

async function viewSupplierProducts(supplier, contractAddress) {
  const marketContract = await marketContractInterface.at(contractAddress);
  return await marketContract.viewSupplierProducts(supplier);
}

module.exports = {
  viewProduct: viewProduct,
  viewAllProducts: viewAllProducts,
  viewSupplierProducts: viewSupplierProducts,
};
