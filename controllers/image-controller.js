const Image = require('../models/image.js')

const uploadImage = async (req, res)=>{
    try {
        if(!req.file){
            res.status(400).json({
                success: false,
                message: 'No file uploaded, please upload an image file'
            })
        }
        
    } catch (error) {
        console.error("Error ", error)
        res.status(500).json({
            success: false,
            message: `Something went wrong`
        })
    }
}