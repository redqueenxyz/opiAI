// feedbackAI

// Setup =======================================================================

var firebase = require("firebase");     
var express = require('express');

// database ====================================================================

var database = require('lib/config/database_auth');
firebase.initializeApp(database); 

// routing =====================================================================

var app = express();     
app.use(require('lib/routes')); // use the routing in lib/routes

// routing =====================================================================

app.listen(3000, () => {
  console.log('App listening on port 3000');
});