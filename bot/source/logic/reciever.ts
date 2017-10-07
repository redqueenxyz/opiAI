// Recieves objects from Facebook

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as logger from 'winston'
import * as express from 'express'

// Local Dependencies
import { userFinder, surveyAssigner, surveyAnswerSaver } from './asker'
import { sendMessage, sendTextMessage } from './sender'

// Recieving Messages 
export default async function reciever(req: facebook.Request, res: facebook.Response) {
  // Authorize
  authorizer(req, res)

  console.log("In here!")
  // Encapsulate
  const data = req.body;

  // Log
  console.log('...Object recieved: ', data)

  if (data.object === 'page') {
    // Log
    console.log('...Identifying object...');

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
          console.log('...Postback Recieved: ', { event });
          console.log('Deciding Response to Postback Object...');

          const postbackText = event.postback.payload;

          // Check and send them into the next question
          userFinder(userID);

          // Assign them their survey
          surveyAssigner(userID, postbackText);

        } if (messagePayload) {
          console.log('...Payload Recieved: ', { event });
          console.log('Deciding Response to Payload Object...');

          const messagePayload = message.quick_reply.payload;

          // Save their answer
          surveyAnswerSaver(userID, messagePayload, messageText);

          // Check and send them into the next question
          userFinder(userID);
        } else if (message && !message.postback && !message.payload) {
          // If it has a message component, run recievedMessage()
          console.log('...Message Recieved: ', { event });
          console.log('Deciding Response to Message Object...');

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

          sendTextMessage(userID, emojis[randomNumber]);

        } else {
          console.log('...Unknown Object Recieved:', { event });
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
  }
};

export async function authorizer(req: Request, res: Response) {
  console.log('Authorizing bot with Facebook...');
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
    console.log('Webhook validated!');
  } else {
    console.log('Failed validation. Make sure the validation tokens match.');
    res.status(403).send
  }
};
