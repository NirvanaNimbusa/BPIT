var express = require('express');
var router = express.Router();
const chain = require('chain-sdk')
const client = new chain.Client()
var googleStocks = require('google-stocks');
var fetchQuotes = require('yahoo-finance-quotes');
var express = require('express');
var router = express.Router();
var xlsxj = require("xlsx-to-json");

let _signer

// xlsxj({
// input: "test.xlsx", 
// output: "output.json"
// }, function(err, result) {
// if(err) {
//   console.error(err);
// } else {
//   console.log("Success");
// }
// });

var config = require('./output.json');

router.post('/addAccount', function(req, res) {
    Promise.resolve().then(() => {
    // snippet create-key
    const keyPromise = client.mockHsm.keys.create()
    // endsnippet
    return keyPromise
    }).then(key => {
    // snippet signer-add-key
    const signer = new chain.HsmSigner()
    signer.addKey(key.xpub, client.mockHsm.signerConnection)
    // endsnippet

    _signer = signer
    return key
    }).then(key => {

    // snippet create-account-alice: FIRST & LAST NAME
    const alicePromise = client.accounts.create({
      alias: req.body.firstName + " " + req.body.lastName,
      rootXpubs: [key.xpub],
      quorum: 1
    })
    // endsnippet

    return Promise.all([goldPromise, silverPromise, alicePromise,totalPromise]);
    res.send({msg:''});
    }).then( t => {

    //TRANSACTIONS:
    //Putting the first stock on the ledger
    for (i = 0; i < config.length; i ++) {
        client.transactions.build(builder => {
            builder.issue({
                assetAlias: (config[i].Asset).replace(/\s+/g, ''),
                amount: parseInt(config[i].Value)
            })
            builder.controlWithAccount({
                accountAlias: req.body.firstName + " " + req.body.lastName,
                assetAlias: (config[i].Asset).replace(/\s+/g, ''),
                amount: parseInt(config[i].Value)
            })
        }).then(issuance => {
            return _signer.sign(issuance)
        }).then(signed => {
            return client.transactions.submit(signed)
        }) }
  }).catch(err =>
  process.nextTick(() => {throw err }),
  res.send({msg:err})
  )
});

module.exports = router;