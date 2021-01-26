const app = require('../index');
const syncDB = require('./syncDB');
const initDB = require('./initDB');
const tic = require('./tic');

syncDB()
    .then(initDB)
    .then(tic)
    .then(() => {
        app.listen(3000, () => {
            console.log('server is running on ' + 3000 + ' port!');
        });
    });