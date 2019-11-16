'use strict';

/////////////////////////////////////////////////////////////////////////
/// dependencies
/////////////////////////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('../db/db.js');
const handlers = require('./handlers.js');

/////////////////////////////////////////////////////////////////////////
/// constructors
/////////////////////////////////////////////////////////////////////////
function Location(city, locData) {
  this.search_query = city;
  this.formatted_query = locData.results[0].formatted_address;
  this.latitude = locData.results[0].geometry.location.lat;
  this.longitude = locData.results[0].geometry.location.lng;
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
          .catch(err => handlers.errorHandler(err, req, res));
      }
    })
    .catch(err => handlers.errorHandler(err, req, res))
}

exports.locationHandler = locationHandler;
