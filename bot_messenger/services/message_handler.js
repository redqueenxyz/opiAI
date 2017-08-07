// This script handles recieved message objects

// Export
let message_handler = module.exports = {};

// Package Dependencies
let logger = require('winston');

// Local Dependencies
let sender = require('../routes/object_sender');
let surveyer = require('../services/survey_handler');

// Message Handler
message_handler.receivedMessage = function(event) {
      logger.info('Deciding Response to Message Object...');

      // Event parameters
      let userID = event.sender.id;
      let recipientID = event.recipient.id;
      let message = event.message;

      // Message parameters
      let messageId = message.mid;
      let messageText = message.text;

      if (message.text == 'test_structured') {
            // Structured Message Test
            sender.sendStructuredMessage(userID);
      } else if (message.text == 'test_survey') {
            // Survey Test
            surveyer.surveyStarter(userID, 'survey_0');
      } else {
            surveyer.userFinder(userID);

            // Lol
            let emojis = [
                  '😀', '😂', '😇', '😍', '😘',
                  '😛', '🤑', '🤗', '😎',
                  '😤', '😵', '😳', '😨',
                  '😴', '😬',
            ];

            randomNumber = parseInt(emojis.length * Math.random());

            sender.sendTextMessage(userID, emojis[randomNumber]);
      }
};
