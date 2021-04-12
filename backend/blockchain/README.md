# Procurement Marketplace Blockchain Source Code

The contracts to be deployed are found in the <code>contracts</code> folder.

To deploy the contracts for live server:

1. In one terminal, run `npm run ganache` to start the ganache server. Note that 21 accounts are necessary for the pre-populated fields.
2. Ensure that the express-offchain server has been running.
3. In another terminal, run `truffle migrate` for truffle to migrate the contract ABI to the ganache server.

To run the tests:

1. In one terminal, run `npm run test` to set up a test server on ganache at port 8546.
2. Run `npm run test-supplier` to test the supplier functions.
3. Run `npm run test-procurer` to test the procurer functions.
4. Run `npm run test-courier` to test the courier functions.
5. Run `npm run test-all` to test all functions.