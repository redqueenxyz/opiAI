#!/usr/bin/env node

// feedbackAI
// A bot that listens to feedback

// setup =======================================================================
var express = require('express')

// initialize ==================================================================
var bot = express()

// database ====================================================================

var database = require('./bot_messenger/services/database_handler')

// routing =====================================================================

bot.use(require('./bot_messenger/routes'))

// serving =====================================================================
const port = process.env.PORT || 8000;

bot.listen(port, () => {
  console.log('Bot listening on port', port)
});