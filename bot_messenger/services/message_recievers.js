// Series of helper functions to aid recieving messages

// Exports
var recievers = module.exports = {};

// Local Dependencies
var sender = require('@bot_messenger/routes/facebook_sender')

// Messages
recievers.receivedMessage = function(event) {

  console.log('\nThe message object contains:\n')
  console.log(event);

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("\n     The received message for our bot %d from page %d and the timestamp %d is: \"%s\" ",
    senderID, recipientID, timeOfMessage, message.text); // Turn just the message from JSON into a string

  console.log('\nThe message component inside the message event contains: \n')
  console.log(message);

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  console.log("\n  The message id is %s, it\'s sequence number is %s, and it says: \"%s\" \n",
    messageId, message.seq, messageText); // Modify if message.attachments is necessary


  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // if so, send it to a given template, else defaultt o sendtextMessage() which just echoes the text we received.
    switch (messageText) {
      case 'generic':
        // if the text is 'generic', run the Structured Message example
        sender.sendGenericMessage(senderID);
        break;
      default:
        // else, run the general Echo example
        sender.sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    // If there's an attachment, run the general sendTextMessage() function, but with the defined text 'message with attachment recieved'.
    sender.sendTextMessage(senderID, "Message with attachment received");
  }
}


/** This function runs when we recieve a postback, and decides how to handle it  */
recievers.receivedPostback = function(event) {
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
  sender.sendTextMessage(senderID, "Postback called");
}
