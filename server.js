require('dotenv').config()

const express = require('express')
const connectDB = require('./database/db.js')
const authRoute = require('./routes/auth-routes.js')
const homeRoute = require('./routes/home-routes.js')
const adminRoute = require('./routes/admin-routes.js')
const upgradeRoute = require('./helpers/upgrade-user.js')
const downgradeRoute = require('./helpers/downgrade-user.js')
const imageRoute = require('./routes/image-routes.js')
const changePasswordRoute = require('./routes/change-password.js')
const fetchUsersRoute = require('./routes/fetch-users.js')


const app = express()

app.use(express.json())

connectDB()

app.use('/api/auth', authRoute)
app.use('/api/home', homeRoute)
app.use('/api/admin', adminRoute)
app.use('/api/upgrade', upgradeRoute)
app.use('/api/downgrade', downgradeRoute)
app.use('/api/images', imageRoute)
app.use('/api/v1/password', changePasswordRoute)
app.use('/api/v1', fetchUsersRoute)



PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})