const endpoint = require("./config") + "/api/courier";
const axios = require("axios");

async function viewPurchaseOrder(orderId, employeeAddress) {
  return await axios.post(`${endpoint}/viewpurchaseorder`, {
    orderId,
    employeeAddress,
  });
}

async function viewAllPurchaseOrders(employeeAddress) {
  return await axios.post(`${endpoint}/viewallpurchaseorders`, {
    employeeAddress,
  });
}

async function receivedByCourier(orderId, employeeAddress) {
  return await axios.put(`${endpoint}/receivedbycourier`, {
    orderId,
    employeeAddress,
  });
}

async function getTokenBalance(employeeAddress) {
  return await axios.get(`${endpoint}/gettokenbalance`, {
    params: {
      employeeAddress: employeeAddress,
    },
  });
}

module.exports = {
  viewAllPurchaseOrders: viewAllPurchaseOrders,
  viewPurchaseOrder: viewPurchaseOrder,
  receivedByCourier: receivedByCourier,
  getTokenBalance: getTokenBalance
}
