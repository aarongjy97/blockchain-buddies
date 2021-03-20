const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const port = 5000;
const procurerRouter = require('./src/routers/procurerroutes')
const supplierRouter = require('./src/routers/supplierroutes');
const loginRouter = require('./src/routers/loginroutes');
const initRouter = require('./src/routers/initroutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/login', loginRouter);
app.use('/api/init', initRouter);
app.use('/api/procurer', procurerRouter);
app.use('/api/supplier', supplierRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})