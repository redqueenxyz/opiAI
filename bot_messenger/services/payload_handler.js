// This script handles recieved payloads, which is what we get whenever anyone answers a survey question (A QR) 

// Export
var payload_handler = module.exports = {};

// Dependencies
var survey_handler = require('../services/survey_handler')

payload_handler.recievedPayload = function (event) {

  console.log("In the payload handler.")
  
  var userID = event.sender.id;
  var message = event.message;
  var messageText = message.text;  
  var messagePayload = message.quick_reply.payload;

  // Save their answer
  survey_handler.surveyAnswerSaver(userID, messagePayload, messageText)

  // Check and send them into the next question
  survey_handler.userFinder(userID)
  
}