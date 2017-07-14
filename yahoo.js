var fetchQuotes = require('yahoo-finance-quotes');
 
 
fetchQuotes(["FB"])
    .then((quotes) => {
        console.info(quotes);
    })
    .catch((response) => {
        console.error(response);
    });
 