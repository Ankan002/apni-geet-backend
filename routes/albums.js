const express= require('express')
const router= express.Router()
const {body}= require('express-validator')
const {fetchUser, isAdmin}= require('../controllers/auth')
const {
    createAlbum, 
    getAllAlbums, 
    getAlbumById, 
    getAlbumByAlbumCategoryId, 
    getAlbumByAlbumName,
    deleteAlbumById,
    updateAlbumById
}= require('../controllers/albums')

//A GET Route to get all the albums together
router.get('/album/getallalbums', fetchUser, getAllAlbums)

//A GET Route to get an album by its id
router.get('/album/:id', fetchUser, getAlbumById)

//A GET Route to get all the albums with a particular Album Category Id
router.get('/album/albumcategory/:id', fetchUser, getAlbumByAlbumCategoryId)

//A GET Route to get all the albums with a particular Album Name
router.get('/album/getallalbums/albumname', fetchUser, [
    body('title').isLength({min: 1}).withMessage('Please Enter something to search for....')
],getAlbumByAlbumName)



//A POST Route for creating an album under an album category
router.post('/album/create', fetchUser, isAdmin, [
    body('title').isLength({min: 4}).withMessage('The length of the title should be at least 4 alphabets long'),
    body('artist').isLength({min: 2}).withMessage('The length of the name of the artist should be at least 2 alphabets long'),
    body('imageuri').isURL().isLength({min: 2}).withMessage('The image URI should be a valid url as well as at least 3 alphabets long.')
], createAlbum)


//A PUT Route for updating certain details in 
router.put('/album/update/:id', fetchUser, isAdmin, [
    body('title').isLength({min: 4}).withMessage('The length of the title should be at least 4 alphabets long'),
    body('artist').isLength({min: 2}).withMessage('The length of the name of the artist should be at least 2 alphabets long'),
    body('imageuri').isURL().isLength({min: 2}).withMessage('The image URI should be a valid url as well as at least 3 alphabets long.')
], updateAlbumById)



//A DELETE Route for deleting an album
router.delete('/album/delete/:id', fetchUser, isAdmin, deleteAlbumById)




module.exports = router