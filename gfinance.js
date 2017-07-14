var googleStocks = require('google-stocks');

googleStocks(["sadfj"], function(error, data) {
	if (error) console.log(error)
	else console.log(data);
});

