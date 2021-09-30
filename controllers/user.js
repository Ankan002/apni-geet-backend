require('dotenv').config()
const User= require('../models/User')
const {validationResult}= require('express-validator')

exports.updateUser = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const userId= req.user
    const {firstname, lastname, username} = req.body

    try{
        let user= await User.findById(userId)

        if(!user){
            return res.status(404).json({
                message: 'No user with this id exists'
            })
        }

        const newUserId= {}

        if(firstname){newUserId.firstname= firstname}
        if(lastname){newUserId.lastname= lastname}
        if(username){
            const isUserNameThere= await User.findOne({username: username})

            if(isUserNameThere){
                return res.status(400).json({
                    error: 'Sorry a user exists with the same username'
                })
            }

            newUserId.username= username
        }

        user= await User.findByIdAndUpdate(userId, {$set: newUserId}, {new: true})

        res.json(user)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}