/*const stationsData = require('./data/stations-yandex.json')
let stations = []

let russia = stationsData.countries.filter(c => c.title == 'Россия')[0]
let len = russia.regions.filter(r => r.title == 'Санкт-Петербург и Ленинградская область')[0].settlements
let lenTrain = len.map(s => s.stations.filter(s => s.transport_type == 'train'))
lenTrain.map(s => stations.push(...s))
stations = stations.map(s => {return{title: s.title, codes: s.codes, station_type: s.station_type, direction: s.direction}})

//let trainStations = petergof.stations.filter(s => s.transport_type == 'train')

var fs = require('fs');
fs.writeFile ("stations.json", JSON.stringify(stations), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);*/
const fetch = require('node-fetch');

const stations = require('./data/stations.json')
let station = 's9602497'
let apikey = 'b95271f9-1cc9-44ba-b3be-bfd5c6fb9fc2'

// current timestamp in milliseconds
let currentTS = Date.now()
let currentDate = new Date(currentTS)

function parseTime(dateObj){
    let hours = dateObj.getHours()
    let minutes = dateObj.getMinutes()
    hours = (hours.toString().length < 2) ? '0' + hours : hours
    minutes = (minutes.toString().length < 2) ? '0' + minutes : minutes
    return hours + ':' + minutes
}

function parseDate(dateObj){
    let year = dateObj.getFullYear()
    let month = dateObj.getMonth() + 1
    let day = dateObj.getDate()
    month = (month.toString().length < 2) ? '0' + month : month
    day = (day.toString().length < 2) ? '0' + day : day
    return year + '-' + month + '-' + day
}

let date = parseDate(currentDate) //YYYY-MM-DD
date = '2020-01-20'
var fs = require('fs')



fetch(`https://api.rasp.yandex.net/v3.0/schedule/?apikey=${apikey}&station=${station}&limit=500&date=${date}`)
.then(res => res.json())
.then(res => {    
    let upcoming = res.schedule.filter(t => Date.parse(t.departure) > currentTS)
    let result = upcoming.map(t => {
        return {
            train_id: t.thread.uid/*,
            train_number: t.thread.number,
            train_name: t.thread.title,
            train_type: t.thread.transport_subtype.title,
            departure_time: t.departure*/
        }
    })
    fs.writeFile ("./data/filling/trains-yandex3.json", JSON.stringify(result), function(err) {
        if (err) throw err
        console.log('complete')
    }
    )
})
