
var googleStocks = require('google-stocks');
var fetchQuotes = require('yahoo-finance-quotes');
var express = require('express');
var router = express.Router();

router.post('/addStock', function(req, res) {

	googleStocks([(req.body.Stock1).replace(/\s+/g, '')], function(error, data) {
  		console.log(data[0].l * req.body.quantity1);
	});
 
	googleStocks([(req.body.Stock2).replace(/\s+/g, '')], function(error, data) {
	  console.log(data[0].l * req.body.quantity2);
	});
})

module.exports = router;
