const provider = require("./Provider");
const contract = require("@truffle/contract");
const procurer = require("../../../blockchain/build/contracts/Procurer.json");

const procurerContractInterface = contract(procurer);
procurerContractInterface.setProvider(provider);

async function createPurchaseOrder(
  productId,
  quantity,
  employeeAddress,
  contractAddress
) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.createPurchaseOrder(
    productId,
    quantity,
    { from: employeeAddress }
  );
}

async function approvePurchaseOrder(orderId, employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.approvePurchaseOrder(orderId, {
    from: employeeAddress,
  });
}

async function rejectPurchaseOrder(orderId, employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.rejectPurchaseOrder(orderId, {
    from: employeeAddress,
  });
}

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.viewPurchaseOrder.call(orderId, {
    from: employeeAddress,
  });
}

async function viewAllPurchaseOrders(employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.viewAllPurchaseOrders.call({
    from: employeeAddress,
  });
}

async function deliveredByCourier(orderId, employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.deliveredByCourier(orderId, {
    from: employeeAddress,
  });
}

async function getTokenBalance(employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.getTokenBalance.call({
    from: employeeAddress,
  });
}

async function getMarketAllowance(employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.getMarketAllowance.call({
    from: employeeAddress,
  });
}

async function addRating(employeeAddress, contractAddress, rating, orderId) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.addRating(rating, orderId, {
    from: employeeAddress,
  });
}

async function procurerStatistics(employeeAddress, contractAddress) {
  const procurerContract = await procurerContractInterface.at(contractAddress);
  return await procurerContract.procurerStatistics.call({
    from: employeeAddress
  })
}

module.exports = {
  createPurchaseOrder: createPurchaseOrder,
  approvePurchaseOrder: approvePurchaseOrder,
  rejectPurchaseOrder: rejectPurchaseOrder,
  viewPurchaseOrder: viewPurchaseOrder,
  viewAllPurchaseOrders: viewAllPurchaseOrders,
  deliveredByCourier: deliveredByCourier,
  getTokenBalance: getTokenBalance,
  getMarketAllowance: getMarketAllowance,
  addRating: addRating,
  procurerStatistics: procurerStatistics
};
