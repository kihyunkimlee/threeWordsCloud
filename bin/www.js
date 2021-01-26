const app = require('../index');
const syncDB = require('./syncDB');
const initDB = require('./initDB');

syncDB()
    .then(initDB)
    .then(() => {
        app.listen(3000, () => {
            console.log('server is running on ' + 3000 + ' port!');
        });
    });