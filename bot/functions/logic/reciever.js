"use strict";
// Recieves objects from Facebook
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Local Dependencies
var asker_1 = require("./asker");
var sender_1 = require("./sender");
// Recieving Messages 
function reciever(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            // Authorize
            authorizer(req, res);
            console.log("In here!");
            data = req.body;
            // Log
            console.log('...Object recieved: ', data);
            if (data.object === 'page') {
                // Log
                console.log('...Identifying object...');
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
                            console.log('...Postback Recieved: ', { event: event });
                            console.log('Deciding Response to Postback Object...');
                            var postbackText = event.postback.payload;
                            // Check and send them into the next question
                            asker_1.userFinder(userID);
                            // Assign them their survey
                            asker_1.surveyAssigner(userID, postbackText);
                        }
                        if (messagePayload) {
                            console.log('...Payload Recieved: ', { event: event });
                            console.log('Deciding Response to Payload Object...');
                            var messagePayload_1 = message.quick_reply.payload;
                            // Save their answer
                            asker_1.surveyAnswerSaver(userID, messagePayload_1, messageText);
                            // Check and send them into the next question
                            asker_1.userFinder(userID);
                        }
                        else if (message && !message.postback && !message.payload) {
                            // If it has a message component, run recievedMessage()
                            console.log('...Message Recieved: ', { event: event });
                            console.log('Deciding Response to Message Object...');
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
                            sender_1.sendTextMessage(userID, emojis[randomNumber]);
                        }
                        else {
                            console.log('...Unknown Object Recieved:', { event: event });
                        }
                    });
                });
                // Send 200 after processing; must send back a 200 within 20 seconds, otherwise times out and FB keeps retrying
            }
            return [2 /*return*/];
        });
    });
}
exports.default = reciever;
;
function authorizer(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Authorizing bot with Facebook...');
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
                res.status(200).send(req.query['hub.challenge']);
                console.log('Webhook validated!');
            }
            else {
                console.log('Failed validation. Make sure the validation tokens match.');
                res.status(403).send;
            }
            return [2 /*return*/];
        });
    });
}
exports.authorizer = authorizer;
;
