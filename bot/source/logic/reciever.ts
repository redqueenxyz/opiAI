// Recieves objects from Facebook

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'

// Local Dependencies
import { whichUser, surveyAssigner, surveySaver } from './asker'
import { sendMessage, sendTextMessage } from './sender'

// Recieving Messages 
export default async function reciever(req: facebook.Request, res: facebook.Response) {
  console.log('...Object recieved: ', data)

  // Encapsulate
  const data = req.body;

  if (data.object === 'page') {
    console.log('...Identifying object...');

    // Iterate over each event in the object
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        // Event parameters
        const userID: string = event.sender.id;
        const recipientID: string = event.recipient.id;
        const timeOfPostback: Date = event.timestamp;

        // Potentially Undefined
        const message: string = (event.message || false);
        const messagePostback: string = (event.postback ? event.postback.payload : false);
        const messagePayload: string = (message.quick_reply ? message.quick_reply.payload : false); // if a is true ? assign b, else var is false

        // Checks which user, their surveys, and sends them questions!
        whichUser(userID);

        if (messagePostback) {
          console.log('...Postback Recieved: ', { event });

          // Grab the postback
          const postbackText: string = event.postback.payload;

          // Assign them their survey
          surveyAssigner(userID, postbackText);

        } if (messagePayload) {
          console.log('...Payload Recieved: ', { event });

          // Grab the payload 
          const messagePayload = parseInt(message.quick_reply.payload)
          let messageText = message.text;

          // Save their answer
          surveySaver(userID, messagePayload, messageText);

        } else if (message && !message.postback && !message.payload) {
          // If it has a message component, run recievedMessage()
          console.log('...Message Recieved: ', { event });

          // Message parameters
          let messageId = message.mid;
          let messageText = message.text;

          // Lol
          let emojis = [
            '😀', '😂', '😇', '😍', '😘',
            '😛', '😎',
            '😤', '😵', '😳', '😨',
            '😴', '😬',
          ];

          const randomNumber = Math.floor(emojis.length * Math.random());

          sendTextMessage(userID, emojis[randomNumber]);
        } else {
          console.log('...Unknown Object Recieved:', { event });
        }
      });
    });
  }
};
