const endpoint = require("./config") + "/api/market";
const axios = require("axios");

async function viewProduct(productId) {
  const data = {
    productId: productId,
  };
  return await axios.get(`${endpoint}/viewproduct`, { params: data });
}

async function viewAllProducts() {
  return await axios.get(`${endpoint}/viewallproducts`);
}

async function viewSupplierProducts(supplier) {
  return await axios.get(`${endpoint}/viewsupplierproducts`, {
    params: { supplier: supplier },
  });
}

async function getMarketAddress() {
  return await axios.get(`${endpoint}/getmarketaddress`);
}

module.exports = {
    viewProduct: viewProduct,
    viewAllProducts: viewAllProducts,
    viewSupplierProducts: viewSupplierProducts,
    getMarketAddress: getMarketAddress
}