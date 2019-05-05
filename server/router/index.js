const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');
const google = require('./google');

router.use('/register', register);
router.use('/login', login);
router.use('/oauth/google', google);


module.exports = router;