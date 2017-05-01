// Series of helper functions to aid sending message templates

// Exports
var senders = module.exports = {};

senders.echoMessage = function(messageText) {
  console.log('\nUse the Echo template!');
  return messageText
  };

/**************/
// Sending Helpers
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes 
/**************/

/** This function sends a text message back to the User with the message Text it was called with (in the example, it's called with incoming messageText) */

// var messageData = {
//  recipient: {
//       id: recipientId
//     },
//     message: {
//       text: messageText
//     }
//   };

// function sendTextMessage(recipientId, messageText) {
//   console.log('\nWe heard nothing special, get the Echo template!');
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       text: messageText
//     }
//   };

//   callSendAPI(messageData);
// }

// //** This function demonstrates the Structured Response capability, and takes a more complex JSON object back to the Messenger API */
// // Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template

// function sendGenericMessage(recipientId) {
//   console.log('\nWe heard \'generic\', get the Structured Message template!');
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "generic",
//           elements: [{
//             title: "rift",
//             subtitle: "Next-generation virtual reality",
//             item_url: "https://www.oculus.com/en-us/rift/",
//             image_url: "http://messengerdemo.parsebot.com/img/rift.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/rift/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for first bubble",
//             }],
//           }, {
//             title: "touch",
//             subtitle: "Your Hands, Now in VR",
//             item_url: "https://www.oculus.com/en-us/touch/",
//             image_url: "http://messengerdemo.parsebot.com/img/touch.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/touch/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for second bubble",
//             }]
//           }]
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }


