const mongoose = require('mongoose')

const trainSchema = new mongoose.Schema({
  id: String,
  en_route: Boolean,
  departure_time: Date,
  free_seats: Number,
  cars: [{
    car_num: Number,
    free_seats: Number,
    layout: String
  }]
})

const Train = mongoose.model('Train', trainSchema, 'trains')

const stationSchema = new mongoose.Schema({
  title: String,
  yandex_code: String,
  station_type: String,
  direction: String
})
const Station = mongoose.model('Station', stationSchema, 'stations')

exports.Train = Train
exports.Station = Station