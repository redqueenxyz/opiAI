// Recieves objects from Facebook

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as express from 'express'

// Local Dependencies
import { whichUser, surveyAssigner, surveySaver } from './asker'
import { sendMessage, sendTextMessage } from './sender'

// Recieving Messages 
export default async function reciever(req: express.Request, res: express.Response) {
  console.log(`...Request recieved: ${req}`)

  // Encapsulate
  const data = req.body;

  if (data.object === 'page') {
    console.log('...Identifying object...');

    // Iterate over each event in the object
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        console.log(`Recieved Event: ${event}. Parsing...`)

        console.log(JSON.stringify(event))
        // Event parameters
        const eventID: string = event.id;
        const userID: string = event.sender.id;
        const timestamp: Date = event.timestamp;
        const botID: string = event.recipient.id;

        // Message parameters
        const message: object = event.message ? event.message.text : undefined
        const messagePostback: string = event.postback ? event.postback.paylod : undefined
        const messagePayload: number = event.message.quickly_reply ? parseInt(event.message.quick_reply.payload) : undefined

        if (messagePostback) {
          console.log('...Postback Recieved: ', { event });
          // Assign them their survey
          surveyAssigner(userID, messagePostback);

        } else if (messagePayload) {
          console.log('...Payload Recieved: ', { event });
          // Grab the payload 
          surveySaver(userID, messagePayload, messageText);

        } else if (message && !messagePostback && !messagePayload) {
          // If it has a message component, run recievedMessage()
          console.log('...Message Recieved: ', { event });

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

        // Checks which user, their surveys, and sends them questions!
        whichUser(userID);

      });
    });
  }
};
