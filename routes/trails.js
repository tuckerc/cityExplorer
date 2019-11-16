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
    .catch(err => handlers.errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// export declarations
/////////////////////////////////////////////////////////////////////////
exports.trailHandler = trailHandler;
