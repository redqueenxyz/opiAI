"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Package Dependencies
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var express = require("express");
var logger = require("winston");
// Local Dependencies
require("./env");
var reciever_1 = require("./logic/reciever");
var auther_1 = require("./logic/auther");
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
bot.get('/webhook/', function (req, res) {
    auther_1.default(req, res)
        .then(function () {
        res.send(200);
    })
        .catch(function (err) {
        logger.log("Error getting from Webhook:", err.stack);
        res.status(500).send('error');
    });
});
// posting ===========================================================
bot.post('/webhook/', function (req, res) {
    reciever_1.default(req, res)
        .then(function () {
        res.send(200);
    })
        .catch(function (err) {
        logger.log("Error posting to Webhook:", err.stack);
        res.status(500).send('error');
    });
});
// notifying ==========================================================
console.log("Opi alive!");
// exporting ==========================================================
exports.opiAI = functions.https.onRequest(bot);
// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question) 
