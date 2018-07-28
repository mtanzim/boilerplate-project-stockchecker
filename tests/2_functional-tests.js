/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

const stockSymbol = 'goog';
const stockSymbolA = 'goog';
const stockSymbolB = 'msft';
const sentStocks = [stockSymbolA, stockSymbolB]


suite('Functional Tests', function () {

  this.timeout(50000);
  afterEach(function (done) {
    this.timeout(10000);
    console.log('Adding Delay...');
    setTimeout(function () {
      console.log('Wake!');
      done();
    }, 3000);
  });

  suite('GET /api/stock-prices => stockData object', function () {


    test('1 stock', function (done) {
      // let stockSymbol = 'goog';
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: stockSymbol })
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.body.stockdata.stock, stockSymbol, 'Should return the same stock back!');
          assert.isNotNaN(Number(res.body.stockdata.price));
          done();
        });

    });

    test('1 stock with like', function (done) {
      // let stockSymbol = 'goog';
      // new testOneStock(done, true);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: stockSymbol, like: true })
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.body.stockdata.stock, stockSymbol, 'Should return the same stock back!');
          assert.equal(res.body.stockdata.likes, 1, 'Liked stocks should be acked');
          assert.isNotNaN(Number(res.body.stockdata.price));
          done();
        });

    });

    test('1 stock with like again (ensure likes arent double counted)', function (done) {

      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: stockSymbol, like: true })
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.body.stockdata.stock, stockSymbol, 'Should return the same stock back!');
          assert.equal(res.body.stockdata.likes, 1, 'Liked stocks should be acked');
          assert.isNotNaN(Number(res.body.stockdata.price));
          done();
        });

    });

    test('2 stocks', function (done) {

      // let sentStocks = [stockSymbolA, stockSymbolB]
      chai.request(server)
        .get(`/api/stock-prices?stock=${stockSymbolA}&stock=${stockSymbolB}`)
        // .query({ stock: stockSymbolA, stock: stockSymbolB })
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.status, 200, 'response status should be 200');
          assert.isArray(res.body.stockdata, 'stockdata should be an array');
          for (let i = 0; i < res.body.stockdata.length; i++) {
            assert.equal(res.body.stockdata[i].stock, sentStocks[i], 'Stocks match sent');
            assert.isNotNaN(Number(res.body.stockdata[i].price), 'Stock prices are numbers');
          }
          done();
        });
    });

    test('2 stocks with likes', function (done) {

      // let sentStocks = [stockSymbolA, stockSymbolB]
      chai.request(server)
        .get(`/api/stock-prices?stock=${stockSymbolA}&stock=${stockSymbolB}&like=true`)
        // .query({ stock: stockSymbolA, stock: stockSymbolB })
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.status, 200, 'response status should be 200');
          assert.isArray(res.body.stockdata, 'stockdata should be an array');
          for (let i = 0; i < res.body.stockdata.length; i++) {
            assert.equal(res.body.stockdata[i].stock, sentStocks[i], 'Stocks match sent');
            assert.isNotNaN(Number(res.body.stockdata[i].price), 'Stock prices are numbers');
            assert.isNotNaN(Number(res.body.stockdata[i].rel_likes), 'Stock likes are numbers');
            assert.include([-1, 0, 1], Number(res.body.stockdata[i].rel_likes), 'Stock likes are -1,0, or 1');
            // assert.isAtMost(Number(res.body.stockdata[i].rel_likes,1), 'Stock likes are max 1');
          }
          done();
        });
    });

    /*       test('2 stocks with like', function(done) {
            
          }); */

  });

});
