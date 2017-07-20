const chain = require('chain-sdk')
var config = require('./output.json');

// This demo is written to run on either one or two cores. Simply provide
// different URLs to the following clients for the two-core version.
const client = new chain.Client()
let xpub
let _signer

Promise.resolve().then (() => {
  const keyPromise = client.mockHsm.keys.create()
  return keyPromise
}).then(key => {
  xpub = key.xpub
  // snippet signer-add-key
  const signer = new chain.HsmSigner() // holds multiple keys
  signer.addKey(key.xpub, client.mockHsm.signerConnection)
  // end snippet

  _signer = signer

}).then(() => {
  for (var k in config) {
    client.assets.create({
      alias: config[k].Asset,
      rootXpubs: [xpub],
      quorum: 1,
    })
 }}).then(() => {   
  for (var i in config) {
  // snippet issue-within-core
  client.transactions.build(builder => {
    builder.issue({
      assetAlias: config[i].Asset,
      amount: parseInt(config[i].Value)
    })
    console.log("hi")
    builder.controlWithAccount({
      accountAlias: 'bob',
      assetAlias: config[i].Asset,
      amount: parseInt(config[i].Value)
    })
  }).then(unsigned => {
    const signer = _signer

    // snippet sign-transaction
    const signerPromise = signer.sign(unsigned)
    // end snippet
    return signerPromise
  }).then(signed => client.transactions.submit(signed))}}
  // endsnippet
).catch(err =>
  process.nextTick(() => { throw err })
)