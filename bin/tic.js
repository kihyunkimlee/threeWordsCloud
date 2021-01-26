const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { models, Op } = require('../models');

module.exports = () => {
    console.log('tic... tok...');

    cron.schedule('0 0 3 * * *', () => {
        console.log('start removing expired files...');

        models.File.findAll({
            attributes: [
                'id',
                'fileUploadedPath',
                'expiredAt',
            ],
        }).then((files) => {
            if (!files) return;

            const now = Date.now();

            const expiredFiles = files.map((file) => {
                if (file.expiredAt - now <= 0){
                    fs.unlink(file.fileUploadedPath, (err) => {
                        if (err) console.log(err.message);
                        else {
                            console.log('removed ' + file.fileUploadedPath + ' successfully!');
                        }
                    });

                    return file.id;
                };
            });

            if (expiredFiles.length === 0) return;

            models.File.destroy({
                where: {
                    id: {
                        [Op.in]: expiredFiles,
                    }
                }
            }).catch((err) => {
                console.log(err.message);
            });
        }).catch((err) => {
            console.log(err.message);
        });
    });

    return Promise.resolve();
};