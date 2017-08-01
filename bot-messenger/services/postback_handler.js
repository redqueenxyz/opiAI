// This script handles recieved postbacks, and decides if people get a survey

// Local Dependencies
const surveyer = require('../services/survey_handler');


// This function runs when object_reciever.js a postback, and decides how to handle it 
receivedPostback = function(event) {
  let userID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfPostback = event.timestamp;

  let postbackText = event.postback.payload;

  // Check and send them into the next question
  surveyer.userFinder(userID);

  // Assign them their survey
  surveyer.surveyer.surveyAssigner(userID, postbackText);
};
