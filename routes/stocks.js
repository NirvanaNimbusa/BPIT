
var googleStocks = require('google-stocks');
var fetchQuotes = require('yahoo-finance-quotes');
var express = require('express');
var router = express.Router();

router.post('/addStock', function(req, res) {

	googleStocks([(req.body.Stock1).replace(/\s+/g, '')], function(error, data) {
		if (error) console.log(error)
		else if (isNaN(req.body.quantity1) || (req.body.quantity1 <= 0)) console.log("invalid quantity1")
		else console.log(data[0].l * req.body.quantity1);
	});
 
	googleStocks([(req.body.Stock2).replace(/\s+/g, '')], function(error, data) {
	  	if (error) console.log(error)
	  	else if (isNaN(req.body.quantity2) || (req.body.quantity2 <= 0)) console.log("invalid quantity2")
	  	else console.log(data[0].l * req.body.quantity2);
	});
})

module.exports = router;
