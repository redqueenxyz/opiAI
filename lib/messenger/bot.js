/**************/
// Intro
/**************/

// This is main file containing code implementing the Express server and functionality for the Messenger Bot
// For this to work, you need to create the following:
// 
//    * Facebook Page - Subscribes the bot to a given Facebook Page so it can recieve all of its messages/events
//    * Facebook App - Creates an app that has an App ID, App Secret, which are necessary (Currently hardcoded, but will be removed eventually)
//    * Facebook App > Messenger - Generates a Page Token for Messenger, and allows the Webhook to subscribe to a given page.
//    * Facebook App > Webhooks - Sets up a callback URL at the `/webhook` endpoint, whether it's hosted via Ngrok, Heroku, or GAE (Requires the messages, messaging_postback permissions)
//    * Facebook App > Webhooks > Verify Token - Defines a string that this app will hand to FB to prove it's connecting through the endpoint (400s otherwise)
// 
// Base: https://glitch.com/edit/#!/messenger-bot
// Quickstart: https://developers.facebook.com/docs/messenger-platform/guides/quick-start
// Additional: https://www.gitbook.com/book/node-bloggers/creating-a-fb-messenger-bot-with-nodejs/details


/**************/
/// Setup
/**************/

'use strict';

// Packages
const express = require('express');
const bodyParser = require('body-parser'); // handle POST requests
const request = require('request');
const path = require('path');
const date = require('datejs');


// Routing via Express JS
let app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({  // support encoded bodies
  extended: true
}));



function saveToFirebase(senderId, payload) {
  var userAnswers = firebase.database().ref("userAnswers/" + senderId);
  userAnswers.set({
    answer: payload
  })
}



// Start Message
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart, as modified for feedbackAI. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.</body></html>";


/**************/
// Authorization
// Typically takes a couple seconds to authorize before going live; don't be surprised if there is a delay!
/**************/

// Webhook Validation
// Retrives variables from .env for consistency/security. 
// @v: Haven't got this to work yet for GAE, currently using a hacky or (`||`) to pass variables; must have something to do with not being able to access the .env shell script at runtime
// TODO: Find a cleaner solution to incorporate process.env.variables 

/** This function validates the webhook endpoint by passing FB back the variables we defined in our app documentation */
app.get('/webhook', function (req, res) {
  if (

    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VERIFY_TOKEN) {

    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);

  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/** This function returns a 200 and displays a simple webpage using the messengerButton component defined up there */
app.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(messengerButton);
  res.end();
});


/**************/
//  Server 
/**************/

// Set Express to listen out for HTTP requests
var server = app.listen(PORT, function () {
  // TODO: Again, using a hacky boolean solution to what should be passed through in that process.env shell file; app prefers port 3000 for some reason. 
  console.log("Listening on port %s", server.address().port);
});

