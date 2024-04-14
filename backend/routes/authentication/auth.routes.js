// auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controller/authentication/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:userId/sports-interests', authController.getSportList);

module.exports = router;
