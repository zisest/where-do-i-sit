require('dotenv').config()

const express = require('express')
const router = express.Router()

const fetch = require('node-fetch');
const path = require('path')

const environment = process.env.NODE_ENV
const rootPath = (environment === 'development') ? path.join(__dirname, 'client','public') : path.join(__dirname, 'client','build')


////DATA:
const stationsData = require('./data/stations.json')
const trainSeatsData = require('./data/trains.json')
////

router.use(express.static(rootPath))

router.get('/api/getStations', (req, res) => {
    let query = req.query.s.toLowerCase()
    console.log('[/api/getStations]: query is: ' + query)
    let startsWithQuery = stationsData.filter(station => {
        let st = station.title.toLowerCase()
        return st.startsWith(query)
    })
    let includesQuery = stationsData.filter(station => {
        let st = station.title.toLowerCase()
        return (!st.startsWith(query) && st.includes(query))
    })
    let filtered = startsWithQuery.concat(includesQuery)
    result = filtered.map(station => station.title)
    console.log('[/api/getStations]: result is: ' + result)
    res.send(result)
})

router.get('/api/getTimetable', (req, res) => {
    let query = req.query.s.toLowerCase()
    let fromIndex = req.query.from
    let toIndex = req.query.to
    let stationCode = ''

    console.log('[/api/getTimetable]: query is: ' + query, fromIndex, toIndex)
    stationsData.forEach(station => {
        if (station.title.toLowerCase() === query) stationCode = station.codes.yandex_code        
    });
    if (stationCode !== ''){        
        let currentTS = Date.now()
        let currentDate = new Date(currentTS)
        let date = parseDate(currentDate)
        console.log(stationCode, date)
        fetch(`https://api.rasp.yandex.net/v3.0/schedule/?station=${stationCode}&limit=200&date=${date}&transport_types=suburban`,
            { method: 'GET', headers: { 'Authorization': process.env.YANDEX_API_KEY }})
        .then(yandexRes => yandexRes.json())
        .then(yandexRes => {    
            console.log(yandexRes)
            if (yandexRes.error !== undefined) throw yandexRes.error.text           
            let upcoming = yandexRes.schedule.filter(t => Date.parse(t.departure) > currentTS)
            let requested = upcoming.filter((t, index) => (index >= fromIndex) && (index <= toIndex))            
            let result = requested.map(t => {
                let toSend = {}
                toSend = (trainSeatsData[t.thread.uid] !== undefined) ?
                {
                    train_id: t.thread.uid,
                    train_number: t.thread.number,
                    train_name: t.thread.title,
                    train_type: t.thread.transport_subtype.title,
                    departure_time: t.departure,
                    stops: t.stops,
                    free_seats: trainSeatsData[t.thread.uid].free_seats
                } :
                {
                    train_id: t.thread.uid,
                    train_number: t.thread.number,
                    train_name: t.thread.title,
                    train_type: t.thread.transport_subtype.title,
                    departure_time: t.departure,
                    stops: t.stops,
                    free_seats: -1
                } 
                return toSend
            })                     
            if (req.query.initial === 'true') {
                console.log('initial')
                let stName = {"stationName": yandexRes.station.title}
                result.push(stName)
            }
            res.send(JSON.stringify(result))
            console.log(JSON.stringify(result))            
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
    } else {
        res.sendStatus(400)
    }
})

router.get('/api/getDetails', (req, res) => {
    let query = req.query.t    
    console.log('[/api/getDetails]: query is: ' + query)    
    if (trainSeatsData[query] !== undefined){               
        res.send(JSON.stringify({free_seats_detailed: trainSeatsData[query].cars}))
        console.log(JSON.stringify({free_seats_detailed: trainSeatsData[query].cars}))      
    } else {
        res.sendStatus(400)
    }
})


router.get('*', (req, res) => res.sendFile('index.html', { root: rootPath }))

function parseDate(dateObj){
    let year = dateObj.getFullYear()
    let month = dateObj.getMonth() + 1
    let day = dateObj.getDate()
    month = (month.toString().length < 2) ? '0' + month : month
    day = (day.toString().length < 2) ? '0' + day : day
    return year + '-' + month + '-' + day
}


module.exports = router
