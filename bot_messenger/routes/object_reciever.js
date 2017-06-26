// Recieves objects from Facebook

// Package Dependencies
var reciever = require('express').Router();
var bodyParser = require('body-parser')
var logger = require('winston')

// Local Dependencies
message_handler = require('../services/message_handler')
postback_handler = require('../services/postback_handler')
payload_handler = require('../services/payload_handler')

// Parsing
reciever.use(bodyParser.json());
reciever.use(bodyParser.urlencoded({ extended: true }));

// Recieving Messages 
reciever.post('/', function (req, res) {

  // Encapsulate
  var data = req.body;

  // Log
  logger.info("...Object recieved: ", {data})
  
  if (data.object === 'page') {
  // Log
  logger.verbose("...Identifying object...")

    // Iterate over each event in the object
    data.entry.forEach(function (entry) {


      entry.messaging.forEach(function (event) {

        // Event parameters
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var message = event.message;

        // Message parameters
        var messageId = message.mid;
        var messageText = message.text;

        if (event.message && !event.postback && !event.payload) {
          // If it has a message component, run recievedMessage()
          logger.warn("...Message Recieved: ",{event})
          message_handler.receivedMessage(event);

        } else if (event.postback) {
          logger.warn("...Postback Recieved: ",{event})
          postback_handler.receivedPostback(event);

        } else if (event.payload) {
          logger.warn("...Payload Recieved: ",{event})
          payload_handler.recievedPayload(event);

          
        } else {
          logger.info("...Unknown Object Recieved:",{event})
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
    res.sendStatus(200);
  }
});

module.exports = reciever; 