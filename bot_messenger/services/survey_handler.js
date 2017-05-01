// This script should handle the individual surveys

// Should lookup the user and see if they have an active survey
// 
// Lookup that survey's postback code (also the unique identifier for the survey)
// Once that postback code is verified, iterate through Quick Replies until the final quick reply postback is achieved
// If a message is recieved inbetween > message_handler
// Else should expect all interactions through postback_handler 

// Export
var surveyer = module.exports = {};

// // Local Dependencies
// var firebase = require('@bot_messenger/services/database_handler')
// var sender = require('@bot_messenger/routes/facebook_sender')

// surveyer.surveyChecker = function(recipientId, messageText) {
//   firebase.db.ref("surveys/survey_1/postback").once("value", function(snapshot) {
//     // console.log(snapshot.val())
//   if (snapshot.val() == "survey_1") { // Check if the postback matches
//     console.log("Postback matches a survey!")
//     surveyLooper(recipientId, messageText)
//   } else {
//     console.log("Postback matches no survey in the database; check the postback?")
//   }
//   // var survey = snapshot.val();  // Can't assign in Firebase callback; async calls; instead create a function to lookup
//   });
// }

// surveyer.surveyLooper = function (recipientId, messageText) {
//   if (postbackText  == "answered_q1") {
//     firebase.db.ref("surveys/survey_1/q1").once("value", function(snapshot) {
//     sender.SendMesage(recipientId, snapshot.val())
//   });
//   } else {
//   }
// }

// surveyer.surveyChecker()

module.exports = surveyer; // export this as 'routes'