/***import modules***/
const express = require('express')
const router = express.Router()
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth_token')
/*** models***/

const SaucesCtrl = require('../controllers/sauces')
//route get sauce 1
router.get('/', auth, SaucesCtrl.getSauce)

//route get one sauce 2
router.get('/:id', auth, SaucesCtrl.getOneSauce) 

//route ajout sauce 3
router.post('/', auth, multer, SaucesCtrl.createSauce)

//route put update oen sauce 4
router.put('/:id', auth, multer, SaucesCtrl.updateOneSauce)

router.delete('/:id', auth, SaucesCtrl.deleteSauce)

router.post('/:id/like', auth, SaucesCtrl.likedSauce)

module.exports = router