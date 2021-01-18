module.exports = (sequelize, DataTypes) => {
    const word = sequelize.define('Word', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false,
    });

    word.associate = function (models) {

    };

    return word;
};