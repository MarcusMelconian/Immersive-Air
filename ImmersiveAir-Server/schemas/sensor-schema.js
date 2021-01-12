const mongoose = require('mongoose')

const sensorSchema = mongoose.Schema({
  particle1: Number,
  particle2: Number,
  particle3: Number,
  particle4: Number,
  particle5: Number,
  particle6: Number,
  co2: Number,
  tvoc: Number,
  temp: mongoose.Decimal128,
  templocal: mongoose.Decimal128,
  humid: mongoose.Decimal128,
  humidlocal: mongoose.Decimal128,
  time: String,
},{
  collection: 'sensors'
})

module.exports = mongoose.model('sensors', sensorSchema)