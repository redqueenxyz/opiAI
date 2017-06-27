// This script handles recieved messages, and hands off to either the facebook_sender or the survey_handler as necessary 

// Export
var message_handler = module.exports = {};

// Package Dependencies
var logger = require('winston')

// Local Dependencies
object_sender = require('../routes/object_sender')
survey_handler = require('../services/survey_handler')

// Message Handler
// The primary handler; looks for a string in a message and responds as necessary 
message_handler.receivedMessage = function (event) {

      logger.info("Deciding Response to Message Object...")

      // Event parameters
      var senderID = event.sender.id;
      var recipientID = event.recipient.id;
      var message = event.message;

      // Message parameters
      var messageId = message.mid;
      var messageText = message.text;

      if (message.text == 'test_structured') {
            object_sender.sendStructuredMessage(senderID);
      } else if (message.text == 'test_survey') {
            survey_handler.surveyChecker(senderID);
      } else {

            var emojis = [
                '😀', '😂', '😇', '😍', '😘',
                '😛', '🤑', '🤗', '🤓', '😎',
                '😤', '😡', '😵', '😳', '😨',
                '😴', '🤔', '🤥', '😬', '🤐',
                '🤢', '🤧', '😷', '🤒', '🤕'
            ];

            randomNumber = parseInt(24 * Math.random()); 

            object_sender.sendTextMessage(senderID, emojis[randomNumber]);
      }
}
