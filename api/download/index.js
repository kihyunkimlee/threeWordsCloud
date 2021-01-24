const express = require('express');
const router = express.Router();
const ctrl = require('./download.ctrl');
const { handleDBError } = require('../../middleware/errorHandler');

router.post('', ctrl.downloadFile);

router.use(handleDBError);

module.exports = router;