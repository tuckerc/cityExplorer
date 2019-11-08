'use strict';

/////////////////////////////////////////////////////////////////////////
/// dependencies
/////////////////////////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('./db.js');

/////////////////////////////////////////////////////////////////////////
/// constructors
/////////////////////////////////////////////////////////////////////////
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


function Movie(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.vote_average;
  this.total_votes = movie.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;
}

function Trail(trail) {
  this.id = trail.id;
  this.name = trail.name;
  this.type = trail.type;
  this.summary = trail.summary;
  this.difficulty = trail.difficulty;
  this.stars = trail.stars;
  this.starVotes = trail.starVotes;
  this.location = trail.location;
  this.url = trail.url;
  this.imgSqSmall = trail.imgSqSmall;
  this.imgSmall = trail.imgSmall;
  this.imgSmallMed = trail.imgSmallMed;
  this.imgMedium = trail.imgMedium;
  this.length = trail.length;
  this.ascent = trail.ascent;
  this.descent = trail.descent;
  this.high = trail.high;
  this.low = trail.low;
  this.longitude = trail.longitude;
  this.latitude = trail.latitude;
  this.conditionStatus = trail.conditionStatus;
  this.conditionDetails = trail.conditionDetails;
  this.conditionDate = trail.conditionDate;
}

// {
//   id: 'VJ8P33L0byJ7zzgcafZ1Aw',
//   alias: 'sultans-kite-downtown-lincoln-3',
//   name: "Sultan's Kite - Downtown",
//   image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/0YZvuwiQc0N0CnYGmwmRbA/o.jpg',
//   is_closed: false,
//   url: 'https://www.yelp.com/biz/sultans-kite-downtown-lincoln-3?adjust_creative=EvIr4C0ZCDtO3BIjwZiT8g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=EvIr4C0ZCDtO3BIjwZiT8g',
//   review_count: 249,
//   categories: [ [Object], [Object], [Object] ],
//   rating: 4.5,
//   coordinates: { latitude: 40.8134651, longitude: -96.7021273 },
//   transactions: [ 'pickup' ],
//   price: '$',
//   location: {
//     address1: '1311 O St',
//     address2: '',
//     address3: '',
//     city: 'Lincoln',
//     zip_code: '68508',
//     country: 'US',
//     state: 'NE',
//     display_address: [Array]
//   },
//   phone: '+14024770013',
//   display_phone: '(402) 477-0013',
//   distance: 40.86118261197519
// }

function Business(business) {
  this.name = business.name;
  this.image_url = business.image_url;
  this.price = business.price;
  this.rating = business.rating;
  this.url = business.url;
}

/////////////////////////////////////////////////////////////////////////
/// location handler
/////////////////////////////////////////////////////////////////////////
function locationHandler(req, res) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GOOGLE_MAPS_KEY}`;

  db.getCity(req.query.data.toUpperCase())
    .then(result => {
      // check if in DB first
      if(result.rowCount) {
        res.send(result.rows[0]);
      }
      // get then push to DB if not there
      else {
        superagent.get(url)
          .then(data => {
            // send the users current location back to them
            const location = new Location(req.query.data.toUpperCase(), data.body);
            db.putLocation(location);
            res.send(location);
          })
          .catch(err => errorHandler(err, req, res));
      }
    })
    .catch(err => errorHandler(err, req, res))
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
    .catch(err => errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// trail handler
/////////////////////////////////////////////////////////////////////////
function trailHandler(req, res) {
  const url = `https://www.hikingproject.com/data/get-trails?lat=${req.query.data.latitude}&lon=${req.query.data.longitude}&key=${process.env.HIKING_PROJECT_KEY}`;

  superagent.get(url)
    .then(data => {
      const trailSummary = data.body.trails.map(trail => {
        return new Trail(trail);
      })
      res.status(200).json(trailSummary);
    })
    .catch(err => errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// movie handler
/////////////////////////////////////////////////////////////////////////
function movieHandler(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${req.query.data.search_query}&api_key=${process.env.THE_MOVIE_DB_KEY}&language=en-US&page=1`;

  superagent.get(url)
    .then(data => {
      let movies = [];
      for(let i = 0; i < 20; i++) {
        movies.push(new Movie(data.body.results[i]));
      }
      res.status(200).json(movies);
    })
    .catch(err => errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// yelp handler
/////////////////////////////////////////////////////////////////////////
function yelpHandler(req, res) {
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${req.query.data.latitude}&longitude=${req.query.data.longitude}&categories=Restaurants&sort_by=rating`;
  // const url = `https://api.yelp.com/v3/businesses/search?latitude=${req.query.data.latitude}&longitude=${req.query.data.longitude}`;
  superagent.get(url)
    .set('Authorization',`Bearer ${process.env.YELP_KEY}`)
    .then(response => {
      let businesses = response.body.businesses.map(business => {
        return new Business(business);
      })
      res.status(200).json(businesses);
    })
    .catch(err => errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// not found handler
/////////////////////////////////////////////////////////////////////////
function notFoundHandler(request,response) {
  response.status(404).send('Hmmm... Something went wrong. We couldn\'t find what you are looking for.');
}

/////////////////////////////////////////////////////////////////////////
/// error handler
/////////////////////////////////////////////////////////////////////////
function errorHandler(err, req, res) {
  console.log(err);
  res.status(500).send(err);
}

/////////////////////////////////////////////////////////////////////////
/// export declarations
/////////////////////////////////////////////////////////////////////////
exports.locationHandler = locationHandler;
exports.weatherHandler = weatherHandler;
exports.trailHandler = trailHandler;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
exports.movieHandler = movieHandler;
exports.yelpHandler = yelpHandler;
