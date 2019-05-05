const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');
const google = require('./google');
const user = require('./user');
const todos = require('./todos');

router.use('/register', register);
router.use('/login', login);
router.use('/oauth/google', google);

router.use('/user', user);
router.use('/todos', todos);


module.exports = router;