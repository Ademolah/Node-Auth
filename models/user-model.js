const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, maxLength: 20, minLength: 3, trim: true},
    email: {type: String, required: true, maxLength: 20, minLength:5, lowercase: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    // createdAt: {type: Date, default: Date.now()}
}, {timestamps: true})


const User = mongoose.model('User', UserSchema)

module.exports = User;