// Manages Firebase DB retrieval and return

// Export
// var database = module.exports = {};

// Admin
// For Firebase SDK
let firebase = require('firebase-admin');
let firebaseConfig = require('../config/firebase');

// Intialize 
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: 'https://opiai-177321.firebaseio.com/',
});
