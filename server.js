require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

const path = require('path')

const environment = 'dev'
const rootPath = (environment == 'dev') ? path.join(__dirname, 'client','public') : path.join(__dirname, 'client','build')


///
const stationsData = require('./data/stations.json')
///
/// ENABLING CORS FOR DEVELOPMENT
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
///

app.use(express.static(rootPath))
app.get('/', (req, res) => res.sendFile('index.html', { root: rootPath }))

app.get('/api/getStations', (req, res) => {
    let query = req.query.s.toLowerCase()
    console.log('[/api/getStations]: query is: ' + query)
    let filtered = stationsData.filter(station => {
        let st = station.title.toLowerCase()
        return st.startsWith(query)
    })
    result = filtered.map(station => station.title)
    console.log('[/api/getStations]: result is: ' + result)
    res.send(result)
})


app.listen(port, () => console.log(`Server is listening on port ${port}!`))