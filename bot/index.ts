'use strict';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Intialize
admin.initializeApp(functions.config().firebase)

bot.use('/webhook', require('./auther'));
bot.use('/webhook', require('./reciever'));

// TODO: ** glob pattern all to webhook endpoint, use auther and reciever


// opiAI
// A bot that collections opinions.

// setting ===========================================================
require('dotenv').config();

// serving ============================================================
admin.initializeApp(functions.config().firebase)

// initializing =======================================================
const bot = require('express')();

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