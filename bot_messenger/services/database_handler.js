// Manages Firebase DB retrieval and return

// Export
// var database = module.exports = {};

// Admin
// For Firebase SDK
// FIXME: Setup Firebase Bolt rules for read/write access

let firebase = require('firebase-admin');
let firebaseConfig = require('../config/firebase');

// Intialize 
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: 'https://opiai-174214.firebaseio.com/',
});
