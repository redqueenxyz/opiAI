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
      var userID = event.sender.id;
      var recipientID = event.recipient.id;
      var message = event.message;

      // Message parameters
      var messageId = message.mid;
      var messageText = message.text;

      if (message.text == 'test_structured') {
            // Structured Message Test
            object_sender.sendStructuredMessage(userID);
      } else if (message.text == 'test_survey') {   
            // Survey Test
            survey_handler.surveyStarter(userID, "survey_0")
      } else {            
      survey_handler.userFinder(userID)

      // Lol
      var emojis = [
          '😀', '😂', '😇', '😍', '😘',
          '😛', '🤑', '🤗', '😎',
          '😤', '😡', '😵', '😳', '😨',
          '😴', '😬'
      ];

      randomNumber = parseInt(emojis.length * Math.random()); 

      object_sender.sendTextMessage(userID, emojis[randomNumber]);
      }
}
