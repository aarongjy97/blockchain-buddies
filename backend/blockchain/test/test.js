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
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});

        let finance = await googleProcurerInstance.viewEmployee.call(googleFinanceEmployee, {from: google});
        let logistics = await googleProcurerInstance.viewEmployee.call(googleLogisticsEmployee, {from: google});
        assert.strictEqual(finance.name, 'googleFinanceEmployee', 'Finance employee name is incorrect');
        assert.strictEqual(finance.employeeType, '2', 'Finance employee type is incorrect');
        assert.strictEqual(logistics.name, 'googleLogisticsEmployee', 'Logistics employee name is incorrect');
        assert.strictEqual(logistics.employeeType, '3', 'Logistics employee type is incorrect');
    });

    it('Supplier Add Employee', async () => {
        await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});

        let employee = await dellSupplierInstance.viewEmployee.call(dellEmployee, {from: dell});
        assert.strictEqual(employee.name, 'dellEmployee', 'Employee name is incorrect');
        assert.strictEqual(employee.employeeType, '1', 'Employee type is incorrect');
    });

    it('Courier Add Employee', async () => {
        await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});

        let employee = await dhlCourierInstance.viewEmployee.call(dhlEmployee, {from: dhl});
        assert.strictEqual(employee.name, 'dhlEmployee', 'Employee name is incorrect');
        assert.strictEqual(employee.employeeType, '1', 'Employee type is incorrect');
    });

    it('Register Stakeholders on Market', async () => {
        let procurer = await googleProcurerInstance.registerAsProcurer({from: google});
        let supplier = await dellSupplierInstance.registerAsSupplier({from: dell});
        let courier = await dhlCourierInstance.registerAsCourier({from: dhl});

        // truffleAssert.eventEmitted(procurer, 'Registered', (ev) => {
        //     return ev.registerType === 'Procurer' && ev.registerer === google;
        // }, 'Procurer is registered incorrectly.');

        // truffleAssert.eventEmitted(supplier, 'Registered', (ev) => {
        //     return ev.registerType === 'Supplier' && ev.registerer === dell;
        // }, 'Supplier is registered incorrectly.');

        // truffleAssert.eventEmitted(courier, 'Registered', (ev) => {
        //     return ev.registerType === 'Courier' && ev.registerer === dhl;
        // }, 'Courier is registered incorrectly.');
    });

    it('Mint Tokens to Procurer', async () => {
        await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});

        let tokens = await googleProcurerInstance.getTokenBalance.call({from: googleFinanceEmployee});
        assert.strictEqual(tokens.toNumber(), 10000, 'Tokens are minted incorectly to procurer');
    });

    it('Supplier List Products', async () => {
        let result = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});

        // truffleAssert.eventEmitted(result, 'Listed', (ev) => {
        //     return ev.supplier === dellSupplierInstance.address && ev.supplierEmployee === dellEmployee && ev._productId === 1 && ev.quantity === 100 && ev.price === 10;
        // }, 'Product is not listed correctly');
    });

    it('Procurer Create Purchase Order', async () => {
        let result = await googleProcurerInstance.createPurchaseOrder(1, 1, {from: googleLogisticsEmployee});

        // truffleAssert.eventEmitted(result, 'OrderCreated', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address && ev.logisticsEmployee === googleLogisticsEmployee && ev._productId === 1 && ev._quantity === 1 && ev.price === 10+50;
        // }, 'Purchase order is not created correctly');
    });

    it('Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});

        // truffleAssert.eventEmitted(result, 'OrderInternalApproved', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address && ev.financeEmployee === googleFinanceEmployee;
        // }, 'Purchase order is not approved by procurer correctly');
    });

    it('Supplier Approve Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});
        
        // truffleAssert.eventEmitted(result, 'OrderSupplierApproved', (ev) => {
        //     return ev._orderId === 1 && ev.supplier === dell && ev.supplierEmployee === dellEmployee;
        // }, 'Purchase order is not approved by supplier correctly');
    });

    it('Supplier Assign Courier', async () => {
        let result = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee}); 

        // truffleAssert.eventEmitted(result, 'OrderCourierAssigned', (ev) => {
        //     return ev._orderId === 1 && ev.supplier === dellSupplierInstance.address && ev.supplierEmployee === dellEmployee && ev.courier === dhlCourierInstance.address;
        // }, 'Purchase order is not assigned to courier by supplier correctly');
    });

    it('Courier Receive Order from Supplier', async () => {
        let result = await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});

        // truffleAssert.eventEmitted(result, 'OrderCourierDelivering', (ev) => {
        //     return ev._orderId === 1 && ev.supplier === dellSupplierInstance.address && ev.courier === dhlCourierInstance.address && ev.courierEmployee === dhlEmployee;
        // }, 'Purchase order is not received by courier correctly');
    });

    it('Procurer Receive Delivered Order from Courier', async () => {
        let result = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});

        // truffleAssert.eventEmitted(result, 'OrderDelivered', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address;
        // }, 'Purchase order is not received by procurer correctly');
    });

    it('Procurer Add Rating for Order', async () => {
        let result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});

        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.rating, '5', 'Rating is not added correctly');
    });
});