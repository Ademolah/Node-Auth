const express = require('express')
const {registerUser, loginUser} = require('../controllers/auth-controller.js')

const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/loginUser',loginUser)

module.exports = router;