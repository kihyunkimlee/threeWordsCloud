const { sequelize } = require('../models');

module.exports = () => {
    const options = {
        force: true,
    };

    console.log('synchronzing database...');

    return sequelize.sync(options);
};