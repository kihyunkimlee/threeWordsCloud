const { sequelize } = require('../models');

module.exports = () => {
    const options = {
        //force: true,
    };

    return sequelize.sync(options);
};