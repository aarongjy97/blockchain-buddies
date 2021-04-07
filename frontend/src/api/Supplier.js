const endpoint = require("./config") + "/api/supplier";
const axios = require("axios");

async function viewSelfProduct(productId, employeeAddress) {
  return await axios.post(`${endpoint}/viewselfproduct`, {
    employeeAddress,
    productId,
  });
}

async function viewAllSelfProducts(employeeAddress) {
  return await axios.post(`${endpoint}/viewallselfproducts`, {
    employeeAddress,
  });
}

async function listProduct(name, price, quantity, employeeAddress) {
  return await axios.post(`${endpoint}/listproduct`, {
    quantity,
    price,
    name,
    employeeAddress,
  });
}

async function unlistProduct(productId, employeeAddress) {
  return await axios.put(`${endpoint}/unlistproduct`, {
    productId,
    employeeAddress,
  });
}

async function relistProduct(productId, employeeAddress) {
  return await axios.put(`${endpoint}/relistproduct`, {
    productId,
    employeeAddress,
  });
}

async function updateProductPrice(productId, newPrice, employeeAddress) {
  return await axios.put(`${endpoint}/updateproductprice`, {
    productId,
    newPrice,
    employeeAddress,
  });
}

async function updateProductQuantity(productId, newQuantity, employeeAddress) {
  return await axios.put(`${endpoint}/updateproductquantity`, {
    productId,
    newQuantity,
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

async function assignCourier(orderId, courier, employeeAddress) {
  return await axios.put(`${endpoint}/assigncourier`, {
    employeeAddress,
    orderId,
    courier,
  });
}

async function viewAllPurchaseOrders(employeeAddress) {
  return await axios.post(`${endpoint}/viewallpurchaseorders`, {
    employeeAddress,
  });
}

async function viewPurchaseOrder(orderid, employeeAddress) {
  return await axios.post(`${endpoint}/viewpurchaseorder`, {
    orderid,
    employeeAddress,
  });
}

async function getCouriers() {
  return await axios.get(`${endpoint}/getcouriers`);
}

async function getTokenBalance(employeeAddress) {
  return await axios.get(`${endpoint}/gettokenbalance`, {
    params: {
      employeeAddress: employeeAddress,
    },
  });
}

async function supplierStatistics(employeeAddress) {
  return await axios.get(`${endpoint}/statistics`, {
    params: {
      employeeAddress: employeeAddress
    }
  })
}

module.exports = {
  viewSelfProduct: viewSelfProduct,
  viewAllSelfProducts: viewAllSelfProducts,
  listProduct: listProduct,
  unlistProduct: unlistProduct,
  relistProduct: relistProduct,
  updateProductPrice: updateProductPrice,
  updateProductQuantity: updateProductQuantity,
  approvePurchaseOrder: approvePurchaseOrder,
  rejectPurchaseOrder: rejectPurchaseOrder,
  assignCourier: assignCourier,
  viewAllPurchaseOrders: viewAllPurchaseOrders,
  viewPurchaseOrder: viewPurchaseOrder,
  getCouriers: getCouriers,
  getTokenBalance: getTokenBalance,
  supplierStatistics: supplierStatistics
};
