const express = require('express');
const kontroler = require('../controller/todos');

const router = express.Router();

router.use(express.json());

router.get('/', kontroler.showTodos);
router.post('/novi', kontroler.newTodo);
router.post('/delete', kontroler.deleteTodo);
router.post('/update', kontroler.updateTodo);

module.exports = router;