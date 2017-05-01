// Package Dependencies
var sender = require('express').Router(); //TODO: Does this need to be a router? Text with exports. 
var request = require('request')

// Local Dependencies
var messageTemplates = require('@bot_messenger/config/message_templates');
const facebookAuth = require('@bot_messenger/config/facebook_auth');

// Send Message 
sender.sendMessage = function(recipientId, messageText, templateName) {
  console.log('\  Sending a message back to Facebook...');

  // Intialize the messageData object that FB will recieve
  var messageData = {
     recipient: {
        id: recipientId
    }
  }

  // Switch the {message: text: ... } component depending on which template we're using
  if (templateName) {
  switch (templateName) {
    case 'structured':
      // if the text is 'structured', return the Structured Message template
      messageData["message"] = messageTemplates.structuredMessage();
      break;
    case 'echo':
      messageData["message"] = messageTemplates.echoMessage(messageText);
      break;      
    default:
      console.log("Saw nothing; default echo.")
      messageData["message"] = messageTemplates.echoMessage(messageText);
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
      console.log(messageData)
      //console.error(response); // Dumps the whole response; very messy console
      console.error(error); // Should still get the error though
    }
  });
}

module.exports = sender;
