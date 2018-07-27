const axios = require('axios');

module.exports = function getStockPrice(symbol) {

  const ALPHAKEY = process.env.ALPHAKEY;
  const ALPHAFUNC = 'TIME_SERIES_DAILY';
  const ALPHASIZE = 'compact';
  const ALPHAINTERVAL = '1min';

  const METADATATAG = 'Meta Data';
  const TSTAG = '3. Last Refreshed';
  const DATATAG = 'Time Series (Daily)';
  const PRICETYPE = '4. close';
  const ERRTAG = 'Error Message';
  const INFOTAG = 'Information';

  return axios.get(`https://www.alphavantage.co/query?function=${ALPHAFUNC}&outputsize=${ALPHASIZE}&symbol=${symbol}&interval=${ALPHAINTERVAL}&apikey=${ALPHAKEY}`)
    .then(function (response) {

      // if (response.data[ERRTAG]) return Promise.reject(new Error(response.data[ERRTAG]));
      // console.log(response.data);
      if (response.data[ERRTAG]) return Promise.reject(new Error(`${symbol} is not a valid stock symbol!`));
      if (response.data[INFOTAG]) return Promise.reject(new Error(response.data[INFOTAG]));
      let data = response.data;
      let lastTS = data[METADATATAG][TSTAG].split(' ')[0];
      // console.log(lastTS);
      let latestResult = data[DATATAG][lastTS];
      return latestResult[PRICETYPE];

    })
    .catch(function (error) {
      return Promise.reject(error);
    });
};