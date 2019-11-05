'use strict'

require('dotenv').config();

const express = require('express');

const app = express();

let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function WeatherDay(city, forecast, time) {
  this.city = city;
  this.forecast = forecast;
  this.time = time;
}

app.get('/location', (req, res) => {
  // send the users current location back to them
  const geoData = require('./data/geo.json');
  const city = req.query.data;
  const locationData = new Location(city, geoData);
  res.send(locationData);
});

app.get('/weather', (req, res) => {
  // send the client next 8 days forecast
  let days = [];
  const weatherData = require('./data/darksky.json');
  const city = req.query.data;
  for(let i = 0; i < 8; i++) {
    let time = weatherData.daily.data[i].time;
    let summary = weatherData.daily.data[i].summary;
    let newDay = new WeatherDay(city, summary, time);
    days.push(newDay);
  }
  res.send(days);
});

app.get('*', (req, res) => {
  res.send('Welcome to City Explorer');
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
