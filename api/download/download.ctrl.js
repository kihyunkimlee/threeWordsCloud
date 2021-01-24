const { models, Op } = require('../../models/');

const downloadFile = (req, res, next) => {
    const threeWordsKey = req.body.threeWordsKey;

    if (!threeWordsKey){
        res.status(400).end();
    } else if (!threeWordsKey.word1 || !threeWordsKey.word2 || !threeWordsKey.word3){
        res.status(400).end();
    }

    const { word1, word2, word3 } = threeWordsKey; 

    models.File.findOne({
        where: {
            [Op.and]: [
                {word1: word1},
                {word2: word2},
                {word3: word3}
            ]
        }
    }).then((file) => {
        if (!file) return res.status(404).end();

        req.session.originalFileName = file.originalFileName;

        return res.json(file);
    }).catch(next);
};

module.exports = {
    downloadFile,
};