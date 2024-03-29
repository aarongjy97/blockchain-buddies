var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');
const truffleAssert = require('truffle-assertions');

contract('Courier Functions', function(accounts) {
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

    /* Main Flow Functions */
    it('Main Flow Functions: Add Employee', async () => {
        let procurer1 = await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        let procurer2 = await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});
        let supplier = await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});
        let courier = await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});

        assert.isNotNull(procurer1);
        assert.isNotNull(procurer2);
        assert.isNotNull(supplier);
        assert.isNotNull(courier);
    });
    
    /* Testing addEmployee */
    it('Should Fail, Non-Owner Courier Adds Employee', async () => {
        let result;
        try {
            result = await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: accounts[0]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even from non-owner');
    });

    it('Should Fail, Courier Adds Employee with Invalid Employee Address', async () => {
        let result;
        try {
            result = await dhlCourierInstance.addEmployee(address(0), 'dhlEmployee', {from: dhl});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even with invalid employee address');
    });

    /* Main Flow Functions */
    it('Main Flow Function: Register Stakeholders', async () => {
        let procurer = await googleProcurerInstance.registerAsProcurer({from: google});
        let supplier = await dellSupplierInstance.registerAsSupplier({from: dell});
        let courier = await dhlCourierInstance.registerAsCourier({from: dhl});

        assert.isNotNull(procurer);
        assert.isNotNull(supplier);
        assert.isNotNull(courier);
    });

    /* Testing registerAsCourier */
    it('Should Fail, Courier Registers with Invalid Address', async () => {
        let result;
        try {
            result = await dhlCourierInstance.registerAsCourier({from: address(0)});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Courier is registered even with invalid address');
    });

    it('Should Fail, Courier Registers with Duplicate Address', async () => {
        let result;
        try {
            result = await dhlCourierInstance.registerAsCourier({from: dhl});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Courier is registered even with duplicate address');
    });

    /* Main Flow Functions */
    it('Main Flow Function: Mint, List Product, Create PO, Approve PO, Assign Courier, Courier Receive', async () => {
        let mint = await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});
        
        let list = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', '', {from: dellEmployee});
        
        let createPO = await googleProcurerInstance.createPurchaseOrder(1, 1, {from: googleLogisticsEmployee});
        let approve1 = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});
        
        let approve2 = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});  
        let assign = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee}); 
       
        let receive = await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});

        assert.isNotNull(mint);
        assert.isNotNull(list);
        assert.isNotNull(createPO);
        assert.isNotNull(approve1);
        assert.isNotNull(approve2);
        assert.isNotNull(assign);
        assert.isNotNull(receive);
    });

    /* Testing viewPurchaseOrder */
    it('Should Fail, Courier Views Purchase Order with Invalid ID', async () => {
        let result;
        try {
            result = await dhlCourierInstance.viewPurchaseOrder.call(10, {from: dhlEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is viewed even with invalid ID');
    });

    it('Courier View Purchase Order', async () => {
        let po = await dhlCourierInstance.viewPurchaseOrder.call(1, {from: dhlEmployee});

        assert.strictEqual(po.productName, 'Dell Laptop', 'Purchase order name is incorrect');
        assert.strictEqual(po.productId, '1', 'Purchase order id is incorrect');
        assert.strictEqual(po.quantity, '1', 'Purchase order quantity is incorrect');
        assert.strictEqual(po.price, '60', 'Purchase order price is incorrect');
    });

    /* Testing courierViewAllPurchaseOrders */
    it('Should Fail, Non-Courier Views All Purchase Orders', async () => {
        let result;
        try {
            result = await dhlCourierInstance.courierViewAllPurchaseOrders.call({from: accounts[0]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is viewed even with non-courier');
    });

    it('Courier View All Purchase Orders', async () => {
        let pos = await dhlCourierInstance.courierViewAllPurchaseOrders.call({from: dhlEmployee});

        assert.strictEqual(pos[0].productName, 'Dell Laptop', 'Purchase order name is incorrect');
        assert.strictEqual(pos[0].productId, '1', 'Purchase order id is incorrect');
        assert.strictEqual(pos[0].quantity, '1', 'Purchase order quantity is incorrect');
        assert.strictEqual(pos[0].price, '60', 'Purchase order price is incorrect');
    });

    /* Testing receivedByCourier */
    it('Should Fail, Courier Receives Purchase Order with Invalid ID', async () => {
        let result;
        try {
            result = await dhlCourierInstance.receivedByCourier(100, {from: dhlEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is received even with invalid ID');
    });

    it('Should Fail, Non-Courier Receives Purchase Order', async () => {
        let result;
        try {
            result = await dhlCourierInstance.receivedByCourier(1, {from: accounts[0]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is received even with non-courier');
    });

    /* Main Flow Functions */
    it('Main Flow Functions: Procurer Receive, Add Rating', async () => {
        let delivered = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});
        let rating = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});

        assert.isNotNull(delivered);
        assert.isNotNull(rating);
    });
});