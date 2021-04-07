const provider = require("./Provider");
const contract = require("@truffle/contract");
const supplier = require("../../../blockchain/build/contracts/Supplier.json");

const supplierContractInterface = contract(supplier);
supplierContractInterface.setProvider(provider);

async function viewSelfProduct(productid, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewSelfProduct.call(productid, {
    from: employeeAddress,
  });
}

async function viewAllSelfProducts(employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewAllSelfProducts.call({
    from: employeeAddress,
  });
}

async function listProduct(
  quantity,
  price,
  name,
  description,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.listProduct(quantity, price, name, description, {
    from: employeeAddress,
  });
}

async function unlistProduct(productId, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.unlistProduct(productId, {
    from: employeeAddress,
  });
}

async function relistProduct(productId, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.relistProduct(productId, {
    from: employeeAddress,
  });
}

async function updateProductPrice(
  productId,
  newPrice,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.updateProductPrice(productId, newPrice, {
    from: employeeAddress,
  });
}

async function updateProductQuantity(
  productId,
  newQuantity,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.updateProductQuantity(productId, newQuantity, {
    from: employeeAddress,
  });
}

async function supplierApprovePurchaseOrder(
  orderId,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.supplierApprovePurchaseOrder(orderId, {
    from: employeeAddress,
  });
}

async function supplierRejectPurchaseOrder(
  orderId,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.supplierRejectPurchaseOrder(orderId, {
    from: employeeAddress,
  });
}

async function assignCourier(
  courier,
  orderId,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.assignCourier(courier, orderId, {
    from: employeeAddress,
  });
}

async function supplierViewAllPurchaseOrders(employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.supplierViewAllPurchaseOrders.call({
    from: employeeAddress,
  });
}

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewPurchaseOrder.call(orderId, {
    from: employeeAddress,
  });
}

async function getTokenBalance(employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.getTokenBalance.call({
    from: employeeAddress,
  });
}

async function supplierStatistics(employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.supplierStatistics.call({
    from: employeeAddress,
  });
}

module.exports = {
  viewSelfProduct: viewSelfProduct,
  viewAllSelfProducts: viewAllSelfProducts,
  listProduct: listProduct,
  unlistProduct: unlistProduct,
  relistProduct: relistProduct,
  updateProductPrice: updateProductPrice,
  updateProductQuantity: updateProductQuantity,
  supplierApprovePurchaseOrder: supplierApprovePurchaseOrder,
  supplierRejectPurchaseOrder: supplierRejectPurchaseOrder,
  assignCourier: assignCourier,
  supplierViewAllPurchaseOrders: supplierViewAllPurchaseOrders,
  viewPurchaseOrder: viewPurchaseOrder,
  getTokenBalance: getTokenBalance,
  supplierStatistics: supplierStatistics
};
