const express= require('express')
const router= express.Router()
const {fetchUser, isAdmin}= require('../controllers/auth')
const {addOrRemoveFromPlaylist}= require('../controllers/addSongToPlaylist')


//A PUT route for either adding song to playlist 
router.put('/playlist/add/remove/:playlistId/:songId', fetchUser, addOrRemoveFromPlaylist)



module.exports= router