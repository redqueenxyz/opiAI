/**************/
// Intro
/**************/

// This is main file containing code implementing the Express server and functionality for the Messenger Bot
// For this to work, you need to create the following:
// 
//    * Facebook Page - Subscribes the bot to a given Facebook Page so it can recieve all of its messages/events
//    * Facebook App - Creates an app that has an App ID, App Secret, which are necessary (Currently hardcoded, but will be removed eventually)
//    * Facebook App > Messenger - Generates a Page Token for Messenger, and allows the Webhook to subscribe to a given page.
//    * Facebook App > Webhooks - Sets up a callback URL at the `/webhook` endpoint, whether it's hosted via Ngrok, Heroku, or GAE (Requires the messages, messaging_postback permissions)
//    * Facebook App > Webhooks > Verify Token - Defines a string that this app will hand to FB to prove it's connecting through the endpoint (400s otherwise)
// 
// Base: https://glitch.com/edit/#!/messenger-bot
// Quickstart: https://developers.facebook.com/docs/messenger-platform/guides/quick-start
// Additional: https://www.gitbook.com/book/node-bloggers/creating-a-fb-messenger-bot-with-nodejs/details

/**************/
/// Setup
/**************/

'use strict';

// Packages
const express = require('express');
const bodyParser = require('body-parser'); // handle POST requests
const request = require('request');
const path = require('path');
const date = require('datejs');

// Routing via Express JS
let app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({  // support encoded bodies
  extended: true
}));

// Start Message
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart, as modified for feedbackAI. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.</body></html>";

/**************/
// Authorization
// Typically takes a couple seconds to authorize before going live; don't be surprised if there is a delay!
/**************/

// Webhook Validation
// Retrives variables from .env for consistency/security. 
// @v: Haven't got this to work yet for GAE, currently using a hacky or (`||`) to pass variables; must have something to do with not being able to access the .env shell script at runtime
// TODO: Find a cleaner solution to incorporate process.env.variables 

/** This function validates the webhook endpoint by passing FB back the variables we defined in our app documentation */
app.get('/webhook', function (req, res) {
  if (

    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN || 'fuckyouappengine') {

    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/** This function returns a 200 and displays a simple webpage using the messengerButton component defined up there */
app.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(messengerButton);
  res.end();
});

/**************/
// Processing Messages
/**************/


/** This function processes every message as a request */
app.post('/webhook', function (req, res) {

  // Outputs what we recieved into the console:
  console.log('\n' + 'We have recieved a request!\n    The body is:\n');
  console.log(req.body);

  // At this point, the request body currently looks like:
  //
  // { object: 'page',
  //   entry:
  //    [ { id: "PAGE_ID",
  //        time: "UNIX_TIMESTAMP_MILLSECONDS", // http://currentmillis.com/
  //        messaging: [Object] } ] 
  // }  
  //

  // Store that information in a local variable
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


/**************/
// Recieving Messages
/**************/


//** This function runs when we recieve a message, and decides how to handle it  */
function receivedMessage(event) {

  // As part of the app.post webhook call we did up there, we know act on EACH event `entry.messaging.forEach()` which looks like this currently:
  // 
  // { sender: { id: "APP_ID" },
  //   recipient: { id: "PAGE_ID" },
  //   timestamp: 'UNIX_TIMESTAMP_MILLSECONDS',
  //   message:
  //    { mid:  'MESSAGE_ID',
  //      seq: 'SEQUENCE_ID', // Increments by 4 for each message, not sure why
  //      text: 'TEXT_IN_THE_MESSAGE' } }  
  // 
  // TODO: Find and store a sequence of conversations by their Message ID? 
  // These are the message ids for a sequence of messages through FB, they have the same string until _ then an appended unique identifier
  // mid.$cAARb3bQd_bFhQhawJFbENFnUpGLG Message 
  // mid.$cAARb3bQd_bFhQhc-HFbENH1beZUc
  // mid.$cAARb3bQd_bFhQhiDqVbENM69CBge 
  //
  // Source: https://developers.facebook.com/docs/messenger-platform/webhook-reference/message

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

  // Now that we have the actual text, let's decide some logic to handle it 
  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // if so, send it to a given template, else defaultt o sendtextMessage() which just echoes the text we received.
    switch (messageText) {
      case 'generic':
        // if the text is 'generic', run the Structured Message example
        sendGenericMessage(senderID);
        break;
      case 'quickreply':
        // if the text is 'quick reply', run the Quick Reply example, then break
        sendQuickReply(senderID);
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


//** This function runs when we recieve a postback, and decides how to handle it  */
function receivedPostback(event) {
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
  sendTextMessage(senderID, "Postback called");
}

/**************/
// Sending Messages
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

/** This function demonstrates the Quick Reply capability (!!) which provides the users buttons to respond and returns a defined payload */
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies

function sendQuickReply(recipientId) {
  console.log('\nWe heard \'quick reply\', get the Quick Reply template!');
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Pick a color:",
      quick_replies: [
        {
          content_type: "text",
          title: "Red",
          payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED", // Recieves this payload back as the new 'message, so maybe just grab this and toss it into FB as part of the 'incoming' loop?
          // TODO: Maybe explore Postbacks for Quick Replies, if necesssary
          image_url: "http://petersfantastichats.com/img/red.png" // Even takes a cute little image for friendliness
          // TODO: Emojis?!
        },
        {
          content_type: "text",
          title: "Green",
          payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
          image_url: "http://petersfantastichats.com/img/green.png"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

/** This function is a wrapper function that is called after every template, and it handles actually submitting the final POST request to the Send API */
function callSendAPI(messageData) {
  console.log('\nMessage has been processed, attempting to send a response back to Facebook Send API...');

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages', // The API endpoint to POST to
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN || 'EAAafieH0vP8BAJSZCRK8dAgTZAuBUZCmaPCAZA5GY05lVZCj3HtK69fv1QGGiGL02IJtGZCWv9sVGaJKek5eD5YDDMxUxnDDhal1iD3pqOtx612WeOmIfVyRN41c8RSQbUEPrMRkgrXwReUPycusvOrkluexXtZBJC0XKWZC5SW75wZDZD' },
    // TODO: Maybe find a less hacky way to pass the PAGE_TOKEN to the API? Using boolean or here
    method: 'POST',
    json: messageData // actual message to send to the Send API 

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("\nSuccessfully sent message with id %s to recipient %s: \"%s\" !",
        messageId, recipientId, messageData.message.text);

    } else {
      console.error("Failed to send new message; check your errors!");
      // console.error(response); // Dumps the whole response; very messy console, removed this
      console.error(error); // Should get the error though
    }
  });
}

/**************/
//  Server 
/**************/

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  // TODO: Again, using a hacky boolean solution to what should be passed through in that process.env shell file; app prefers port 3000 for some reason. 
  console.log("Listening on port %s", server.address().port);
});
