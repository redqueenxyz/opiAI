#!/usr/bin/env node

// feedbackAI
// A bot that listens to feedback.

// serving ======================================================================
const express = require('express')

// initializing =================================================================
const bot = express()

// logging =====================================================================
const logger = require('./services/logging_handler');
bot.use(logger.requestLogger);
bot.use(logger.errorLogger);

// saving ======================================================================
const database = require('./services/database_handler')

// routing =====================================================================
bot.use(require('./routes'))

// listening ====================================================================
const PORT = process.env.port || 8080

bot.listen(PORT, () => {
    logger.info('Bot alive at %d.', PORT)
});