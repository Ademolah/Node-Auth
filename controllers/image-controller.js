const Image = require('../models/image.js')
const {uploadToCloudinary} = require('../helpers/cloudinaryHelpers.js')
const fs = require('fs')

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
            message: `Something went wrong`
        })
    }
}

const fetchImages = async (req, res)=>{
    try {
        const image = await Image.find({})

        if(image){
            res.status(200).json({
                success: true,
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

module.exports = {uploadImage, fetchImages}