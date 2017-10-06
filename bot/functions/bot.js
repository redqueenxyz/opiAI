"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Package Dependencies
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var express = require("express");
// Local Dependencies
var auther_1 = require("./logic/auther");
var reciever_1 = require("./logic/reciever");
// opiAI
// A bot that collections opinions.
// setting ===========================================================
require('dotenv').config();
// serving ============================================================
admin.initializeApp(functions.config().firebase);
// initializing =======================================================
var bot = express();
// getting ===========================================================
// bot.get('/webhook/', (req: Request, res: Response) => {
//     res.send("Connected!")
// })
bot.get('/', function (req, res) {
    res.send("Alive!");
});
// using =============================================================
bot.get('/webhook/', auther_1.default);
bot.get('/webhook/', reciever_1.default);
// exporting ==========================================================
exports.opiAI = functions.https.onRequest(bot);
// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question) 
