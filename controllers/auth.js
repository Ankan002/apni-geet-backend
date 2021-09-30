require('dotenv').config()
const User= require('../models/User')
const {validationResult} = require('express-validator')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Controller For Sign Up
exports.signup = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty){
        return res.status(400).json({errors: errors.array()})
    }

    try{

        let userName = await User.findOne({username: req.body.username})
        if(userName){
            return res.status(400).json({
                error: 'Sorry a user exists with the same username'
            })
        } 

        let userEmail = await User.findOne({email: req.body.email})
        if(userEmail){
            return res.status(400).json({
                error: 'Sorry a user exists with the same email id'
            })
        }

        const salt= await bcrypt.genSalt(10)
        const securedPassword= await bcrypt.hash(req.body.password, salt)

        const user= await User.create({
            firstname: req.body.firstname,
            lastname: (req.body.lastname) ? req.body.lastname : '',
            username: req.body.username,
            email: req.body.email,
            password: securedPassword
        })

        const data= {
            user: user._id
        }

        const authToken= jwt.sign(data, process.env.SECRET)

        res.json(authToken)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send({message: 'Internal Server Error'})
    }
}



//Controller For Login
exports.login = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    try{
        let user= await User.findOne({email})

        if(!user){
            return res.status(400).json({
                error: 'Please try again with correct credentials'
            })
        }

        let passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare){
            return res.status(400).json({
                error: 'Please try again with correct credentials'
            })
        }

        const data= {
            user: user.id
        }

        const authToken = jwt.sign(data, process.env.SECRET)

        res.json(authToken)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

//Router for getting a user
exports.getUser = async (req, res) => {
    try{
        const userId= req.user
        // console.log(userId)
        const user= await User.findById(userId).select("-password")
        // console.log(user.role)
        res.json(user)
    }
    catch(error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}



//Some custom controllers
exports.fetchUser = (req, res, next) => {
    const token= req.header('auth-token')

    if(!token){
        res.status(401).send({error: 'Please authenticate using a valid token'})
    }

    try{
        const data= jwt.verify(token, process.env.SECRET)

        req.user= data.user
        next()
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}

exports.isAdmin = async (req, res, next) => {
    const userId= req.user

    const user= await User.findById(userId)


    if(user.role === 0){
        return res.status(400).json({
            error: 'Access Denied'
        })
    }

    next()
}