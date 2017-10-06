#!/usr/bin/env node

// opiAI
// A bot that collections opinions.

// setting ===========================================================
require('dotenv').config();

// initializing =======================================================
const express = require('express');

// routing ============================================================
const bot = express();

// routing ===========================================================
bot.use('/webhook', require('./auther'));
bot.use('/webhook', require('./reciever'));

// serving ============================================================
bot.get('/', (req, res) => {
    res.status(200).json({message: 'Connected!'});
});

// exporting ==========================================================
export default bot;

// TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)
