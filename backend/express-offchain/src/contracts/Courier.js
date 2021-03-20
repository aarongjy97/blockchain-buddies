const provider = require('./Provider');
const contract = require('@truffle/contract');
const courier = require('../../../blockchain/build/contracts/Courier.json');

const courierContractInterface = contract(courier);
courierContractInterface.setProvider(provider);

async function viewPurchaseOrder(orderId, employeeAddress, contractAddress) {
    const courierContract = await supplierContractInterface.at(contractAddress);    
    return await courierContract.viewPurchaseOrder(orderId, { from: employeeAddress });
}

async function courierViewAllPurchaseOrders(employeeAddress, contractAddress) {
    const courierContract = await supplierContractInterface.at(contractAddress);    
    return await courierContract.courierViewAllPurchaseOrders(orderId, { from: employeeAddress });
}

async function receivedByCourier(orderId, employeeAddress, contractAddress) {
    const courierContract = await supplierContractInterface.at(contractAddress);    
    return await courierContract.receivedByCourier(orderId, { from: employeeAddress });
}

module.exports = {
    viewPurchaseOrder: viewPurchaseOrder,
    courierViewAllPurchaseOrders: courierViewAllPurchaseOrders,
    receivedByCourier: receivedByCourier
}