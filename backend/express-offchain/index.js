const express = require('express');
const logger = require('morgan');
const port = 5000;
const indexRouter = require('./src/routes')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})