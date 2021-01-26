const { sequelize, models, Op } = require('../../models/');
const fs = require('fs');

const createthreeWordsKey = async () => {
    const { count, rows } = await models.Word.findAndCountAll({
        attributes: [ 'word', ],
        order: sequelize.random(),
    });

    let cnt = 0;
    while(cnt <= 100){
        const threeWords = [];

        for(let i = 0; i < 3; i++){
            const randNum = Math.floor(Math.random() * count);

            threeWords.push(rows[randNum].word);
        }

        const exist = await models.File.count({
            where: {
                [Op.and]: [
                    { word1: threeWords[0] },
                    { word2: threeWords[1] },
                    { word3: threeWords[2] }
                ]
            }
        });

        if (exist){
            cnt += 1;

            continue;
        }else {
            return threeWords;
        }
    }

    return [-1, -1, -1];
};

const postFile = async (req, res, next) => {
    const listOfMaxAges = [
        30000,    //30 seconds for test
        10800000, //3 hours
        43200000, //12 hours
        86400000, //24 hours
    ];

    let age = parseInt(req.body.age, 10);
    if (Number.isNaN(age)){
        age = 10800000;
    } else if (listOfMaxAges.every((maxAge) => (age !== maxAge))){
        return res.status(400).end();
    }

    if (!req.file){
        if (req.fileFormatError){
            return res.status(415).end();
        } else {
            return res.status(400).end();
        }
    }

    const threeWordsKey = await createthreeWordsKey();
    
    if (threeWordsKey[0] === -1){
        console.log('exceed the maximum number of try to make a new threeWordskey!');

        return res.status(503).end();
    }

    const { originalname, size, mimetype, path } = req.file;

    const now = Date.now();

    models.File.create({
        word1: threeWordsKey[0],
        word2: threeWordsKey[1],
        word3: threeWordsKey[2],
        originalFileName: originalname,
        fileSize: size,
        fileMimeType: mimetype,
        fileUploadedPath: path,
        createdAt: now,
        expiredAt: now + age,
    }).then((file) => {
        return res.status(201).json(file);
    }).catch(next);

};

const getFile = (req, res, next) => {
    const { word1, word2, word3 } = req.session;
    if (!word1 || !word2 || !word3){
        return res.status(401).end();
    }

    const { year, month, date, fileName } = req.params;

    const fileUploadedPath = 'file/' + year + '/' + month + '/' + date + '/' + fileName;

    models.File.findOne({
        where: {
            [Op.and] : [
                {word1: word1},
                {word2: word2},
                {word3: word3},
            ]
        }
    }).then((file) => {
        if (file.fileUploadedPath !== fileUploadedPath){
            return res.status(403).end();
        }

        res.setHeader('Content-disposition', 'filename=' + file.originalFileName);
        res.setHeader('Content-type', file.fileMimeType);

        const filestream = fs.createReadStream(file.fileUploadedPath);
        filestream.pipe(res);
    }).catch(next);

};

module.exports = {
    postFile,
    getFile,
};