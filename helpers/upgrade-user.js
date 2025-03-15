const express = require('express')
const User = require('../models/user-model.js')

const router = express.Router()

router.get('/upgradeUser/:id', async (req, res)=>{
    try {
        const userId = req.params.id

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                success: false,
                message: 'No user with the ID'
            })
        }else {
            if(user.role === 'user'){
                user.role = 'admin'
                res.status(200).json({
                    success: true,
                    message: `${user.username} has been upgraded successfully`,
                    data: user
                })

                await user.save()
            }else{
                res.status(200).json({
                    message: "User is already an admin"
                })
            }
            
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        })
    }

})


module.exports = router;