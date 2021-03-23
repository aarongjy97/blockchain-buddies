const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider("http://localhost:8545");

module.exports = provider;