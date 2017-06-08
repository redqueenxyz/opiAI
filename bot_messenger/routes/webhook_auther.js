// Authorizes the bot with Facebook

/// Locally-Hosted Setup
// Originally, we had to host the bot locally and pipe it through a hosted proxy (via ngrok) to allow it to connect via HTTPS to Facebook. 

// npm start: starts bot.js at the main folder
// ngrok http 3000: serves localhost:3000 at public_url
// `https://public_url.com/webhook`: Goes in developers.facebook.com > feedbackAI > Webhooks > Application > Edit Subscription > Callback url
// `https://public_url.com/webhook`: Goes in developers.facebook.com > feedbackAI > Webhooks > Page > Edit Subscription > Callback url
// `messages, messaging_postbacks`: Required messaging gpermissions in developers.facebook.com, also requires subscription to Feedbck page 

/// Cloud-Hosted Setup
// We have containerized and move our bot onto GAE, using a custom runtime and Google Compute Engine (hello bills!)
// docker build -t feedbackai: Build and tag the feedbackai bot.
// gcloud app deploy: Deploys bot to a project url; requires the gcloud SDK to be setup and intalled 
// gcloud app logs tail -s default: Dumps all the logs to the CLI from Google; great for monitoring it. 



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