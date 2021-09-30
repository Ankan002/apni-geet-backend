const express= require('express')
const router= express.Router()
const {body}= require('express-validator')
const {fetchUser, isAdmin}= require('../controllers/auth')
const{
    createPlaylist,
    deletePlaylistById,
    getPlaylistsCreatedByAUser,
    getAllPlaylists,
    getPlaylistById,
    getPublicPlaylistByName,
    updatePlaylistById
}= require('../controllers/playlist')

//GET Route for getting all the playlists ever created and available on the data base. To do so, you need to be logged in as well as an admin
router.get('/playlist/getall', fetchUser, isAdmin, getAllPlaylists)

//GET Route for getting a playlist by id. You need to to be looged in for that
router.get('/playlist/getplaylistid/:id', fetchUser, getPlaylistById)

//GET Route for getting all the playlists created by particular user. For this that person needs to logged in as we will only show the playlists created by that person
router.get('/playlist/myplaylists', fetchUser, getPlaylistsCreatedByAUser)

//GET Route for getting a playlist bu name. It will be accessble by everybody but the Playlists that has been marked as public.
router.get('/playlist/playlistbyname', fetchUser, getPublicPlaylistByName)

//POST route for creating a new Playlist. To create a new playlist the user needs to be signed in.
router.post('/playlist/create', fetchUser, [
    body('title').isLength({min: 4}).withMessage('The length of the title of the playlist must be at least 4 characters long')
], createPlaylist)

//PUT route for updating an existing playlist. To update an existing playlist you need to be signed in as well as the owner of that particular playlist.
router.put('/playlist/update/:id', fetchUser, [
    body('title').isLength({min: 3}).withMessage('The length if the title of the playlist must be at least 4 characters long')
], updatePlaylistById)

//DELETE route for deleting a Playlist. To delet a playlist you need to be signed in.
router.delete('/playlist/delete/:id', fetchUser, deletePlaylistById)

module.exports= router