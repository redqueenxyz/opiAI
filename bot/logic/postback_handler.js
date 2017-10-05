// This script handles recieved postbacks, and decides what to do with them

// Export 
module.exports = {};

// Package Dependencies
let logger = require('winston');

// Local Dependencies
let { userFinder, surveyAssigner } = require('../services/survey_handler');


// When object_reciever.js a postback, decides how to handle it 
module.exports.receivedPostback = async (event) => {
  logger.info('Deciding Response to Postback Object...');

  const userID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;

  const postbackText = event.postback.payload;

  // Check and send them into the next question
  userFinder(userID);

  // Assign them their survey
  surveyAssigner(userID, postbackText);
};
