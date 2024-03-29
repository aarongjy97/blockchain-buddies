const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const port = 5000;
const procurerRouter = require('./src/routers/procurerroutes')
const supplierRouter = require('./src/routers/supplierroutes');
const loginRouter = require('./src/routers/loginroutes');
const initRouter = require('./src/routers/initroutes');
const courierRouter = require('./src/routers/courierroutes');
const marketRouter = require('./src/routers/marketroutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/login', loginRouter);
app.use('/api/init', initRouter);
app.use('/api/procurer', procurerRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/courier', courierRouter);
app.use('/api/market', marketRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})