var yfinance = require('yfinance');
 
yfinance.getQuotes('lasdkjf', function (err, data) {
    if(err) console.log(err);
    else console.log(data)
});