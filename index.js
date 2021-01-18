const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');

if (process.env.NODE_ENV == 'test'){
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;