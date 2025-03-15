

const isAdminUser = (req,res, next)=>{
    
    //the userInfo is gotten from the token during login
    if(req.userInfo.role !== 'admin'){
        res.status(401).json({
            success: false,
            message: 'Access denied, Only Admin Authorized!'
        })
    }

    next()
}

module.exports = isAdminUser