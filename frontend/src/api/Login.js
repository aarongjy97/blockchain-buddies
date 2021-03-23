const endpoint = require("./config") + "/api/login";
const axios = require("axios");

async function procurerLogin(email, password) {
  const data = {
    email: email,
    password: password,
  };
  return await axios.get(`${endpoint}/procureremployee`, { params: data });
}

async function supplierLogin(email, password) {
  const data = {
    email: email,
    password: password,
  };
  return await axios.get(`${endpoint}/supplieremployee`, { params: data });
}

async function courierLogin(email, password) {
  const data = {
    email: email,
    password: password,
  };
  return await axios.get(`${endpoint}/courieremployee`, { params: data });
}

module.exports = {
  procurerLogin: procurerLogin,
  supplierLogin: supplierLogin,
  courierLogin: courierLogin,
};
