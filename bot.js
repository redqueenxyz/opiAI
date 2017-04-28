// feedbackAI

// setup =======================================================================

var firebase = require("firebase");     
var express = require('express');

// database ====================================================================

var database = require('@bot_messenger/config/database_auth');
firebase.initializeApp(database); 

// routing =====================================================================

var app = express();     
app.use(require('@bot_messenger/routes')); // use the routing in lib/routes

// serving =====================================================================

app.listen(3000, () => {
  console.log('App listening on port 3000');
});