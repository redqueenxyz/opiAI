"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Package Dependencies
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var express = require("express");
// Local Dependencies
require("./env");
var reciever_1 = require("./logic/reciever");
// opiAI
// A bot that collections opinions.
// serving ============================================================
admin.initializeApp(functions.config().firebase);
// initializing =======================================================
var bot = express();
// getting ===========================================================
bot.get('/', function (req, res) {
    res.send("Alive!");
});
// using =============================================================
bot.get('/webhook/', function (req, res) {
    reciever_1.default(req, res)
        .catch(function (err) {
        console.log("Error at Webhook:", err.stack);
        res.status(500).send('error');
    });
});
console.log('opiAI online.');
// exporting ==========================================================
exports.opiAI = functions.https.onRequest(bot);
// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question) 
