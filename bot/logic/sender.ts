// Sends messages back to Facebook

// Dependencies
import { } from 'dotenv/config'
import * as request from 'request'
import * as logger from 'winston'

// Facebook Send API 
/** This function interacts with the Facebook Send Api, so it is called with every message template, and handles actually submitting the final POST request to the Send API / Facebook Messenger */
export async function callSendAPI(messageData: JSON) {
  // Log
  logger.info('...Preparing Object: ', { messageData });

  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: process.env.PAGETOKEN },
    method: 'POST',
    json: messageData, // actual message to send to the Send API 

  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      logger.warn(' Sending Successful! ', {
        status: response.statusCode,
      });
    } else {
      logger.warn(' Sending Error... ', {
        error: error,
      });
    }
  });
};


// TODO: Move these message templates.
// Send Any Message
export async function sendMessage(recipientId, messageObject) {
  // Intialize the messageData object that FB will recieve
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: messageObject,
  };
  exports.callSendAPI(messageData);
};


// Send Text Message 
export async function sendTextMessage(recipientId, messageText) {
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

// Send Templates
export async function sendStructuredMessage(recipientId) {
  console.log('\nWe heard \'generic\', get the Structured Message template!');
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: 'rift',
            subtitle: 'Next-generation virtual reality',
            item_url: 'https://www.oculus.com/en-us/rift/',
            image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
            buttons: [{
              type: 'web_url',
              url: 'https://www.oculus.com/en-us/rift/',
              title: 'Open Web URL',
            }, {
              type: 'postback',
              title: 'Call Postback',
              payload: 'Payload for first bubble',
            }],
          }, {
            title: 'touch',
            subtitle: 'Your Hands, Now in VR',
            item_url: 'https://www.oculus.com/en-us/touch/',
            image_url: 'http://messengerdemo.parseapp.com/img/touch.png',
            buttons: [{
              type: 'web_url',
              url: 'https://www.oculus.com/en-us/touch/',
              title: 'Open Web URL',
            }, {
              type: 'postback',
              title: 'Call Postback',
              payload: 'Payload for second bubble',
            }],
          }],
        },
      },
    },
  };
  exports.callSendAPI(messageData);
};
