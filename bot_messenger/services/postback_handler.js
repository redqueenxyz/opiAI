// This script handles recieved postbacks, and decides if people get a survey
// TODO: Finish this for pre-alpha? 

// Local Dependencies
sender = require('../routes/object_sender')
// surveyer = require('../services/payload_sender')


// This function runs when object_reciever.js a postback, and decides how to handle it 
receivedPostback = function (event) {
  // TODO: Finish the survey checker logic. 

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var postback = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // Lookup that Postback ID using the survey Checker
  //     surveyer.surveyChecker(senderID);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful

  // TODO: Do some checking to ensure the payload from the AD (typically the AD Campaign ID itself) using case checking from before
  // Totally works, but switching to ads to make sure we can generate these ad campaigns quickly
  sender.echoMessage(senderID, "Postback called");
}

// surveyChecker(): 
// For random messages, run the surveyChecker and push them into a survey if they haven't done one
// surveyer.surveyChecker = function (recipientId, payloadText, responseText) {
//   firebase.db.ref("surveys/survey_1/postback").once("value", function (snapshot) {
//     // console.log(snapshot.val())
//     if (snapshot.val() == "survey_1") { // Check if the postback matches
//       console.log("Postback matches a survey!")
//       surveyer.surveyLooper(recipientId, payloadText)
//     } else {
//       console.log("Postback matches no survey in the database; check the postback?")
//     }
//     // var survey = snapshot.val();  // Can't assign in Firebase callback; async calls; instead create a function to lookup
//   });
// }
//   Lookup the postback provided, and start that survey for that user
//   If a user randomly messages, lookup the user and see if they still have an active survey
//      If yes, loop them through the highest priority survey with surveyLooper() 
//      Else, no surveys, send the response 'No surveys!' 




// FIXME: Psuedocode. 

// Checks if a user has available survey by checking an ad's campaign postback code against DB. 
// surveyLookup(postbackText): 
//   returns surveyCode 


// Checks if a user has available survey by checking an ad's campaign postback code against DB. 
// surveyChecker(recepientID, postbackText, surveyCode):
// if True
//    check that user's status on that survey
// if False
//    start this user on that survey
// If clicked on a messenger ad, will be given a unique postback (should match the one in Firebase db)
