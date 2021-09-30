const mongoose= require('mongoose')
const {Schema} = mongoose

const albumCategorySchema = new Schema({
    title: {
        type: String,
        minlength: 4,
        required: true,
        trim: true,
        unique: true,
    }
},{timestamps: true})

module.exports = mongoose.model('AlbumCategory', albumCategorySchema)