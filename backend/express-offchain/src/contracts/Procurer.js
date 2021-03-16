const provider = require('./Provider');
const contract = require('@truffle/contract');
const procurer = require('../../../blockchain/build/contracts/Procurer.json');

const procurerContract = contract(procurer);
procurerContract.setProvider(provider);

async function createPurchaseOrder(id, quantity, price, address) {
    const instance = await procurerContract.deployed();
    await instance.createPurchaseOrder(id, quantity, price, { from: address });
}

module.exports = {
    createPurchaseOrder: createPurchaseOrder
}