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
      console.log(req.query || 'not sent');
      if (!req.session.likes) req.session.likes = [];
      // console.log(req.session.likes);

      if (req.query.like) {
        // console.log(`Liked:${req.query.like}`);
      }
      if (req.query.stock) {
        if (Array.isArray(req.query.stock)) {
          let priceArray = [];
          console.log('2 stocks sent');
          // promise.all is causing issues since it's running too many queries too quickly!!
          Promise.all(req.query.stock.map(stock => {
            // console.log(stock);
            return getStockPrice(stock);
          }))
            .then(stockPrices => {
              // console.log(stockPrices);

              let liked = [];

              for (let i = 0; i < req.query.stock.length; i++) {
                if (req.query.like && !req.session.likes.includes(req.query.stock[i])) {
                  req.session.likes.push(req.query.stock[i]);
                }

                liked[i] = 0;
                if (req.session.likes.includes(req.query.stock[i])) liked[i] = 1;

                // console.log(liked);

                priceArray.push({
                  stock: req.query.stock[i],
                  price: stockPrices[i]
                });
              }

              // calculate relative likes
              priceArray[0]['rel_likes'] = liked[0] - liked[1];
              priceArray[1]['rel_likes'] = liked[1] - liked[0];


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
          // console.log('1 stock sent');
          getStockPrice(req.query.stock)
            .then(price => {
              // console.log(price)

              if (req.query.like && !req.session.likes.includes(req.query.stock)) {
                req.session.likes.push(req.query.stock);
              }

              let liked = 0;
              if (req.session.likes.includes(req.query.stock)) liked = 1;


              return res.json({
                stockdata: {
                  stock: req.query.stock,
                  price: price,
                  likes: liked,
                },
              });
            })
            .catch(err => {
              // console.log('in api routes');
              console.log(err);
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
