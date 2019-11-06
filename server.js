'use strict'

require('dotenv').config();

// app dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// object to contain previous locations
let locations = {};

// initializers
const app = express();
app.use(cors());
let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

// route declarations
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

function Location(city, locData) {
  this.search_query = city;
  this.formatted_query = locData.results[0].formatted_address;
  this.latitude = locData.results[0].geometry.location.lat;
  this.longitude = locData.results[0].geometry.location.lng;
}

function WeatherDay(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function locationHandler(req, res) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GOOGLE_MAPS_KEY}`;

  if(locations[url]) {
    res.send(locations[url]);
  }
  else {
    superagent.get(url)
      .then(data => {
        // send the users current location back to them
        const location = new Location(req.query.data, data.body);
        locations[url] = location;
        res.send(location);
      })
      .catch(err => errorHandler(err, req, res));
  }
}

function weatherHandler(req, res) {
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  
  superagent.get(url)
    .then(data => {
      
      // send the client next 8 days forecast
      const weatherSummaries = data.body.daily.data.map(day => {
        return new WeatherDay(day);
      })
      
      console.log(weatherSummaries);

      res.status(200).json(weatherSummaries);
    })
    .catch(err => errorHandler(err, req, res));
}

function notFoundHandler(request,response) {
  response.status(404).send('Hmmm... Something went wrong. We couldn\'t find what you are looking for.');
}

function errorHandler(err, req, res) {
  res.status(500).send(err);
}

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
