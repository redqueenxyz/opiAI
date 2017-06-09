// This script should handle the individual surveys

// Logic:
// If clicked on a messenger ad, will be given a unique postback (should match the one in Firebase db)

// surveyChecker(): 
//   Lookup the postback provided, and start that survey for that user
//   If a user randomly messages, lookup the user and see if they still have an active survey
//      If yes, loop them through the highest priority survey with surveyLooper() 
//      Else, no surveys, send the response 'No surveys!' 

// surveyLooper():
//   For every QR response, will get a postback, so:
//      If postback is answered_qX_survey_X, send them qX+2 and update status + 1 
//      Else If status is 0% complete, get the first question
//   Loop and update 'status' until status is 100%
//       Return 'No surveys!' 

// Once that postback code is verified, iterate through Quick Replies until the final quick reply postback is achieved
// If a message is recieved inbetween > message_handler
// Else should expect all interactions through postback_handler 

// Export
var surveyer = module.exports = {};

// // Local Dependencies
var firebase = require('../services/database_handler')
var sender = require('../routes/facebook_sender')

// TODO: For random messages, run the surveyChecker and push them into a survey if they haven't done one
surveyer.surveyChecker = function (recipientId, payloadText) {
  firebase.db.ref("surveys/survey_1/postback").once("value", function (snapshot) {
    // console.log(snapshot.val())
    if (snapshot.val() == "survey_1") { // Check if the postback matches
      console.log("Postback matches a survey!")
      surveyer.surveyLooper(recipientId, payloadText)
    } else {
      console.log("Postback matches no survey in the database; check the postback?")
    }
    // var survey = snapshot.val();  // Can't assign in Firebase callback; async calls; instead create a function to lookup
  });
}

// TODO: Save each payload response, increment the survey's status, and then loop until through
surveyer.surveyLooper = function (recipientId, payloadText) {
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

// surveyer.surveyChecker()
module.exports = surveyer; // export this as 'routes'