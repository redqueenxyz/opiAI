// Webhook Router
var router = require('express').Router();

// Imports
const facebookAuth = require('lib/config/facebook_auth');
// console.log(facebookAuth);

// Facebook Authorization
router.get('/', function (req, res) {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === facebookAuth.verifyToken) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);

  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

module.exports = router; // export this as 'routes'