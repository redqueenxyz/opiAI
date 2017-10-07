// Sends messages back to Facebook

// Dependencies
import { } from 'dotenv/config'
import * as request from 'request'
import * as logger from 'winston'

// Facebook Send API 
/** This function interacts with the Facebook Send Api, so it is called with every message template, and handles actually submitting the final POST request to the Send API / Facebook Messenger */
async function callSendAPI(messageData: JSON) {
  // Log
  console.log('...Preparing Object: ', { messageData });

  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: process.env.FACEBOOK_PAGE_TOKEN },
    method: 'POST',
    json: messageData, // actual message to send to the Send API 

  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      console.log(' Sending Successful! ', {
        status: response.statusCode,
      });
    } else {
      console.log(' Sending Error... ', {
        error: error,
      });
    }
  });
};


// Send Any Message
export async function sendMessage(recipientId: string, messageObject: JSON) {
  // Intialize the messageData object that FB will recieve
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: messageObject,
  };
  callSendAPI(messageData);
};


// Send Text Message 
export async function sendTextMessage(recipientId: string, messageText: string) {
  // Intialize the messageData object that FB will recieve
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };
  callSendAPI(messageData);
};
