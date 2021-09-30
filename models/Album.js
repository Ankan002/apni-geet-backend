const mongoose= require('mongoose')
const {Schema} = mongoose
const {ObjectId} =mongoose.Schema

const albumSchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        trim: true,
        required: true
    },
    albumcategory: {
        type: ObjectId,
        ref: 'AlbumCategory'
    },
    artist: {
        type: String,
        minlength: 2,
        required: true,
        trim: true,
    },
    movie: {
        type: String,
        trim: true
    },
    imageuri: {
        type: String,
        min: 2,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Album', albumSchema)