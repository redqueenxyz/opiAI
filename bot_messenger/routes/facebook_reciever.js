// Package Dependencies
var reciever = require('express').Router();
var bodyParser = require('body-parser')

// Local Dependencies
var recievers = require('@bot_messenger/services/message_recievers')

// Parsing
reciever.use(bodyParser.json());
reciever.use(bodyParser.urlencoded({ extended: true }));

// Recieving Messages 
reciever.post('/', function (req, res) {

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
          recievers.receivedMessage(event);

        } else if (event.postback) {
          // if it has a postback component, run recievedPostback()
          console.log('It has a postback object, how should we handle it?')
          recievers.receivedPostback(event);
        } else {
          console.log("It has neither a message nor a postback; we have received an unknown event: ", event);
        }
      });
    });
    // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
    res.sendStatus(200);
  }
});



module.exports = reciever; // export this as 'routes'