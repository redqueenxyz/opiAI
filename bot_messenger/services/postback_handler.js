// This script handles recieved postbacks, and decides if people get a survey

// Local Dependencies
survey_handler = require('../services/survey_handler')


// This function runs when object_reciever.js a postback, and decides how to handle it 
receivedPostback = function (event) {

  var userID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  var postbackText = event.postback.payload;

  // Assign them their survey
  survey_handler.survey_handler.surveyAssigner(userID, postbackText)

  // Check and send them into the next question
  survey_handler.userFinder(userID)
}
