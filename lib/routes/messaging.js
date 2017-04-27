// Dependencies
var app = require('express').Router();
var bodyParser = require('body-parser')
var request = require('request')

// Auth
const facebookAuth = require('lib/config/facebook_auth');

// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Messaging

app.post('/', function (req, res) {

  console.log('\n' + 'We have recieved a request!\n    The body is:\n');
  console.log(req.body);

  var data = req.body;

  // Make sure this is a page subscription; the Page subscription under Products > Messenger > Settings is switched on to the right page
  if (data.object === 'page') {
    console.log('\n' + 'It is a page object...\n    ');

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function (entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;


      // More pretty printing
      console.log('    The page is ' + pageID + '.') // TODO: Pass this to Firebase
      console.log('    The time is ' + Date(timeOfEvent).toString("MMM dd") + '.'); // TODO: Pass this to Firebase

      // Iterate over each messaging event inside the 'messaging' object passed earlier and decide what to do

      entry.messaging.forEach(function (event) {
        if (event.message) {

          // If it has a message component, run recievedMessage()
          console.log('\nIt has a message object, what\'s in it?')
          receivedMessage(event);

        } else if (event.postback) {
          // if it has a postback component, run recievedPostback()
          console.log('It has a postback object, how should we handle it?')
          receivedPostback(event);
        } else {
          console.log("It has neither a message nor a postback; we have received an unknown event: ", event);
        }
      });
    });

    // After processing, assume all went well
    //
    // You must send back a 200, within 20 seconds, to let FB know
    // we've successfully received the callback. Otherwise, the request
    // will time out and FB will keep trying to resend.
    res.sendStatus(200);
  }
});



//** This function runs when we recieve a message, and decides how to handle it  */
function receivedMessage(event) {

  console.log('\nThe message object contains:\n')
  console.log(event);

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("\n     The received message for our app %d from page %d and the timestamp %d is: \"%s\" ",
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
        sendGenericMessage(senderID);
        break;
      default:
        // else, run the general Echo example
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    // If there's an attachment, run the general sendTextMessage() function, but with the defined text 'message with attachment recieved'.
    sendTextMessage(senderID, "Message with attachment received");
  }
}



/**************/
// Sending Helpers
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes 
/**************/

/** This function sends a text message back to the User with the message Text it was called with (in the example, it's called with incoming messageText) */
function sendTextMessage(recipientId, messageText) {
  console.log('\nWe heard nothing special, get the Echo template!');
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

//** This function demonstrates the Structured Response capability, and takes a more complex JSON object back to the Messenger API */
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template

function sendGenericMessage(recipientId) {
  console.log('\nWe heard \'generic\', get the Structured Message template!');
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}




/** This function is a wrapper function that is called after every template, and it handles actually submitting the final POST request to the Send API */
function callSendAPI(messageData) {
  console.log('\nMessage has been processed, attempting to send a response back to Facebook Send API...');
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: facebookAuth.pageAccessToken },
    // TODO: Maybe find a less hacky way to pass the PAGE_TOKEN to the API? Using boolean or here
    method: 'POST',
    json: messageData // actual message to send to the Send API 

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(messageData)

      // If there's NO error or the response is good (200), then print the message
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("\nSuccessfully sent message with id %s to recipient %s: \"%s\" !",
        messageId, recipientId, messageData.message.text);

    } else {
      console.error("Failed to send new message; check your errors!");
      //console.error(response); // Dumps the whole response; very messy console
      console.error(error); // Should still get the error though
    }
  });
}


module.exports = app; // export this as 'routes'