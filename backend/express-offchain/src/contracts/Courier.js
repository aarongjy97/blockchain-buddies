const provider = require("./Provider");
const contract = require("@truffle/contract");
const courier = require("../../../blockchain/build/contracts/Courier.json");

const courierContractInterface = contract(courier);
courierContractInterface.setProvider(provider);

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
  const courierContract = await courierContractInterface.at(contractAddress);
  return await courierContract.viewPurchaseOrder.call(orderId, {
    from: employeeAddress,
  });
}

async function courierViewAllPurchaseOrders(employeeAddress, contractAddress) {
  const courierContract = await courierContractInterface.at(contractAddress);
  return await courierContract.courierViewAllPurchaseOrders.call({
    from: employeeAddress,
  });
}

async function receivedByCourier(orderId, employeeAddress, contractAddress) {
  const courierContract = await courierContractInterface.at(contractAddress);
  return await courierContract.receivedByCourier(orderId, {
    from: employeeAddress,
  });
}

async function getTokenBalance(employeeAddress, contractAddress) {
  const courierContract = await courierContractInterface.at(contractAddress);
  return await courierContract.getTokenBalance.call({
    from: employeeAddress,
  });
}

module.exports = {
  viewPurchaseOrder: viewPurchaseOrder,
  courierViewAllPurchaseOrders: courierViewAllPurchaseOrders,
  receivedByCourier: receivedByCourier,
  getTokenBalance: getTokenBalance
};
