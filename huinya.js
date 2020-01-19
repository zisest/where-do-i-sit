const stationsData = require('./data/stations-yandex.json')
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
);