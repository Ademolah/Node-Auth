const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next)=>{
    
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        })
    }

    //decode the token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)

        console.log(decodedTokenInfo)

        req.userInfo = decodedTokenInfo
        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            message: `Somthing went wrong: ${error}`
        })
    }

}

module.exports = authMiddleware