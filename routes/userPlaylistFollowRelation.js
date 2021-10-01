const express= require('express')
const router= express.Router()
const {fetchUser, isAdmin}= require('../controllers/auth')
const {updateFollowers}= require('../controllers/userPlaylistFollowRelation')


//PUT route for updating the playlist followed array as well as the number of followers of that playlist. You need to be logged in to do so.
router.put('/user/playlist/followers/:playlistId', fetchUser, updateFollowers)



module.exports= router