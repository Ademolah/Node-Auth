const bcrypt = require('bcryptjs')
const User = require('../models/user-model.js')
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async (req, res)=>{
    try {
        const {username, email, password, role} = req.body
        

        //check if username or email is already stored in database
        const checkExistingUser = await User.findOne({$or: [{username}, {email}]})

        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message:'This email or username already exist'
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: newUser
            })
        }else {
            res.status(400).json({
                success: false,
                message: 'Something went wrong'
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Something went wrong: ${error}`
        })
    }
}


//login controller
const loginUser = async (req, res)=>{
    try {
        const {username, password} = req.body

        //check if user is in database
        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found or Invalid credentials"
            })
        }

        //check if password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Login credentials"
            })
        }

        //create access token 
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: '20m'})


        res.status(200).json({
            success: true,
            message: 'Logged in successful',
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Invalid username or password'
        })
    }
}


const changePassword = async (req, res)=>{
    try {
        const userId = req.userInfo.userId
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(userId)
        console.log(userId)

        if(!user){
            return res.status(404).json({
                success: false,
                message: `No user with this Id`
            })
        }

        //compare old and new password
        const checkCurrentPassword = await bcrypt.compare(oldPassword, user.password)

        if(!checkCurrentPassword){
            return res.status(400).json({
                success: false,
                message: "Pasword does not match with current password"
            })
        }
        
        //check if old and new password are same
        if(newPassword === oldPassword){
            return res.status(400).json({
                success: false,
                message: "Old password cannot be the same as new password"
            })
        }
        

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Invalid username or password'
        })
    }
}

const fetchUsers = async (req, res)=>{
    try {
        //add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page -1) * limit

        //sorting
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc'? 1 : -1;
        const totalUsers = await User.countDocuments()
        const totalPages = Math.ceil(totalUsers/limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder


        const users = await User.find().sort(sortObj).skip(skip).limit(limit)

        res.status(200).json({
            success: true,
            page: page,
            totalPages: totalPages,
            totalUsers: totalUsers,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Invalid username or password'
        })
    }
}

module.exports =  {registerUser, loginUser, changePassword, fetchUsers}