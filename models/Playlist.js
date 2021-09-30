require('dotenv').config()
const mongoose= require('mongoose')
const {Schema} = mongoose
const {ObjectId} = mongoose.Schema

const playlistSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        minlength: 4,
        required: true,
        trim: true,
    },
    creator: {
        type: String
    },
    songs: {
        type: Array,
        default: [],
    },
    access: {
        type: String,
        default: 'Public',
        enum: ['Public', 'Private'],
    },
    updated: Date,
    followers: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Playlist', playlistSchema)