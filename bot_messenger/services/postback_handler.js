// This script handles recieved postbacks, and hands off to either the facebook_sender or the survey_handler as necessary 

// Local Dependencies
sender = require('../routes/object_sender')

/** This function runs when we recieve a postback, and decides how to handle it  */
receivedPostback = function (event) {
  // TODO: Explore postbacks and see if they are helpful
  // Skipping the logic here for now; we'll come back if we need Postback functionality

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful

  // TODO: Do some checking to ensure the payload from the AD (typically the AD Campaign ID itself) using case checking from before
  // Totally works, but switching to ads to make sure we can generate these ad campaigns quickly
  sender.echoMessage(senderID, "Postback called");
}