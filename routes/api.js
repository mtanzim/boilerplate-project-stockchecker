/*
*
*
*       Complete the API routing below
*
*
*/

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const axios = require('axios');

const ALPHAKEY = process.env.ALPHAKEY;
const ALPHAFUNC ='TIME_SERIES_INTRADAY';
const ALPHASIZE ='compact';
const ALPHAINTERVAL ='1min';

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

function getLatestStock (data) {
  // return data;
  let lastTS = data['Meta Data'];
  console.log(lastTS);
  let latestResult = data['Time Series (1min)'][lastTS];
  console.log(latestResult);
  return latestResult;
}

module.exports = function (app) {

  //health-check
  app.route('/api/health-check')
    .get(function (req, res) {
      res.send('OK');
    });

  app.route('/api/stock-prices')
    .get(function (req, res, next){

      console.log(req.query || 'not sent');
      if (req.query.stock) {  
        if (Array.isArray(req.query.stock)){
          console.log('2 stocks sent');
          req.query.stock.forEach(stock => {
            console.log(stock);
          });
        } else {
          console.log('1 stock sent');
          console.log(req.query.stock);
          axios.get(`https://www.alphavantage.co/query?function=${ALPHAFUNC}&outputsize=${ALPHASIZE}&symbol=${req.query.stock}&interval=${ALPHAINTERVAL}&apikey=${ALPHAKEY}`)
            .then(function (response) { 
              // console.log(response.data);
              console.log(getLatestStock(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        return res.status(404);
      }

      return next(new Error('Not yet developed'));
    });
    
};
