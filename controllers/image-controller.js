const Image = require('../models/image.js')
const {uploadToCloudinary} = require('../helpers/cloudinaryHelpers.js')
const fs = require('fs')
const cloudinary = require('../config/cloudinary.js')

const uploadImage = async (req, res)=>{

    try {

        //check if file is upload is missing
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'No file uploaded, please upload an image file'
            })
        }

        //upload image to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path)

        //store the url and publicId in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save()

        //delete file from local storage immediately after upload
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        })

        
    } catch (error) {
        console.error("Error ", error)
        res.status(500).json({
            success: false,
            message: `Something went wrong, ${error}`
        })
    }
}

const fetchImages = async (req, res)=>{
    try {

        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page -1) * limit;

        const sortBy = req.query.sortBy || 'createdBy'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages/limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        const image = await Image.find().sort(sortObj).skip(skip).limit(limit)

        if(image){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPage: totalPages,
                totalImages: totalImages,
                data: image
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        })
    }
}

const deleteImage = async (req, res)=>{
    try {
        
        const getCurrentImageId = req.params.id 
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentImageId)
        if(!image){
            return res.status(400).json({
                success: false,
                message: "No image with given Id"
            })
        }

        //check if image is uploaded by current user trying to delete
        if(userId !== image.uploadedBy.toString()){
            return res.status(403).json({
                success: false,
                message: "Sorry, you are not permitted to delete image you did not upload"
            })
        }

        //delete the image from the cloudinary storage
        await cloudinary.uploader.destroy(image.publicId)

        //delete image from mongodb
        await Image.findByIdAndDelete(getCurrentImageId)

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        })
    }
}

module.exports = {uploadImage, fetchImages, deleteImage}