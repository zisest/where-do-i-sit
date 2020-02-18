require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

const path = require('path')
const fetch = require('node-fetch');

const environment = process.env.NODE_ENV

const routes = require('./router')

///
const stationsData = require('./data/stations.json')
const trainSeatsData = require('./data/trains.json')
///
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
