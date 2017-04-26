// Webhook Router
var router = require('express').Router();

// TODO: Fix all this shit right here

/**************/
// Processing Messages
/**************/


/** This function processes every message as a request */
app.post('/', function (req, res) {

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

          if('quick_reply' in event.message) {
            QRHandler(event);
          }
          
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

function QRHandler(event) {
  console.log('QRHandler called!')

  firebase.database().ref("users/" + event.sender.id).once('value').then( function(snapshot) {
    if(snapshot.val() == null){
      // if it doesn't exist save user data
      var userObject = {
        currentSurvey: "survey_1",
        questionLastAnswered: "q1"
      }
      firebase.database().ref("users/" + event.sender.id).set(userObject);
      firebase.database().ref("responses/survey_1/" + event.sender.id).set({q1: event.message.text});
    } else {
      
    }
  });

}



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
      case 'specificquickreply':
        // Experimenting with quick reply wrapper
        sendSpecificQuickReply(senderID, lol.question1);
        break;


      //FIXME: WHY U NO CHANGE
      case 'setmenu':
        //TODO: Successfully passing, but no change to the Bot UI
        setPersistentMenu();
        break;
      case 'setgreeting':
        //TODO: Successfully passing, but no change to the Bot UI
        setGreeting();
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



/** This function runs when we recieve a postback, and decides how to handle it  */
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

  // TODO: Do some checking to ensure the payload from the AD (typically the AD Campaign ID itself) using case checking from before
  // Totally works, but switching to ads to make sure we can generate these ad campaigns quickly
  sendTextMessage(senderID, "Postback called");

  
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
          payload: "answered_q1", // Recieves this payload back as the new 'message, so maybe just grab this and toss it into FB as part of the 'incoming' loop?
          // TODO: Maybe explore Postbacks for Quick Replies, if necesssary
          image_url: "http://petersfantastichats.com/img/red.png" // Even takes a cute little image for friendliness
          // TODO: Emojis?!
        },
        {
          content_type: "text",
          title: "Green",
          payload: "answered_q1",
          image_url: "http://petersfantastichats.com/img/green.png"
        }
      ]
    }


  };

  callSendAPI(messageData);
}

function sendSpecificQuickReply(recipientId, question) {
  console.log('\nWe heard \'quick reply\', get the Quick Reply template!');
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: question
  };

  callSendAPI(messageData);
}



/**************/
// Setting Bot Parameters
/**************/

/** This function attemps to explore the Greeting capability which sets a new users default message */
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
function setGreeting() {
  console.log('\nWe are sending a greeting!');
  var settingData = {
    setting_type: "greeting",
    greeting: {
      text: "Welcome to another bot {{user_first_name}}."
    }
  }
  tellSendAPI(settingData);
};

/** This function attemps to explore the Persistent Menu capability which sets a new users default message */
// Reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
function setPersistentMenu() {
  console.log('\nWe are changing the Persistent Menu!');
  var settingData = {
    "setting_type": "call_to_actions",
    "thread_state": "new_thread",
    "call_to_actions": [
      {
        "payload": "Launch Program"
      }
    ]
  }
  tellSendAPI(settingData);
};

/**************/
// Sending Messages
/**************/

/** This function is a wrapper function that is called after every setting, and it handles actually submitting the final POST request to the Send API */
function tellSendAPI(settingData) {
  console.log('\nMessage has been processed, attempting to set something via the Facebook Send API...');
  request({
    uri: 'https://graph.facebook.com/v2.8/me/thread_settings', // The API endpoint to POST to
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: settingData // actual message to send to the Send API 

  }, function (error, response, body) {
    console.log(settingData)
    if (!error && response.statusCode == 200) {
      // If there's NO error or the response is good (200), then print the message
      console.log("\nSuccessfully sent setting!");
    } else {
      console.error("Failed to send new setting; check your errors!");
      // console.error(response); // Dumps the whole response; very messy console, removed this
      console.error(error); // Should get the error though
    }
  });
}


/** This function is a wrapper function that is called after every template, and it handles actually submitting the final POST request to the Send API */
function callSendAPI(messageData) {
  console.log('\nMessage has been processed, attempting to send a response back to Facebook Send API...');

  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages', // The API endpoint to POST to
    qs: { access_token: PAGE_ACCESS_TOKEN },
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
      // console.error(response); // Dumps the whole response; very messy console, removed this
      console.error(error); // Should get the error though
    }
  });
}


module.exports = router; // export this as 'routes'