// This script handles recieved payloads, which is what we get whenever anyone answers a survey question (A QR) 

// Export
let payload_handler = module.exports = {};

// Package Dependencies
let logger = require('winston');

// Dependencies
let surveyer = require('../services/survey_handler');

payload_handler.recievedPayload = async (event) => {
  logger.info('Deciding Response to Payload Object...');

  let userID = event.sender.id;
  let message = event.message;
  let messageText = message.text;
  let messagePayload = message.quick_reply.payload;

  // Save their answer
  surveyer.surveyAnswerSaver(userID, messagePayload, messageText);

  // Check and send them into the next question
  surveyer.userFinder(userID);
};
