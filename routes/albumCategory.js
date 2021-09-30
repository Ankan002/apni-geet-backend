require('dotenv').config()
const express= require('express')
const router= express.Router()
const {fetchUser, isAdmin}= require('../controllers/auth')
const {body} = require('express-validator')
const {createAlbumCategory, getAllAlbumCategories, deleteAlbumCategory, updateAlbumCategory} = require('../controllers/albumCategory')


//Get route to get all the Album Categories
router.get('/albumcategories', fetchUser, getAllAlbumCategories)



//Post route for creation of the Album Categories
router.post('/albumcategories/create',fetchUser, isAdmin, [
    body('title').isLength({min: 4}).withMessage('The title of the Album Category must be 4 characters long or more than that')
], createAlbumCategory)


//PUT route for updating the details of the Album Categories
router.put('/albumcategories/update/:id', fetchUser, isAdmin, [
    body('title').isLength({min: 4}).withMessage('The title of the Album Category must be 4 characters long or more than that')
],updateAlbumCategory)



//DELETE route for the deletion of a particular Album Category
router.delete('/albumcategories/delete/:id', fetchUser, isAdmin, deleteAlbumCategory)


module.exports= router