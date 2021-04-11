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
    
    before(async () => {
        marketERC20Instance = await MarketERC20.new({from: erc20});
        marketInstance = await Market.new(marketERC20Instance.address, {from: market});

        googleProcurerInstance = await Procurer.new(marketInstance.address, marketERC20Instance.address, {from: google});
        dellSupplierInstance = await Supplier.new(marketInstance.address, marketERC20Instance.address, {from: dell});
        dhlCourierInstance = await Courier.new(marketInstance.address, marketERC20Instance.address, {from: dhl});
    });

    it('Procurer Add Employee', async () => {
        await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleFinanceEmployee', {from: google});
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

    });

    it('Supplier Relist Product', async () => {

    });

    it('Supplier Update Product', async () => {

    });

    it('Procurer Create Purchase Order', async () => {

    });

    it('Procurer Approve Purchase Order', async () => {

    });

    it('Supplier View Purchase Order', async () => {

    });

    it('Supplier View All Purchase Orders', async () => {

    });

    it('Supplier Approve Purchase Order', async () => {

    });

    it('Supplier Reject Purchase Order', async () => {

    });

    it('Supplier Assign Courier', async () => {

    });
});

