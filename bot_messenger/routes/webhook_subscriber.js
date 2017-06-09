// This script handles the verification of correct subscritions. 
// FIXME: webhook_subscriber.js switched off until proper testing and integration. 

// Webhook Router
var subscriber = require('express').Router();

// Package Dependencies
var request = require('request')

// Local Dependencies
const facebookApp = require('../config/facebook')

/** This function retrieves the app token from facebook; technically don't need this to run. */
// function getAppToken() {
//   request({
//     uri: 'https://graph.facebook.com/v2.8/oauth/access_token',
//     qs : {
//       client_id: facebookApp.appID,
//       client_secret: facebookApp.appSecret,
//       grant_type: 'client_credentials'
//     }
//   }, function (error, response, body) {
//       console.log(response.body)
//     });
//   }

/** This function reads our current subscriptions. TODO: Works, but may need to parse the JSON response so it's easier to read. */
// function readSubscriptions() {
//   console.log('\nSetting appropriate subscriptions for Facebook Messenger integration...');

//   request(
//     {
//     method: 'GET',
//     uri: 'https://graph.facebook.com/v2.9/'.concat(facebookApp.appID).concat('/subscriptions'), // The API endpoint to POST to
//     qs: { 
//       access_token: facebookApp.accessToken
//     },

//   }, function (error, response, body) {
//       if (error) {
//         console.log('We had an error!')
//         // console.log(error) 
//       } else if (response.statusCode == 400) {
//         console.log('Hmm')
//         console.log(facebookApp.accessToken)
//         //console.log(response)
//       } else {
//         console.log('Success?')
//         console.log(response.statusCode)
//         console.log(body)
//       } 
//   });
// }

/** This function publishes our desired subscriptions (only one at the moment.) */
function publishSubscriptions() {
  console.log('\nSetting appropriate subscriptions for Facebook Messenger integration...');
  request(
    {
      method: 'POST',
      uri: 'https://graph.facebook.com/v2.8/'.concat(facebookApp.appID).concat('/subscriptions'), // The API endpoint to POST to
      qs: {
        object: 'permissions',
        callback_url: facebookApp.callbackUrl,
        verify_token: facebookAuth.verifyToken,
        fields: ['pages_messaging', 'pages_messaging_subscriptions'],
        access_token: facebookApp.accessToken
      },

    }, function (error, response, body) {
      if (error) {
        console.log('We ran into error!')
        console.log(error)
      } else if (response.statusCode == 400) {
        console.log('We made a bad request.')
        console.log(body)
      } else {
        // If we've made it here, we're fine. 
        // console.log('Successfully subscribed.')
        // console.log(body)
      }
    });
}

// Give the bot 5 seconds before we start asking for permissions from Facebook
setTimeout(publishSubscriptions, 5000);

module.exports = subscriber; 