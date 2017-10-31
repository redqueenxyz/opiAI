// Sends messages back to Facebook

// Dependencies
import * as request from 'request'

// Facebook Send API 
/** This function interacts with the Facebook Send Api, so it is called with every message template, and handles actually submitting the final POST request to the Send API / Facebook Messenger */
async function callSendAPI(messageData: object) {
  // Log
  console.log(`...Sending Response: ${messageData}`)

  request({
    uri: 'https://graph.facebook.com/v2.10/me/messages', // The API endpoint to POST to
    qs: { access_token: process.env.FACEBOOK_PAGE_TOKEN },
    method: 'POST',
    json: messageData, // actual message to send to the Send API 

  }, (error: request.Error, response: request.Response, body: request.body) => {
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      console.log(` Sending Successful!`)
    } else {
      console.log(` Sending Error! ${error.stack} `)
    }
  });
};

export async function callMessengerProfile(settingData: object) {
  // Log
  console.log(`...Setting parameter: ${settingData}`)

  return request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile', // The API endpoint to POST to
    qs: { access_token: process.env.FACEBOOK_PAGE_TOKEN },
    method: 'POST',
    json: settingData, // setting to send to the Messenger API 

  }, (error: request.Error, response: request.Response, body: request.body) => {
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      console.log(` Saving Successful!`)
    } else {
      console.log(response)
      console.log(` Saving Error! ${error}`)
    }
  });
};

// Send Any Message
export async function sendMessage(recipientId: string, messageObject: object) {
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
