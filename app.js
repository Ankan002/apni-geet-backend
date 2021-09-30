//imports
require('dotenv').config()
const express = require('express')
const cors= require('cors')
const connectToMongo= require('./db')
const app = express()

//importing Routes
const authRoutes = require('./routes/auth')
const albumCategoryRoutes = require('./routes/albumCategory')
const albumRoutes = require('./routes/albums')
const songRoutes = require('./routes/song')
const playlistRoutes= require('./routes/playlist')
const userRoutes= require('./routes/user')

//DataBase Connection
connectToMongo()

//middleware declaration
app.use(express.json())
app.use(cors())

//All the routing
app.use('/api', authRoutes)
app.use('/api', albumCategoryRoutes)
app.use('/api', albumRoutes)
app.use('/api', songRoutes)
app.use('/api', playlistRoutes)
app.use('/api', userRoutes)

//Declaring the PORT number
const port = process.env.PORT || 8000

//Running Port
app.listen(port, () => console.log(`Running at ${port}`))