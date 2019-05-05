const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');
const gverify = require('../../middlewares/gverify');


router.post('/login', gverify, UserController.glogin );
router.post('/register', UserController.gregister );


module.exports = router;