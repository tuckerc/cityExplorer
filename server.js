'use strict'

require('dotenv').config();

// app dependencies
const express = require('express');
const cors = require('cors');
const handlers = require('./routes/handlers.js')
const location = require('./routes/location.js');
const trails = require('./routes/trails.js');
const movies = require('./routes/movies.js');
const yelp = require('./routes/yelp.js');
const weather = require('./routes/weather.js');
const db = require('./db/db.js');

// initializers
const app = express();
app.use(cors());
let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

// route declarations
app.get('/', );
app.get('/location', location.locationHandler);
app.get('/weather', weather.weatherHandler);
app.get('/trails', trails.trailHandler);
app.get('/movies', movies.movieHandler);
app.get('/yelp', yelp.yelpHandler);
app.use('*', handlers.notFoundHandler);
app.use(handlers.errorHandler);

db.client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    })
  })
  .catch(err => {throw err;})
