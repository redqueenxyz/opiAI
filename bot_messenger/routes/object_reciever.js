// Recieves objects from Facebook

// Package Dependencies
var reciever = require('express').Router();
var bodyParser = require('body-parser')

// Local Dependencies
message_handler = require('../services/message_handler')
postback_handler = require('../services/postback_handler')
payload_handler = require('../services/payload_handler')
logging_handler = require('../services/logging_handler')

// Parsing
reciever.use(bodyParser.json());
reciever.use(bodyParser.urlencoded({ extended: true }));

// Recieving Messages 
reciever.post('/', function (req, res) {
  
  // Encapsulate
  var data = req.body;

  // Log Messages
  logging_handler.recieveObject(req);

  if (data.object === 'page') {
    // Iterate over each event in the object
    data.entry.forEach(function (entry) {

      entry.messaging.forEach(function (event) {
        if (event.message) {
          // If it has a message component, run recievedMessage()
          message_handler.receivedMessage(event);


        } else if (event.postback) {
          // if it has a postback component, run recievedPostback()
          postback_handler.receivedPostback(event);


        } else if (event.payload) {
          // if it has a postback component, run recievedPostback()
          payload_handler.recievedPayload(event);

          
        } else {
          console.log("It has neither a message nor a postback; we have received an unknown event: ", event);
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
    res.sendStatus(200);
  }
});

module.exports = reciever; // export this as 'routes'