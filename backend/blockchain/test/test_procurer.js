var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');
const truffleAssert = require('truffle-assertions');

contract('Procurer Functions', function(accounts) {
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

    /* Testing addEmployee */

    it('Should Fail, Non-Owner Procurer Adds Employee', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even from non-owner');
    });

    it('Should Fail, Procurer Adds Employee with Invalid Employee Type', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addEmployee(googleFinanceEmployee, 5, 'googleFinanceEmployee', {from: google});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even with invalid employee type');
    });

    it('Should Fail, Procurer Adds Employee with Invalid Employee Address', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addEmployee(address(0), 1, 'googleFinanceEmployee', {from: google});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even with invalid employee address');
    });
    
    /* Main Flow Function */
    it('Procurer Add Employee', async () => {
        await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});
    });

    /* Main Flow Function */
    it('Supplier Add Employee', async () => {
        await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});
    });

    /* Main Flow Function */
    it('Courier Add Employee', async () => {
        await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});
    });

    /* Main Flow Function */
    it('Register Stakeholders on Market', async () => {
        let procurer = await googleProcurerInstance.registerAsProcurer({from: google});
        let supplier = await dellSupplierInstance.registerAsSupplier({from: dell});
        let courier = await dhlCourierInstance.registerAsCourier({from: dhl});

        // truffleAssert.eventEmitted(courier, 'Registered');
    });

    /* Main Flow Function */
    it('Mint Tokens to Procurer', async () => {
        await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});
    });

    /* Main Flow Function */
    it('Supplier List Products', async () => {
        let result = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
        
    });

    /* Testing createPurchaseOrder */

    it('Should Fail, Procurer Creates Purchase Order with Finance Employee', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(1, 1, 10+50, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with finance employee');
    });

    it('Should Fail, Procurer Creates Purchase Order with Invalid Product ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(0, 1, 10+50, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid product ID');
    });

    it('Should Fail, Procurer Creates Purchase Order with Invalid Quantity', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(1, -1, 10+50, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid quantity');
    });

    it('Should Fail, Procurer Creates Purchase Order with Non-Existent Product', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(100, 1, 10+50, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with non-existent product');
    });

    it('Should Fail, Procurer Creates Purchase Order with Invalid Price', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(100, 1, 0, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid price');
    });

    /* Main Flow Function */
    it('Procurer Create Purchase Order', async () => {
        await googleProcurerInstance.createPurchaseOrder(1, 1, 10+50, {from: googleLogisticsEmployee});

        // truffleAssert.eventEmitted(result, 'Market.OrderCreated');
    });

    /* Testing viewPurchaseOrder */

    it('Should Fail, Procurer Views Purchase Order with Invalid ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.viewPurchaseOrder.call(10, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is viewed even with invalid ID');
    });
    
    it('Procurer View Purchase Order', async () => {
        await googleProcurerInstance.viewPurchaseOrder.call(1, {from: googleLogisticsEmployee});
        await googleProcurerInstance.viewPurchaseOrder.call(1, {from: googleFinanceEmployee});
    });

    /* Testing viewAllPurchaseOrders */

    it('Procurer View Purchase Order', async () => {
        await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleLogisticsEmployee});
        await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleFinanceEmployee});
    });
    
    /* Testing rejectPurchaseOrder */

    it('Should Fail, Procurer Rejects Purchase Order with Logistics Employee', async () => {
        let result;
        try {
            result = await googleProcurerInstance.rejectPurchaseOrder(1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is rejected even with logistics employee');
    });

    it('Should Fail, Procurer Rejects Purchase Order with Invalid ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.rejectPurchaseOrder(100, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is rejected even with invalid ID');
    });

    it('Procurer Reject Purchase Order', async () => {
        await googleProcurerInstance.rejectPurchaseOrder.call(1, {from: googleFinanceEmployee});
    });

    /* Testing approvePurchaseOrder */

    it('Should Fail, Procurer Approves Non-Existent Purchase Order', async () => {
        let result;
        try {
            result = await googleProcurerInstance.approvePurchaseOrder(0, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is approved even when it is non-existent');
    });

    it('Should Fail, Invalid Procurer Approves Purchase Order', async () => {
        let result;
        try {
            result = await googleProcurerInstance.approvePurchaseOrder(1, {from: accounts[13]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is approved even from invalid procurer');
    });

    it('Should Fail, Procurer Logistics Team Approves Purchase Order', async () => {
        let result;
        try {
            result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is approved even when from logistics team');
    });

    /* Main Flow Function */
    it('Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});
    });
    
    /* Main Flow Function */
    it('Supplier Approve Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});  
    });

    /* Main Flow Function */
    it('Supplier Assign Courier', async () => {
        let result = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee}); 
    });

    /* Main Flow Function */
    it('Courier Receive Order from Supplier', async () => {
        let result = await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});
    });

    /* Testing deliveredByCourier */

    it('Should Fail, Procurer Receives Delivered Order with Finance Team', async () => {
        let result;
        try {
            result = await googleProcurerInstance.deliveredByCourier(1, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is received even when from finance team');
    });

    it('Should Fail, Procurer Receives Delivered Order with Invalid ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.deliveredByCourier(100, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is received even when has invalid ID');
    });

    it('Should Fail, Invalid Procurer Receives Delivered Order', async () => {
        let result;
        try {
            result = await googleProcurerInstance.deliveredByCourier(1, {from: accounts[13]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is received even when from invalid procurer');
    });

    /* Main Flow Function */
    it('Procurer Receive Delivered Order from Courier', async () => {
        let result = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});
    });

    /* Testing addRating */

    it('Should Fail, Procurer Adds Rating with Finance Team', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addRating(5, 1, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Rating is added even with finance team');
    });

    it('Should Fail, Procurer Adds Rating with Invalid ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addRating(5, 100, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Rating is added even with invalid ID');
    });

    it('Should Fail, Procurer Adds Invalid Rating', async () => {
        let result;
        try {
            result = await googleProcurerInstance.addRating(500, 1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Rating is added even when invalid');
    });

    /* Main Flow Function */
    it('Procurer Add Rating for Order', async () => {
        let result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});
    });
});