// Recieves objects from Facebook

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as logger from 'winston'

// Local Dependencies
import { userFinder, surveyAssigner, surveyAnswerSaver } from 'asker'
import { auther } from 'auther'

// Recieving Messages 
let reciever = functions.https.onRequest(async (req, res) => {
  // Encapsulate
  const data = req.body;

  // Log
  logger.info('...Object recieved: ', { data });

  if (data.object === 'page') {
    // Log
    logger.info('...Identifying object...');

    // Iterate over each event in the object
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        // Event parameters
        const userID = event.sender.id;
        const recipientID = event.recipient.id;
        const timeOfPostback = event.timestamp;

        // Potentially Undefined
        const message = (event.message || false);
        const messagePostback = (event.postback ? event.postback.payload : false);
        const messagePayload = (message.quick_reply ? message.quick_reply.payload : false); // if a is true ? assign b, else var is false

        if (messagePostback) {
          logger.warn('...Postback Recieved: ', { event });
          logger.info('Deciding Response to Postback Object...');

          const postbackText = event.postback.payload;

          // Check and send them into the next question
          userFinder(userID);

          // Assign them their survey
          surveyAssigner(userID, postbackText);

        } if (messagePayload) {
          logger.warn('...Payload Recieved: ', { event });
          logger.info('Deciding Response to Payload Object...');

          const messagePayload = message.quick_reply.payload;

          // Save their answer
          surveyAnswerSaver(userID, messagePayload, messageText);

          // Check and send them into the next question
          userFinder(userID);
        } else if (message && !message.postback && !message.payload) {
          // If it has a message component, run recievedMessage()
          logger.warn('...Message Recieved: ', { event });
          logger.info('Deciding Response to Message Object...');

          // Message parameters
          let messageId = message.mid;
          let messageText = message.text;

          // Check and send them into the next question
          userFinder(userID);

          // Lol
          let emojis = [
            '😀', '😂', '😇', '😍', '😘',
            '😛', '🤑', '🤗', '😎',
            '😤', '😵', '😳', '😨',
            '😴', '😬',
          ];

          const randomNumber = parseInt(emojis.length * Math.random());

          sender.sendTextMessage(userID, emojis[randomNumber]);

        } else {
          logger.info('...Unknown Object Recieved:', { event });
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
    res.status(200).send()
  }
});

// Export Router
export { reciever }
