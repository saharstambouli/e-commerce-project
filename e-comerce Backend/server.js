const express = require('express')
require ('dotenv').config()
const mongoose = require('mongoose');
const connectToMongo = require('./helpers/db.connect')
const app = express()
const cors = require('cors');


const port = process.env.PORT || 8000
// Enable CORS for all routes and all methods
app.use(cors()); 

app.use(express.json())

app.use('/uploads', express.static('uploads'));


 app.use('/User',require('./Routes/User.routes'))
 
 app.use('/Product',require('./Routes/Product.routes'))





app.listen(port,(err)=>{
    err? console.log('err', err) : console.log(`Server is running on port : ${port}`)
})
connectToMongo()
