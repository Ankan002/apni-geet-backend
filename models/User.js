require('dotenv').config()
const mongoose= require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    firstname: {
        type: String,
        minlength: 2,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
        default: '',
    },
    email: {
        type: String,
        minlength: 4,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        minlength: 4,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    likedsongs: {
        type: Array,
        default: [],
    },
    role: {
        type: Number,
        default: 0
    },
    follower: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)