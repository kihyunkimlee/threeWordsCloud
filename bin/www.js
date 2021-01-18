const app = require('../index');
const db = require('./sync-db');

db().then(() => {
    console.log('sync database!');

    app.listen(3000, () => {
        console.log('server is running on ' + 3000 + ' port!');
    });
});