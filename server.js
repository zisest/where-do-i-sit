require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

const path = require('path')
const fetch = require('node-fetch')
const mongoose = require('mongoose')

const environment = process.env.NODE_ENV

const routes = require('./router')

// MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_LOCATION}/test?retryWrites=true&w=majority`, 
  {dbName: 'wheredoisit', useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Successfully connected to the database') 
})

/// ENABLING CORS FOR DEVELOPMENT
if (environment === 'development'){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}
///

app.use('/', routes)

app.listen(port, () => console.log(`Server is listening on port ${port}!`))
