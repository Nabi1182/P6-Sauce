/***import modules***/
const express = require('express')
/*** models***/
const router = express.Router()

const authCtrl = require('../controllers/auth')


//route signup
router.post('/signup', authCtrl.createUser)
//route login
router.post('/login', authCtrl.loginUser)


module.exports = router