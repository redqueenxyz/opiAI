// Webhook Router
var validator = require('express').Router();

// Imports
const facebookAuth = require('../config/facebook_auth');
// console.log(facebookAuth);

// Facebook Authorization
validator.get('/', function (req, res) {
  console.log('\nAuthorizing bot with Facebook...');
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === facebookAuth.verifyToken) {
    res.status(200).send(req.query['hub.challenge']);
    console.log("Webhook validated!");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

module.exports = validator;