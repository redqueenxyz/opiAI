// Package Dependencies
var sender = require('express').Router(); //TODO: Does this need to be a router? Text with exports. 
var request = require('request')

// Local Dependencies
var senders = require('@bot_messenger/services/message_senders')

// Auth
const facebookAuth = require('@bot_messenger/config/facebook_auth');

// Setup
sender.sendTextMessage = function(recipientId, messageText) {
  console.log('\nWe heard nothing special, get the Echo template!');
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: senders.echoMessage(messageText)
    }
  }

    callSendAPI(messageData);
  };


// Facebook Send API 
/** This function interacts with the Facebook Send Api, so it is called with every message template, and handles actually submitting the final POST request to the Send API / Facebook Messenger */
function callSendAPI(messageData) {
  console.log('\nMessage has been processed, attempting to send a response back to Facebook Send API...');
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: facebookAuth.pageAccessToken },
    // TODO: Maybe find a less hacky way to pass the PAGE_TOKEN to the API? Using boolean or here
    method: 'POST',
    json: messageData // actual message to send to the Send API 

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(messageData)

      // If there's NO error or the response is good (200), then print the message
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("\nSuccessfully sent message with id %s to recipient %s: \"%s\" !",
        messageId, recipientId, messageData.message.text);

    } else {
      console.error("Failed to send new message; check your errors!");
      //console.error(response); // Dumps the whole response; very messy console
      console.error(error); // Should still get the error though
    }
  });
}

module.exports = sender;
