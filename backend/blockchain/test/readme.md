# Procurement Blockchain Marketplace Platform Testing

Testing Strategy

1. To test that a function is supposed to fail, we would wrap it in a trycatch block, and instantiate <code>result</code> to be undefined. Consequently, as the function fails, <code>result</code> should still be <code>undefined</code>.

2. For functions that are meant to pass, and are supposed to emit an event, we will not use <code>truffle-assert</code>. This is because, we are calling a contract that calls the <code>Market</code> contract, the blockchain logs will not be propagated back to us. Reasoning found [here](https://ethereum.stackexchange.com/questions/61912/truffle-test-logs-do-not-include-an-emitted-event). Hence, we would check if the transaction receipt is present in <code>result</code>.