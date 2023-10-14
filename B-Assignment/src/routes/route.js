const express = require('express');
const router = express.Router();
const {createUser, loginUser, forgotPassword, resetPassword} = require('../cotrollers/userController')

router.post('/signup', createUser )


router.post('/login', loginUser)

router.post('/forgot-password', forgotPassword)

router.put('/reset-password', resetPassword);


module.exports = router;