const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const upload = require('./api/upload/');

if (process.env.NODE_ENV == 'test'){
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/upload/file', upload);

module.exports = app;