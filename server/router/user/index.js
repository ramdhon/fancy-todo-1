const express = require('express');
const router = express.Router();

const TodoController = require('../../controllers/todo');
const Authenticate = require('../../middlewares/authenticate');

router.use(Authenticate);

router.get('/todos', TodoController.findAllAuth);


module.exports = router;