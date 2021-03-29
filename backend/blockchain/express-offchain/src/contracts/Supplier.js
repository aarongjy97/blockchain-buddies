const provider = require("./Provider");
const contract = require("@truffle/contract");
const supplier = require("../../../blockchain/build/contracts/Supplier.json");

const supplierContractInterface = contract(supplier);
supplierContractInterface.setProvider(provider);

async function viewSelfProduct(productid, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewSelfProduct(productid, {
    from: employeeAddress,
  });
}

async function viewAllSelfProducts(employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewAllSelfProducts({ from: employeeAddress });
}

async function listProduct(
  quantity,
  price,
  name,
  employeeAddress,
  contractAddress
) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.listProduct(quantity, price, name, {
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
  return await supplierContract.supplierViewAllPurchaseOrders({
    from: employeeAddress,
  });
}

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
  const supplierContract = await supplierContractInterface.at(contractAddress);
  return await supplierContract.viewPurchaseOrder(orderId, {
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
};
