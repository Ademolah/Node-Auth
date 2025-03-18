const express = require('express')
const {changePassword} = require('../controllers/auth-controller.js')
const authMiddleware = require('../middleware/auth-middleware.js')

const router = express.Router()

router.post('/changePassword/:id',authMiddleware, changePassword)



module.exports = router;
