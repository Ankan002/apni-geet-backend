require('dotenv').config()
const AlbumCategory = require('../models/AlbumCategory')
const {validationResult} = require('express-validator')
const { re } = require('semver')

//Common Album Category id: 614c0daed859bb31fa0cf278
//To get all Album Categories
exports.getAllAlbumCategories = async (req, res) => {
    try{
        const allCategories = await AlbumCategory.find().exec()

        res.json(allCategories)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}




//To Create a new Album Category
exports.createAlbumCategory = async (req, res) => {
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {title} = req.body

    try{

        const isCategoryThere= await AlbumCategory.findOne({title})

        if(isCategoryThere){
            return res.status(400).json({
                message: 'Another Album Category with the same title already exists. Either edit is there or to create a new one please delete the older one....'
            })
        }


        const albumCategory = new AlbumCategory({
            title
        })

        const newAlbumCategory =  await albumCategory.save()

        res.json(newAlbumCategory)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}



//To update a particular Album Category
exports.updateAlbumCategory = async (req, res) => {

    const errors= validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const {title} = req.body

    try{

        const newAlbumCategory = {}

        if(title){newAlbumCategory.title= title}

        let albumCategory = await AlbumCategory.findById(req.params.id)

        if(!albumCategory){
            return res.status(404).json({message: 'No such Album Category can be found'})
        }

        albumCategory = await AlbumCategory.findByIdAndUpdate(req.params.id, {$set: newAlbumCategory}, {new: true})

        res.json(albumCategory)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}




//To delete a particular Album Category
exports.deleteAlbumCategory = async (req, res) => {
    try{
        let albumCategory = await AlbumCategory.findById(req.params.id)

        if(!albumCategory){
            return res.status(404).json({
                message: 'Data not found'
            })
        }

        albumCategory = await AlbumCategory.findByIdAndDelete(req.params.id)

        res.json({albumCategory})
    }
    catch(error){
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}