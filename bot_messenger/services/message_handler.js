// This script handles recieved messages, and hands off to either the facebook_sender or the survey_handler as necessary 

// Export
var message_handler = module.exports = {};

// Local Dependencies
sender = require('@bot_messenger/routes/facebook_sender')

// Message Handler
// The primary handler; looks for a string in a message and responds as necessary 
message_handler.receivedMessage = function(event) {

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
        sender.sendMessage(senderID, messageText, "structured");
        break;
      default:
        // else, run the general Echo example
        sender.sendMessage(senderID, messageText, "echo");
    }
  } else if (messageAttachments) {
    // If there's an attachment, run the general sendTextMessage() function, but with the defined text 'message with attachment recieved'.
    sender.echoMessage(senderID, "Message with attachment received");
  }
}