var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');
const truffleAssert = require('truffle-assertions');

contract('Procurement Marketplace', function(accounts) {
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
    let dhlEmployee = accounts[20];
    
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
        let procurer = await googleProcurerInstance.registerAsProcurer({from: google});
        let supplier = await dellSupplierInstance.registerAsSupplier({from: dell});
        let courier = await dhlCourierInstance.registerAsCourier({from: dhl});

        // truffleAssert.eventEmitted(courier, 'Registered');
    });

    it('Mint Tokens to Procurer', async () => {
        await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});
    });

    it('Supplier List Products', async () => {
        let result = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
        // truffleAssert.eventEmitted(result, 'Listed', (ev) => {
        //     return ev.supplier === dell && ev.supplierEmployee === dellEmployee;
        // }, 'Product is not listed correctly');
    });

    it('Procurer Create Purchase Order', async () => {
        await googleProcurerInstance.createPurchaseOrder(1, 1, 10+50, {from: googleLogisticsEmployee});
        // let orderId = await googleProcurerInstance.createPurchaseOrder.call(1, 1, 10+50, {from: googleLogisticsEmployee}); // not working dk why
        // console.log(orderId.toNumber());

        // truffleAssert.eventEmitted(result, 'Market.OrderCreated');
    });

    it('Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});
    });

    it('Supplier Approve Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});  
    });

    it('Supplier Assign Courier', async () => {
        let result = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee}); 

        // truffleAssert.eventEmitted(result, 'OrderCourierAssigned');
    });

    it('Courier Receive Order from Supplier', async () => {
        let result = await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});
    });

    it('Procurer Receive Delivered Order from Courier', async () => {
        let result = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});
    });

    it('Procurer Add Rating for Order', async () => {
        let result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});
    });
});