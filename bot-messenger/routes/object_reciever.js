// Recieves objects from Facebook

// Package Dependencies
let reciever = require('express').Router();
let bodyParser = require('body-parser');
let logger = require('winston');

// Local Dependencies
let message_handler = require('../services/message_handler');
let postback_handler = require('../services/postback_handler');
let payload_handler = require('../services/payload_handler');

// Parsing
reciever.use(bodyParser.json());
reciever.use(bodyParser.urlencoded({ extended: true }));

// Recieving Messages 
reciever.post('/', function (req, res) {
  // Encapsulate
  let data = req.body;

  // Log
  logger.info('...Object recieved: ', { data });

  if (data.object === 'page') {
    // Log
    logger.info('...Identifying object...');

    // Iterate over each event in the object
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        // Event parameters
        let userID = event.sender.id;
        let recipientID = event.recipient.id;

        // Potentially Undefined
        let message = (event.message || false);
        let messagePostback = (event.postback ? event.postback.payload : false);
        let messagePayload = (message.quick_reply ? message.quick_reply.payload : false); // if a is true ? assign b, else var is false

        if (messagePostback) {
          logger.warn('...Postback Recieved: ', { event });
          postback_handler.receivedPostback(event);
        } if (messagePayload) {
          logger.warn('...Payload Recieved: ', { event });
          payload_handler.recievedPayload(event);
        } else if (message && !message.postback && !message.payload) {
          // If it has a message component, run recievedMessage()
          logger.warn('...Message Recieved: ', { event });
          message_handler.receivedMessage(event);
        } else {
          logger.info('...Unknown Object Recieved:', { event });
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
    res.sendStatus(200);
  }
});

module.exports = reciever;
