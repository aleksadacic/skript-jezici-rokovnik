const express = require('express');
const kontroler = require('../controller/signature');

const router = express.Router();

router.use(express.json());

router.get('/', kontroler.showSignature);

router.post('/novi', kontroler.newSignature);

module.exports = router;