// Sends messages back to Facebook

// Dependencies
import * as request from 'request'
import * as logger from 'winston'

// Facebook Send API 
/** This function interacts with the Facebook Send Api, so it is called with every message template, and handles actually submitting the final POST request to the Send API / Facebook Messenger */
export async function callSendAPI(messageData: JSON) {
  // Log
  logger.info('...Preparing Object: ', { messageData });

  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: facebook.pageAccessToken },
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
object_sender.sendMessage = async (recipientId, messageObject) => {
  // Intialize the messageData object that FB will recieve
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: messageObject,
  };
  object_sender.callSendAPI(messageData);
};


// Send Text Message 
object_sender.sendTextMessage = async (recipientId, messageText) => {
  // Intialize the messageData object that FB will recieve
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };
  object_sender.callSendAPI(messageData);
};

// Send Templates
object_sender.sendStructuredMessage = async (recipientId) => {
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
  object_sender.callSendAPI(messageData);
};


/** This function demonstrates the Quick Reply capability which provides the users buttons to respond and returns a defined payload */
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
object_sender.sendQuickReply = function (recipientId, question1) {
  console.log('\nWe heard \'quick reply\', get the Quick Reply template!');
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: 'Pick a color:',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: 'answered_q1', // Recieves this payload back as the new 'message, so maybe just grab this and toss it into FB as part of the 'incoming' loop?
          // TODO: Maybe explore Postbacks for Quick Replies, if necesssary
          image_url: 'http://petersfantastichats.com/img/red.png', // Even takes a cute little image for friendliness
          // TODO: Emojis?!
        },
        {
          content_type: 'text',
          title: 'Green',
          payload: 'answered_q1',
          image_url: 'http://petersfantastichats.com/img/green.png',
        },
      ],
    },
  };
  object_sender.callSendAPI(messageData);
};

object_sender.sendQuickHello = async (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: 'Hello, I\'m Opi! Ready to get started?',
      quick_replies: [
        {
          content_type: 'text',
          title: '😊',
          payload: 'intro', // Recieves this payload back as the new 'message, so maybe just grab this and toss it into FB as part of the 'incoming' loop?
          // TODO: Maybe explore Postbacks for Quick Replies, if necesssary
          image_url: 'http://petersfantastichats.com/img/red.png', // Even takes a cute little image for friendliness
          // TODO: Emojis?!
        },
        {
          content_type: 'text',
          title: 'Green',
          payload: 'answered_q1',
          image_url: 'http://petersfantastichats.com/img/green.png',
        },
      ],
    },
  };
  object_sender.callSendAPI(messageData);
};


