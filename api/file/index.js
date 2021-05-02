const express = require('express');
const router = express.Router();
const ctrl = require('./file.ctrl');
const multer = require('multer');
const { createPath, makeDir } = require('../../lib');
const { handleMulterError, handleDBError } = require('../../middleware/errorHandler');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const newPath = createPath('file');

        makeDir(newPath);

        cb(null, newPath);
    }
});

const fileFilter = (req, file, cb) => {
    const re = /.asp|.aspx|.php|.jsp|.pl|.html/;

    const fileName = file.originalname.toLowerCase();

    if (re.test(fileName)){
        req.fileFormatError = true;
        
        cb(null, false);
    } else{
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5*1024*1024 },
});

router.post('', upload.single('file'), ctrl.createFile);
router.get('/:year/:month/:date/:fileName', ctrl.getFile);

router.use(handleDBError);
router.use(handleMulterError);

module.exports = router;