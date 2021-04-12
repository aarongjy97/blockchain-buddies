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

    /* Main Flow Function */
    it("Main Flow Function: Adding Employees", async () => {
        await googleProcurerInstance.addEmployee(googleFinanceEmployee, 1, 'googleFinanceEmployee', {from: google});
        await googleProcurerInstance.addEmployee(googleLogisticsEmployee, 2, 'googleLogisticsEmployee', {from: google});
        await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dell});
        await dhlCourierInstance.addEmployee(dhlEmployee, 'dhlEmployee', {from: dhl});
    });

    /* Testing Supplier.addEmployee */
    it('Should Fail, Non-Owner Supplier Adds Employee', async () => {
        let result;
        try {
            result = await dellSupplierInstance.addEmployee(dellEmployee, 'dellEmployee', {from: dellEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even from non-owner');
    });

    /* Testing Supplier.addEmployee */
    it('Should Fail, Supplier Adds Employee with Invalid Employee Address', async () => {
        let result;
        try {
            result = await dellSupplierInstance.addEmployee(address(0), 'dellEmployee', {from: dell});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, 'Employee is added even with invalid employee address');
    });

    /* Testing Supplier.registerAsSupplier */ 
    it('Should Fail, Supplier registers itself as Supplier with Invalid Address', async () => {
        let result;
        try {
            result = await dellSupplierInstance.registerAsSupplier({from: google});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Supplier is registered with an Invalid Address");
    });

    /* Testing Supplier.registerAsSupplier */
    it('Should emit Registered event, Supplier registers itself correctly', async () => {
        let result = await dellSupplierInstance.registerAsSupplier({from: dell});
        assert.isNotNull(result);
    });

    /* Testing Supplier.registerAsSupplier */ 
    it('Should Fail, Supplier registers itself again', async () => {
        let result;
        try {
            result = await dellSupplierInstance.registerAsSupplier.call({from: dell});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Supplier is registered again");
    });

    /* Main Flow Function */
    it("Main Flow Function: Register Stakeholders", async () => {
        let result = await googleProcurerInstance.registerAsProcurer({from: google});
        assert.isNotNull(result);

        result = await dhlCourierInstance.registerAsCourier({from: dhl});
        assert.isNotNull(result);
    });

    /* Main Flow Function */
    it('Main Flow Function: Mint Tokens to Procurer', async () => {
        const result = await marketERC20Instance.mintTokens(googleProcurerInstance.address, 10000, {from: erc20});
        assert.isNotNull(result);
    });

    /* Testing Supplier.listProduct() */
    it('Supplier List Products', async () => {
        let result = await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
        assert.isNotNull(result);
    });

    it('Should Fail, Wrong address used to list product', async () => {
        let result;
        try {
            result = await dellSupplierInstance.listProduct.call(100, 10, 'Dell Laptop', 'Good Laptop', {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Wrong address can be used to list a product")
    });

    /* Testing Supplier.viewSelfProduct */
    it('Supplier View Product', async () => {
        let product;
        try {
            product = await dellSupplierInstance.viewSelfProduct(1, {from: dellEmployee});
        } 
        catch(e) {}

        assert.strictEqual(product.productName, 'Dell Laptop', 'Product name is not correct');
        assert.strictEqual(product.quantityAvailable, '100', 'Product quantity is not correct');
        assert.strictEqual(product.price, '10', 'Product price is not correct');
        assert.strictEqual(product.description, 'Good Laptop', 'Product description is not correct');
    });

    /* Testing Supplier.viewAllSelfProducts */
    it('Supplier View All Products', async () => {
        let products;
        try {
            products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        } 
        catch(e) {}

        assert.strictEqual(products[0].productName, 'Dell Laptop', 'Product name is not correct');
        assert.strictEqual(products[0].quantityAvailable, '100', 'Product quantity is not correct');
        assert.strictEqual(products[0].price, '10', 'Product price is not correct');
        assert.strictEqual(products[0].description, 'Good Laptop', 'Product description is not correct');
    });

    /* Testing Supplier.viewAllSelfProducts */
    it('Should Fail, Supplier Unlist Product that does not exist', async () => {
        let result;
        try {
            result = await dellSupplierInstance.unlistProduct(5, {from: dellEmployee});
        } 
        catch(e) {}

        assert.strictEqual(result, undefined, "Product that does not exist have been unlisted");
    });

    /* Testing Supplier.viewAllSelfProducts */
    it('Should Fail, Wrong address used to unlist product', async () => {
        let result;
        try {
            result = await dellSupplierInstance.unlistProduct(1, {from: googleLogisticsEmployee});
        } 
        catch(e) {}

        assert.strictEqual(result, undefined, "Wrong address can be used to unlist a product");
    });

    /* Testing Supplier.unlistProduct */
    it('Supplier Unlist Product', async () => {
        let result;
        let products;
        try {
            result = await dellSupplierInstance.unlistProduct(1, {from: dellEmployee});
            products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});        
        } 
        catch(e) {}

        assert.strictEqual(products[0].listed, false, "Product is not unlisted correctly");
    });

    /* Testing Supplier.relistProduct */
    it('Should Fail, Supplier relist a product that is already listed', async () => {
        let result;
        let products;
        try {
            await dellSupplierInstance.listProduct(100, 10, 'Dell Laptop', 'Good Laptop', {from: dellEmployee});
            result = await dellSupplierInstance.relistProduct(2, {from: dellEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Supplier relist a product that is already listed");
    });
    
    /* Testing Supplier.relistProduct */
    it('Should Fail, Supplier relist a product that does not exist', async () => {
        let result;
        try {
            result = await dellSupplierInstance.relistProduct(5, {from: dellEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Supplier relist a product that deos not exist");
    });    

    /* Testing Supplier.relistProduct */
    it('Should Fail, Wrong address is used to relist a product', async () => {
        let result;
        try {
            result = await dellSupplierInstance.relistProduct(1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(result, undefined, "Wrong address can be used to relist a product");
    });    
    
    /* Testing Supplier.relistProduct */
    it('Supplier Relist Product', async () => {
        let result;
        let products;
        try {
            result = await dellSupplierInstance.relistProduct(1, {from: dellEmployee});
            products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        }
        catch(e) {}

        assert.strictEqual(products[0].listed, true, "Product is not relisted correctly");
    });

    /* Testing Supplier.updateProductPrice, Supplier.updateProductQuantity, Supplier.updateProductDescription */
    it('Should Fail, Supplier update product that does not exist', async () => {
        let result1;
        let result2;
        let result3;

        try {
            result1 = await dellSupplierInstance.updateProductPrice(5, 20, {from: dellEmployee});
        }
        catch(e) {}

        try {
            result2 = await dellSupplierInstance.updateProductQuantity(5, 150, {from: dellEmployee});
        } catch (error) {}

        try {
            result3 = await dellSupplierInstance.updateProductDescription(5, "Bad Laptop", {from: dellEmployee});
    
        } catch (error) {}
        
        assert.strictEqual(result1, undefined, 'Product that does not exist has been updated');
        assert.strictEqual(result2, undefined, 'Product that does not exist has been updated');
        assert.strictEqual(result3, undefined, 'Product that does not exist has been updated');
    });

    /* Testing Supplier.updateProductPrice, Supplier.updateProductQuantity, Supplier.updateProductDescription */
    it('Should Fail, Wrong address used to update product', async () => {
        let result1;
        let result2;
        let result3;

        try {
            result1 = await dellSupplierInstance.updateProductPrice(1, 20, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        try {
            result2 = await dellSupplierInstance.updateProductQuantity(1, 150, {from: googleLogisticsEmployee});
        } catch (error) {}

        try {
            result3 = await dellSupplierInstance.updateProductDescription(1, "Bad Laptop", {from: googleLogisticsEmployee});
        } catch (error) {}
        
        assert.strictEqual(result1, undefined, 'Wrong address can be used to update a product');
        assert.strictEqual(result2, undefined, 'Wrong address can be used to update a product');
        assert.strictEqual(result3, undefined, 'Wrong address can be used to update a product');
    });

    /* Testing Supplier.updateProductPrice, Supplier.updateProductQuantity, Supplier.updateProductDescription */
    it('Supplier Update Product (Price, Quantity and Description)', async () => {
        let products;
        try {
            await dellSupplierInstance.updateProductPrice(1, 20, {from: dellEmployee});
            await dellSupplierInstance.updateProductQuantity(1, 150, {from: dellEmployee});
            await dellSupplierInstance.updateProductDescription(1, "Bad Laptop", {from: dellEmployee});
            products = await dellSupplierInstance.viewAllSelfProducts.call({from: dellEmployee});
        }
        catch(e) {}
        
        assert.strictEqual(products[0].quantityAvailable, '150', 'Product updated quantity is not correct');
        assert.strictEqual(products[0].price, '20', 'Product updated price is not correct');
        assert.strictEqual(products[0].description, 'Bad Laptop', 'Product updated description is not correct');
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Create Purchase Order', async () => {
        let result = await googleProcurerInstance.createPurchaseOrder(1, 1, {from:googleLogisticsEmployee});
        assert.isNotNull(result);
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Approve Purchase Order', async () => {
        let result = await googleProcurerInstance.approvePurchaseOrder(1, {from:googleFinanceEmployee});
        assert.isNotNull(result);
    });

    /* Testing Supplier.viewPurchaseOrder */
    it('Should Fail: Supplier view a PO that does not exist', async () => {
        let po;
        try {
            po = await dellSupplierInstance.viewPurchaseOrder.call(5, {from: dellEmployee});
        }
        catch(e) {}

        assert.strictEqual(po, undefined, 'Supplier is viewing a PO that does not exist');
    });

    /* Testing Supplier.viewPurchaseOrder */
    it('Should Fail: Wrong address used to view supplier PO', async () => {
        let po;
        try {
            po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: googleLogisticsEmployee});
        }
        catch(e) {}

        assert.strictEqual(po, undefined, 'Wrong address can be used to view supplier PO');
    });

    /* Testing Supplier.viewPurchaseOrder */
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

    /* Testing Supplier.supplierViewAllPurchaseOrders */
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

    /* Testing Supplier.supplierApprovePurchaseOrder */
    it('Main Flow Function: Supplier Approve Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierApprovePurchaseOrder(1, {from:dellEmployee});
        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.status, "3", "PO Status is not SupplierApproved")
    });

    /* Testing Supplier.supplierRejectPurchaseOrder */
    it('Supplier Reject Purchase Order', async () => {
        let result = await dellSupplierInstance.supplierRejectPurchaseOrder.call(1, {from:dellEmployee});
        assert.isNotNull(result);
    });

    /* Testing Supplier.assignCourier */
    it('Main Flow Function: Supplier Assign Courier', async () => {
        let result = await dellSupplierInstance.assignCourier(dhlCourierInstance.address, 1, {from: dellEmployee});
        let po = await dellSupplierInstance.viewPurchaseOrder.call(1, {from: dellEmployee});
        assert.strictEqual(po.courier, dhlCourierInstance.address, "Courier is incorrectly assigned")
    });

    /* Main Flow Function */
    it('Main Flow Function: Courier Receive Order from Supplier', async () => {
        await dhlCourierInstance.receivedByCourier(1, {from: dhlEmployee});
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Receive Delivered Order from Courier', async () => {
        const result = await googleProcurerInstance.deliveredByCourier(1, {from: googleLogisticsEmployee});
        assert.isNotNull(result);
    });

    /* Main Flow Function */
    it('Main Flow Function: Procurer Add Rating for Order', async () => {
        const result = await googleProcurerInstance.addRating(5, 1, {from: googleLogisticsEmployee});
        assert.isNotNull(result);
    });
});
