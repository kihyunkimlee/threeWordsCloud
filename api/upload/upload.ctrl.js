const { sequelize, models, Op } = require('../../models/');

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

const uploadFile = async (req, res, next) => {
    console.log(req);
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
    
    models.File.create({
        word1: threeWordsKey[0],
        word2: threeWordsKey[1],
        word3: threeWordsKey[2],
        originalFileName: originalname,
        fileSize: size,
        fileMimeType: mimetype,
        fileUploadedPath: path,
    }).then((file) => {
        return res.json({
            word1: file.word1,
            word2: file.word2,
            word3: file.word3,
        });
    }).catch(next);
    
};

module.exports = {
    uploadFile,
};