require('dotenv').config()
const express= require('express')
const router= express.Router()
const {body}= require('express-validator')
const {signup, login, fetchUser, getUser} = require('../controllers/auth')

//SignUp Route. Does not require to be authenticated or logged in
router.post('/user/signup', [
    body('firstname').isLength({min: 2}).withMessage('Your first name should be at least 2 alphabets long'),
    body('email').isEmail().withMessage('Enter a valid Email id'),
    body('username').isLength({min: 4}).withMessage('Your username should be at least 4 characters long'),
    body('password').isLength({min: 8}).withMessage('Your password should be at least 8 characters long')
], signup)



//LogIn Route. Does not required to be authenticated or logged in
router.post('/user/login', [
    body('email').isEmail().withMessage('Please Enter a valid email id'),
    body('password').isLength({min: 8}).withMessage('Your password should be at least 8 characters long')
], login)



//Get User details. You need to be authenticated as well as logged in
router.get('/user/getuser', fetchUser, getUser)



//Exporting the Router
module.exports = router