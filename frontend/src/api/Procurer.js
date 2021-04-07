const endpoint = require("./config") + "/api/procurer";
const axios = require("axios");

async function createPurchaseOrder(
  productId,
  quantity,
  price,
  employeeAddress
) {
  return await axios.post(`${endpoint}/createpurchaseorder`, {
    productId,
    quantity,
    price,
    employeeAddress,
  });
}

async function approvePurchaseOrder(orderId, employeeAddress) {
  return await axios.put(`${endpoint}/approvepurchaseorder`, {
    employeeAddress,
    orderId,
  });
}

async function rejectPurchaseOrder(orderId, employeeAddress) {
  return await axios.put(`${endpoint}/rejectpurchaseorder`, {
    employeeAddress,
    orderId,
  });
}

async function viewPurchaseOrder(orderId, employeeAddress) {
  return await axios.post(`${endpoint}/viewpurchaseorder`, {
    employeeAddress,
    orderId,
  });
}

async function viewAllPurchaseOrders(employeeAddress) {
  return await axios.post(`${endpoint}/viewallpurchaseorders`, {
    employeeAddress,
  });
}

async function deliveredByCourier(orderId, employeeAddress) {
  return await axios.put(`${endpoint}/deliveredbycourier`, {
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

async function getMarketAllowance(employeeAddress) {
  return await axios.get(`${endpoint}/getmarketallowance`, {
    params: { employeeAddress: employeeAddress },
  });
}

async function addRating(employeeAddress, orderId, rating) {
  return await axios.put(`${endpoint}/addrating`, {
    employeeAddress,
    orderId,
    rating
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
  addRating: addRating
};
