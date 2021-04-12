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
    
    /* Main Flow Function */
    it('Main Flow Function: Add Employee', async () => {
        await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});
        await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});
        await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});
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
    it('Main Flow Function: Register Stakeholders, Mint Tokens, List Product', async () => {
        await googleProcurerInstance.registerAsProcurer({from: google});
        await dellSupplierInstance.registerAsSupplier({from: dell});
        await dhlCourierInstance.registerAsCourier({from: dhl});

        await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});

        await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
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

    it('Should Fail, Procurer Creates Purchase Order with Invalid Price', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(100, 1, 0, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid price');
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Create Purchase Order', async () => {
        await googleProcurerInstance.createPurchaseOrder(1, 1,  {from: googleLogisticsEmployee});

        // truffleAssert.eventEmitted(result, 'OrderCreated', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address && ev.logisticsEmployee === googleLogisticsEmployee && ev._productId === 1 && ev._quantity === 1 && ev.price === 10+50;
        // }, 'Purchase order is not created correctly');
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
        let po1 = await googleProcurerInstance.viewPurchaseOrder.call(1, {from: googleLogisticsEmployee});
        let po2 = await googleProcurerInstance.viewPurchaseOrder.call(1, {from: googleFinanceEmployee});

        assert.strictEqual(po1.orderId, po2.orderId, 'Viewed purchase order is different for logistics and finance employee');
        assert.strictEqual(po1.procurer, googleProcurerInstance.address, 'Viewed purchase order procurer is incorrect');
        assert.strictEqual(po1.supplier, dellSupplierInstance.address, 'Viewed purchase order supplier is incorrect');
        assert.strictEqual(po1.productId, '1', 'Viewed purchase order product id is incorrect');
        assert.strictEqual(po1.productName, 'Dell Laptop', 'Viewed purchase order product name is incorrect');
        assert.strictEqual(po1.orderId, '1', 'Viewed purchase order id is incorrect');
        assert.strictEqual(po1.quantity, '1', 'Viewed purchase order quantity is incorrect');
        assert.strictEqual(po1.price, '60', 'Viewed purchase order price is incorrect');
    });

    /* Testing viewAllPurchaseOrders */
    it('Procurer View Purchase Order', async () => {
        let pos1 = await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleLogisticsEmployee});
        let pos2 = await googleProcurerInstance.viewAllPurchaseOrders.call({from: googleFinanceEmployee});

        assert.strictEqual(pos1[0].orderId, pos2[0].orderId, 'Viewed purchase order is different for logistics and finance employee');
        assert.strictEqual(pos1[0].procurer, googleProcurerInstance.address, 'Viewed purchase order procurer is incorrect');
        assert.strictEqual(pos1[0].supplier, dellSupplierInstance.address, 'Viewed purchase order supplier is incorrect');
        assert.strictEqual(pos1[0].productId, '1', 'Viewed purchase order product id is incorrect');
        assert.strictEqual(pos1[0].productName, 'Dell Laptop', 'Viewed purchase order product name is incorrect');
        assert.strictEqual(pos1[0].orderId, '1', 'Viewed purchase order id is incorrect');
        assert.strictEqual(pos1[0].quantity, '1', 'Viewed purchase order quantity is incorrect');
        assert.strictEqual(pos1[0].price, '60', 'Viewed purchase order price is incorrect');
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
        let result = await googleProcurerInstance.rejectPurchaseOrder.call(1, {from: googleFinanceEmployee});

        // truffleAssert.eventEmitted(result, 'OrderInternalRejected', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address && ev.financeEmployee === googleFinanceEmployee;
        // }, 'Purchase order is not rejected by procurer correctly');
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

    it('Should Fail, Procurer Logistics Team Approves Purchase Order', async () => {
        let result;
        try {
            result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is approved even when from logistics team');
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});

        // truffleAssert.eventEmitted(result, 'OrderInternalApproved', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address && ev.financeEmployee === googleFinanceEmployee;
        // }, 'Purchase order is not approved by procurer correctly');
    });
    
    /* Main Flow Function */
    it('Main Flow Function: Supplier Approve Purchase Order, Assign Courier, Courier Receive Order', async () => {
        await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from: dellEmployee});
        await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee});

        await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});   
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

    /* Main Flow Function */
    it('Main Flow Function: Procurer Receive Delivered Order from Courier', async () => {
        let result = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});

        // truffleAssert.eventEmitted(result, 'OrderDelivered', (ev) => {
        //     return ev._orderId === 1 && ev.procurer === googleProcurerInstance.address;
        // }, 'Purchase order is not received by procurer correctly');
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
    it('Main Flow Function: Procurer Add Rating for Order', async () => {
        let result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});

        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.rating, '5', 'Rating is not added correctly');
    });
});