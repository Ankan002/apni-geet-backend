require('dotenv').config()
const Playlist= require('../models/Playlist')
const User= require('../models/User')


//A PUT Route for adding or removing a song
exports.addOrRemoveFromPlaylist = async (req, res) => {
    const playlistId= req.params.playlistId
    const songId= req.params.songId
    const userIdFromToken= req.user
    
    try{
        const playlist= await Playlist.findById(playlistId)
        let songsInPlaylist= playlist.songs
        const userFromPlaylist= await User.findById(playlist.user)

        if(userIdFromToken !== userFromPlaylist.id){
            return res.status(401).json({
                message: 'Access Denied'
            })
        }
        
        if(songsInPlaylist.includes(songId)){
            songsInPlaylist= removeFromArray(songsInPlaylist, songId)

            const newPlaylist= {}

            if(songsInPlaylist){newPlaylist.songs= songsInPlaylist}

            const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId, {$set: newPlaylist}, {new: true})

            return res.json(updatedPlaylist)
        }

        songsInPlaylist.unshift(songId)

        const newPlaylist= {}

        if(songsInPlaylist){newPlaylist.songs= songsInPlaylist}

        const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId, {$set: newPlaylist}, {new: true})

        res.json(updatedPlaylist)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}

const removeFromArray = (arr, value) => {
    return arr.filter(element => element!==value)
}