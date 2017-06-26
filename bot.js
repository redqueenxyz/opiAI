#!/usr/bin/env node

// feedbackAI
// A bot that listens to feedback.

// hosting =====================================================================
var host = require('./bot_messenger/services/hosting_handler')

// logging =====================================================================
var logger = require('winston');

// saving ======================================================================
var database = require('./bot_messenger/services/database_handler')

// serving ======================================================================
var express = require('express')

// initializing =================================================================
var bot = express()

// routing =====================================================================
bot.use(require('./bot_messenger/routes'))

// listening ====================================================================
bot.listen(port=8000, () => {
   logger.info('Bot alive at port %d.', port)
});