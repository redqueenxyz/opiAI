// feedbackAI

// setup =======================================================================
var express = require('express');
var bot = express();     

// database ====================================================================

var database = require('@bot_messenger/services/database')

// routing =====================================================================

bot.use(require('@bot_messenger/routes')); // use the routing in lib/routes

// serving =====================================================================

bot.listen(3000, () => {
  console.log('Bot listening on port 3000');
});