require('dotenv').config()
const {validationResult}= require('express-validator')
const Playlist= require('../models/Playlist')
const User= require('../models/User')

//GET Controller for fetching all the playlists created by a particular user. A playlist should only be available to an user who created it.
exports.getPlaylistsCreatedByAUser = async (req, res) => {
    const userId= req.user

    try{

        const numberOfPlaylists= await Playlist.countDocuments({user: userId})

        if(numberOfPlaylists < 1){
            return res.json([])
        }

        const playLists= await Playlist.find({user: userId}).exec()

        res.json(playLists)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET Controller for fetching all the playlist ever created and avalble on the data base. You need to be logged in as well as an admin to do so.
exports.getAllPlaylists = async (req, res) => {
    try{
        const numberOfPlayLists= await Playlist.countDocuments()

        if(numberOfPlayLists < 0){
            return res.json([])
        }

        const allPlaylists= await Playlist.find().exec()

        res.json(allPlaylists)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET controller for getting a playlist by id. You need to be logged in.
exports.getPlaylistById = async (req, res) => {
    const playlistId= req.params.id

    try{
        const playlist= await Playlist.findById(playlistId)

        if(!playlist){
            return res.status(404).json({message: 'Data Not Found'})
        }

        res.json(playlist)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//GET Controller for getting playlists by name. It will be public so only playlists marked with public access will be available.
exports.getPublicPlaylistByName = async (req, res) => {
    const titleFromBody= req.body.title

    try{
        const numOfPlaylists= await Playlist.countDocuments({title: titleFromBody, access: 'Public'}).exec()

        if(numOfPlaylists < 1){
            return res.json([])
        }

        const playlist= await Playlist.find({title: titleFromBody, access: 'Public'}).exec()

        res.json(playlist)
    }
    catch(error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}


//POST controller for creating a new playlist. You need to be logged in to do so.
exports.createPlaylist = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const userId= req.user

    try{
        const user= await User.findById(userId)

        if(!user){
            return res.status(400).json({
                message: 'User not found'
            })
        }

        const newPlaylist= new Playlist({
            user: userId,
            title: req.body.title,
            creator: user.firstname,
            access: (!req.body.access) ? 'Public' : req.body.access
        })

        let playList= await newPlaylist.save()

        res.json(playList)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//PUT Controller for updating an existing user playlist. You need to be logged in to do so as well as you need to be the same user who created it.
exports.updatePlaylistById = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const idFromToken = req.user
    const playListId= req.params.id
    const {title, access} = req.body

    try{
        const user= await User.findById(idFromToken)

        if(idFromToken !== user.id){
            return res.status(401).json({
                message: 'Access Denied'
            })
        }

        const newPlaylist= {}

        if(title){newPlaylist.title= title}
        if(access){newPlaylist.access= access}

        let playlist= await Playlist.findById(playListId)

        if(!playlist){
            return res.status(404).json({
                message: 'Data Not Found!'
            })
        }

        playlist= await Playlist.findByIdAndUpdate(playListId, {$set: newPlaylist}, {new: true})

        res.json(playlist)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}

//DELETE Controller for deleting an existing user playlist. You need to be logged in to do so as well as you need to be the same user who created it.
exports.deletePlaylistById = async (req, res) => {
    try{
        const playlist= await Playlist.findById(req.params.id)

        //Finding the creator object id
        const creatorId= playlist.user

        //Finding the creator id
        const user= await User.findById(creatorId)

        //Matching if the creator id is same as the user who is accessing it i.e. from req.user
        if(req.user !== user.id){
            return res.status(401).json({message: 'Access Denied'})
        }

        const playlistDeleted= await Playlist.findByIdAndDelete(req.params.id)

        res.json(playlistDeleted)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}