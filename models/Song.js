const mongoose= require('mongoose')
const { Schema } = mongoose
const {ObjectId} = mongoose.Schema

const songSchema = new Schema({
    title: {
        type: String,
        minlength: 3,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        minlength: 2,
        required:true,
        trim: true,
    },
    album: {
        type: ObjectId,
        ref: 'Album',
    },
    imageuri: {
        type: String,
        minlength: 2,
        required: true,
    },
    uri: {
        type: String,
        minlength: 2,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Song', songSchema)