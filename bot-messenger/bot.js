#!/usr/bin/env node

// opiAI
// A bot that collections opinions.

// env ===============================================================
require('dotenv').config();

// logging ===========================================================
const logger = require('./services/logging_handler');

// initializing =======================================================
const express = require('express');

// serving ============================================================
const bot = express();

// saving ============================================================
const database = require('./services/database_handler');

// routing ===========================================================
bot.use(require('./routes'));

// listening ==========================================================
const PORT = process.env.port || 8080;

bot.listen(PORT, () => {
    logger.info('Bot alive at %d.', PORT);
});

// TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)
