const express = require('express');
const kontroler = require('../controller/signature');

const router = express.Router();

router.use(express.json());

// router.get('/', kontroler.showSignature);

router.post('/novi', kontroler.newSignature);
router.get('/login/:name/:pass', kontroler.login);
router.get('/logout', kontroler.logout);
router.get('/load', kontroler.load);

module.exports = router;