// This script handles recieved payloads, which is what we get whenever anyone answers a survey question (A QR) 

// Export
var survey_handler = module.exports = {};

// Package Dependencies
var firebase = require('../services/database_handler')
var logger = require('winston')

// Local ependencies
var object_sender = require('../routes/object_sender')

survey_handler.surveyChecker = function (senderID) {
  logger.info("Checking if User has Survey...")

  // Firebase Checker
  // Lookup the Firebase for a User ID entry
  //  if no entry, offer a survey
  // if survey in progress, provide that one
  //  if it has a payload, it's come from an id, so save that survey id

  console.log("SenderId checked.")

  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var senderID = snapshot.val().senderID;
});
}

//   if firebase.db.ref("users/") // + userID == false): 
//   // then send him q1: 
//     firebase.db.ref("surveys/survey_1/q1").once("value", function (snapshot) {
//       sender.sendMessage(recipientId, snapshot.val())
//     });
// }

/**Saves users in Firebase */
survey_handler.saveUser = function (userId, firstName) {
  firebase.database().ref('users/' + userId).set({
    userID: userId,
    firstName: firstName
  });
}

// var usersRef = firebase.db.ref("users/")

// firebase.db.ref("users/").once("value", function (snapshot) {

//   });

//   // Check the current status of the user's completion
//   // Lookup that payload and chain the next response  
//   if ((messageQuickReply) == 'undefined') {
//     surveyer.surveyChecker(senderID);
//   } else if  ((messageQuickReply) == 'undefined') {
//     surveyer.surveyChecker(senderID);

//     // surveyer.surveyChecker(senderID, messageQuickReply.payload) // QuickReply has an internal object called payload; that's what we need
//   }
//   else if (messageAttachments) {
//     // If there's an attachment, run the general sendTextMessage() function, but with the defined text 'message with attachment recieved'.
//     // sender.sendTextMessage(senderID, "Message with attachment received");
//   }
// }


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
survey_handler.surveyLooper = function (recipientId, payloadText) {
  if (payloadText == "answered_q1") {
    firebase.db.ref("surveys/survey_1/q2").once("value", function (snapshot) {
      sender.sendMessage(recipientId, snapshot.val())
    });
  } else if (payloadText == "answered_q2") {
    firebase.db.ref("surveys/survey_1/q3").once("value", function (snapshot) {
      sender.sendMessage(recipientId, snapshot.val())
    });
  } else if (payloadText == "answered_q3") {
    firebase.db.ref("surveys/survey_1/q4").once("value", function (snapshot) {
      sender.sendMessage(recipientId, snapshot.val())
    });
  } else if (payloadText == "answered_q4") {
    firebase.db.ref("surveys/survey_1/q5").once("value", function (snapshot) {
      sender.sendMessage(recipientId, snapshot.val())
    });
  } else if (payloadText == "answered_q5") {
    sender.sendTextMessage(recipientId, "Survey done!")
  } else {
    firebase.db.ref("surveys/survey_1/q1").once("value", function (snapshot) {
      sender.sendMessage(recipientId, snapshot.val())
    });
  }
}

// // surveyer.surveyChecker()