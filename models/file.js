module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define('File', {
        id: {
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        word1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        word2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        word3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        originalFileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fileMimeType: {
            //On Windows, Linux, Solaris, and Mac os X, the maximum number of characters for a file name is 255Bytes.
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileUploadedPath: {
            //the maximum combined length of both file name and path name is vary with OS.
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    });

    file.associate = function (models) {

    };
    
    return file;
};