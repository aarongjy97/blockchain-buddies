const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const port = 5000;
const indexRouter = require('./src/routers/routes')
const loginRouter = require('./src/routers/loginroutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// app.use('/', indexRouter)
app.use('/api/login', loginRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})