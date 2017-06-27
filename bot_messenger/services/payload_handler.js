// This script handles recieved payloads, which is what we get whenever anyone answers a survey question (A QR) 

// Export
var payload_handler = module.exports = {};

// Dependencies
var firebase = require('../services/database_handler')
var sender = require('../routes/object_sender')
var survey_handler = require('../services/survey_handler')

payload_handler.recievedPayload = function (event) {

 // TODO: These are also stored in logging_handler and object_reciever; need to fix these 
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  var messageId = message.mid;
  var messageText = message.text;
  var messagePayload = message.payload;

  // TODO: Save answers, then load next question
  survey_handler.answerSaver(senderID, "survey_1", 1, messageText)
}