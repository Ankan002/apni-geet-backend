require('dotenv').config()
const Song= require('../models/Song')
const {validationResult}= require('express-validator')

//GET Controller for getting all the songs together
exports.getAllSongs = async (req, res) => {
    try{
        const allSongs= await Song.find().exec()

        res.json(allSongs)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET Controller for getting all the together but according to a particular album id
exports.getSongsByAlbumId = async (req, res) => {

    const albumId= req.params.id

    try{
        const numberOfSongs = await Song.countDocuments({album: albumId}).exec()

        if(numberOfSongs < 1){
            return res.json([])
        }

        const songs= await Song.find({album: albumId}).exec()

        res.json(songs)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET Route for getting songs by its id.
exports.getSongById = async (req, res) => {

    const songId= req.params.id

    try{
        const song= await Song.findById(songId)

        if(!song){
            return res.status(404).json({
                message: 'Data Not Found!'
            })
        }

        res.json(song)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET Controller for finding song by name.
exports.getSongByName = async (req, res) => {
    const {title} = req.body

    try{
        const numberOfSongsFound= await Song.countDocuments({title: title}).exec()

        if(numberOfSongsFound < 1){
            return res.json([])
        }

        const song= await Song.find({title: title}).exec()

        res.json(song)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//POST Controller for creating a new Song
exports.createSong = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        res.status(400).json(errors.array())
    }

    try{
        const newSong= await Song.create({
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            imageuri: req.body.imageuri,
            uri: req.body.uri
        })

        res.json(newSong)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//PUT Controller for updating a song
exports.updateSongById = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {title, artist, album, imageuri, uri} = req.body
    const songId= req.params.id

    try{
        const newSong= {}

        if(title){newSong.title= title}
        if(artist){newSong.artist= artist}
        if(album){newSong.album= album}
        if(imageuri){newSong.imageuri= imageuri}
        if(uri){newSong.uri= uri}

        let song= await Song.findById(songId)

        if(!song){
            return res.status(404).json({
                message: 'DATA Not Found'
            })
        }

        song= await Song.findByIdAndUpdate(songId, {$set: newSong}, {new: true})

        res.json(song)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}


//DELETE Controller for deleting a song
exports.deleteSongById = async (req, res) => {
    const songId= req.params.id

    try{
        let song= await Song.findById(songId)

        if(!song){
            return res.status(404).json({
                message: 'Data Not Found!'
            })
        }

        song= await Song.findByIdAndDelete(songId)

        res.json(song)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}