const express= require('express')
const router= express.Router()
const {fetchUser}= require('../controllers/auth')
const {updateLikes}= require('../controllers/userSongsLikeRelation')


//PUT route for updating the number off likes as well as updating the liked songs array present in the user.
router.put('/user/song/likes/:songId', fetchUser, updateLikes)




module.exports= router