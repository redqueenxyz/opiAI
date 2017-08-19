#!/usr/bin/env node

// TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)
// TODO: Greeting function - Onboardings messages with a qR

// feedbackAI
// A bot that listens to feedback.

// serving ============================================================
const express = require('express');

// initializing =======================================================
const bot = express();

// logging ===========================================================
const logger = require('./services/logging_handler');
bot.use(logger.requestLogger);
bot.use(logger.errorLogger);

// saving ============================================================
const database = require('./services/database_handler');

// routing ===========================================================
bot.use(require('./routes'));

// listening ==========================================================
const PORT = process.env.port || 8080;

bot.listen(PORT, () => {
    logger.info('Bot alive at %d.', PORT);
});
