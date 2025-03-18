const {fetchUsers} = require('../controllers/auth-controller.js')
const express = require('express')
const authMiddleware = require('../middleware/auth-middleware.js')
const adminMiddleware = require('../middleware/admin-middleware.js')



const router = express.Router()

router.get('/fetchUsers',authMiddleware, adminMiddleware, fetchUsers)

module.exports = router