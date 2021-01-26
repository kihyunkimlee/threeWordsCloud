const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const file = require('./api/file/');
const downloadToken = require('./api/downloadToken');

if (process.env.NODE_ENV !== 'test'){
    app.use(morgan('dev'));
}

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PW, SESSION_DB_NAME } = process.env;

const sessionStore = new MySqlStore({
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PW,
    database: SESSION_DB_NAME,
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

app.use('/file', file);
app.use('/downloadToken', downloadToken);

module.exports = app;