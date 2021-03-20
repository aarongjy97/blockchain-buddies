const provider = require('./Provider');
const contract = require('@truffle/contract');
const procurer = require('../../../blockchain/build/contracts/Procurer.json');

const procurerContractInterface = contract(procurer);
procurerContractInterface.setProvider(provider);

async function createPurchaseOrder(productId, quantity, price, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.createPurchaseOrder(productId, quantity, price, { from: employeeAddress });
}

async function approvePurchaseOrder(orderId, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.approvePurchaseOrder(orderId, { from: employeeAddress });
}

async function rejectPurchaseOrder(orderId, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.rejectPurchaseOrder(orderId, { from: employeeAddress });
}

async function supplierRejectPurchaseOrder(price, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.supplierRejectPurchaseOrder(price, { from: employeeAddress });
}

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.viewPurchaseOrder(orderId, { from: employeeAddress });
}

async function viewAllPurchaseOrders(employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.viewAllPurchaseOrders({ from: employeeAddress });
}

async function deliveredByCourier(orderId, employeeAddress, contractAddress) {
    const procurerContract = await procurerContractInterface.at(contractAddress);
    return await procurerContract.deliveredByCourier(orderId, { from: employeeAddress});
}


module.exports = {
    createPurchaseOrder: createPurchaseOrder,
    approvePurchaseOrder: approvePurchaseOrder,
    rejectPurchaseOrder: rejectPurchaseOrder,
    supplierRejectPurchaseOrder: supplierRejectPurchaseOrder,
    viewPurchaseOrder: viewPurchaseOrder,
    viewAllPurchaseOrders: viewAllPurchaseOrders,
    deliveredByCourier: deliveredByCourier
}