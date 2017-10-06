"use strict";
// Recieves objects from Facebook
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require("winston");
// Local Dependencies
var asker_1 = require("./asker");
var auther_1 = require("./auther");
// Recieving Messages 
function reciever(req, res) {
    // Encapsulate
    var data = req.body;
    // Log
    logger.info('...Object recieved: ', { data: data });
    if (data.object === 'page') {
        // Log
        logger.info('...Identifying object...');
        // Iterate over each event in the object
        data.entry.forEach(function (entry) {
            entry.messaging.forEach(function (event) {
                // Event parameters
                var userID = event.sender.id;
                var recipientID = event.recipient.id;
                var timeOfPostback = event.timestamp;
                // Potentially Undefined
                var message = (event.message || false);
                var messagePostback = (event.postback ? event.postback.payload : false);
                var messagePayload = (message.quick_reply ? message.quick_reply.payload : false); // if a is true ? assign b, else var is false
                if (messagePostback) {
                    logger.warn('...Postback Recieved: ', { event: event });
                    logger.info('Deciding Response to Postback Object...');
                    var postbackText = event.postback.payload;
                    // Check and send them into the next question
                    asker_1.userFinder(userID);
                    // Assign them their survey
                    asker_1.surveyAssigner(userID, postbackText);
                }
                if (messagePayload) {
                    logger.warn('...Payload Recieved: ', { event: event });
                    logger.info('Deciding Response to Payload Object...');
                    var messagePayload_1 = message.quick_reply.payload;
                    // Save their answer
                    asker_1.surveyAnswerSaver(userID, messagePayload_1, messageText);
                    // Check and send them into the next question
                    asker_1.userFinder(userID);
                }
                else if (message && !message.postback && !message.payload) {
                    // If it has a message component, run recievedMessage()
                    logger.warn('...Message Recieved: ', { event: event });
                    logger.info('Deciding Response to Message Object...');
                    // Message parameters
                    var messageId = message.mid;
                    var messageText = message.text;
                    // Check and send them into the next question
                    asker_1.userFinder(userID);
                    // Lol
                    var emojis = [
                        '😀', '😂', '😇', '😍', '😘',
                        '😛', '🤑', '🤗', '😎',
                        '😤', '😵', '😳', '😨',
                        '😴', '😬',
                    ];
                    var randomNumber = parseInt(emojis.length * Math.random());
                    sender.sendTextMessage(userID, emojis[randomNumber]);
                }
                else {
                    logger.info('...Unknown Object Recieved:', { event: event });
                }
            });
        });
        // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
        res.status(200).send();
    }
    auther_1.auther(req, res);
}
exports.default = reciever;
exports.reciever = reciever;
;
