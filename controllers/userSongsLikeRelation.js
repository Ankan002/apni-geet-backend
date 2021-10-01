require('dotenv').config()
const User= require('../models/User')
const Song= require('../models/Song')

//PUT Controller for updating number of likes and also adding and deleting song ids from the likedSong array of a particular user.
exports.updateLikes = async (req, res) => {
    const userId= req.user
    const songId= req.params.songId

    try{
        const user= await User.findById(userId)
        const song= await Song.findById(songId)
        let currentLikedSongsArray= user.likedsongs
    

        if(currentLikedSongsArray.includes(songId)){
            currentLikedSongsArray = removeElementsFromArray(currentLikedSongsArray, songId)
            let currentLikes= song.likes
            currentLikes -= 1

            const newUser= {}
            const newSong= {}

            if(currentLikedSongsArray){newUser.likedsongs= currentLikedSongsArray}
            newSong.likes= currentLikes

            const updatedUser= await User.findByIdAndUpdate(userId, {$set: newUser}, {new: true})
            const updatedSong= await Song.findByIdAndUpdate(songId, {$set: newSong}, {new: true})

            console.log(updatedSong)
            return res.json(updatedUser)
        }
        let currentLikes= song.likes

        currentLikedSongsArray.unshift(songId)
        currentLikes++

        const newUser= {}
        const newSong= {}

        if(currentLikedSongsArray){newUser.likedsongs= currentLikedSongsArray}
        if(currentLikes){newSong.likes= currentLikes}
        

        const updatedUser= await User.findByIdAndUpdate(userId, {$set: newUser}, {new: true})
        const updatedSong= await Song.findByIdAndUpdate(songId, {$set: newSong}, {new: true})

        console.log(updatedSong)
        res.json(updatedUser)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}



//Method for removing or filtering out certain elements from an array. Here we will be using `Array.filter(cb)` to do so.
const removeElementsFromArray = (arr, value) => {
    return arr.filter(element => element !== value)
}