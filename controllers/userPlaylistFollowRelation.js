require('dotenv').config()
const User= require('../models/User')
const Playlist= require('../models/Playlist')

//PUT Controller for updating the playlist followed array and also the number of playlist followers.
exports.updateFollowers = async (req, res) => {
    const userId= req.user
    const playlistId= req.params.playlistId

    try{
        const user= await User.findById(userId)
        const playlist= await Playlist.findById(playlistId)
        let currentFollowedPlaylistArray= user.followedplaylists

        if(playlist.access === 'Private'){
            return res.status(400).json({
                message: 'Private Playlists cannot be followed'
            })
        }

        if(currentFollowedPlaylistArray.includes(playlistId)){
            currentFollowedPlaylistArray= removeElementsFromArray(currentFollowedPlaylistArray, playlistId)
            let playlistFollowers= playlist.followers
            playlistFollowers--

            const newUser= {}
            const newPlaylist= {}

            newUser.followedplaylists= currentFollowedPlaylistArray
            newPlaylist.followers= playlistFollowers

            const updatedUser= await User.findByIdAndUpdate(userId, {$set: newUser}, {new: true})
            const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId, {$set: newPlaylist}, {new: true})

            console.log(updatedPlaylist)
            return res.json(updatedUser)
        }

        currentFollowedPlaylistArray.unshift(playlistId)
        let playlistFollowers= playlist.followers
        playlistFollowers++

        const newUser= {}
        const newPlaylist= {}

        newUser.followedplaylists= currentFollowedPlaylistArray
        newPlaylist.followers= playlistFollowers

        const updatedUser= await User.findByIdAndUpdate(userId, {$set: newUser}, {new: true})
        const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId, {$set: newPlaylist}, {new: true})

        console.log(updatedPlaylist)
        res.json(updatedUser)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}

//A function to remove a particular element from an array
const removeElementsFromArray = (arr, value) => {
    return arr.filter(element => element !== value)
}