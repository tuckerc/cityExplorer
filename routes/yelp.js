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
function Business(business) {
  this.name = business.name;
  this.image_url = business.image_url;
  this.price = business.price;
  this.rating = business.rating;
  this.url = business.url;
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
    .catch(err => handlers.errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// export declarations
/////////////////////////////////////////////////////////////////////////
exports.yelpHandler = yelpHandler;
