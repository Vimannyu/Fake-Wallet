const express = require('express');

// eslint-disable-next-line no-unused-vars
const User = require('../models/user');
const apiAuthController = require('../controllers/apiAuth');

const router = express.Router();

router.post('user/signup', apiAuthController.createUser );


router.post('user/login', apiAuthController.login);

module.exports = router;

