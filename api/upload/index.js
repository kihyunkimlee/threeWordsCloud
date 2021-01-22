const express = require('express');
const router = express.Router();
const ctrl = require('./upload.ctrl');
const multer = require('multer');
const { createPath, makeDir } = require('../../lib');
const { handleMulterError, handleDBError } = require('../../middleware/errorHandler');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const newPath = createPath('uploads');

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
    limits: { fileSize: 3*1024*1024 },
});

router.post('', upload.single('file'), ctrl.uploadFile);

router.use(handleDBError);
router.use(handleMulterError);

module.exports = router;