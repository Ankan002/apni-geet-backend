const express = require('express')
const router= express.Router()
const {body}= require('express-validator')
const {fetchUser, isAdmin}= require('../controllers/auth')
const {
    updateUser
}= require('../controllers/user')


//PUT route for updating details of an user. To do so you obviously you need to be logged in.
router.put('/user/update/self', fetchUser, [
    body('firstname').isLength({min: 2}).withMessage('Your first name should be at least 2 alphabets long'),
    body('username').isLength({min: 4}).withMessage('Your username should be at least 4 characters long'),
], updateUser) 



module.exports= router