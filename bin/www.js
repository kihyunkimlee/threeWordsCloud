const app = require('../index');
const syncDB = require('./syncDB');
const initDB = require('./initDB');
const tic = require('./tic');

syncDB()
    .then(initDB)
    .then(tic)
    .then(() => {
        app.listen(5000, () => {
            console.log('server is running on ' + 5000 + ' port!');
        });
    });