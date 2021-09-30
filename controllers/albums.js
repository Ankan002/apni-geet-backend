require('dotenv').config()
const Album = require('../models/Album')
const {validationResult} = require('express-validator')

//Common Album Category id: 614c0daed859bb31fa0cf278
//Creating a new Album after having the permission of doing so
exports.createAlbum = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    try{
        const newAlbum= await Album.create({
            title: req.body.title,
            albumcategory: (req.body.albumcategory === '') ? '614c0daed859bb31fa0cf278' : req.body.albumcategory,
            artist: req.body.artist,
            movie: (req.body.movie === '') ? '' : req.body.movie,
            imageuri: req.body.imageuri
        })

        res.json(newAlbum)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}


//Get Route for fetching all the available albums
exports.getAllAlbums = async (req, res) => {
    try{
        const allAlbums= await Album.find().exec()
        res.json(allAlbums)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}


//Get Route for fetching an album by its id
exports.getAlbumById = async (req, res) => {

    const albumId= req.params.id

    try{
        const album= await Album.findById(albumId)

        res.json(album)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}


//Get Route for fetching all albums with a particular Album Category Id
exports.getAlbumByAlbumCategoryId = async (req, res) => {
    const albumCategoryId= req.params.id
    
    try{
        const albums= await Album.find({albumcategory: albumCategoryId})
        res.json(albums)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}


//Get Route for fetching all albums with a particular Album Name
exports.getAlbumByAlbumName = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {title} = req.body

    try{
        const count= await Album.countDocuments({title}).exec()

        if(count < 1){
            return res.json([])
        }

        const album = await Album.find({title}).exec()

        res.json(album)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}



//Put Route for updating an album
exports.updateAlbumById = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {title, albumcategory, artist, movie, imageuri} = req.body
    const albumId= req.params.id 

    try{
        const newAlbum= {}
        
        if(title){newAlbum.title= title}
        if(albumcategory){newAlbum.albumcategory= albumcategory}
        if(artist){newAlbum.artist=artist}
        if(movie){newAlbum.movie= movie}
        if(imageuri){newAlbum.imageuri= imageuri}

        let album= await Album.findById(albumId)

        if(!album){
            return res.status(404).json({
                message: 'Data not found'
            })
        }

        album= await Album.findByIdAndUpdate(albumId, {$set: newAlbum}, {new: true})

        res.json(album)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}




//Delete Route for deleting an album
exports.deleteAlbumById = async (req, res) => {
    const albumId= req.params.id

    try{
        let album= await Album.findById(albumId)

        if(!album){
            return res.status(404).json({
                message: 'Data not found'
            })
        }

        album= await Album.findByIdAndDelete(albumId)

        res.json(album)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
} 