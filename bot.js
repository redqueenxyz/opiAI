#!/usr/bin/env node
// feedbackAI

// setup =======================================================================
var express = require('express')

// initialize ==================================================================
var bot = express()

// database ====================================================================

var database = require('./bot_messenger/services/database_handler')

// routing =====================================================================

bot.use(require('./bot_messenger/routes'))

// serving =====================================================================

bot.listen(3000, () => {
  console.log('Bot listening on port 3000')
});