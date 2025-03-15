const bcrypt = require('bcrypt')
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
        }, process.env.JWT_SECRET_KEY, {expiresIn: '15m'})


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

module.exports =  {registerUser, loginUser}