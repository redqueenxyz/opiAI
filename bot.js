#!/usr/bin/env node

// feedbackAI
// A bot that listens to feedback

// hosting =====================================================================
var host = require('./bot_messenger/services/hosting_handler')

// logging =====================================================================
var logger = require('./bot_messenger/services/logging_handler');

// database ====================================================================
var database = require('./bot_messenger/services/database_handler')

// setup =======================================================================
var express = require('express')

// initialize ==================================================================
var bot = express()

// routing =====================================================================
bot.use(require('./bot_messenger/routes'))

// serving =====================================================================
bot.listen(8000, () => {
   logger.info('Bot listening on', {port: 8000})
});