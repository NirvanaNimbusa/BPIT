var express = require('express');
var router = express.Router();
const chain = require('chain-sdk')
const client = new chain.Client()

let _signer

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
  
    // snippet create-asset: STOCK 1
    const goldPromise = client.assets.create({
      alias: req.body.Stock1,
      rootXpubs: [key.xpub],
      quorum: 1,
    })
    // endsnippet
    
    // snippet create-asset: STOCK 2
    const silverPromise = client.assets.create({
      alias: req.body.Stock2,
      rootXpubs: [key.xpub],
      quorum: 1,
    })
    // endsnippet
    // snippet create-account-alice: FIRST & LAST NAME
    const alicePromise = client.accounts.create({
      alias: req.body.firstName + " " + req.body.lastName,
      rootXpubs: [key.xpub],
      quorum: 1
    })
    // endsnippet
    
    return Promise.all([goldPromise, silverPromise, alicePromise]);
    res.send({msg:''});
    }).then( t => { 
    
    //TRANSACTIONS:
    //Putting the first stock on the ledger
    client.transactions.build(builder => {
        builder.issue({
            assetAlias: req.body.Stock1,
            amount: parseInt(req.body.quantity1)
        })
        builder.controlWithAccount({
            accountAlias: req.body.firstName + " " + req.body.lastName,
            assetAlias: req.body.Stock1,
            amount: parseInt(req.body.quantity1)
        })
    }).then(issuance => {
        return _signer.sign(issuance)
    }).then(signed => {
        return client.transactions.submit(signed)
    })  
  }).then( v => { 

    //Putting the second stock on the ledger 
    client.transactions.build(builder => {
        builder.issue({
            assetAlias: req.body.Stock2,
            amount: parseInt(req.body.quantity2)
        })
        builder.controlWithAccount({
            accountAlias: req.body.firstName + " " + req.body.lastName,
            assetAlias: req.body.Stock2,
            amount: parseInt(req.body.quantity2)
        })
    }).then(issuance => {
        return _signer.sign(issuance)
    }).then(signed => {
        return client.transactions.submit(signed)
    })  
  }).catch(err =>
  process.nextTick(() => {throw err }),
  res.send({msg:err})
  )
});
