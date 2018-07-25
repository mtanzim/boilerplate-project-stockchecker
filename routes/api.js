/*
*
*
*       Complete the API routing below
*
*
*/

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  //health-check
  app.route('/api/health-check')
    .get(function (req, res) {
      res.send('OK');
    });

  app.route('/api/stock-prices')
    .get(function (req, res, next){
      return next(new Error('Not yet developed'));
    });
  app.route('/api/stock')
    .get(function (req, res, next){
      return next(new Error('Not yet developed'));
    });
    
};
