const express= require('express')
const router= express.Router()
const {fetchUser, isAdmin}= require('../controllers/auth')
const {body}= require('express-validator')
const {
    createSong,
    getAllSongs,
    getSongsByAlbumId,
    getSongById,
    getSongByName,
    deleteSongById,
    updateSongById
}= require('../controllers/song')

//GET route for getting all the songs together. To do so you need to be logged in.
router.get('/song/getallsongs', fetchUser, getAllSongs)

//GET route for getting all the songs based on a particular albumId. To do so you need to be logged in.
router.get('/song/getbyalbumid/:id', fetchUser, getSongsByAlbumId)

//GET route for getting all the songs based on the song id. To do so you need to be logged in.
router.get('/song/songbyid/:id', fetchUser, getSongById)

//GET route for getting all the songs based on a particular name. To do so you need to be logged in.
router.get('/song/songbyname', fetchUser, getSongByName)


//POST route for creating a new Song. To do so you need to be user as well as an admin
router.post('/song/create', fetchUser, isAdmin, [
    body('title').isLength({min: 3}).withMessage('The name of the song has to be at least 3 alphabets long'),
    body('artist').isLength({min: 2}).withMessage('The name of the artist should be at least 2 alphabets long'),
    body('imageuri').isURL().isLength({min: 2}).withMessage('Image URI should be an URL as well as 2 characters long'),
    body('uri').isURL().isLength({min: 2}).withMessage('URL should be an URL as well as 2 characters long')
], createSong)

//PUT roue for updating a song. To do so you need to be user as well as an admin
router.put('/song/update/:id', fetchUser, isAdmin, [
        body('title').isLength({min: 3}).withMessage('The name of the song has to be at least 3 alphabets long'),
        body('artist').isLength({min: 2}).withMessage('The name of the artist should be at least 2 alphabets long'),
        body('imageuri').isURL().isLength({min: 2}).withMessage('Image URI should be an URL as well as 2 characters long'),
        body('uri').isURL().isLength({min: 2}).withMessage('URL should be an URL as well as 2 characters long')
    ], updateSongById)


//DELETE route for deleting a song. To do so you need to be user as well as an admin
router.delete('/song/delete/:id', fetchUser, isAdmin, deleteSongById)





//Exporting the routes
module.exports= router