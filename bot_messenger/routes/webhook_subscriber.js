// For the bot to work, the webhook must be calibrated
// Current workflow:
// `npm start` > starts bot.js at the main folder
// `ngrok http 3000` > serves localhost:3000 at public url
// `https://someurl.com/webhook` > Put that in developers.facebook.com > feedbackAI > Webhooks > Application > Edit Subscription > Callback url
// This script should run after webhook_auth, and will ensure the proper permissions are set on Facebook for messaging through the page 

// FIXME: Make sure to double check the callback url under Webhooks for all elements (pages, permissions, etc.); may still error out. 
// Documentation: https://developers.facebook.com/docs/graph-api/webhooks/


// Webhook Router
var subscriber = require('express').Router();

// Package Dependencies
var request = require('request')

// Local Dependencies
const facebookAuth = require('../config/facebook_auth')
const facebookApp = require('../config/facebook_app')

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
        fields: ['pages_messaging'],
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