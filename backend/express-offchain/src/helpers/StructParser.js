function parseProduct(product) {
    const p = {
        supplier: product[0],
        productId: product[1],
        quantityAvailable: product[2],
        price: product[3],
        numSold: product[4],
        productName: product[5],
        listed: product[6]
    }

    return p;
}

function parsePurchaseOrder(purchaseOrder) {

}

module.exports = {
    parseProduct: parseProduct
}