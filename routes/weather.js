'use strict';

/////////////////////////////////////////////////////////////////////////
/// dependencies
/////////////////////////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('../db/db.js');
const handlers = require('../handlers.js');

/////////////////////////////////////////////////////////////////////////
/// constructors
/////////////////////////////////////////////////////////////////////////
function WeatherDay(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

/////////////////////////////////////////////////////////////////////////
/// weather handler
/////////////////////////////////////////////////////////////////////////
function weatherHandler(req, res) {
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  
  superagent.get(url)
    .then(data => {
      
      // send the client next 8 days forecast
      const weatherSummaries = data.body.daily.data.map(day => {
        return new WeatherDay(day);
      })
      
      res.status(200).json(weatherSummaries);
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

exports.weatherHandler = weatherHandler;
