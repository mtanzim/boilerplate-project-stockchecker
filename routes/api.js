/*
*
*
*       Complete the API routing below
*
*
*/

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const getStockPrice = require('./getStockPrice');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});



module.exports = function (app) {

  //health-check
  app.route('/api/health-check')
    .get(function (req, res) {
      res.send('OK');
    });

  app.route('/api/stock-prices')
    .get(function (req, res, next) {

      // console.log(req.query || 'not sent');
      if (req.query.stock) {
        if (Array.isArray(req.query.stock)) {
          let priceArray = [];
          console.log('2 stocks sent');
          // promise.all is causing issues since it's running too many queries too quickly!!
          Promise.all(req.query.stock.map(stock => {
            console.log(stock);
            return getStockPrice(stock);
          }))
            .then(stockPrices => {
              console.log(stockPrices);
              for (let i = 0; i < req.query.stock.length; i++) {
                priceArray.push({
                  stock: req.query.stock[i],
                  price: stockPrices[i]
                });
              }
              return res.json({
                stockdata: priceArray,
              });
            })
            .catch(err => {
              console.log(err);
              return res.status(404)
                .type('text')
                .send(err.message);
            });
        } else {
          console.log('1 stock sent');
          getStockPrice(req.query.stock)
            .then(price => {
              console.log(price)
              return res.json({
                stockdata: {
                  stock: req.query.stock,
                  price: price,
                },
              });
            })
            .catch(err => {
              return res.status(404)
                .type('text')
                .send(err.message);
            });

        }
      } else {
        return res.status(404);
      }

      // return next(new Error('Not yet developed'));
    });

};
