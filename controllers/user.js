require('dotenv').config()
const User= require('../models/User')
const {validationResult}= require('express-validator')


//PUT Controller for updating the basic details of a particular user. You essentially need to be logged in to do so, but you need not be an admin for that particular purpose.
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


//GET Controller for getting a particular by their Username. This route is completely restricted to the Admin as of now for changing the permission access of a particular user.
exports.getUserByUsername = async (req, res) => {

    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {username}= req.body

    try{
        const numberOfUsersAvailable= await User.countDocuments({username: username})

        if(numberOfUsersAvailable < 1){
            return res.json([])
        }

        const user= await User.find({username: username}).exec()

        res.json(user)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}

//PUT Controller for updating the permissions of a particular user. To do so, you need to be an admin.
exports.updateUserPermissions = async (req, res) => {
    const id= req.params.id
    const {role} = req.body

    try{

        if((parseInt(role) < 0) || (parseInt(role) > 1)){
            return res.status(400).json({
                message: 'Roles can only be 0 or 1'
            })
        }

        const newUserPermissions= {}

        if(role){newUserPermissions.role= parseInt(role)}

        const newUser= await User.findByIdAndUpdate(id, {$set: newUserPermissions}, {new: true})

        res.json(newUser)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
}