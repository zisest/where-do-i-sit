require('dotenv').config()

const express = require('express')
const router = express.Router()

const fetch = require('node-fetch')
const bigInt = require('big-integer')
const path = require('path')

const environment = process.env.NODE_ENV
const rootPath = (environment === 'development') ? path.join(__dirname, 'client','public') : path.join(__dirname, 'client','build')

const  { fillTrain, randomizing, encodeCarLayout, decodeCarLayout, carSizes } = require('./filler')
const { Train, Station } = require('./mongo')


router.use(express.static(rootPath))

router.get('/api/getStations', (req, res) => {
    let query = req.query.s
    console.log('[/api/getStations]: query is: ' + query)
    let startsWithRegExp = new RegExp(`^${query}`, 'i')
    let containsRegExp = new RegExp(`(?<!^)${query}`, 'i')
    let result = []
    Station.find({title: startsWithRegExp}).sort('title').then(docs => {
        docs.forEach(st => result.push(st.title))
        Station.find({title: containsRegExp}).sort('title').then(docs => {
            docs.forEach(st => !result.includes(st.title) && result.push(st.title))
            console.log('[/api/getStations]: result is: ' + result)
            res.send(result)
        })        
    })
    /*
    let startsWithQuery = stationsData.filter(station => {
        let st = station.title.toLowerCase()
        return st.startsWith(query)
    })
    let includesQuery = stationsData.filter(station => {
        let st = station.title.toLowerCase()
        return (!st.startsWith(query) && st.includes(query))
    })
    let filtered = startsWithQuery.concat(includesQuery)
    let result = filtered.map(station => station.title)
    */
    
    //res.send(result)
})

router.get('/api/getTimetable', (req, res) => {
    let query = req.query.s.toLowerCase()
    let fromIndex = req.query.from
    let toIndex = req.query.to
    let stationCode = ''

    console.log('[/api/getTimetable]: query is: ' + query, fromIndex, toIndex)
    Station.findOne({title: regexify(query)}).then(st => {
        console.log(st)
        if(!st) res.status(400).send('Bad Request')
        let currentTS = Date.now()
        let currentDate = new Date(currentTS)
        let date = parseDate(currentDate)
        console.log(st.yandex_code, date)
        fetch(`https://api.rasp.yandex.net/v3.0/schedule/?station=${st.yandex_code}&limit=200&date=${date}&transport_types=suburban`,
            { method: 'GET', headers: { 'Authorization': process.env.YANDEX_API_KEY }})
        .then(yandexRes => yandexRes.json())
        .then(yandexRes => {    
            console.log(yandexRes)
            if (yandexRes.error !== undefined) throw yandexRes.error.text           
            let upcoming = yandexRes.schedule.filter(t => Date.parse(t.departure) > currentTS)
            let requested = upcoming.filter((t, index) => (index >= fromIndex) && (index <= toIndex))     
            let queries = requested.map((t, i) => {
                return Train.findOne({id: t.thread.uid}).exec().then(doc => {
                    let train = {
                        train_id: t.thread.uid,
                        train_number: t.thread.number,
                        train_name: t.thread.title,
                        train_type: t.thread.transport_subtype.title,
                        departure_time: t.departure,
                        stops: t.stops
                    } 
                    if(!doc) Train.create(fillTrain(t.thread.uid, randomizing(i)), (err, newDoc) => {
                        if (err) throw err
                        return {...train, free_seats: newDoc.free_seats}
                    })
                    else return {...train, free_seats: doc.free_seats}                           
                })
            })
            Promise.all(queries).then(results => {
                let toSend = results
                if (req.query.initial === 'true') {
                    console.log('initial')
                    let stName = {"stationName": yandexRes.station.title}
                    toSend.push(stName)
                }
                res.send(JSON.stringify(toSend))
                console.log(JSON.stringify(toSend))
            }).catch(err => { throw err })      
        })          
        .catch(err => {
            console.error(err)
            res.status(500).send('Internal Server Error')
        })
    })
    .catch(err => {
        console.error(err)
        res.status(500).send('Internal Server Error')
    })     
})

router.get('/api/getDetails', (req, res) => {
    let query = req.query.t    
    console.log('[/api/getDetails]: query is: ' + query)    
    Train.findOne({id: query}).then(train => {
        if(!train) res.status(400).send('Bad Request')
        res.send(JSON.stringify({free_seats_detailed: train.cars}))
        console.log(JSON.stringify({free_seats_detailed: train.cars}))
    })
})


//Receiving requests from Arduino
// http://trains.zisest.ru/api/updateSeats?key=&layout=3&car=1&id=237dyh3ud
router.get('/api/updateSeats', (req, res) => {
    console.log('api/updateSeats')

    const FULL_LAYOUTS = { // when all seats are taken
        67: bigInt('147573952589676412927'),
        103: bigInt('10141204801825835211973625643007')
    }

    try {
        let queryLayout = bigInt(req.query.layout)
        if (!'12345'.includes(req.query.car) || queryLayout.isNegative() || queryLayout.greater(FULL_LAYOUTS[carSizes[req.query.car]]))
            res.status(400).send('Bad request')

        if (req.query.key === process.env.ACCESS_KEY){
            Train.findOne({id: req.query.id}).then(doc => {
                console.log(doc)
                let car = doc.cars[req.query.car - 1]            
                let prevLayout = decodeCarLayout(car.layout, carSizes[+req.query.car])
                let newLayout = decodeCarLayout(queryLayout, carSizes[+req.query.car])
                let diff = newLayout.reduce((acc, curr, i) => acc + curr - prevLayout[i], 0)            
                doc.free_seats += diff
                car.free_seats += diff
                car.layout = queryLayout.toString()
                doc.save(() => console.log('saved'))
            })
            .catch(err => { throw err }) 
            res.send(JSON.stringify({train: req.query.id, car_num: req.query.car, layout: queryLayout.toString()}))      
        } else {        
            res.status(403).send('Access denied')
        }   

    } catch(err) {
        res.status(400).send('Bad request')
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

function regexify(string){
    return new RegExp('^' + string.replace(/\s/g, "\\s").replace(/\(/g, "\\(").replace(/\)/g, "\\)") + '$', 'i')
}


module.exports = router
