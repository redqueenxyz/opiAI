// This script handles recieved payloads, which is what we get whenever anyone answers a survey question (A QR) 

// Export
var payload_handler = module.exports = {};

// Dependencies
var firebase = require('../services/database_handler')
var sender = require('../routes/object_sender')

payload_handler.recievedPayload = function (event) {

  console.log('\nThe payload handler worked kinda!\n')

 // TODO: These are also stored in logging_handler and object_reciever; need to fix these 
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  var messageId = message.mid;
  var messageText = message.text;
  var messageQuickReply = message.quick_reply;

  // Check their survey status
  
  // if (!messageQuickReply) == 'undefined') {
  //   // If we receive a text message, check to see if it matches a keyword
  //   // if so, send it to a given template, else defaultt o sendtextMessage() which just echoes the text we received.
  //   switch (messageText) {
  //     case 'structured':
  //       // if the text is 'generic', run the Structured Message example
  //       sender.sendStructuredMessage(senderID);
  //       break;
  //     case 'survey':
  //       // if the text is 'generic', run the Structured Message example
  //       // surveyer.surveyChecker(senderID, messageText); // FIXME: Temporarily hijacking message checker; final version should use postbacks
  //       break;
  //     default:
  //       // else, run the general Echo example
  //       sender.sendTextMessage(senderID, messageText);
  //   }
  // } if (messageQuickReply) {
  //   console.log('Payload recieved!')
  //   // surveyer.surveyChecker(senderID, messageQuickReply.payload) // QuickReply has an internal object called payload; that's what we need
  // }
  // else if (messageAttachments) {
  //   // If there's an attachment, run the general sendTextMessage() function, but with the defined text 'message with attachment recieved'.
  //   // sender.sendTextMessage(senderID, "Message with attachment received");
  // }
}


// // surveyLooper():
// //   For every QR response, will get a postback, so:
// //      If postback is answered_qX_survey_X, send them qX+2 and update status + 1 
// //      Else If status is 0% complete, get the first question
// //   Loop and update 'status' until status is 100%
// //       Return 'No surveys!' 

// // Once that postback code is verified, iterate through Quick Replies until the final quick reply postback is achieved
// // If a message is recieved inbetween > message_handler
// // Else should expect all interactions through postback_handler 


// // Get a database reference to our posts
// // var db = admin.database();
// // var ref = db.ref("server/saving-data/fireblog/posts")

// // Attach an asynchronous callback to read the data at our posts reference
// // ref.on("value", function(snapshot) {
// //   console.log(snapshot.val());
// // }, function (errorObject) {
// //   console.log("The read failed: " + errorObject.code);
// // });




// // TODO: Save each payload response, increment the survey's status, and then loop until through
// surveyer.surveyLooper = function (recipientId,  payloadText) {
//   if (payloadText == "answered_q1") {
//     firebase.db.ref("surveys/survey_1/q2").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
//   } else if (payloadText == "answered_q2") {
//     firebase.db.ref("surveys/survey_1/q3").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
//   } else if (payloadText == "answered_q3") {
//     firebase.db.ref("surveys/survey_1/q4").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
//   } else if (payloadText == "answered_q4") {
//     firebase.db.ref("surveys/survey_1/q5").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
//   } else if (payloadText == "answered_q5") {
//     sender.sendTextMessage(recipientId, "Survey done!")
//   } else {
//     firebase.db.ref("surveys/survey_1/q1").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
//   }
// }

// // surveyer.surveyChecker()