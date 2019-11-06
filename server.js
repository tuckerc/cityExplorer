'use strict'

require('dotenv').config();

// app dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// initializers
const app = express();
app.use(cors());
let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

function Location(city, locData) {
  this.search_query = city;
  this.formatted_query = locData.results[0].formatted_address;
  this.latitude = locData.results[0].geometry.location.lat;
  this.longitude = locData.results[0].geometry.location.lng;
}

function WeatherDay(city, forecast, time) {
  this.city = city;
  this.forecast = forecast;
  this.time = time;
}

function locationHandler(req, res) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GOOGLE_MAPS_KEY}`;

  superagent.get(url)
    .then(data => {
      // send the users current location back to them
      const city = req.query.data;
      const locationData = new Location(city, data.body);
      console.log(locationData);
      res.status(200).json(locationData);
    })
    .catch(err => errorHandler(err, req, res));
}

function weatherHandler(req, res) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=process.env.GOOGLE_MAPS_KEY`;
  
  superagent.get(url)
    .then(data => {
      // send the client next 8 days forecast
      let days = [];
      const city = req.query.data;
      for(let i = 0; i < 8; i++) {
        let time = new Date(data.daily.data[i].time * 1000).toLocaleDateString();
        let summary = data.daily.data[i].summary;
        let newDay = new WeatherDay(city, summary, time);
        days.push(newDay);
      }
      res.status(200).json(days);
    })
    .catch(err => errorHandler(err, req, res));
}

function errorHandler(err, req, res) {
  res.status(500).send(err);
}

// function notFoundHandler(req, res) {
//   let data = {
//     status: 404,
//     response: 'We can\'t find what you\'re looking for'
//   }
//   res.status(404).json(data);
// }

app.get('/location', locationHandler);

app.get('/weather', weatherHandler);

app.get('/', (req, res) => {
  console.log('got a hit on /');
  res.status(200).send('Welcome to City Explorer');
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
