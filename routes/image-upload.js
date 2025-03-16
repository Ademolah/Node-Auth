const express = require('express')
const {uploadImage} = require('../controllers/image-controller.js')
const authMiddleware = require('../middleware/auth-middleware.js')
const adminMiddleware = require('../middleware/admin-middleware.js')
const uploadMiddleware = require('../middleware/upload-middleware.js')

const router = express.Router()


//upload image (only admin can upload images)
router.post('/uploadImage',authMiddleware,adminMiddleware,uploadMiddleware.single('image'), uploadImage)


//get images
router.get('/getImages', authMiddleware,)




module.exports = router