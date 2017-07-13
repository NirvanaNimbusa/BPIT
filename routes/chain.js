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
  // snippet create-asset
    const goldPromise = client.assets.create({
      alias: 'ho',
      rootXpubs: [key.xpub],
      quorum: 1,
    })
    // endsnippet

    // snippet create-account-alice
    const alicePromise = client.accounts.create({
      alias: 'd',
      rootXpubs: [key.xpub],
      quorum: 1
    })
    // endsnippet

    // snippet create-account-bob
    const bobPromise = client.accounts.create({
      alias: 'r',
      rootXpubs: [key.xpub],
      quorum: 1
    })
    // endsnippet
    
    return Promise.all([goldPromise, alicePromise, bobPromise]);
    res.send({msg:''});

  }).catch(err =>
  process.nextTick(() => {throw err }),
  res.send({msg:err})
  )
});

module.exports = router;