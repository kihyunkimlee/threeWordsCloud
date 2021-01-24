const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const upload = require('./api/upload/');
const download = require('./api/download/');

if (process.env.NODE_ENV == 'test'){
    app.use(morgan('dev'));
}

const { DB_HOST, DB_PORT, DB_USER, DB_PW, DB_NAME } = process.env;

const sessionStore = new MySqlStore({
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PW,
    database: DB_NAME,
});

app.use(session({
    secret: 'threeWordsCloudSecretKey',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
        secure: false,
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/upload/file', upload);
app.use('/download/file', download);

module.exports = app;