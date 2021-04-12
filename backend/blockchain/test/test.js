var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');

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
        await googleProcurerInstance.registerAsProcurer({from: google});
        await dellSupplierInstance.registerAsSupplier({from: dell});
        await dhlCourierInstance.registerAsCourier({from: dhl});

        let procurer = await googleProcurerInstance.procurerStatistics.call({from: googleLogisticsEmployee});
        assert.strictEqual(procurer[0].toNumber(), 0, 'Procurer is registered incorrectly');

        let supplier = await dellSupplierInstance.supplierStatistics.call({from: dellEmployee});
        assert.strictEqual(supplier[0].toNumber(), 0, 'Supplier is registered incorrectly');

        let courier = await dhlCourierInstance.courierStatistics.call({from: dhlEmployee});
        assert.strictEqual(courier[0].toNumber(), 0, 'Courier is registered incorrectly');
    });

    it('Mint Tokens to Procurer', async () => {
        await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});

        let tokens = await googleProcurerInstance.getTokenBalance.call({from: googleFinanceEmployee});
        assert.strictEqual(tokens.toNumber(), 10000, 'Tokens are minted incorectly to procurer');
    });

    it('Supplier List Products', async () => {
        await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});

        let product = await dellSupplierInstance.viewSelfProduct.call(1, {from: dellEmployee});
        assert.strictEqual(product.listed, true, 'Product is listed incorrectly');
    });

    it('Procurer Create Purchase Order', async () => {
        await googleProcurerInstance.createPurchaseOrder(1, 1, {from: googleLogisticsEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '1', 'Purchase order is created incorrectly');
    });

    it('Procurer Approve Purchase Order', async () => {
        await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '2', 'Purchase order is approved incorrectly');
    });

    it('Supplier Approve Purchase Order', async () => {
        await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});
        
        let po = await dellSupplierInstance.viewPurchaseOrder(1, {from: dellEmployee});
        assert.strictEqual(po.status, '3', 'Purchase order is approved incorrectly');
    });

    it('Supplier Assign Courier', async () => {
        await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee}); 

        let po = await dellSupplierInstance.viewPurchaseOrder(1, {from: dellEmployee});
        assert.strictEqual(po.status, '6', 'Courier is assigned incorrectly');
    });

    it('Courier Receive Order from Supplier', async () => {
        await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});

        let po = await dhlCourierInstance.viewPurchaseOrder(1, {from: dhlEmployee});
        assert.strictEqual(po.status, '7', 'Purchase order is received incorrectly');
    });

    it('Procurer Receive Delivered Order from Courier', async () => {
        await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '8', 'Purchase order is received incorrectly');
    });

    it('Procurer Add Rating for Order', async () => {
        let result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});

        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.rating, '5', 'Rating is not added correctly');
    });
});