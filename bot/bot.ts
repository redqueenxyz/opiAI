'use strict';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Intialize
admin.initializeApp(functions.config().firebase)

// // intialize firebase
// admin.initializeapp(functions.config().firebase);

// pass /webhook to reciever 

// /** 
//  * Serves the bot!
//  */

// functions.https.onRequest(bot);


// // opiAI
// // A bot that collections opinions.

// // setting ===========================================================
// require('dotenv').config();

// // initializing =======================================================
// const express = require('express');

// // routing ============================================================
// const bot = express();

// // routing ===========================================================
// bot.use('/webhook', require('./auther'));
// bot.use('/webhook', require('./reciever'));

// // serving ============================================================
// bot.get('/', (req, res) => {
//   res.status(200).json({ message: 'Connected!' });
// });

// // exporting ==========================================================
// export default bot;

// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)