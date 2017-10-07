// Recieves objects from Facebook

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'

// Local Dependencies
import { whichUser, surveyAssigner, surveyAnswerSaver } from './asker'
import { sendMessage, sendTextMessage } from './sender'

// Recieving Messages 
export default async function reciever(req: facebook.Request, res: facebook.Response) {

  console.log("In here!")
  // Encapsulate
  const data = req.body;

  // Log
  console.log('...Object recieved: ', data)

  if (data.object === 'page') {
    // Log
    console.log('...Identifying object...');

    // Iterate over each event in the object
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        // Event parameters
        const userID = event.sender.id;
        const recipientID = event.recipient.id;
        const timeOfPostback = event.timestamp;

        // Potentially Undefined
        const message = (event.message || false);
        const messagePostback = (event.postback ? event.postback.payload : false);
        const messagePayload = (message.quick_reply ? message.quick_reply.payload : false); // if a is true ? assign b, else var is false

        // Checks which user, their surveys, and sends them questions!
        whichUser(userID);

        if (messagePostback) {
          console.log('...Postback Recieved: ', { event });

          // Grab the postback
          const postbackText = event.postback.payload;

          // Assign them their survey
          surveyAssigner(userID, postbackText);

        } if (messagePayload) {
          console.log('...Payload Recieved: ', { event });

          // Grab the payload 
          const messagePayload = message.quick_reply.payload;

          // Save their answer
          surveyAnswerSaver(userID, messagePayload, messageText);

        } else if (message && !message.postback && !message.payload) {
          // If it has a message component, run recievedMessage()
          console.log('...Message Recieved: ', { event });

          // Message parameters
          let messageId = message.mid;
          let messageText = message.text;

          // Lol
          let emojis = [
            '😀', '😂', '😇', '😍', '😘',
            '😛', '🤑', '😎',
            '😤', '😵', '😳', '😨',
            '😴', '😬',
          ];

          const randomNumber = parseInt(emojis.length * Math.random());

          sendTextMessage(userID, emojis[randomNumber]);
        } else {
          console.log('...Unknown Object Recieved:', { event });
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
  }
};
