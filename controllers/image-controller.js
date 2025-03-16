const Image = require('../models/image.js')
const {uploadToCloudinary} = require('../helpers/cloudinaryHelpers.js')

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

module.exports = {uploadImage}