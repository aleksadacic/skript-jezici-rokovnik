const express = require('express');
const kontroler = require('../controller/notes');

const router = express.Router();

router.use(express.json());

router.get('/', kontroler.showNotes);

router.post('/novi', kontroler.newNote);
router.post('/delete', kontroler.deleteNote);
router.post('/update', kontroler.updateNote);

module.exports = router;