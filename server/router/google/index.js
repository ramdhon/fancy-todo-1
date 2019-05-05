const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');


router.post('/login', UserController.glogin );
router.post('/register', UserController.gregister );


module.exports = router;