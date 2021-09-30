const express = require('express')
const router= express.Router()
const {body}= require('express-validator')
const {fetchUser, isAdmin}= require('../controllers/auth')
const {
    updateUser,
    getUserByUsername,
    updateUserPermissions
}= require('../controllers/user')

//GET Route for getting an user using their Username. For now it will be considered as a private route only available for the admins to change a particular permission of that particular user.
router.get('/user/get/username', fetchUser, isAdmin, [
    body('username').isLength({min: 4}).withMessage('Your username should be at least 4 characters long')
], getUserByUsername)


//PUT Route for updating the permissions given to that particular user. First of all to do that task you need to be an admin.
router.put('/user/update/permission/:id', fetchUser, isAdmin, updateUserPermissions)


//PUT route for updating details of an user. To do so you obviously you need to be logged in.
router.put('/user/update/self', fetchUser, [
    body('firstname').isLength({min: 2}).withMessage('Your first name should be at least 2 alphabets long'),
    body('username').isLength({min: 4}).withMessage('Your username should be at least 4 characters long'),
], updateUser) 



module.exports= router