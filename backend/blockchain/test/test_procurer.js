var Courier = artifacts.require('./Courier.sol');
var Market = artifacts.require('./Market.sol');
var MarketERC20 = artifacts.require('./MarketERC20.sol');
var Procurer = artifacts.require('./Procurer.sol');
var Supplier = artifacts.require('./Supplier.sol');

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

        let finance = await googleProcurerInstance.viewEmployee.call(googleFinanceEmployee, {from: google});
        let logistics = await googleProcurerInstance.viewEmployee.call(googleLogisticsEmployee, {from: google});
        assert.strictEqual(finance.name, 'googleFinanceEmployee', 'Finance employee name is incorrect');
        assert.strictEqual(logistics.name, 'googleLogisticsEmployee', 'Logistics employee name is incorrect');
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

        let procurer = await googleProcurerInstance.procurerStatistics.call({from: googleLogisticsEmployee});
        assert.strictEqual(procurer[0].toNumber(), 0, 'Procurer is registered incorrectly');
    });

    /* Testing registerAsProcurer */
    it('Should Fail, Procurer Registers with Invalid Address', async () => {
        let result;
        try {
            result = await googleProcurerInstance.registerAsProcurer({from: accounts[0]});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Procurer is registered even with invalid address');
    });

    /* Testing createPurchaseOrder */
    it('Should Fail, Procurer Creates Purchase Order with Finance Employee', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(1, 1, {from: googleFinanceEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with finance employee');
    });

    it('Should Fail, Procurer Creates Purchase Order with Invalid Product ID', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(0, 1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid product ID');
    });

    it('Should Fail, Procurer Creates Purchase Order with Invalid Quantity', async () => {
        let result;
        try {
            result = await googleProcurerInstance.createPurchaseOrder(1, -1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Purchase order is created even with invalid quantity');
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Create Purchase Order', async () => {
        await googleProcurerInstance.createPurchaseOrder(1, 1,  {from: googleLogisticsEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '1', 'Purchase order is created incorrectly');
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
        await googleProcurerInstance.createPurchaseOrder(1, 2,  {from: googleLogisticsEmployee});

        await googleProcurerInstance.rejectPurchaseOrder(2, {from: googleFinanceEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(2, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '4', 'Purchase order is rejected incorrectly');
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
        await googleProcurerInstance.approvePurchaseOrder(1, {from: googleFinanceEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '2', 'Purchase order is approved incorrectly');
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
        await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});

        let po = await googleProcurerInstance.viewPurchaseOrder(1, {from: googleLogisticsEmployee});
        assert.strictEqual(po.status, '8', 'Purchase order is received incorrectly');
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
        await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});

        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.rating, '5', 'Rating is not added correctly');
    });
});