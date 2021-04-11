var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');
const truffleAssert = require('truffle-assertions');

contract('Supplier Functions', function(accounts) {
    let marketERC20Instance;
    let marketInstance;

    let amdProcurerInstance;
    let appleProcurerInstance;
    let googleProcurerInstance;

    let dellSupplierInstance;
    let foxconnSupplierinstance;
    let tsmcSupplierinstance;

    let ninjavanCourierInstance;
    let dhlCourierInstance;
    
    let erc20 = accounts[0];
    let market = accounts[1];

    let dell = accounts[2];
    let dellEmployee = accounts[3];
    let google = accounts[14];
    let googleFinanceEmployee = accounts[15]; 
    let googleLogisticsEmployee = accounts[16];
    let dhl = accounts[19];
    let dhlEmployee = accounts[20]

    let zero_address = '0x0000000000000000000000000000000000000000';
    
    before(async () => {
        marketERC20Instance = await MarketERC20.new({from: erc20});
        marketInstance = await Market.new(marketERC20Instance.address, {from: market});

        googleProcurerInstance = await Procurer.new(marketInstance.address, marketERC20Instance.address, {from: google});
        dellSupplierInstance = await Supplier.new(marketInstance.address, marketERC20Instance.address, {from: dell});
        dhlCourierInstance = await Courier.new(marketInstance.address, marketERC20Instance.address, {from: dhl});
    });

    it('Procurer Add Employee', async () => {
        await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});
    });

    it('Supplier Add Employee', async () => {
        await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});
    });

    it('Courier Add Employee', async () => {
        await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});
    });

    it('Register Stakeholders on Market', async () => {
        await googleProcurerInstance.registerAsProcurer({from: google});
        await dellSupplierInstance.registerAsSupplier({from: dell});
        await dhlCourierInstance.registerAsCourier({from: dhl});
    });

    it('Supplier List Products', async () => {
        let result = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
        // truffleAssert.eventEmitted(result, 'Listed', (ev) => {
        //     return ev.supplier === dell && ev.supplierEmployee === dellEmployee;
        // }, 'Product is not listed correctly');
    });

    it('Supplier View Product', async () => {
        let product = await dellSupplierInstance.viewSelfProduct.call(1, {from: dellEmployee});
        assert.strictEqual(product.productName, 'Dell Laptop', 'Product name is not correct');
        assert.strictEqual(product.quantityAvailable, '100', 'Product quantity is not correct');
        assert.strictEqual(product.price, '10', 'Product price is not correct');
        assert.strictEqual(product.description, 'Good Laptop', 'Product description is not correct');
    });

    it('Supplier View All Products', async () => {
        let products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        assert.strictEqual(products[0].productName, 'Dell Laptop', 'Product name is not correct');
        assert.strictEqual(products[0].quantityAvailable, '100', 'Product quantity is not correct');
        assert.strictEqual(products[0].price, '10', 'Product price is not correct');
        assert.strictEqual(products[0].description, 'Good Laptop', 'Product description is not correct');
    });

    it('Supplier Unlist Product', async () => {
        let result = await dellSupplierInstance.unlistProduct(1, {from: dellEmployee});
        let products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        assert.strictEqual(products[0].listed, false, "Product is not unlisted correctly")
    });

    it('Supplier Relist Product', async () => {
        let result = await dellSupplierInstance.relistProduct(1, {from: dellEmployee});
        let products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        assert.strictEqual(products[0].listed, true, "Product is not relisted correctly")
    });

    it('Supplier Update Product (Price, Quantity and Description)', async () => {
        await dellSupplierInstance.updateProductPrice(1, 20, {from: dellEmployee});
        await dellSupplierInstance.updateProductQuantity(1, 150, {from: dellEmployee});
        await dellSupplierInstance.updateProductDescription(1, "Bad Laptop", {from: dellEmployee});
        let products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        assert.strictEqual(products[0].quantityAvailable, '150', 'Product updated quantity is not correct');
        assert.strictEqual(products[0].price, '20', 'Product updated price is not correct');
        assert.strictEqual(products[0].description, 'Bad Laptop', 'Product updated description is not correct');
    });

    it('Procurer Create Purchase Order', async () => {
        let result = await googleProcurerInstance.createPurchaseOrder(1, 1, 70, {from:googleLogisticsEmployee});
        let po = await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleLogisticsEmployee});
        assert.strictEqual(po[0].status, "1", "PO status is not Ordered");
    });

    it('Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from:googleFinanceEmployee});
        let po = await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleFinanceEmployee});
        assert.strictEqual(po[0].status, "2", "PO status is not InternalApproved");
        // may need to add in the increase allowance 
    });

    it('Supplier View Purchase Order', async () => {
        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.procurer, googleProcurerInstance.address, "PO procurer is incorrect");
        assert.strictEqual(po.procurerLogisticsEmployee, googleLogisticsEmployee, "PO procurerLogisticsEmployee is incorrect");
        assert.strictEqual(po.procurerFinanceEmployee, googleFinanceEmployee, "PO procurerFinanceEmployee is incorrect");
        assert.strictEqual(po.supplier, dellSupplierInstance.address, "PO supplier is incorrect");
        assert.strictEqual(po.supplierEmployee, zero_address, "PO supplierEmployee is incorrect");
        assert.strictEqual(po.courier, zero_address, "PO Courier is incorrect");
        assert.strictEqual(po.productId, "1", "PO productId is incorrect");
        assert.strictEqual(po.productName, "Dell Laptop", "PO productName is incorrect");
        assert.strictEqual(po.orderId, "1", "PO orderId is incorrect");
        assert.strictEqual(po.quantity, "1", "PO quantity is incorrect");
        assert.strictEqual(po.price, "70", "PO price is incorrect");
        // assert.strictEqual(po[0].dateCreated, zero_address, "PPO courierEmployee is incorrect");
        assert.strictEqual(po.status, "2", "PO status is incorrect");
        assert.strictEqual(po.rating, "0", "PO rating is incorrect");
    });

    it('Supplier View All Purchase Orders', async () => {
        let po = await dellSupplierInstance.supplierViewAllPurchaseOrders.call({from: dellEmployee});
        assert.strictEqual(po[0].procurer, googleProcurerInstance.address, "PO procurer is incorrect");
        assert.strictEqual(po[0].procurerLogisticsEmployee, googleLogisticsEmployee, "PO procurerLogisticsEmployee is incorrect");
        assert.strictEqual(po[0].procurerFinanceEmployee, googleFinanceEmployee, "PO procurerFinanceEmployee is incorrect");
        assert.strictEqual(po[0].supplier, dellSupplierInstance.address, "PO supplier is incorrect");
        assert.strictEqual(po[0].supplierEmployee, zero_address, "PO supplierEmployee is incorrect");
        assert.strictEqual(po[0].courier, zero_address, "PO Courier is incorrect");
        assert.strictEqual(po[0].productId, "1", "PO productId is incorrect");
        assert.strictEqual(po[0].productName, "Dell Laptop", "PO productName is incorrect");
        assert.strictEqual(po[0].orderId, "1", "PO orderId is incorrect");
        assert.strictEqual(po[0].quantity, "1", "PO quantity is incorrect");
        assert.strictEqual(po[0].price, "70", "PO price is incorrect");
        // assert.strictEqual(po[0].dateCreated, zero_address, "PPO courierEmployee is incorrect");
        assert.strictEqual(po[0].status, "2", "PO status is incorrect");
        assert.strictEqual(po[0].rating, "0", "PO rating is incorrect");
    });

    it('Supplier Approve Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from:dellEmployee});
        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.status, "3", "PO Status is not SupplierApproved")
    });

    it('Supplier Reject Purchase Order', async () => {
        // need to repeat above steps ?? :(
    });

    it('Supplier Assign Courier', async () => {
        let result = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee});
        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.courier, dhlCourierInstance.address, "Courier is incorrectly assigned")
    });
});
